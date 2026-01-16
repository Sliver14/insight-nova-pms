"use client"

import { motion } from "framer-motion";
import { Briefcase, Building2, Users } from "lucide-react";

const audiences = [
  {
    icon: Building2,
    title: "Hotel Owners",
    benefits: [
      "Real-time revenue visibility from anywhere",
      "Stop staff theft before it drains profits",
      "Sleep better knowing every naira is tracked",
      "Proven 20% revenue recovery in 14 days"
    ],
    gradient: "from-primary to-primary-light"
  },
  {
    icon: Briefcase,
    title: "Hotel Managers",
    benefits: [
      "Complete control over operations",
      "Instant alerts for suspicious activity",
      "Staff performance tracking made easy",
      "No more paper-based guesswork"
    ],
    gradient: "from-accent to-accent-light"
  },
  {
    icon: Users,
    title: "Front Desk Teams",
    benefits: [
      "Simple, intuitive interface",
      "Works even during power outages",
      "Clear transaction records",
      "Fair accountability for all staff"
    ],
    gradient: "from-primary-light to-primary"
  }
];

export const AudienceSection = () => {
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
            Who It's For
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Built for Your
            <span className="block text-primary">Entire Hotel Team</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you own the hotel, manage it, or work the front desk – InsightNova makes your job easier.
          </p>
        </motion.div>

        {/* Audience Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="relative bg-card rounded-2xl border border-border p-8 h-full overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl bg-gradient-to-br ${audience.gradient}`} />

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${audience.gradient} flex items-center justify-center mb-6`}>
                  <audience.icon className="w-8 h-8 text-primary-foreground" />
                </div>

                <h3 className="font-heading text-2xl font-bold text-foreground mb-6">
                  {audience.title}
                </h3>

                <ul className="space-y-4">
                  {audience.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
