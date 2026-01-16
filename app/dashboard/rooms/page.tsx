"use client";

import { RoomCard, RoomStatus } from "@/components/dashboard/RoomCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Plus } from "lucide-react";
import { AddRoomModal } from "@/components/rooms/AddRoomModal";

// Real Room type (matches your Prisma schema)
interface Room {
  id: string;
  room_number: string;
  status: RoomStatus;
  guestName?: string;
  floor: number;
  type: string;
  rate_per_night: number;
  checkIn?: string;
  checkOut?: string;
}

export default function Rooms() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addRoomOpen, setAddRoomOpen] = useState(false);

  const { data: rooms = [], isLoading, refetch } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await fetch("/api/rooms");
      if (!res.ok) throw new Error("Failed to fetch rooms");
      return res.json();
    },
  });

  const filteredRooms = useMemo(() => 
    rooms.filter((room) => {
      const matchesStatus = statusFilter === "all" || room.status === statusFilter;
      const matchesSearch = 
        room.room_number?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (room.guestName || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    }),
    [rooms, statusFilter, searchQuery]
  );

  const statusCounts = useMemo(() => ({
    all: rooms.length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
    available: rooms.filter((r) => r.status === "available").length,
    reserved: rooms.filter((r) => r.status === "reserved").length,
    cleaning: rooms.filter((r) => r.status === "cleaning").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
  }), [rooms]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Rooms</h1>
          <p className="text-muted-foreground">Manage all hotel rooms and their status</p>
        </div>
        <Button variant="hero" onClick={() => setAddRoomOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by room number or guest name..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rooms ({statusCounts.all})</SelectItem>
            <SelectItem value="occupied">Occupied ({statusCounts.occupied})</SelectItem>
            <SelectItem value="available">Available ({statusCounts.available})</SelectItem>
            <SelectItem value="reserved">Reserved ({statusCounts.reserved})</SelectItem>
            <SelectItem value="cleaning">Cleaning ({statusCounts.cleaning})</SelectItem>
            <SelectItem value="maintenance">Maintenance ({statusCounts.maintenance})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`glass-card p-4 text-center transition-all duration-200 cursor-pointer ${
              statusFilter === status ? "border-primary shadow-glow-primary" : ""
            }`}
          >
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-sm text-muted-foreground capitalize">{status}</p>
          </button>
        ))}
      </div>

      {/* Room Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading rooms...</div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No rooms found</div>
      ) : (
        <div className="glass-card p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id || room.room_number} // Use id if available, fallback to room_number
                roomNumber={room.room_number}
                status={room.status?.toLowerCase() as RoomStatus}
                guestName={room.guestName}
                floor={parseInt(room.room_number?.charAt(0) || "1")}
                onClick={() => setSelectedRoom(room)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Room Detail Dialog */}
      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="glass-card border-glass-border">
          <DialogHeader>
            <DialogTitle className="text-2xl">Room {selectedRoom?.room_number}</DialogTitle>
            <DialogDescription>
              {selectedRoom?.type} • ₦{selectedRoom?.rate_per_night?.toLocaleString()}/night
            </DialogDescription>
          </DialogHeader>
          
          {selectedRoom && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold capitalize">{selectedRoom.status}</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-sm text-muted-foreground">Rate/Night</p>
                  <p className="font-semibold">₦{selectedRoom.rate_per_night?.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedRoom(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Room Modal */}
      <AddRoomModal 
        open={addRoomOpen} 
        onOpenChange={setAddRoomOpen}
        onSuccess={refetch}
      />
    </div>
  );
}