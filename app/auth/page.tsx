"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [step, setStep] = useState<OnboardingStep>(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "manager",
    hotelName: "",
    location: "",
    roomCount: "",
    hotelType: "Mid-Range",
    currency: "₦",
    paymentMethods: ["Cash", "POS"],
    shortStay: false,
  });

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignIn = async () => {
    setLoading(true);
    // Simulate auth
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.push("/dashboard");
  };

  const handleSignUp = async () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as OnboardingStep);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    toast({ title: "Account created!", description: "Your hotel is ready to manage." });
    router.push("/dashboard");
  };

  const togglePaymentMethod = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter((m) => m !== method)
        : [...prev.paymentMethods, method],
    }));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-card to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-glow-primary">
              <span className="text-primary-foreground font-bold text-xl">IN</span>
            </div>
            <div>
              <h1 className="font-bold text-xl">InsightNova</h1>
              <p className="text-sm text-muted-foreground">Property Management System</p>
            </div>
          </div>

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

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-glow-primary">
              <span className="text-primary-foreground font-bold text-lg">IN</span>
            </div>
            <span className="font-bold text-xl">InsightNova</span>
          </div>

          {mode === "signin" ? (
            /* Sign In Form */
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
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button className="text-sm text-primary hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="remember" />
                  <Label htmlFor="remember" className="text-sm text-muted-foreground">
                    Remember me
                  </Label>
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
                  onClick={() => setMode("signup")}
                >
                  Create an account
                </button>
              </p>
            </div>
          ) : (
            /* Sign Up / Onboarding Form */
            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      s === step
                        ? "w-8 bg-primary"
                        : s < step
                        ? "w-2 bg-primary/60"
                        : "w-2 bg-muted"
                    }`}
                  />
                ))}
              </div>

              {step === 1 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="text-center lg:text-left">
                    <h2 className="text-3xl font-bold mb-2">Create your account</h2>
                    <p className="text-muted-foreground">Step 1 of 3 — Account details</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => updateFormData("fullName", e.target.value)}
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <div className="flex gap-3">
                        {["owner", "manager"].map((role) => (
                          <button
                            key={role}
                            onClick={() => updateFormData("role", role)}
                            className={`flex-1 py-3 px-4 rounded-xl border transition-all duration-200 capitalize ${
                              formData.role === role
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Lagos, Nigeria"
                        value={formData.location}
                        onChange={(e) => updateFormData("location", e.target.value)}
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hotel Type</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {hotelTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => updateFormData("hotelType", type)}
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
                    <p className="text-muted-foreground">Step 3 of 3 — Configure your settings</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <div className="flex gap-3">
                        {["₦", "$", "€", "£"].map((currency) => (
                          <button
                            key={currency}
                            onClick={() => updateFormData("currency", currency)}
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
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {step > 1 && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep((prev) => (prev - 1) as OnboardingStep)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                <Button
                  variant="hero"
                  size="lg"
                  className="flex-1"
                  onClick={handleSignUp}
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
