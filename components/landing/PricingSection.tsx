"use client";

import { motion } from "framer-motion";
import { Check, CreditCard, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Standalone PMS",
    price: "₦75,000",
    period: "/month",
    description: "Complete hotel management system with theft-proof features",
    features: [
      "Full PMS functionality",
      "Real-time revenue dashboard",
      "Staff-linked transactions",
      "Short-stay auto billing",
      "OTA channel manager",
      "Offline mode",
      "Payment reconciliation",
      "Audit alerts",
      "Email & WhatsApp support"
    ],
    addon: {
      name: "Security Layer Add-on",
      price: "₦10,000/month",
      description: "CCTV & smart lock integration"
    },
    highlighted: true
  },
  {
    name: "Add-On for Existing PMS",
    price: "₦10,000",
    period: "/month",
    description: "Security layer for eZee, MyHotelLine, or other PMS users",
    features: [
      "Staff accountability layer",
      "Transaction verification",
      "Audit trail & alerts",
      "Payment reconciliation",
      "Works alongside existing PMS",
      "No migration needed",
      "Email & WhatsApp support"
    ],
    addon: {
      name: "CCTV / Smart Lock Setup",
      price: "One-time fee",
      description: "Custom quote based on hardware"
    }
  }
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
            Simple Pricing
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Transparent. Fair.
            <span className="block text-primary">No Hidden Fees.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start protecting your revenue today. No long-term contracts. Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl p-8 lg:p-10 ${
                plan.highlighted 
                  ? 'bg-card border-2 border-primary shadow-glow' 
                  : 'bg-card border border-border'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-accent text-accent-foreground text-sm font-semibold px-4 py-1 rounded-full flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Recommended
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-4xl lg:text-5xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Add-on */}
              <div className="bg-muted/50 rounded-xl p-4 mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground text-sm">{plan.addon.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.addon.price} – {plan.addon.description}
                </p>
              </div>

              <Button 
                variant={plan.highlighted ? "hero" : "outline"} 
                size="lg" 
                className="w-full group"
              >
                <CreditCard className="w-4 h-4" />
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div 
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-accent" />
            <span>No long-term contract</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-accent" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-accent" />
            <span>14-day ROI trial</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
