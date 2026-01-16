"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Building2, Mail, MapPin, Phone, Users } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const DemoSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Demo Request Received!",
      description: "We'll contact you within 24 hours to schedule your demo.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="demo" className="py-20 lg:py-32 bg-gradient-surface">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              See It in Action
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Book a Live
              <span className="block text-primary">Demo Today</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              See exactly how InsightNova can protect your hotel's revenue. 
              Our team will walk you through every feature and answer all your questions.
            </p>

            {/* What to Expect */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">What to expect:</h3>
              <ul className="space-y-3">
                {[
                  "30-minute personalized walkthrough",
                  "See real revenue recovery scenarios",
                  "Custom pricing for your hotel",
                  "No obligation, no pressure"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            className="bg-card rounded-2xl border border-border p-8 shadow-lg"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hotelName" className="flex items-center gap-2 text-foreground">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  Hotel Name
                </Label>
                <Input
                  id="hotelName"
                  placeholder="e.g., Grand Palace Hotel"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rooms" className="flex items-center gap-2 text-foreground">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Number of Rooms
                </Label>
                <Input
                  id="rooms"
                  type="number"
                  placeholder="e.g., 50"
                  min="1"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2 text-foreground">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Ikeja, Lagos"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-foreground">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Phone / WhatsApp
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., +234 801 234 5678"
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., manager@hotel.com"
                  required
                  className="h-12"
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                variant="hero" 
                className="w-full group"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Book a Live Demo"}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
