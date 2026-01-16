"use client";

import { motion } from "framer-motion";
import { CheckCircle, Shield, Zap } from "lucide-react";

const highlights = [
  "Every sale tied to staff ID",
  "Real-time revenue dashboard",
  "Short-stay auto-billing (30-min timers)",
  "Works offline during outages",
  "Payment reconciliation (Cash, OPay, PalmPay)",
  "Future-proof authentication ready"
];

export const SolutionSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-surface">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              The Shift
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              InsightNova is Not
              <span className="block text-primary">Just a PMS</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              It's a <strong>revenue enforcement and accountability system</strong> built specifically for Nigerian hotels. 
              Every naira is tracked. Every staff member is accountable. Every transaction has a trail.
            </p>

            {/* Highlights */}
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Visual Card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative bg-gradient-hero rounded-3xl p-8 lg:p-12">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10 rounded-3xl overflow-hidden">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '32px 32px'
                }} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-primary-foreground">
                      Theft-Proof
                    </h3>
                    <p className="text-primary-foreground/70">By Design</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-primary-foreground/80 text-sm">Revenue Protected</span>
                      <Zap className="w-4 h-4 text-accent" />
                    </div>
                    <p className="text-3xl font-bold text-primary-foreground">₦2.4M+</p>
                    <p className="text-primary-foreground/60 text-sm">Average monthly recovery</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-accent">14</p>
                      <p className="text-primary-foreground/70 text-sm">Days to ROI</p>
                    </div>
                    <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-accent">100%</p>
                      <p className="text-primary-foreground/70 text-sm">Audit Trail</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full rounded-3xl bg-accent/20 blur-sm" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
