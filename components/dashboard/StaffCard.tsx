"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  revenue: number;
  performance: "excellent" | "good" | "average" | "poor";
}

interface StaffCardProps {
  staff: StaffMember;
  onClick?: () => void;
  className?: string;
}

const performanceConfig = {
  excellent: { color: "text-primary", bg: "bg-primary/20", label: "Excellent" },
  good: { color: "text-success", bg: "bg-success/20", label: "Good" },
  average: { color: "text-warning", bg: "bg-warning/20", label: "Average" },
  poor: { color: "text-destructive", bg: "bg-destructive/20", label: "Poor" },
};

export function StaffCard({ staff, onClick, className }: StaffCardProps) {
  const perf = performanceConfig[staff.performance];

  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card p-4 flex items-center gap-4 cursor-pointer hover:bg-card/90 transition-all duration-200",
        className
      )}
    >
      <Avatar className="h-12 w-12 border-2 border-primary/30">
        <AvatarImage src={staff.avatar} alt={staff.name} />
        <AvatarFallback className="bg-primary/20 text-primary font-semibold">
          {staff.name.split(" ").map((n) => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{staff.name}</p>
        <p className="text-sm text-muted-foreground">{staff.role}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-primary">₦{staff.revenue.toLocaleString()}</p>
        <span
          className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            perf.bg,
            perf.color
          )}
        >
          {perf.label}
        </span>
      </div>
    </div>
  );
}