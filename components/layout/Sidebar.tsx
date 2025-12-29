"use client";

import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  BedDouble,
  Calendar,
  CreditCard,
  FileText,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BedDouble, label: "Rooms", href: "/dashboard/rooms" },
  { icon: Calendar, label: "Bookings", href: "/dashboard/bookings" },
  { icon: CreditCard, label: "Payments", href: "/dashboard/payments" },
  { icon: FileText, label: "Reports", href: "/dashboard/reports" },
  { icon: Users, label: "Staff", href: "/dashboard/staff" },
];

const bottomItems = [
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: HelpCircle, label: "Help", href: "/dashboard/help" },
];

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-40",
        className
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-glow-primary">
            <span className="text-primary-foreground font-bold text-lg">IN</span>
          </div>
          <div>
            <h1 className="font-bold text-foreground">InsightNova</h1>
            <p className="text-xs text-muted-foreground">PMS Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-200"
            activeClassName="bg-sidebar-accent text-foreground border-l-2 border-primary"
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="py-4 px-4 border-t border-sidebar-border space-y-2">
        {bottomItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-200"
            activeClassName="bg-sidebar-accent text-foreground"
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 w-full">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}