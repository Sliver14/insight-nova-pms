"use client";

import { MetricCard } from "@/components/dashboard/MetricCard";
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
import { Search, Download, CreditCard, Banknote, Smartphone, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface Transaction {
  id: string;
  guestName: string;
  room: string;
  amount: number;
  method: "cash" | "pos" | "transfer" | "mobile";
  status: "completed" | "pending" | "failed" | "unreconciled";
  date: string;
  time: string;
  staff: string;
}

const transactions: Transaction[] = [
  { id: "TXN001", guestName: "John Smith", room: "101", amount: 75000, method: "pos", status: "completed", date: "2025-01-20", time: "10:30 AM", staff: "Adamu Bello" },
  { id: "TXN002", guestName: "Mary Johnson", room: "205", amount: 45000, method: "transfer", status: "completed", date: "2025-01-20", time: "11:15 AM", staff: "Chioma Eze" },
  { id: "TXN003", guestName: "Ahmed Ali", room: "302", amount: 15000, method: "cash", status: "unreconciled", date: "2025-01-20", time: "12:00 PM", staff: "Emeka Okonkwo" },
  { id: "TXN004", guestName: "Grace Obi", room: "108", amount: 120000, method: "transfer", status: "pending", date: "2025-01-20", time: "02:45 PM", staff: "Fatima Abdullahi" },
  { id: "TXN005", guestName: "David Chen", room: "401", amount: 240000, method: "pos", status: "completed", date: "2025-01-19", time: "09:00 AM", staff: "Ibrahim Musa" },
  { id: "TXN006", guestName: "Fatima Abdullahi", room: "203", amount: 12000, method: "mobile", status: "failed", date: "2025-01-19", time: "03:30 PM", staff: "Adamu Bello" },
];

const methodConfig = {
  cash: { icon: Banknote, label: "Cash", color: "text-success" },
  pos: { icon: CreditCard, label: "POS", color: "text-primary" },
  transfer: { icon: Smartphone, label: "Transfer", color: "text-chart-3" },
  mobile: { icon: Smartphone, label: "Mobile Money", color: "text-secondary" },
};

const statusConfig = {
  completed: { color: "bg-success/20 text-success border-success/30", label: "Completed" },
  pending: { color: "bg-secondary/20 text-secondary border-secondary/30", label: "Pending" },
  failed: { color: "bg-destructive/20 text-destructive border-destructive/30", label: "Failed" },
  unreconciled: { color: "bg-warning/20 text-warning border-warning/30", label: "Unreconciled" },
};

export default function Payments() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((txn) => {
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    const matchesMethod = methodFilter === "all" || txn.method === methodFilter;
    const matchesSearch = 
      txn.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesMethod && matchesSearch;
  });

  const totalRevenue = transactions.filter(t => t.status === "completed").reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = transactions.filter(t => t.status === "pending").reduce((sum, t) => sum + t.amount, 0);
  const unreconciledCount = transactions.filter(t => t.status === "unreconciled").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Track all transactions and payment methods</p>
        </div>
        <Button variant="hero">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Today's Revenue"
          value={`₦${totalRevenue.toLocaleString()}`}
          icon={<CreditCard className="h-6 w-6" />}
          variant="primary"
        />
        <MetricCard
          title="Pending Payments"
          value={`₦${pendingAmount.toLocaleString()}`}
          icon={<Banknote className="h-6 w-6" />}
          variant="secondary"
        />
        <MetricCard
          title="Unreconciled"
          value={unreconciledCount}
          icon={<AlertTriangle className="h-6 w-6" />}
          variant="warning"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by guest name or transaction ID..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="unreconciled">Unreconciled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="pos">POS</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
            <SelectItem value="mobile">Mobile Money</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold text-muted-foreground">Transaction</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Guest</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Method</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Amount</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Staff</th>
                <th className="text-right p-4 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => {
                const MethodIcon = methodConfig[txn.method].icon;
                return (
                  <tr key={txn.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-mono text-sm">{txn.id}</p>
                      <p className="text-xs text-muted-foreground">{txn.date} • {txn.time}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{txn.guestName}</p>
                      <p className="text-sm text-muted-foreground">Room {txn.room}</p>
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center gap-2 ${methodConfig[txn.method].color}`}>
                        <MethodIcon className="h-4 w-4" />
                        <span>{methodConfig[txn.method].label}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold">₦{txn.amount.toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={statusConfig[txn.status].color}>
                        {statusConfig[txn.status].label}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{txn.staff}</td>
                    <td className="p-4 text-right">
                      {txn.status === "unreconciled" && (
                        <Button variant="heroSecondary" size="sm">Reconcile</Button>
                      )}
                      {txn.status === "pending" && (
                        <Button variant="hero" size="sm">Confirm</Button>
                      )}
                      {(txn.status === "completed" || txn.status === "failed") && (
                        <Button variant="outline" size="sm">View</Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}