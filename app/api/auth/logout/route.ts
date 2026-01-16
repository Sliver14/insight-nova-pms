// app/api/auth/logout/route.ts
export const runtime = "nodejs"; // 🔑 REQUIRED for lucia

import { lucia } from "@/lib/lucia-node";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  const sessionId =
    cookieStore.get(lucia.sessionCookieName)?.value ?? null;

  if (sessionId) {
    await lucia.invalidateSession(sessionId);
  }

  const blankCookie = lucia.createBlankSessionCookie();
  cookieStore.set(
    blankCookie.name,
    blankCookie.value,
    blankCookie.attributes
  );

  return NextResponse.json({ success: true });
}
