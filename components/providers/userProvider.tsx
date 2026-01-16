// components/providers/UserProvider.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession } from "@/hooks/use-session"; // Correct path

type User = {
  id: string;
  fullname: string | null;
  email: string | null;
  role: string;
  hotelId: string | null;
  isApproved: boolean;
  hotelName: string | null;
};

type UserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, isLoading } = useSession();

  const value = {
    user: session?.user || null,
    isAuthenticated: !!session?.authenticated,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};