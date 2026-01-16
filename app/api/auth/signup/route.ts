// app/api/auth/signup/route.ts
export const runtime = "nodejs";
import { lucia } from "@/lib/lucia-node"; // ← Use the full version with Prisma
import { prisma } from "@/lib/prisma"; // Make sure you have this (prisma client instance)
import { hash } from "argon2"; // Using argon2 for secure password hashing
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Validation schema for signup
const signupSchema = z.object({
  fullname: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  hotelName: z.string().min(2, "Hotel name is required"),
  location: z.string().optional(),
  roomCount: z.coerce.number().int().positive().optional(),
  hotelType: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const { fullname, email, password, hotelName, location, roomCount, hotelType } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { fullname: fullname.toLowerCase() }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hash(password);

    // Create Hotel first
    const hotel = await prisma.hotel.create({
      data: {
        name: hotelName,
        address: location,
        room_count: roomCount ?? 0,
        // You can set defaults for subscription if needed
        subscription_status: "trial",
      },
    });

    // Create User (owner)
    const user = await prisma.user.create({
      data: {
        fullname: fullname.toLocaleLowerCase(),
        email: email.toLowerCase(),
        password_hash: passwordHash,
        role: "owner",
        hotel_id: hotel.id,
        is_approved: true, // Owner is auto-approved
      },
    });

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    revalidatePath("/dashboard"); // Forces fresh server render
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        hotelId: hotel.id,
        hotelName: hotel.name,
      },
    });
  } catch (error) {
    console.error("[SIGNUP API ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}