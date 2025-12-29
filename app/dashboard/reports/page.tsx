"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileText, AlertTriangle, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const monthlyRevenue = [
  { month: "Jan", revenue: 45000000 },
  { month: "Feb", revenue: 52000000 },
  { month: "Mar", revenue: 48000000 },
  { month: "Apr", revenue: 61000000 },
  { month: "May", revenue: 55000000 },
  { month: "Jun", revenue: 67000000 },
];

const occupancyData = [
  { month: "Jan", rate: 68 },
  { month: "Feb", rate: 72 },
  { month: "Mar", rate: 65 },
  { month: "Apr", rate: 78 },
  { month: "May", rate: 74 },
  { month: "Jun", rate: 82 },
];

interface AlertLog {
  id: string;
  type: "anomaly" | "warning" | "info";
  message: string;
  timestamp: string;
  resolved: boolean;
}

const alertLogs: AlertLog[] = [
  { id: "1", type: "anomaly", message: "Unusual check-out pattern detected in Room 302", timestamp: "2025-01-20 14:30", resolved: false },
  { id: "2", type: "warning", message: "Cash collection exceeds ₦500,000 - Deposit recommended", timestamp: "2025-01-20 12:00", resolved: false },
  { id: "3", type: "anomaly", message: "Multiple discount overrides by staff member", timestamp: "2025-01-19 16:45", resolved: true },
  { id: "4", type: "info", message: "Monthly revenue target achieved ahead of schedule", timestamp: "2025-01-18 09:00", resolved: true },
  { id: "5", type: "warning", message: "POS terminal offline for 30+ minutes", timestamp: "2025-01-17 22:15", resolved: true },
];

const alertConfig = {
  anomaly: { color: "bg-destructive/20 text-destructive border-destructive/30", icon: AlertTriangle },
  warning: { color: "bg-warning/20 text-warning border-warning/30", icon: AlertTriangle },
  info: { color: "bg-primary/20 text-primary border-primary/30", icon: TrendingUp },
};

export default function Reports() {
  const [dateRange, setDateRange] = useState("month");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports & Audit</h1>
          <p className="text-muted-foreground">Analytics, exports, and alert logs</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="hero">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₦${(v / 1000000).toFixed(0)}M`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6">Occupancy Rate</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Occupancy"]}
                />
                <Bar dataKey="rate" fill="hsl(var(--secondary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Daily Summary", desc: "Revenue, check-ins, check-outs", icon: FileText },
          { title: "Staff Performance", desc: "Individual metrics & rankings", icon: TrendingUp },
          { title: "Room Analytics", desc: "Occupancy by room type", icon: Calendar },
        ].map((report) => (
          <button
            key={report.title}
            className="glass-card-hover p-6 text-left flex items-start gap-4"
          >
            <div className="p-3 rounded-xl bg-primary/20">
              <report.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{report.title}</h3>
              <p className="text-sm text-muted-foreground">{report.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Alert Logs */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Alert Logs</h3>
          <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30">
            {alertLogs.filter(a => !a.resolved).length} Active
          </Badge>
        </div>
        <div className="space-y-3">
          {alertLogs.map((alert) => {
            const AlertIcon = alertConfig[alert.type].icon;
            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border flex items-start gap-4 ${
                  alert.resolved ? "opacity-60" : ""
                } ${alertConfig[alert.type].color}`}
              >
                <AlertIcon className="h-5 w-5 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm opacity-80">{alert.timestamp}</p>
                </div>
                {!alert.resolved && (
                  <Button variant="outline" size="sm">
                    Resolve
                  </Button>
                )}
                {alert.resolved && (
                  <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                    Resolved
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}