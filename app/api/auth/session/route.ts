// app/api/auth/session/route.ts
import { lucia } from "@/lib/lucia-node";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ authenticated: false });
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session || !user) {
    return NextResponse.json({ authenticated: false });
  }

  // Fetch hotel details (only name for now)
  let hotelName: string | null = null;
  if (user.hotelId) {
    const hotel = await prisma.hotel.findUnique({
      where: { id: user.hotelId },
      select: { name: true },
    });
    hotelName = hotel?.name || null;
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      fullname: user.fullname || null,
      email: user.email || null,
      role: user.role,
      hotelId: user.hotelId || null,
      hotelName,                      // ← Now correctly fetched
      isApproved: user.isApproved,
    },
  });
}