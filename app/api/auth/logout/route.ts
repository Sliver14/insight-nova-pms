// app/api/auth/logout/route.ts
import { lucia } from "@/lib/lucia-node";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (sessionId) {
    // Delete the session from DB
    await lucia.invalidateSession(sessionId);
  }

  // Clear the cookie
  const blankCookie = lucia.createBlankSessionCookie();
  cookies().set(blankCookie.name, blankCookie.value, blankCookie.attributes);

  return NextResponse.json({ success: true });
}