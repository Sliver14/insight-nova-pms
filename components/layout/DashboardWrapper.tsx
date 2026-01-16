"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useMediaQuery } from "@/hooks/use-mobile";
import { BottomBar } from "./BottomBar"; // We will create this

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex min-h-screen">
      {!isMobile && <Sidebar />}
      <main className={`flex-1 transition-all duration-300 ${!isMobile ? "ml-20" : "pb-20"}`}>
        <TopBar />
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
      {isMobile && <BottomBar />}
    </div>
  );
}
