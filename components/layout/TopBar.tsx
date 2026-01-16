"use client";

import { cn } from "@/lib/utils";
import { Bell, ChevronDown, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { memo } from "react";
import { useUser } from "@/components/providers/userProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface TopBarProps {
  className?: string;
}

export const TopBar = memo(function TopBar({
  className,
}: TopBarProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useUser();

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        router.push("/auth");
        router.refresh();
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  
  if (isLoading) {
    return <TopBarSkeleton className={className} />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const { fullname, hotelName, email } = user;

  return (
    <header
      className={cn(
        "h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50",
        className
      )}
    >
      {/* Hotel Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 text-foreground">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm">
              IN
            </div>
            <span className="font-semibold">{hotelName || "Your Hotel"}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Switch Hotel</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="font-medium">{hotelName || "Your Hotel"}</DropdownMenuItem>
          <DropdownMenuItem>+ Add New Hotel</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Right Side: Search, Notifications, User */}
      <div className="flex items-center gap-4">
        {/* Date Filter (Static) */}
        <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2 cursor-pointer">
          <span className="text-sm text-muted-foreground">Today</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>

        {/* Search Bar (Fake Input) */}
        <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search bookings, guests..."
            className="bg-transparent border-none outline-none text-sm w-40 placeholder:text-muted-foreground"
            readOnly
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full animate-pulse" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
                  {fullname?.slice(0, 1).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block font-medium">
                {fullname || "User"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {fullname || "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {email || "No email"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Hotel Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onSelect={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
});

const TopBarSkeleton = ({ className }: { className?: string }) => (
  <header
    className={cn(
      "h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50",
      className
    )}
  >
    <div className="flex items-center gap-2">
      <Skeleton className="w-8 h-8 rounded-lg" />
      <Skeleton className="w-24 h-4" />
    </div>
    <div className="flex items-center gap-4">
      <Skeleton className="w-24 h-9 rounded-xl hidden md:block" />
      <Skeleton className="w-40 h-9 rounded-xl hidden md:block" />
      <Skeleton className="w-9 h-9 rounded-full" />
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-20 h-4 hidden md:block" />
      </div>
    </div>
  </header>
);
