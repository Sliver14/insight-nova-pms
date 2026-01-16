"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, Eye, FileText } from "lucide-react";

export const FinalCTASection = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      <motion.div 
        className="absolute top-20 right-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-6xl font-bold text-primary-foreground mb-6">
            Stop Guessing.
            <span className="block">Stop Trusting Paper Books.</span>
            <span className="block text-accent mt-2">Start Seeing the Truth.</span>
          </h2>

          <p className="text-lg sm:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join Nigerian hotel owners who are finally taking control of their revenue. 
            Real-time visibility. Complete accountability. Peace of mind.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="xl" variant="hero" className="group">
              <Eye className="w-5 h-5" />
              Request Demo
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="xl" variant="heroOutline" className="group">
              <CreditCard className="w-5 h-5" />
              Start Now – Pay with Paystack
            </Button>
          </div>

          {/* Bottom Trust */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 text-primary-foreground/60 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>No long-term contract</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span>14-day ROI guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
