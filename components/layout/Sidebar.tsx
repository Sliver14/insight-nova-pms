"use client";

import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import { memo } from "react";
import {
  LayoutDashboard,
  BedDouble,
  Calendar,
  CreditCard,
  FileText,
  Users,
  Settings,
  HelpCircle,
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

export const Sidebar = memo(function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-20 fixed h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-40",
        className
      )}
    >
      {/* Logo Section - Forced Center */}
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-glow-primary">
          <span className="text-primary-foreground font-bold text-lg">IN</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 flex flex-col items-center space-y-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            // Removed px-3 and used w-12 to ensure it's a perfect square/circle centered in the w-20
            className="group relative flex items-center justify-center w-12 h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-200"
            // Use 'after:' for the active border so it doesn't push the icon
            activeClassName="bg-sidebar-accent text-foreground after:absolute after:left-[-16px] after:w-1 after:h-6 after:bg-primary after:rounded-r-full"
          >
            <item.icon className="h-6 w-6 shrink-0" />
            
            {/* Tooltip */}
            <span className="absolute left-full z-50 ml-4 px-3 py-1.5 rounded-md bg-popover text-popover-foreground text-sm font-medium shadow-md 
                             opacity-0 invisible -translate-x-2 transition-all duration-200 
                             group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 whitespace-nowrap pointer-events-none">
              {item.label}
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-popover rotate-45" />
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="py-4 flex flex-col items-center border-t border-sidebar-border space-y-4">
        {bottomItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            className="group relative flex items-center justify-center w-12 h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-200"
            activeClassName="bg-sidebar-accent text-foreground after:absolute after:left-[-16px] after:w-1 after:h-6 after:bg-primary after:rounded-r-full"
          >
            <item.icon className="h-6 w-6 shrink-0" />
            <span className="absolute left-full z-50 ml-4 px-3 py-1.5 rounded-md bg-popover text-popover-foreground text-sm font-medium shadow-md 
                             opacity-0 invisible -translate-x-2 transition-all duration-200 
                             group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 whitespace-nowrap pointer-events-none">
              {item.label}
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-popover rotate-45" />
            </span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
});