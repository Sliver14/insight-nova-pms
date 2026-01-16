"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, Lock, Mail, User, AlertCircle, CheckCircle2, Users, UserCog, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function StaffSignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hotelInfo, setHotelInfo] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "staff" as "staff" | "manager" | "frontdesk" | "cleaner",
  });

  // Extract hotelId from URL query parameter
  const hotelId = searchParams.get("hotelId") || searchParams.get("h");

  useEffect(() => {
    // Validate hotel ID presence
    if (!hotelId) {
      toast({
        title: "Invalid Signup Link",
        description: "This staff signup link is missing a hotel ID. Please contact your manager for a valid link.",
        variant: "destructive",
      });
      return;
    }

    // Fetch hotel information to display
    fetchHotelInfo();
  }, [hotelId]);

  const fetchHotelInfo = async () => {
    if (!hotelId) return;

    try {
      const response = await fetch(`/api/hotels/${hotelId}`);
      
      if (!response.ok) {
        throw new Error("Hotel not found");
      }

      const data = await response.json();
      setHotelInfo(data);
    } catch (error) {
      console.error("Failed to fetch hotel info:", error);
      toast({
        title: "Invalid Hotel",
        description: "Could not load hotel information. Please check your signup link.",
        variant: "destructive",
      });
      // Don't redirect immediately - let user see the error
    }
  };

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const roleOptions = [
    { value: "staff", label: "Staff", icon: Users, description: "General hotel staff member" },
    { value: "manager", label: "Manager", icon: UserCog, description: "Can approve new staff" },
    { value: "frontdesk", label: "Front Desk", icon: User, description: "Reception and guest services" },
    { value: "cleaner", label: "Cleaner", icon: Sparkles, description: "Housekeeping staff" },
  ];

  const validateForm = (): boolean => {
    // Check required fields
    if (!formData.fullname.trim()) {
      toast({
        title: "Full Name Required",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.password) {
      toast({
        title: "Password Required",
        description: "Please enter a password",
        variant: "destructive",
      });
      return false;
    }

    // Password strength validation
    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please ensure both password fields match",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    // Validate hotel ID
    if (!hotelId) {
      toast({
        title: "Error",
        description: "Hotel ID is missing. Please use a valid signup link.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("[STAFF-SIGNUP-PAGE] Submitting signup...");
      
      const response = await fetch("/api/auth/staff-signup", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          fullname: formData.fullname.trim(),
          hotelId: hotelId,
          role: formData.role,
        }),
      });

      const data = await response.json();
      console.log("[STAFF-SIGNUP-PAGE] Response:", { status: response.status, data });

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409) {
          throw new Error("An account with this email already exists. Please use a different email or sign in.");
        } else if (response.status === 400 && data.error?.includes("hotel")) {
          throw new Error("Invalid hotel. Please contact your manager for a new signup link.");
        }
        throw new Error(data.error || data.details || "Signup failed. Please try again.");
      }

      // Show success state
      setShowSuccess(true);

      // Replace with simple delay + back to login
      setTimeout(() => {
        router.push("/auth");
      }, 3000);

    } catch (error) {
      console.error("[STAFF-SIGNUP-PAGE] Signup error:", error);
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state while fetching hotel info
  if (!hotelId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Invalid signup link. Please contact your manager for a valid staff signup link.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hotelInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading hotel information...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          <div className="glass-card p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Account Created Successfully!</h2>
              <p className="text-muted-foreground">
                Your staff account for <span className="font-semibold">{hotelInfo.name}</span> has been created.
              </p>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {formData.role === "manager" 
                  ? "Your manager account is active. You can now login to access the dashboard."
                  : "Your account is pending manager approval. You will be notified via email once your account is approved and you can login."
                }
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main signup form
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        {/* Hotel Info Card */}
        <div className="glass-card p-6 mb-6 text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-4 shadow-glow-primary">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-1">{hotelInfo.name}</h2>
          <p className="text-muted-foreground text-sm">Join our team</p>
          {hotelInfo.address && (
            <p className="text-xs text-muted-foreground mt-1">{hotelInfo.address}</p>
          )}
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup}>
          <div className="glass-card p-6 space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Create Your Staff Account</h3>
              <p className="text-muted-foreground text-sm">
                Your account requires manager approval before you can login
              </p>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullname">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullname"
                    placeholder="John Doe"
                    className="pl-10"
                    value={formData.fullname}
                    onChange={(e) => updateFormData("fullname", e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Your Role <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateFormData("role", option.value)}
                        disabled={loading}
                        className={`p-3 rounded-xl border transition-all duration-200 text-left ${
                          formData.role === option.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{option.label}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                "Create Staff Account"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                className="text-primary font-medium hover:underline"
                onClick={() => router.push("/auth")}
                disabled={loading}
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
