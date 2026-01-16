"use client";

import { motion } from "framer-motion";
import { Building2, Globe, Lock, MapPin, Shield, Zap } from "lucide-react";

const trustPoints = [
  {
    icon: MapPin,
    title: "Built in Lagos, Nigeria",
    description: "Designed by Nigerians who understand Nigerian business realities."
  },
  {
    icon: Zap,
    title: "Power & Internet Ready",
    description: "Works offline during outages. Syncs automatically when connection returns."
  },
  {
    icon: Building2,
    title: "InsightNova Tech Ltd",
    description: "Registered Nigerian company committed to hospitality innovation."
  },
  {
    icon: Lock,
    title: "Security-First Architecture",
    description: "Bank-grade encryption. Your data is safe and secure."
  },
  {
    icon: Globe,
    title: "Scalable Infrastructure",
    description: "From 20 rooms to 100+ rooms. Grows with your business."
  },
  {
    icon: Shield,
    title: "Future-Proof Technology",
    description: "Regular updates. New features. Always ahead of the curve."
  }
];

export const TrustSection = () => {
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
            Why Trust Us
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Built by Nigerians
            <span className="block text-primary">For Nigerian Hotels</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We understand the unique challenges of running a hotel in Nigeria. 
            That's why every feature is designed with local realities in mind.
          </p>
        </motion.div>

        {/* Trust Points Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trustPoints.map((point, index) => (
            <motion.div
              key={point.title}
              className="flex gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <point.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{point.title}</h3>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial Placeholder */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Pilot program now open for Lagos hotels
          </div>
        </motion.div>
      </div>
    </section>
  );
};
