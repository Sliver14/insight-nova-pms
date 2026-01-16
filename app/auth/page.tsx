"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Building2, ArrowLeft, ArrowRight, Check } from "lucide-react";

type AuthMode = "signin" | "signup";
type OnboardingStep = 1 | 2 | 3;

const hotelTypes = ["Budget", "Mid-Range", "Premium", "Luxury"];
const paymentMethods = ["Cash", "POS", "Bank Transfer", "Mobile Money"];


export default function Auth() {
  const router = useRouter();
  const { toast } = useToast();

// useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await fetch("/api/auth/session");
//         const data = await res.json();
//         if (data.authenticated) {
//           router.replace("/dashboard"); // Full replace to avoid back button issues
//         }
//       } catch (err) {
//         // Network error → stay on auth page
//       }
//     };

//     checkAuth();
//   }, [router]);

  const [mode, setMode] = useState<AuthMode>("signin");
  const [step, setStep] = useState<OnboardingStep>(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullname: "",
    hotelName: "",
    location: "",
    roomCount: "",
    hotelType: "Mid-Range",
    currency: "₦",
    paymentMethods: ["Cash", "POS"] as string[],
    shortStay: false,
  });

  const updateFormData = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const togglePaymentMethod = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter((m) => m !== method)
        : [...prev.paymentMethods, method],
    }));
  };

  // REAL LOGIN
  const handleSignIn = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing fields",
        description: "Please enter email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in",
        });
        router.push("/dashboard");
        router.refresh(); // Ensures server components see new session
      } else {
        toast({
          title: "Login failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // REAL SIGNUP (multi-step → final API call on step 3)
  const handleNextOrSignup = async () => {
    if (mode === "signin") return;

    // Step 1: Validate required fields before advancing
    if (step === 1) {
      const name = formData.fullname.trim();
      const email = formData.email.trim();
      const password = formData.password;

      if (!name || !email || !password) {
        toast({
          title: "Missing information",
          description: "Please provide your full name, email, and password",
          variant: "destructive",
        });
        return;
      }

      // Basic password length check (mirrors API)
      if (password.length < 8) {
        toast({
          title: "Weak password",
          description: "Password must be at least 8 characters long",
          variant: "destructive",
        });
        return;
      }
    }

    // Step 2: Validate hotel name before going to step 3
    if (step === 2) {
      if (!formData.hotelName.trim()) {
        toast({
          title: "Hotel name required",
          description: "Please enter the name of your hotel",
          variant: "destructive",
        });
        return;
      }
    }

    // Navigate to next step
    if (step < 3) {
      setStep((prev) => (prev + 1) as OnboardingStep);
      return;
    }

    // Step 3: Final signup
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: formData.fullname.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          hotelName: formData.hotelName.trim(),
          location: formData.location.trim() || undefined,
          roomCount: formData.roomCount ? parseInt(formData.roomCount, 10) : undefined,
          hotelType: formData.hotelType || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast({
          title: "Welcome to InsightNova! 🎉",
          description: `${formData.fullname.trim()}, your hotel "${formData.hotelName.trim()}" has been created successfully.`,
        });
        router.push("/dashboard");
        router.refresh(); // Ensures session is recognized server-side
      } else {
        // Enhanced error messages from API
        let message = data.error || "Unable to create account";

        if (data.details && typeof data.details === "object") {
          const errors = Object.values(data.details).flat() as string[];
          message = errors.join(" • ");
        }

        toast({
          title: "Signup failed",
          description: message,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast({
        title: "Connection failed",
        description: "Please check your internet connection and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding (unchanged) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-card to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <a href="#" aria-label="InsightNova Home">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-glow-primary">
              <span className="text-primary-foreground font-bold text-xl">IN</span>
            </div>
            
            <div>
              <h1 className="font-bold text-xl">InsightNova</h1>
              <p className="text-sm text-muted-foreground">Property Management System</p>
            </div>
            
          </div>
          </a>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Take control of your
              <br />
              <span className="text-gradient-primary">hotel operations</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-md">
              Real-time insights, seamless management, and zero blind spots. Your hotel deserves the best.
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span>Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Forms */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-glow-primary">
              <span className="text-primary-foreground font-bold text-lg">IN</span>
            </div>
            <span className="font-bold text-xl">InsightNova</span>
          </div>

          {/* SIGN IN */}
          {mode === "signin" ? (
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
                <p className="text-muted-foreground">Sign in to access your dashboard</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleSignIn}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-center text-muted-foreground">
                New here?{" "}
                <button
                  className="text-primary font-medium hover:underline"
                  onClick={() => {
                    setMode("signup");
                    setStep(1);
                    setFormData((prev) => ({ ...prev, fullname: "", hotelName: "" }));
                  }}
                  disabled={loading}
                >
                  Create an account
                </button>
              </p>
            </div>
          ) : (
            /* SIGN UP - Multi-step */
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      s === step ? "w-8 bg-primary" : s < step ? "w-2 bg-primary/60" : "w-2 bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold mb-2">Create your account</h2>
                    <p className="text-muted-foreground">Step 1 of 3 — Account details</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullname">Full Name</Label>
                      <Input
                        id="fullname"
                        placeholder="John Doe"
                        value={formData.fullname}
                        onChange={(e) => updateFormData("fullname", e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email</Label>
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword">Password</Label>
                      <Input
                        id="signupPassword"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 & 3 unchanged visually — just inputs */}
              {step === 2 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold mb-2">Hotel Details</h2>
                    <p className="text-muted-foreground">Step 2 of 3 — Tell us about your hotel</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hotelName">Hotel Name</Label>
                      <Input
                        id="hotelName"
                        placeholder="Grand Palace Hotel"
                        value={formData.hotelName}
                        onChange={(e) => updateFormData("hotelName", e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Lagos, Nigeria"
                        value={formData.location}
                        onChange={(e) => updateFormData("location", e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roomCount">Number of Rooms</Label>
                      <Input
                        id="roomCount"
                        type="number"
                        placeholder="50"
                        value={formData.roomCount}
                        onChange={(e) => updateFormData("roomCount", e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hotel Type</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {hotelTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => updateFormData("hotelType", type)}
                            disabled={loading}
                            className={`py-3 px-4 rounded-xl border transition-all duration-200 ${
                              formData.hotelType === type
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold mb-2">Setup Preferences</h2>
                    <p className="text-muted-foreground">Step 3 of 3 — Finalize your settings</p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <div className="flex gap-3">
                        {["₦", "$", "€", "£"].map((currency) => (
                          <button
                            key={currency}
                            onClick={() => updateFormData("currency", currency)}
                            disabled={loading}
                            className={`flex-1 py-3 px-4 rounded-xl border transition-all duration-200 text-lg font-semibold ${
                              formData.currency === currency
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {currency}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Methods</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {paymentMethods.map((method) => (
                          <button
                            key={method}
                            onClick={() => togglePaymentMethod(method)}
                            disabled={loading}
                            className={`py-3 px-4 rounded-xl border transition-all duration-200 ${
                              formData.paymentMethods.includes(method)
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                      <div>
                        <p className="font-medium">Enable Short-Stay</p>
                        <p className="text-sm text-muted-foreground">30-minute auto billing</p>
                      </div>
                      <Switch
                        checked={formData.shortStay}
                        onCheckedChange={(checked) => updateFormData("shortStay", checked)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {step > 1 && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep((prev) => (prev - 1) as OnboardingStep)}
                    disabled={loading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  onClick={handleNextOrSignup}
                  disabled={loading}
                >
                  {loading ? (
                    "Creating..."
                  ) : step === 3 ? (
                    <>
                      <Building2 className="h-4 w-4 mr-2" />
                      Create Hotel
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              <p className="text-center text-muted-foreground">
                Already have an account?{" "}
                <button
                  className="text-primary font-medium hover:underline"
                  onClick={() => {
                    setMode("signin");
                    setStep(1);
                  }}
                  disabled={loading}
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}