// app/staff-auth/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, Lock, Mail, Phone, User, AlertCircle, CheckCircle2, Users, UserCog, Sparkles, UserCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Mode = "signin" | "signup";

const roleOptions = [
  { value: "staff", label: "Staff", icon: Users, desc: "General hotel staff" },
  { value: "manager", label: "Manager", icon: UserCog, desc: "Can manage and approve staff" },
  { value: "frontdesk", label: "Front Desk", icon: UserCheck, desc: "Guest services & check-in" },
  { value: "cleaner", label: "Cleaner", icon: Sparkles, desc: "Housekeeping" },
];

export default function StaffAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(false);
  const [hotelInfo, setHotelInfo] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const hotelId = searchParams.get("hotelId") || searchParams.get("h");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    role: "staff" as "staff" | "manager" | "frontdesk" | "cleaner",
  });

  useEffect(() => {
    if (!hotelId) {
      toast({
        title: "Invalid Link",
        description: "Missing hotel information. Contact your manager for the correct link.",
        variant: "destructive",
      });
      return;
    }
    fetchHotelInfo();
  }, [hotelId]);

  const fetchHotelInfo = async () => {
    try {
      const res = await fetch(`/api/hotels/${hotelId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setHotelInfo(data);
    } catch {
      toast({
        title: "Hotel Not Found",
        description: "This link is invalid or the hotel no longer exists.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelId) return;

    setLoading(true);

    try {
      if (mode === "signup") {
        // === STAFF SIGNUP ===
        if (!formData.fullname.trim() || !formData.email.trim() || !formData.password || !formData.phone.trim()) {
          throw new Error("All fields are required");
        }

        const res = await fetch("/api/auth/staff-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullname: formData.fullname.trim(),
            email: formData.email.toLowerCase().trim(),
            phone: formData.phone.trim(),
            password: formData.password,
            hotelId,
            role: formData.role,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed");

        setShowSuccess(true);
        setTimeout(() => router.push(`/staff-auth?hotelId=${hotelId}`), 4000);
      } else {
        // === STAFF SIGN IN ===
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email.toLowerCase().trim(),
            phone: formData.phone.trim(),
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 403) {
            throw new Error("Your account is pending manager approval");
          }
          throw new Error(data.error || "Invalid email or password");
        }

        toast({ title: "Welcome back!" });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      toast({
        title: mode === "signup" ? "Signup Failed" : "Login Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Invalid link
  if (!hotelId || !hotelInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Invalid or missing hotel link. Please use the link provided by your manager.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Success after signup
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 text-center space-y-6">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
            <div>
              <h2 className="text-2xl font-bold">Account Created!</h2>
              <p className="text-muted-foreground mt-2">
                Your staff account for <strong>{hotelInfo.name}</strong> has been submitted.
              </p>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your account is pending approval. You will be notified when you can log in.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Auth Form
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Hotel Header */}
        <div className="glass-card p-6 mb-6 text-center">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">{hotelInfo.name}</h1>
          {hotelInfo.address && <p className="text-sm text-muted-foreground mt-1">{hotelInfo.address}</p>}
          <p className="text-sm text-muted-foreground mt-3">Staff Portal</p>
        </div>

        <div className="glass-card p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">
              {mode === "signin" ? "Staff Sign In" : "Join as Staff"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "signin" ? "Access your dashboard" : "Create your staff account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name - Signup only */}
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullname"
                    placeholder="John Doe"
                    className="pl-10"
                    value={formData.fullname}
                    onChange={(e) => setFormData((p) => ({ ...p, fullname: e.target.value }))}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            )}

            {/* Phone Number - Signup only */}
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+234 801 234 5678"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@hotel.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  disabled={loading}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Role Selection - Signup only */}
            {mode === "signup" && (
              <div className="space-y-2">
                <Label>Select Your Role *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map(({ value, label, icon: Icon, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, role: value as any }))}
                      disabled={loading}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.role === value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{label}</p>
                          <p className="text-xs text-muted-foreground">{desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-sm text-primary hover:underline font-medium"
              disabled={loading}
            >
              {mode === "signin"
                ? "New staff? Sign up here"
                : "Already registered? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}