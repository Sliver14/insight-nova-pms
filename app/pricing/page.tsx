// app/pricing/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import Link from "next/link";

const oneTimeSetup = {
  price: 250000, // ₦250,000 (adjust as needed)
  description: "One-time payment for initial setup, data migration, on-site/remote training, and first month support",
};

const plans = [
  {
    name: "Starter",
    monthlyPrice: 45000,
    annualPrice: 450000, // ~₦37,500/month when paid yearly
    description: "Perfect for small hotels & guesthouses (up to 30 rooms)",
    features: [
      "Up to 30 rooms management",
      "Basic booking & check-in/out",
      "Revenue & occupancy tracking",
      "Staff scheduling",
      "Email support",
      "Standard reports",
    ],
    limitations: [
      "No multi-property support",
      "No advanced analytics",
      "No custom integrations",
    ],
    popular: false,
  },
  {
    name: "Professional",
    monthlyPrice: 95000,
    annualPrice: 950000, // ~₦79,166/month when paid yearly
    description: "Best for medium-large hotels & chains (up to 150 rooms)",
    features: [
      "Unlimited rooms & properties",
      "Advanced revenue management",
      "Folio & transaction system",
      "Staff performance tracking",
      "Custom reports & analytics",
      "Priority support + training",
      "API access & integrations",
      "Multi-user roles & permissions",
    ],
    limitations: [],
    popular: true,
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start with a 14-day free trial. No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* One-time Setup Notice */}
        <div className="max-w-3xl mx-auto mb-16">
          <Card className="border-primary/30 bg-primary/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <span className="text-primary">One-time Setup & Training</span>
                <Badge variant="outline" className="text-lg">
                  Required
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-4">
                ₦{oneTimeSetup.price.toLocaleString()}
              </p>
              <p className="text-lg text-muted-foreground">
                {oneTimeSetup.description}
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  On-site or remote training for your team
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  Data migration from your current system
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  First month of priority support
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={`text-lg ${!isAnnual ? "text-primary font-medium" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <Switch
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
            className="data-[state=checked]:bg-primary"
          />
          <span className={`text-lg ${isAnnual ? "text-primary font-medium" : "text-muted-foreground"}`}>
            Annual <span className="text-sm text-primary">(Save ~17%)</span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                plan.popular
                  ? "border-primary shadow-2xl scale-[1.03] bg-gradient-to-b from-card to-card/90"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-8 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-lg mt-2">
                  {plan.description}
                </CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold">
                    ₦{(isAnnual ? plan.annualPrice : plan.monthlyPrice).toLocaleString()}
                  </span>
                  <span className="text-xl text-muted-foreground">/year</span>
                  {!isAnnual && (
                    <span className="block text-sm text-muted-foreground mt-1">
                      ₦{plan.monthlyPrice.toLocaleString()} billed monthly
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limit) => (
                    <li key={limit} className="flex items-center gap-3 text-muted-foreground">
                      <X className="h-5 w-5 text-muted-foreground/70 flex-shrink-0" />
                      <span>{limit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  size="lg"
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link href="/auth?mode=signup">
                    Start Free Trial
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Hotel Operations?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Get started with your 14-day free trial today. No risk, cancel anytime.
          </p>
          <Button size="lg" className="text-lg px-10 py-6" asChild>
            <Link href="/auth?mode=signup">Start Your Free Trial Now →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}