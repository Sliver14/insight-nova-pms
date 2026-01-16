"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, Play, Shield, Zap } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary-foreground)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-accent/20 blur-2xl"
        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-accent/15 blur-3xl"
        animate={{ y: [0, 20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container relative z-10 mx-auto px-4 pt-24 pb-16 lg:pt-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground backdrop-blur-sm mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Shield className="w-4 h-4 text-accent" />
              <span>Nigeria's First Theft-Proof PMS</span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-heading text-4xl font-bold text-primary-foreground sm:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6">
              Stop Revenue
              <span className="block text-accent">Leakage Today</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-primary-foreground/80 sm:text-xl max-w-xl mx-auto lg:mx-0 mb-8">
              Every transaction tied to staff. Real-time revenue visibility. 
              Works offline. Hotels recover up to <span className="font-bold text-accent">20% lost revenue in 14 days</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="xl" variant="hero" className="group">
                Request Free Demo
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="xl" variant="heroOutline">
                <Play className="w-5 h-5" />
                Start Now – Pay with Paystack
              </Button>
            </div>

            {/* Trust Indicators */}
            <motion.div 
              className="mt-12 flex flex-wrap gap-6 justify-center lg:justify-start items-center text-primary-foreground/60 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span>Works Offline</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span>Staff Accountability</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Built in Lagos</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Dashboard Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="/assets/hero-dashboard.png" 
                alt="InsightNova Hotel PMS Dashboard showing real-time revenue tracking and staff management"
                width={1200}
                height={800}
                className="w-full h-auto"
                priority
              />
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-primary-foreground/10" />
            </div>
            
            {/* Floating Stats Card */}
            <motion.div 
              className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-xl border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue Recovered</p>
                  <p className="text-xl font-bold text-foreground">+20%</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};
