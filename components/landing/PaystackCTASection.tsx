"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, Shield } from "lucide-react";

export const PaystackCTASection = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Paystack Badge */}
          <motion.div 
            className="inline-flex items-center gap-3 bg-accent/20 rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <CreditCard className="w-5 h-5 text-accent" />
            <span className="text-accent font-semibold">Pay Securely with Paystack</span>
          </motion.div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Stop the
            <span className="block text-accent">Revenue Bleeding?</span>
          </h2>

          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Start protecting your hotel revenue today. Pay securely with cards, bank transfers, or USSD. 
            Instant onboarding after payment.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="xl" variant="hero" className="group">
              <CreditCard className="w-5 h-5" />
              Pay Now with Paystack
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="xl" variant="heroOutline">
              Request Demo First
            </Button>
          </div>

          {/* Payment Methods */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 text-primary-foreground/60 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Bank Cards</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Bank Transfer</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>USSD</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Mobile Money</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
