// app/api/auth/login/route.ts
import { lucia } from "@/lib/lucia-node"; // ← Use the full version with Prisma
import { prisma } from "@/lib/prisma";
import { verify } from "argon2"; // Note: argon2Verify is deprecated in newer argon2; use verify
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";


// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase(),
  password: z.string().min(8, "Password too short"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email }, // Assume emails are lowercased on signup
    });

    if (!user || !user.password_hash || !(await verify(user.password_hash, password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    if (!user.is_approved) {
      return NextResponse.json({ error: "Account not approved yet" }, { status: 403 });
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    revalidatePath("/dashboard"); // Forces fresh server render
    // Optional: Return basic user info (no sensitive data)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullname: user.fullname,
        role: user.role,
        hotelId: user.hotel_id,
      },
    });
  } catch (error) {
    console.error("[LOGIN API ERROR]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}