"use client";

import { cn } from "@/lib/utils";
import { Bell, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  hotelName?: string;
  userName?: string;
  className?: string;
}

export function TopBar({
  hotelName = "Grand Palace Hotel",
  userName = "Admin",
  className,
}: TopBarProps) {
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
            <span className="font-semibold">{hotelName}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Switch Hotel</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{hotelName}</DropdownMenuItem>
          <DropdownMenuItem>Add New Hotel</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search & Actions */}
      <div className="flex items-center gap-4">
        {/* Date Filter */}
        <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
          <span className="text-sm text-muted-foreground">Today</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm w-32 placeholder:text-muted-foreground"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/20 text-primary text-sm">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block font-medium">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}