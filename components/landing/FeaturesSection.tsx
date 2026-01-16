"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  AlertCircle, 
  Camera, 
  Clock, 
  CreditCard, 
  Globe, 
  Key, 
  UserCheck, 
  Wifi 
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Real-Time Sales Tracking",
    description: "See every transaction as it happens. No delays. No hidden revenue.",
    highlight: true
  },
  {
    icon: UserCheck,
    title: "Staff-Linked Transactions",
    description: "Every sale, every payment tied to a specific staff member. Complete accountability."
  },
  {
    icon: Clock,
    title: "Short-Stay Auto Billing",
    description: "30-minute automatic timers. No more free room hours. Every minute billed."
  },
  {
    icon: CreditCard,
    title: "POS & Payment Reconciliation",
    description: "Cash, cards, OPay, PalmPay – all payment methods auto-reconciled and verified."
  },
  {
    icon: Globe,
    title: "OTA Channel Manager",
    description: "Hotels.ng, Booking.com, Jumia Travel – all channels synced. No double bookings."
  },
  {
    icon: Wifi,
    title: "Offline Mode",
    description: "Works during NEPA blackouts and internet outages. Syncs when connection returns."
  },
  {
    icon: AlertCircle,
    title: "Audit Alerts",
    description: "Instant notifications for suspicious activities. Know before losses compound."
  },
  {
    icon: Camera,
    title: "CCTV & Smart Lock Integration",
    description: "Optional: Link door events and camera footage to transactions for complete visibility.",
    optional: true
  },
  {
    icon: Key,
    title: "Future-Proof Auth Layer",
    description: "PIN codes, biometrics, mobile keys – any authentication you choose, we support it.",
    optional: true
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-surface">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
            Powerful Features
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need
            <span className="block text-primary">Nothing You Don't</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Built for Nigerian hotels. Designed for accountability. Ready for growth.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`relative group rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${
                feature.highlight 
                  ? 'bg-gradient-hero border-transparent text-primary-foreground hover:shadow-glow' 
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              {feature.optional && (
                <span className="absolute top-4 right-4 text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded-full">
                  Optional
                </span>
              )}

              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                feature.highlight 
                  ? 'bg-primary-foreground/20' 
                  : 'bg-primary/10 group-hover:bg-primary/20'
              }`}>
                <feature.icon className={`w-7 h-7 ${
                  feature.highlight ? 'text-accent' : 'text-primary'
                }`} />
              </div>

              <h3 className={`font-heading text-xl font-semibold mb-2 ${
                feature.highlight ? 'text-primary-foreground' : 'text-foreground'
              }`}>
                {feature.title}
              </h3>
              <p className={feature.highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
