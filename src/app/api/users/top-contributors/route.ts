import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const topContributors = await prisma.user.findMany({
      where: {
        ideasCount: {
          gt: 0,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        walletAddress: true,
        ideasCount: true,
        _count: {
          select: {
            ideas: true,
          },
        },
      },
      orderBy: {
        ideasCount: 'desc',
      },
      take: 5,
    });

    return NextResponse.json(topContributors);
  } catch (error) {
    console.error("Error fetching top contributors:", error);
    return NextResponse.json(
      { error: "Failed to fetch top contributors" },
      { status: 500 }
    );
  }
} 