// app/api/hotels/[id]/route.ts
export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Basic UUID format validation (optional but good practice)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return NextResponse.json(
      { error: "Invalid hotel ID format" },
      { status: 400 }
    );
  }

  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        room_count: true,
        // Add any other safe fields you want to show
      },
    });

    if (!hotel) {
      return NextResponse.json(
        { error: "Hotel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("[HOTEL FETCH API ERROR]", error);
    return NextResponse.json(
      { error: "Failed to load hotel information" },
      { status: 500 }
    );
  }
}