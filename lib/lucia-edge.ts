// lib/lucia-edge.ts
import { Lucia } from "lucia";

// Dummy adapter — we don't use DB in middleware
class DummyAdapter {
  async getSessionAndUser() { return [null, null]; }
  async getSession() { return null; }
  async getUserSessions() { return []; }
  async setSession() {}
  async updateSession() {}
  async deleteSession() {}
  async deleteUserSessions() {}
  async deleteExpiredSessions() {}
}

export const luciaEdge = new Lucia(new DummyAdapter() as any, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});