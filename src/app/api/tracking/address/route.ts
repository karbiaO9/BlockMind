import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Validation schema
const trackAddressSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  name: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

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
    const validated = trackAddressSchema.parse(body);

    // Check if address is already tracked
    const existing = await prisma.trackedAddress.findUnique({
      where: {
        userId_address: {
          userId: session.user.id,
          address: validated.address.toLowerCase(),
        },
      },
    });

    if (existing) {
      if (existing.status === "DELETED") {
        // Reactivate if previously deleted
        const updated = await prisma.trackedAddress.update({
          where: { id: existing.id },
          data: { 
            status: "ACTIVE",
            name: validated.name,
            notes: validated.notes,
            tags: validated.tags,
          },
        });
        return NextResponse.json(updated);
      }
      return NextResponse.json(
        { error: "Address already tracked" },
        { status: 400 }
      );
    }

    // Create new tracked address
    const tracked = await prisma.trackedAddress.create({
      data: {
        ...validated,
        address: validated.address.toLowerCase(),
        userId: session.user.id,
      },
    });

    return NextResponse.json(tracked);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid address format" },
        { status: 400 }
      );
    }
    console.error("Track address error:", error);
    return NextResponse.json(
      { error: "Failed to track address" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");
    const status = searchParams.get("status") || "ACTIVE";

    const where = {
      userId: session.user.id,
      status: status as "ACTIVE" | "PAUSED" | "DELETED",
      ...(address && { address: address.toLowerCase() }),
    };

    const addresses = await prisma.trackedAddress.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        alerts: {
          where: { isActive: true },
          select: { id: true },
        },
      },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("Get tracked addresses error:", error);
    return NextResponse.json(
      { error: "Failed to get tracked addresses" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, status, name, notes, tags } = body;

    const updated = await prisma.trackedAddress.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        status,
        ...(name && { name }),
        ...(notes && { notes }),
        ...(tags && { tags }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update tracked address error:", error);
    return NextResponse.json(
      { error: "Failed to update tracked address" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    await prisma.trackedAddress.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        status: "DELETED",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete tracked address error:", error);
    return NextResponse.json(
      { error: "Failed to delete tracked address" },
      { status: 500 }
    );
  }
} 