"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchSession() {
  const res = await fetch("/api/auth/session");
  if (!res.ok) {
    throw new Error("Failed to fetch session");
  }
  return res.json();
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}
