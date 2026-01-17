// app/api/hotels/me/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { lucia } from "@/lib/lucia-node";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session || !user || !user.hotelId) {
    return NextResponse.json({ error: "No hotel associated with this user" }, { status: 403 });
  }

  const hotel = await prisma.hotel.findUnique({
    where: { id: user.hotelId },
    select: {
      id: true,
      name: true,
      address: true,
      room_count: true,
      subscription_status: true,
      subscription_tier: true,
      created_at: true,
      // Add more fields as needed
    },
  });

  if (!hotel) {
    return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
  }

  return NextResponse.json(hotel);
}