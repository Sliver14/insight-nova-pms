"use client";

import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  BedDouble,
  Calendar,
  Users,
  Settings,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BedDouble, label: "Rooms", href: "/dashboard/rooms" },
  { icon: Calendar, label: "Bookings", href: "/dashboard/bookings" },
  { icon: Users, label: "Staff", href: "/dashboard/staff" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function BottomBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around md:hidden z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          className="flex flex-col items-center justify-center text-muted-foreground w-full h-full"
          activeClassName="text-primary"
        >
          <item.icon className="h-6 w-6" />
          <span className="text-xs">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
