"use client";

import { DashboardWrapper } from "./DashboardWrapper";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardWrapper>
      {children}
    </DashboardWrapper>
  );
}