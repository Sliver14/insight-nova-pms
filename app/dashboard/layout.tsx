// app/(dashboard)/layout.tsx (updated)
import { ThemeProvider } from "next-themes";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserProvider } from "@/components/providers/userProvider";
import { ReactNode } from "react";
import { QueryProvider } from "@/components/providers/query-provider";

export default function ProtectedDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <QueryProvider>
        <UserProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </UserProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}