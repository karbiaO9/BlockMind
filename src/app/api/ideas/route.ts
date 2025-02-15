import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ideaSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10),
  symbol: z.string(),
  type: z.enum(["LONG", "SHORT"]),
  timeframe: z.enum([
    "MINUTE_1", "MINUTE_5", "MINUTE_15",
    "HOUR_1", "HOUR_4", "DAY_1", "WEEK_1"
  ]),
  image: z.string().optional(),
  tags: z.array(z.string()),
});

// GET /api/ideas
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const filter = searchParams.get("filter") || "latest"; // latest, trending, top
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    let orderBy: any = { createdAt: "desc" };
    if (filter === "trending") {
      orderBy = { views: "desc" };
    } else if (filter === "top") {
      orderBy = { likes: "desc" };
    }

    const session = await getServerSession(authOptions);

    const ideas = await prisma.tradingIdea.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { symbol: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            walletAddress: true,
          },
        },
        tags: true,
        likedBy: {
          where: {
            id: session?.user?.id || '',
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likedBy: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    const total = await prisma.tradingIdea.count();

    const ideasWithLikeStatus = ideas.map(idea => ({
      ...idea,
      isLiked: idea.likedBy.length > 0,
      likedBy: undefined,
    }));

    return NextResponse.json({
      ideas: ideasWithLikeStatus,
      metadata: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    );
  }
}

// POST /api/ideas
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = ideaSchema.parse(body);

    const idea = await prisma.tradingIdea.create({
      data: {
        ...validated,
        author: { connect: { id: session.user.id } },
        tags: {
          connectOrCreate: validated.tags.map(tag => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tags: true,
      },
    });

    // Update user's idea count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { ideasCount: { increment: 1 } },
    });

    return NextResponse.json(idea);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating idea:", error);
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }
} 