"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon?: ReactNode;
  variant?: "default" | "primary" | "secondary" | "warning";
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon,
  variant = "default",
  className,
}: MetricCardProps) {
  const variantStyles = {
    default: "border-glass-border",
    primary: "border-primary/30 shadow-glow-primary",
    secondary: "border-secondary/30 shadow-glow-secondary",
    warning: "border-warning/30",
  };

  const iconColors = {
    default: "text-muted-foreground bg-muted",
    primary: "text-primary bg-primary/20",
    secondary: "text-secondary bg-secondary/20",
    warning: "text-warning bg-warning/20",
  };

  return (
    <div
      className={cn(
        "glass-card p-6 animate-fade-in",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {change && (
            <div
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium",
                change.type === "increase" ? "text-success" : "text-destructive"
              )}
            >
              {change.type === "increase" ? "↑" : "↓"} {Math.abs(change.value)}%
              <span className="text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "p-3 rounded-xl",
              iconColors[variant]
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}