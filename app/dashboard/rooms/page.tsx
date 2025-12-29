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
import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";

interface Room {
  roomNumber: string;
  status: RoomStatus;
  guestName?: string;
  floor: number;
  type: string;
  price: number;
  checkIn?: string;
  checkOut?: string;
}

const generateRooms = (): Room[] => {
  const types = ["Standard", "Deluxe", "Suite", "Executive"];
  const prices = { Standard: 25000, Deluxe: 45000, Suite: 75000, Executive: 120000 };
  const statuses: RoomStatus[] = ["occupied", "available", "reserved", "cleaning", "maintenance"];
  const guests = ["John Smith", "Mary Johnson", "Ahmed Ali", "Grace Obi", "David Chen"];
  
  const rooms: Room[] = [];
  for (let floor = 1; floor <= 4; floor++) {
    for (let room = 1; room <= 6; room++) {
      const roomNum = floor * 100 + room;
      const type = types[Math.floor(Math.random() * types.length)];
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
        guestName: status === "occupied" ? guests[Math.floor(Math.random() * guests.length)] : undefined,
        floor,
        type,
        price: prices[type as keyof typeof prices],
        checkIn: status === "occupied" ? "2025-01-20" : undefined,
        checkOut: status === "occupied" ? "2025-01-25" : undefined,
      });
    }
  }
  return rooms;
};

const rooms = generateRooms();

export default function Rooms() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = rooms.filter((room) => {
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    const matchesSearch = room.roomNumber.includes(searchQuery) || 
      (room.guestName?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: rooms.length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
    available: rooms.filter((r) => r.status === "available").length,
    reserved: rooms.filter((r) => r.status === "reserved").length,
    cleaning: rooms.filter((r) => r.status === "cleaning").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Rooms</h1>
          <p className="text-muted-foreground">Manage all hotel rooms and their status</p>
        </div>
        <Button variant="hero">
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
            className={`glass-card p-4 text-center transition-all duration-200 ${
              statusFilter === status ? "border-primary shadow-glow-primary" : ""
            }`}
          >
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-sm text-muted-foreground capitalize">{status}</p>
          </button>
        ))}
      </div>

      {/* Room Grid by Floor */}
      {[1, 2, 3, 4].map((floor) => {
        const floorRooms = filteredRooms.filter((r) => r.floor === floor);
        if (floorRooms.length === 0) return null;
        
        return (
          <div key={floor} className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Floor {floor}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {floorRooms.map((room) => (
                <RoomCard
                  key={room.roomNumber}
                  roomNumber={room.roomNumber}
                  status={room.status}
                  guestName={room.guestName}
                  floor={room.floor}
                  onClick={() => setSelectedRoom(room)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Room Detail Dialog */}
      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="glass-card border-glass-border">
          <DialogHeader>
            <DialogTitle className="text-2xl">Room {selectedRoom?.roomNumber}</DialogTitle>
            <DialogDescription>
              {selectedRoom?.type} • Floor {selectedRoom?.floor}
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
                  <p className="font-semibold">₦{selectedRoom.price.toLocaleString()}</p>
                </div>
              </div>

              {selectedRoom.guestName && (
                <div className="glass-card p-4">
                  <p className="text-sm text-muted-foreground mb-2">Guest Information</p>
                  <p className="font-semibold">{selectedRoom.guestName}</p>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span>Check-in: {selectedRoom.checkIn}</span>
                    <span>Check-out: {selectedRoom.checkOut}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {selectedRoom.status === "occupied" && (
                  <Button variant="heroSecondary" className="flex-1">Check Out</Button>
                )}
                {selectedRoom.status === "available" && (
                  <Button variant="hero" className="flex-1">Check In Guest</Button>
                )}
                {selectedRoom.status === "cleaning" && (
                  <Button variant="hero" className="flex-1">Mark as Ready</Button>
                )}
                <Button variant="outline" className="flex-1">View History</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}