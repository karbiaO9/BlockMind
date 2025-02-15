import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const popularTags = await prisma.tag.findMany({
      where: {
        ideas: {
          some: {} // Only get tags that are used in ideas
        }
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            ideas: true
          }
        }
      },
      orderBy: {
        ideas: {
          _count: 'desc'
        }
      },
      take: 10,
    });

    return NextResponse.json(popularTags);
  } catch (error) {
    console.error("Error fetching popular tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch popular tags" },
      { status: 500 }
    );
  }
} 