"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";

interface AddRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const today = format(new Date(), "yyyy-MM-dd");
const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");

export function AddRoomModal({ open, onOpenChange, onSuccess }: AddRoomModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    roomNumbers: "",
    type: "SINGLE",
    price: "",
    status: "AVAILABLE",
    checkInDate: today,
    checkOutDate: tomorrow,
  });

  // Auto-update check-out when check-in changes
  useEffect(() => {
    if (formData.checkInDate) {
      const newCheckOut = format(addDays(new Date(formData.checkInDate), 1), "yyyy-MM-dd");
      setFormData((prev) => ({ ...prev, checkOutDate: newCheckOut }));
    }
  }, [formData.checkInDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const roomList = formData.roomNumbers
      .split(",")
      .map((num) => num.trim())
      .filter(Boolean);

    if (roomList.length === 0 || !formData.price) {
      toast({
        title: "Error",
        description: "Please enter at least one room number and a price",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    // Validate dates
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      toast({
        title: "Error",
        description: "Invalid date format",
        variant: "destructive",
      });
      return;
    }

    if (checkOut <= checkIn) {
      toast({
        title: "Error",
        description: "Check-out date must be after check-in date",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNumbers: roomList,
          type: formData.type,
          price: price,
          status: formData.status,
          // You can send dates if your API needs them later
          // checkInDate: formData.checkInDate,
          // checkOutDate: formData.checkOutDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create rooms");
      }

      toast({
        title: "Success",
        description: `${roomList.length} room(s) added successfully`,
      });

      // Reset form with fresh dates
      setFormData({
        roomNumbers: "",
        type: "SINGLE",
        price: "",
        status: "AVAILABLE",
        checkInDate: today,
        checkOutDate: tomorrow,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add rooms",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Rooms</DialogTitle>
          <DialogDescription>
            Enter room numbers separated by commas to add multiple at once.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="roomNumbers">Room Numbers *</Label>
            <Input
              id="roomNumbers"
              value={formData.roomNumbers}
              onChange={(e) => setFormData({ ...formData, roomNumbers: e.target.value })}
              placeholder="101, 102, 103..."
              required
            />
          </div>

          {/* Date Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkInDate">Check-in Date</Label>
              <Input
                id="checkInDate"
                type="date"
                value={formData.checkInDate}
                min={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) =>
                  setFormData({ ...formData, checkInDate: e.target.value })
                }
              />

            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOutDate">Check-out Date</Label>
              <Input
                id="checkOutDate"
                type="date"
                value={formData.checkOutDate}
                min={formData.checkInDate}
                onChange={(e) =>
                  setFormData({ ...formData, checkOutDate: e.target.value })
                }
              />

            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Room Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE">Single</SelectItem>
                <SelectItem value="DOUBLE">Double</SelectItem>
                <SelectItem value="SUITE">Suite</SelectItem>
                <SelectItem value="DELUXE">Deluxe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price per Night (₦) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="50000"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Initial Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="OCCUPIED">Occupied</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Add Rooms"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}