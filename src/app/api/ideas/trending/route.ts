import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const trendingIdeas = await prisma.tradingIdea.findMany({
      take: 10,
      orderBy: [
        { likes: 'desc' },
        { createdAt: 'desc' }
      ],
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
            likedBy: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(trendingIdeas);
  } catch (error) {
    console.error("Error fetching trending ideas:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending ideas" },
      { status: 500 }
    );
  }
} 