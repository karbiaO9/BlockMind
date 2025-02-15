import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/ideas/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const idea = await prisma.tradingIdea.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tags: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            likedBy: true,
            comments: true,
          },
        },
      },
    });

    if (!idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.tradingIdea.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(idea);
  } catch (error) {
    console.error("Error fetching idea:", error);
    return NextResponse.json(
      { error: "Failed to fetch idea" },
      { status: 500 }
    );
  }
}

// DELETE /api/ideas/[id]
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

    const idea = await prisma.tradingIdea.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    });

    if (!idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      );
    }

    if (idea.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this idea" },
        { status: 403 }
      );
    }

    await prisma.tradingIdea.delete({
      where: { id: params.id },
    });

    // Update user's idea count
    await prisma.user.update({
      where: { id: session.user.id },
      data: { ideasCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting idea:", error);
    return NextResponse.json(
      { error: "Failed to delete idea" },
      { status: 500 }
    );
  }
}

// PATCH /api/ideas/[id]
export async function PATCH(
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

    const idea = await prisma.tradingIdea.findUnique({
      where: { id: params.id },
      select: { authorId: true },
    });

    if (!idea) {
      return NextResponse.json(
        { error: "Idea not found" },
        { status: 404 }
      );
    }

    if (idea.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const updatedIdea = await prisma.tradingIdea.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        symbol: body.symbol,
        type: body.type,
        timeframe: body.timeframe,
        tags: {
          set: body.tags.map((tag: { id: string }) => ({ id: tag.id })),
        },
      },
    });

    return NextResponse.json(updatedIdea);
  } catch (error) {
    console.error("Error updating idea:", error);
    return NextResponse.json(
      { error: "Failed to update idea" },
      { status: 500 }
    );
  }
} 