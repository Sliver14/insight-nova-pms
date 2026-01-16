// app/api/bookings/route.ts
import { lucia } from "@/lib/lucia-node";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const bookingSchema = z.object({
  roomId: z.string().uuid("Invalid room ID"),
  guestName: z.string().min(2, "Guest name is required"),
  guestEmail: z.string().email("Invalid email address"),
  checkInDate: z.string().regex(dateRegex, "Invalid check-in date (use YYYY-MM-DD)"),
  checkOutDate: z.string().regex(dateRegex, "Invalid check-out date (use YYYY-MM-DD)"),
  totalPrice: z.number().positive("Total price must be a positive number"),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).default("PENDING"),
}).refine(
  (data) => {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);
    return checkOut > checkIn;
  },
  {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDate"],
  }
);

// GET: Fetch all bookings for current user's hotel
export async function GET() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session || !user || !user.hotelId) {
    return NextResponse.json({ error: "Unauthorized - no hotel linked" }, { status: 403 });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        hotel_id: user.hotelId,
      },
      include: {
        room: {
          select: {
            room_number: true,
            type: true,
          },
        },
      },
      orderBy: {
        check_in: "desc",  // ← Correct field
      },
    });

    const formattedBookings = bookings.map((b) => ({
      id: b.id,
      roomId: b.room_id,
      roomNumber: b.room?.room_number,
      roomType: b.room?.type,
      guestName: b.guest_name,
      guestEmail: b.guest_email,
      checkInDate: b.check_in.toISOString().split("T")[0],
      checkOutDate: b.check_out.toISOString().split("T")[0],
      totalPrice: b.total_price,
      status: b.status,
      createdAt: b.created_at,
    }));

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error("[GET BOOKINGS ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

// POST: Create a new booking
export async function POST(request: Request) {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session || !user || !user.hotelId) {
    return NextResponse.json({ error: "Unauthorized - no hotel linked" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = bookingSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { roomId, guestName, guestEmail, checkInDate, checkOutDate, totalPrice, status } = validated.data;

    // Verify the room belongs to the user's hotel
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room || room.hotel_id !== user.hotelId) {
      return NextResponse.json(
        { error: "Room not found or not part of your hotel" },
        { status: 404 }
      );
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        hotel_id: user.hotelId,
        room_id: roomId,
        guest_name: guestName.trim(),
        guest_email: guestEmail.toLowerCase().trim(),
        check_in: new Date(checkInDate),      // ← Correct Prisma field
        check_out: new Date(checkOutDate),    // ← Correct Prisma field
        total_price: totalPrice,
        status,
      },
    });

    return NextResponse.json(
      {
        success: true,
        booking: {
          id: booking.id,
          roomId: booking.room_id,
          guestName: booking.guest_name,
          guestEmail: booking.guest_email,
          checkInDate: booking.check_in.toISOString().split("T")[0],
          checkOutDate: booking.check_out.toISOString().split("T")[0],
          totalPrice: booking.total_price,
          status: booking.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CREATE BOOKING ERROR]", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}