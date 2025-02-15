import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const idea = await prisma.tradingIdea.update({
      where: { id: params.id },
      data: {
        likedBy: {
          connect: { id: session.user.id },
        },
        likes: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error liking idea:", error);
    return NextResponse.json(
      { error: "Failed to like idea" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const idea = await prisma.tradingIdea.update({
      where: { id: params.id },
      data: {
        likedBy: {
          disconnect: { id: session.user.id },
        },
        likes: { decrement: 1 },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error unliking idea:", error);
    return NextResponse.json(
      { error: "Failed to unlike idea" },
      { status: 500 }
    );
  }
} 