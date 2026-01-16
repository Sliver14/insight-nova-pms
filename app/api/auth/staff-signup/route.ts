// app/api/auth/staff-signup/route.ts
export const runtime = "nodejs";
import { lucia } from "@/lib/lucia-node";
import { prisma } from "@/lib/prisma";
import { hash } from "argon2";
import { NextResponse } from "next/server";
import { z } from "zod";

// Updated schema to include phone
const staffSignupSchema = z.object({
  fullname: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(), // Optional but recommended
  password: z.string().min(6, "Password must be at least 6 characters"),
  hotelId: z.string().uuid("Invalid hotel ID"),
  role: z.enum(["staff", "manager", "frontdesk", "cleaner"]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = staffSignupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { fullname, email, phone, password, hotelId, role } = parsed.data;

    // Check if hotel exists
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      return NextResponse.json(
        { error: "Invalid hotel invite link" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hash(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        fullname: fullname.trim(),
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        role: role as any,
        hotel_id: hotelId,
        is_approved: false,
      },
    });

    // Create Staff profile with phone
    await prisma.staff.create({
      data: {
        fullname: fullname.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        hotel_id: hotelId,
        role: role as any,
        user_id: user.id,
        status: "INACTIVE",
        hire_date: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Staff account created! Your account is pending approval from a manager or owner.",
    });
  } catch (error) {
    console.error("[STAFF-SIGNUP API ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}