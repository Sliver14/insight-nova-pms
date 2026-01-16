"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Layers, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const options = [
  {
    icon: Shield,
    title: "Standalone PMS",
    subtitle: "For new or OTA-only hotels",
    description: "Complete hotel management system from scratch. Perfect if you're using manual records, WhatsApp, or only rely on OTA platforms.",
    benefits: [
      "Full PMS functionality",
      "Real-time dashboard",
      "Staff accountability built-in",
      "OTA channel manager included",
      "Offline-first architecture"
    ],
    highlight: true
  },
  {
    icon: Layers,
    title: "Add-On Security Layer",
    subtitle: "For eZee / MyHotelLine users",
    description: "Already using a PMS? Don't switch. Add InsightNova as a security overlay to catch what your current system misses.",
    benefits: [
      "Works alongside existing PMS",
      "No system migration needed",
      "Staff accountability layer",
      "Transaction verification",
      "Audit trail & alerts"
    ]
  }
];

export const DeploymentSection = () => {
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
            Flexible Deployment
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Two Ways to
            <span className="block text-primary">Protect Your Revenue</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you need a complete system or just want to add accountability to your existing setup – we've got you covered.
          </p>
        </motion.div>

        {/* Options Grid */}
        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {options.map((option, index) => (
            <motion.div
              key={option.title}
              className={`relative rounded-2xl p-8 lg:p-10 transition-all duration-300 ${
                option.highlight 
                  ? 'bg-gradient-hero text-primary-foreground shadow-glow' 
                  : 'bg-card border border-border hover:border-primary/50 hover:shadow-lg'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              {option.highlight && (
                <div className="absolute -top-3 left-8 bg-accent text-accent-foreground text-sm font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                option.highlight ? 'bg-primary-foreground/20' : 'bg-primary/10'
              }`}>
                <option.icon className={`w-8 h-8 ${option.highlight ? 'text-accent' : 'text-primary'}`} />
              </div>

              <h3 className={`font-heading text-2xl lg:text-3xl font-bold mb-2 ${
                option.highlight ? 'text-primary-foreground' : 'text-foreground'
              }`}>
                {option.title}
              </h3>
              <p className={`text-sm font-medium mb-4 ${
                option.highlight ? 'text-accent' : 'text-accent'
              }`}>
                {option.subtitle}
              </p>
              <p className={`mb-6 ${
                option.highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'
              }`}>
                {option.description}
              </p>

              <ul className="space-y-3 mb-8">
                {option.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 ${
                      option.highlight ? 'text-accent' : 'text-accent'
                    }`} />
                    <span className={option.highlight ? 'text-primary-foreground/90' : 'text-foreground'}>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={option.highlight ? "hero" : "outline"} 
                size="lg" 
                className="w-full group"
              >
                Learn More
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
