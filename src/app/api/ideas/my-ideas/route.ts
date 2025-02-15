import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    console.log(session.user.id);
    const [ideas, total] = await Promise.all([
      prisma.tradingIdea.findMany({
        where: {
          authorId: session.user.id,
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
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              comments: true,
              likedBy: true,
            },
          },
    
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.tradingIdea.count({
        where: {
          authorId: session.user.id,
        },
      }),
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      ideas: ideas.map((idea) => ({
        ...idea,

        likedBy: undefined,
      })),
      metadata: {
        total,
        page,
        limit,
        pages,
      },
    });

  } catch (error) {
    console.error("Error fetching my ideas:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 