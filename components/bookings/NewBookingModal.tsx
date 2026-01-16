"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface NewBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface Room {
  id: string;
  room_number: string;
  type: string;
  rate_per_night: number;
}

export function NewBookingModal({ open, onOpenChange, onSuccess }: NewBookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    roomId: "",
    guestName: "",
    guestEmail: "",
    checkInDate: "",
    checkOutDate: "",
    status: "PENDING",
  });

  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  // Fetch available rooms
  useEffect(() => {
    if (open) {
      fetchRooms();
    }
  }, [open]);

  // Calculate total price when dates or room changes
  useEffect(() => {
    if (formData.roomId && formData.checkInDate && formData.checkOutDate) {
      const room = rooms.find((r) => r.id === formData.roomId);
      if (room) {
        const checkIn = new Date(formData.checkInDate);
        const checkOut = new Date(formData.checkOutDate);
        const nights = Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (nights > 0) {
          setCalculatedPrice(room.rate_per_night * nights);
        } else {
          setCalculatedPrice(0);
        }
      }
    } else {
      setCalculatedPrice(0);
    }
  }, [formData.roomId, formData.checkInDate, formData.checkOutDate, rooms]);

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const response = await fetch("/api/rooms");
      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.roomId || !formData.guestName || !formData.guestEmail || !formData.checkInDate || !formData.checkOutDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate dates
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    
    if (checkOut <= checkIn) {
      toast({
        title: "Error",
        description: "Check-out date must be after check-in date",
        variant: "destructive",
      });
      return;
    }

    if (calculatedPrice <= 0) {
      toast({
        title: "Error",
        description: "Invalid booking duration",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: formData.roomId,
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          totalPrice: calculatedPrice,
          status: formData.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      toast({
        title: "Success",
        description: "Booking created successfully",
      });

      // Reset form
      setFormData({
        roomId: "",
        guestName: "",
        guestEmail: "",
        checkInDate: "",
        checkOutDate: "",
        status: "PENDING",
      });
      setCalculatedPrice(0);

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>New Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guestName">Guest Name *</Label>
            <Input
              id="guestName"
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              placeholder="Enter guest name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestEmail">Guest Email *</Label>
            <Input
              id="guestEmail"
              type="email"
              value={formData.guestEmail}
              onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
              placeholder="guest@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomId">Room *</Label>
            <Select value={formData.roomId} onValueChange={(value) => setFormData({ ...formData, roomId: value })}>
              <SelectTrigger>
                <SelectValue placeholder={loadingRooms ? "Loading rooms..." : "Select room"} />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    Room {room.room_number} - {room.type} (₦{room.rate_per_night?.toLocaleString()}/night)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkInDate">Check-in Date *</Label>
              <Input
                id="checkInDate"
                type="date"
                value={formData.checkInDate}
                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOutDate">Check-out Date *</Label>
              <Input
                id="checkOutDate"
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                min={formData.checkInDate || new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {calculatedPrice > 0 && (
            <div className="rounded-lg bg-muted p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Price:</span>
                <span className="text-lg font-bold">₦{calculatedPrice.toLocaleString()}</span>
              </div>
              {formData.checkInDate && formData.checkOutDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.ceil((new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} night(s)
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || loadingRooms}>
              {loading ? "Creating..." : "Create Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
