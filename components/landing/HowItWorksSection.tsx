"use client";

import { motion } from "framer-motion";
import { ArrowRight, Camera, CreditCard, DoorOpen, LayoutDashboard, User, UserCheck } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    number: "01",
    title: "Staff Logs In",
    description: "Every shift starts with secure staff authentication. Identity verified, accountability begins."
  },
  {
    icon: CreditCard,
    number: "02",
    title: "Sale Tied to Staff + Room",
    description: "Every transaction is linked to the staff member who processed it. No anonymous sales."
  },
  {
    icon: User,
    number: "03",
    title: "Payments Auto-Reconciled",
    description: "Cash, card, OPay, PalmPay – all payments are automatically matched and verified."
  },
  {
    icon: DoorOpen,
    number: "04",
    title: "Short Stays Auto-Timed",
    description: "30-minute timers ensure every short-stay is properly billed. No free room time."
  },
  {
    icon: Camera,
    number: "05",
    title: "Events Synced (Optional)",
    description: "CCTV and smart lock events can be linked for complete operational visibility."
  },
  {
    icon: LayoutDashboard,
    number: "06",
    title: "Manager Sees Truth",
    description: "Real-time dashboard shows exactly what's happening. No surprises. No guesswork."
  }
];

export const HowItWorksSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
            Simple Process
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How InsightNova Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Six simple steps to complete revenue visibility and staff accountability.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative bg-card rounded-2xl border border-border p-6 h-full hover:border-primary/50 hover:shadow-glow transition-all duration-300">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold text-sm shadow-accent">
                  {step.number}
                </div>

                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>

              {/* Connector Arrow (hide on last item and mobile) */}
              {index < steps.length - 1 && (index + 1) % 3 !== 0 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-muted-foreground/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
