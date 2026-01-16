// lib/auth.ts
import { Lucia } from "lucia";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

const prisma = new PrismaClient();
const adapter = new PrismaAdapter(prisma.session, prisma.user); // This is fine — only used in Node runtime (API routes, server components)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => ({
    fullname: attributes.fullname,
    email: attributes.email,
    role: attributes.role,
    hotelId: attributes.hotel_id,
    isApproved: attributes.is_approved,
  }),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      fullname: string;
      email: string | null;
      role: string;
      hotel_id: string | null;
      is_approved: boolean;
    };
  }
}