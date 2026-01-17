// app/api/rooms/route.ts
export const runtime = "nodejs";
import { lucia } from "@/lib/lucia-node";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for adding rooms (bulk support)
const roomSchema = z.object({
  roomNumbers: z.array(z.string().min(1).max(10)).min(1, "At least one room number required"),
  type: z.enum(["SINGLE", "DOUBLE", "SUITE", "DELUXE", "standard", "deluxe", "suite"]),
  price: z.number().positive("Price must be positive"),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "CLEANING", "RESERVED"]).default("AVAILABLE"),
});

// POST: Add one or multiple rooms
export async function POST(request: Request) {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session || !user || !user.hotelId) {
    return NextResponse.json({ error: "No hotel associated" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = roomSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { roomNumbers, type, price, status } = validated.data;

    // Check for duplicates
    const existingRooms = await prisma.room.findMany({
      where: {
        hotel_id: user.hotelId,
        room_number: { in: roomNumbers },
      },
      select: { room_number: true },
    });

    if (existingRooms.length > 0) {
      const duplicates = existingRooms.map(r => r.room_number).join(", ");
      return NextResponse.json(
        { error: `Room numbers already exist: ${duplicates}` },
        { status: 409 }
      );
    }

    // Bulk create rooms
    const createdRooms = await prisma.room.createMany({
      data: roomNumbers.map(roomNumber => ({
        hotel_id: user.hotelId!,
        room_number: roomNumber,
        type: type.toUpperCase() as any,
        rate_per_night: price,
        status: status.toUpperCase() as any,
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      count: createdRooms.count,
      message: `${createdRooms.count} room(s) added successfully`,
    }, { status: 201 });

  } catch (error) {
    console.error("[ADD ROOMS ERROR]", error);
    return NextResponse.json({ error: "Failed to add rooms" }, { status: 500 });
  }
}

// GET: Fetch all rooms for current user's hotel
export async function GET() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session || !user || !user.hotelId) {
    return NextResponse.json({ error: "No hotel associated" }, { status: 403 });
  }

  try {
    const rooms = await prisma.room.findMany({
      where: {
        hotel_id: user.hotelId,
      },
      orderBy: {
        room_number: "asc",
      },
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error("[GET ROOMS ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}