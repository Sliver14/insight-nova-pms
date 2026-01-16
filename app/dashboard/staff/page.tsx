"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../../components/providers/userProvider";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Check, Copy, Search, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export default function Staff() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const queryClient = useQueryClient();

  // ... (useQuery and useMutation logic remains the same)
  const { data: staff = [], isLoading, isError } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res = await fetch("/api/staff");
      if (!res.ok) throw new Error("Failed to fetch staff");
      return res.json();
    },
  });

  const approvalMutation = useMutation({
    mutationFn: async ({ staffId, isApproved }: { staffId: string; isApproved: boolean }) => {
      const res = await fetch("/api/staff", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId, isApproved }),
      });
      if (!res.ok) throw new Error("Failed to update staff status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({ title: "Success", description: "Staff status updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update status", variant: "destructive" });
    },
  });

  const copySignupUrl = () => {
    if (!user?.hotelId) {
      toast({ title: "Error", description: "No hotel ID found", variant: "destructive" });
      return;
    }
    const baseUrl = window.location.origin;
    const signupUrl = `${baseUrl}/auth/staff-signup?hotelId=${user.hotelId}`;
    navigator.clipboard.writeText(signupUrl);
    setCopied(true);
    toast({ title: "Copied!", description: "Staff signup URL copied" });
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredStaff = useMemo(() => {
    if (!searchQuery) return staff;
    const lower = searchQuery.toLowerCase();
    return staff.filter((member: any) =>
      (member.fullname?.toLowerCase() || "").includes(lower) ||
      (member.email?.toLowerCase() || "").includes(lower) ||
      (member.role?.toLowerCase() || "").includes(lower)
    );
  }, [searchQuery, staff]);

  const totalStaff = staff.length;
  const activeStaff = staff.filter((s: any) => s.is_approved).length;
  const pendingStaff = totalStaff - activeStaff;

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      ADMIN: "destructive", MANAGER: "default", STAFF: "secondary", FRONTDESK: "outline", CLEANER: "outline",
    };
    return variants[role?.toUpperCase()] || "outline";
  };

  if (isLoading) return <div className="space-y-8 p-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-6 md:space-y-8 pb-10 overflow-x-hidden">
      {/* Header - Stacks on mobile */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage hotel staff and roles</p>
        </div>
        <Button variant="hero" onClick={copySignupUrl} className="w-full sm:w-auto">
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? "Copied!" : "Signup Link"}
        </Button>
      </div>

      {/* Stats - 3 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "Total Staff", val: totalStaff, color: "" },
          { label: "Active", val: activeStaff, color: "text-primary" },
          { label: "Pending", val: pendingStaff, color: "text-orange-500" }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 flex flex-row sm:flex-col justify-between items-center sm:text-center">
            <p className="text-xs md:text-sm text-muted-foreground uppercase font-medium">{stat.label}</p>
            <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search staff..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Staff Table Container - This handles the horizontal scroll */}
      <div className="glass-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
          <div className="inline-block min-w-full align-middle">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="min-w-[150px]">Name & Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member: any) => (
                  <TableRow key={member.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="font-semibold text-sm md:text-base">{member.fullname}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[120px] md:max-w-none">
                        {member.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadge(member.role)} className="text-[10px] md:text-xs uppercase">
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.is_approved ? "default" : "outline"} className="text-[10px]">
                        {member.is_approved ? "Active" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {format(new Date(member.created_at), "MMM dd, yy")}
                    </TableCell>
                    <TableCell className="text-right">
                      {!member.is_approved ? (
                        <div className="flex gap-1 justify-end">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-primary"
                            onClick={() => approvalMutation.mutate({ staffId: member.id, isApproved: true })}
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => approvalMutation.mutate({ staffId: member.id, isApproved: false })}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Approved</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredStaff.length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm">No results found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}