"use client";

import { cn } from "@/lib/utils";

export type RoomStatus = "occupied" | "available" | "reserved" | "cleaning" | "maintenance";

interface RoomCardProps {
  roomNumber: string;
  status: RoomStatus;
  guestName?: string;
  floor?: number;
  onClick?: () => void;
  className?: string;
}

const statusConfig = {
  occupied: {
    color: "bg-primary/20 border-primary/40 text-primary",
    label: "Occupied",
    dot: "bg-primary",
  },
  available: {
    color: "bg-muted border-glass-border text-muted-foreground",
    label: "Available",
    dot: "bg-muted-foreground",
  },
  reserved: {
    color: "bg-secondary/20 border-secondary/40 text-secondary",
    label: "Reserved",
    dot: "bg-secondary",
  },
  cleaning: {
    color: "bg-chart-3/20 border-chart-3/40 text-chart-3",
    label: "Cleaning",
    dot: "bg-chart-3",
  },
  maintenance: {
    color: "bg-destructive/20 border-destructive/40 text-destructive",
    label: "Maintenance",
    dot: "bg-destructive",
  },
};

export function RoomCard({
  roomNumber,
  status,
  guestName,
  floor,
  onClick,
  className,
}: RoomCardProps) {
  const config = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-left w-full",
        config.color,
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg">{roomNumber}</span>
        <span className={cn("w-2 h-2 rounded-full animate-pulse", config.dot)} />
      </div>
      <p className="text-xs opacity-80 truncate">
        {guestName || config.label}
      </p>
      {floor && (
        <p className="text-xs opacity-60 mt-1">Floor {floor}</p>
      )}
    </button>
  );
}