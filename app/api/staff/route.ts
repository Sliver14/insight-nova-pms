// app/api/staff/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { lucia } from "@/lib/lucia-node";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session || !user || !user.hotelId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const staff = await prisma.user.findMany({
      where: {
        hotel_id: user.hotelId,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        role: true,
        is_approved: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return NextResponse.json(staff);
  } catch (error) {
    console.error("[GET STAFF ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

const approvalSchema = z.object({
    staffId: z.string().uuid(),
    isApproved: z.boolean(),
});

export async function PUT(request: Request) {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (!session || !user || !user.hotelId || user.role !== 'OWNER' && user.role !== 'MANAGER') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await request.json();
        const validated = approvalSchema.safeParse(body);
        if (!validated.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const { staffId, isApproved } = validated.data;
        
        // Ensure the staff member being updated belongs to the same hotel
        const staffToUpdate = await prisma.user.findFirst({
            where: {
                id: staffId,
                hotel_id: user.hotelId,
            }
        });

        if(!staffToUpdate) {
            return NextResponse.json({ error: "Staff not found" }, { status: 404 });
        }

        const updatedStaff = await prisma.user.update({
            where: {
                id: staffId,
            },
            data: {
                is_approved: isApproved,
            }
        });

        return NextResponse.json(updatedStaff);
    } catch (error) {
        console.error("[UPDATE STAFF ERROR]", error);
        return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
    }
}
