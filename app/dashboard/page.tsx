"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
import { RoomCard, RoomStatus } from "@/components/dashboard/RoomCard";
import { StaffCard } from "@/components/dashboard/StaffCard";
import { TrendingUp, BedDouble, AlertTriangle, Users } from "lucide-react";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueData = [
  { name: "Mon", revenue: 4200000 },
  { name: "Tue", revenue: 3800000 },
  { name: "Wed", revenue: 5100000 },
  { name: "Thu", revenue: 4700000 },
  { name: "Fri", revenue: 6200000 },
  { name: "Sat", revenue: 7800000 },
  { name: "Sun", revenue: 6500000 },
];

const staffPerformanceData = [
  { name: "Adamu", revenue: 2800000 },
  { name: "Chioma", revenue: 2400000 },
  { name: "Emeka", revenue: 2100000 },
  { name: "Fatima", revenue: 1800000 },
  { name: "Ibrahim", revenue: 1500000 },
];

const pieData = [
  { name: "Front Desk", value: 45, color: "hsl(168, 70%, 50%)" },
  { name: "Housekeeping", value: 25, color: "hsl(37, 91%, 55%)" },
  { name: "Maintenance", value: 15, color: "hsl(200, 70%, 50%)" },
  { name: "Security", value: 15, color: "hsl(280, 70%, 50%)" },
];

// Generate sample rooms
const generateRooms = () => {
  const statuses: RoomStatus[] = ["occupied", "available", "reserved", "cleaning", "maintenance"];
  const rooms = [];
  for (let floor = 1; floor <= 3; floor++) {
    for (let room = 1; room <= 8; room++) {
      const roomNum = floor * 100 + room;
      const statusIndex = Math.floor(Math.random() * 100);
      let status: RoomStatus;
      if (statusIndex < 50) status = "occupied";
      else if (statusIndex < 70) status = "available";
      else if (statusIndex < 85) status = "reserved";
      else if (statusIndex < 95) status = "cleaning";
      else status = "maintenance";
      
      rooms.push({
        roomNumber: `${roomNum}`,
        status,
        guestName: status === "occupied" ? ["John Smith", "Mary Johnson", "Ahmed Ali", "Grace Obi"][Math.floor(Math.random() * 4)] : undefined,
        floor,
      });
    }
  }
  return rooms;
};

const rooms = generateRooms();

const staffMembers = [
  { id: "1", name: "Adamu Bello", role: "Front Desk Manager", revenue: 2800000, performance: "excellent" as const },
  { id: "2", name: "Chioma Eze", role: "Senior Receptionist", revenue: 2400000, performance: "excellent" as const },
  { id: "3", name: "Emeka Okonkwo", role: "Night Auditor", revenue: 2100000, performance: "good" as const },
  { id: "4", name: "Fatima Abdullahi", role: "Receptionist", revenue: 1800000, performance: "good" as const },
  { id: "5", name: "Ibrahim Musa", role: "Reservations Agent", revenue: 1500000, performance: "average" as const },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your hotel performance</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Revenue Growth"
          value="+23.5%"
          change={{ value: 12.3, type: "increase" }}
          icon={<TrendingUp className="h-6 w-6" />}
          variant="primary"
        />
        <MetricCard
          title="Occupancy Rate"
          value="78%"
          change={{ value: 5.2, type: "increase" }}
          icon={<BedDouble className="h-6 w-6" />}
          variant="default"
        />
        <MetricCard
          title="Rooms Occupied"
          value="19/24"
          icon={<Users className="h-6 w-6" />}
          variant="default"
        />
        <MetricCard
          title="Anomalies"
          value="3"
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
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
                  activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff Activity Pie */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6">Staff Activity</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Grid & Staff Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Occupancy Grid */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Room Occupancy</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-muted-foreground">Reserved</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {rooms.map((room) => (
              <RoomCard
                key={room.roomNumber}
                roomNumber={room.roomNumber}
                status={room.status}
                guestName={room.guestName}
                floor={room.floor}
              />
            ))}
          </div>
        </div>

        {/* Staff Performance */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6">Top Staff by Revenue</h3>
          <div className="space-y-3">
            {staffMembers.map((staff) => (
              <StaffCard key={staff.id} staff={staff} />
            ))}
          </div>
        </div>
      </div>

      {/* Staff Performance Bar Chart */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-6">Staff Revenue Contribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={staffPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
                formatter={(value: number) => [`₦${value.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
