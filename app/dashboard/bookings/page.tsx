"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { NewBookingModal } from "@/components/bookings/NewBookingModal";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function Bookings() {
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await fetch("/api/bookings");
      if (!response.ok) throw new Error("Failed to fetch bookings");
      return response.json();
    },
  });

  const handleBookingSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
  }, [queryClient]);

  const getStatusBadge = useCallback((status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      CONFIRMED: "default",
      PENDING: "secondary",
      CANCELLED: "destructive",
    };
    return variants[status] || "outline";
  }, []);

  const sortedBookings = useMemo(() => {
    const filtered = bookings.filter((booking: any) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        booking.guestName?.toLowerCase().includes(searchLower) ||
        booking.guestEmail?.toLowerCase().includes(searchLower) ||
        booking.room?.room_number?.includes(searchLower)
      );
    });
    return [...filtered].sort((a: any, b: any) => 
      new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
    );
  }, [bookings, searchQuery]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">Manage guest reservations</p>
        </div>
        <Button variant="hero" onClick={() => setNewBookingOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by guest name, email, or room..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Total Bookings</p>
          <p className="text-2xl font-bold">{bookings.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold text-primary">
            {bookings.filter((b: any) => b.status === "CONFIRMED").length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-secondary">
            {bookings.filter((b: any) => b.status === "PENDING").length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground">Cancelled</p>
          <p className="text-2xl font-bold text-muted-foreground">
            {bookings.filter((b: any) => b.status === "CANCELLED").length}
          </p>
        </div>
      </div>

      <div className="glass-card">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading bookings...</div>
        ) : sortedBookings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery ? "No bookings found matching your search" : "No bookings yet"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.guestName}</p>
                      <p className="text-sm text-muted-foreground">{booking.guestEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    Room {booking.room?.room_number} ({booking.room?.type})
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.checkInDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.checkOutDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ₦{booking.totalPrice?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(booking.status)}>
                      {booking.status?.toLowerCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <NewBookingModal 
        open={newBookingOpen} 
        onOpenChange={setNewBookingOpen}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
}
