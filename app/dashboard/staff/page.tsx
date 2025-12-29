"use client";

import { StaffCard } from "@/components/dashboard/StaffCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus, Clock, CreditCard, Calendar } from "lucide-react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
  revenue: number;
  performance: "excellent" | "good" | "average" | "poor";
  checkIns: number;
  checkOuts: number;
  transactions: number;
  shiftStart: string;
  shiftEnd: string;
  status: "active" | "on-break" | "off-duty";
}

const staffMembers: StaffMember[] = [
  { id: "1", name: "Adamu Bello", role: "Front Desk Manager", email: "adamu@hotel.com", phone: "+234 801 234 5678", revenue: 2800000, performance: "excellent", checkIns: 45, checkOuts: 38, transactions: 124, shiftStart: "06:00", shiftEnd: "14:00", status: "active" },
  { id: "2", name: "Chioma Eze", role: "Senior Receptionist", email: "chioma@hotel.com", phone: "+234 802 345 6789", revenue: 2400000, performance: "excellent", checkIns: 42, checkOuts: 35, transactions: 98, shiftStart: "06:00", shiftEnd: "14:00", status: "active" },
  { id: "3", name: "Emeka Okonkwo", role: "Night Auditor", email: "emeka@hotel.com", phone: "+234 803 456 7890", revenue: 2100000, performance: "good", checkIns: 28, checkOuts: 45, transactions: 87, shiftStart: "22:00", shiftEnd: "06:00", status: "off-duty" },
  { id: "4", name: "Fatima Abdullahi", role: "Receptionist", email: "fatima@hotel.com", phone: "+234 804 567 8901", revenue: 1800000, performance: "good", checkIns: 35, checkOuts: 30, transactions: 76, shiftStart: "14:00", shiftEnd: "22:00", status: "on-break" },
  { id: "5", name: "Ibrahim Musa", role: "Reservations Agent", email: "ibrahim@hotel.com", phone: "+234 805 678 9012", revenue: 1500000, performance: "average", checkIns: 22, checkOuts: 18, transactions: 54, shiftStart: "14:00", shiftEnd: "22:00", status: "active" },
];

const weeklyData = [
  { day: "Mon", revenue: 450000 },
  { day: "Tue", revenue: 380000 },
  { day: "Wed", revenue: 520000 },
  { day: "Thu", revenue: 470000 },
  { day: "Fri", revenue: 620000 },
  { day: "Sat", revenue: 780000 },
  { day: "Sun", revenue: 560000 },
];

const statusConfig = {
  active: { color: "bg-success/20 text-success border-success/30", label: "Active" },
  "on-break": { color: "bg-secondary/20 text-secondary border-secondary/30", label: "On Break" },
  "off-duty": { color: "bg-muted text-muted-foreground border-border", label: "Off Duty" },
};

export default function Staff() {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStaff = staffMembers.filter((staff) =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Monitor performance and manage team</p>
        </div>
        <Button variant="hero">
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search staff by name or role..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Active Staff Count */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = staffMembers.filter((s) => s.status === status).length;
          return (
            <div key={status} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground capitalize">{status.replace("-", " ")}</p>
              </div>
              <Badge variant="outline" className={config.color}>
                {config.label}
              </Badge>
            </div>
          );
        })}
      </div>

      {/* Staff List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredStaff.map((staff) => (
          <div key={staff.id} onClick={() => setSelectedStaff(staff)} className="cursor-pointer">
            <StaffCard staff={staff} />
            <div className="flex items-center justify-between px-4 py-2 bg-muted/30 rounded-b-xl -mt-2 border-x border-b border-glass-border">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {staff.shiftStart} - {staff.shiftEnd}
                </span>
              </div>
              <Badge variant="outline" className={statusConfig[staff.status].color}>
                {statusConfig[staff.status].label}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Detail Dialog */}
      <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
        <DialogContent className="glass-card border-glass-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedStaff?.name}</DialogTitle>
            <DialogDescription>{selectedStaff?.role}</DialogDescription>
          </DialogHeader>
          
          {selectedStaff && (
            <div className="space-y-6 mt-4">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedStaff.email}</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedStaff.phone}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-4 text-center">
                  <CreditCard className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{selectedStaff.transactions}</p>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <Calendar className="h-5 w-5 mx-auto mb-2 text-success" />
                  <p className="text-2xl font-bold">{selectedStaff.checkIns}</p>
                  <p className="text-sm text-muted-foreground">Check-ins</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <Calendar className="h-5 w-5 mx-auto mb-2 text-secondary" />
                  <p className="text-2xl font-bold">{selectedStaff.checkOuts}</p>
                  <p className="text-sm text-muted-foreground">Check-outs</p>
                </div>
              </div>

              {/* Weekly Performance Chart */}
              <div className="glass-card p-4">
                <h4 className="font-semibold mb-4">Weekly Revenue</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}K`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                        }}
                        formatter={(value: number) => [`₦${value.toLocaleString()}`, "Revenue"]}
                      />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="hero" className="flex-1">Edit Profile</Button>
                <Button variant="outline" className="flex-1">View Full Activity</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}