"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Calendar, Clock, User } from "lucide-react";
import { useState } from "react";

interface Booking {
  id: string;
  guestName: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: "confirmed" | "pending" | "checked-in" | "checked-out" | "cancelled";
  amount: number;
  isShortStay: boolean;
}

const bookings: Booking[] = [
  { id: "BK001", guestName: "John Smith", room: "101", checkIn: "2025-01-20", checkOut: "2025-01-25", status: "checked-in", amount: 125000, isShortStay: false },
  { id: "BK002", guestName: "Mary Johnson", room: "205", checkIn: "2025-01-21", checkOut: "2025-01-23", status: "confirmed", amount: 90000, isShortStay: false },
  { id: "BK003", guestName: "Ahmed Ali", room: "302", checkIn: "2025-01-20", checkOut: "2025-01-20", status: "checked-out", amount: 15000, isShortStay: true },
  { id: "BK004", guestName: "Grace Obi", room: "108", checkIn: "2025-01-22", checkOut: "2025-01-28", status: "pending", amount: 270000, isShortStay: false },
  { id: "BK005", guestName: "David Chen", room: "401", checkIn: "2025-01-19", checkOut: "2025-01-21", status: "checked-out", amount: 240000, isShortStay: false },
  { id: "BK006", guestName: "Fatima Abdullahi", room: "203", checkIn: "2025-01-20", checkOut: "2025-01-20", status: "checked-in", amount: 12000, isShortStay: true },
];

const statusConfig = {
  confirmed: { color: "bg-primary/20 text-primary border-primary/30", label: "Confirmed" },
  pending: { color: "bg-secondary/20 text-secondary border-secondary/30", label: "Pending" },
  "checked-in": { color: "bg-success/20 text-success border-success/30", label: "Checked In" },
  "checked-out": { color: "bg-muted text-muted-foreground border-border", label: "Checked Out" },
  cancelled: { color: "bg-destructive/20 text-destructive border-destructive/30", label: "Cancelled" },
};

export default function Bookings() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesSearch = 
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.room.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">Manage reservations and short-stay bookings</p>
        </div>
        <Button variant="hero">
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by guest name, booking ID, or room..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="checked-in">Checked In</SelectItem>
            <SelectItem value="checked-out">Checked Out</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="glass-card-hover p-6 flex flex-col lg:flex-row lg:items-center gap-4"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg">{booking.guestName}</h3>
                {booking.isShortStay && (
                  <Badge variant="outline" className="bg-secondary/20 text-secondary border-secondary/30">
                    <Clock className="h-3 w-3 mr-1" />
                    Short Stay
                  </Badge>
                )}
                <Badge variant="outline" className={statusConfig[booking.status].color}>
                  {statusConfig[booking.status].label}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="font-mono">{booking.id}</span>
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Room {booking.room}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {booking.checkIn} → {booking.checkOut}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">₦{booking.amount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.isShortStay ? "30-min billing" : "Total amount"}
                </p>
              </div>
              <div className="flex gap-2">
                {booking.status === "pending" && (
                  <Button variant="hero" size="sm">Confirm</Button>
                )}
                {booking.status === "confirmed" && (
                  <Button variant="hero" size="sm">Check In</Button>
                )}
                {booking.status === "checked-in" && (
                  <Button variant="heroSecondary" size="sm">Check Out</Button>
                )}
                <Button variant="outline" size="sm">Details</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline View Hint */}
      <div className="glass-card p-6 text-center">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">Timeline View Coming Soon</h3>
        <p className="text-muted-foreground">Visual calendar view with drag-and-drop booking management</p>
      </div>
    </div>
  );
}