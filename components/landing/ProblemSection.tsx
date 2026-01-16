"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Banknote, Clock, FileQuestion, Users, Wifi } from "lucide-react";

const problems = [
  {
    icon: Banknote,
    title: "Staff Pocketing Cash",
    description: "Payments made but never recorded. Cash disappears before reaching the books."
  },
  {
    icon: Clock,
    title: "Short-Stay Abuse",
    description: "Rooms rented for hours without proper billing. Revenue lost to untracked occupancy."
  },
  {
    icon: FileQuestion,
    title: "Occupied Room, No Payment",
    description: "Guests checking in without payment records. Paper logs easily manipulated."
  },
  {
    icon: Users,
    title: "WhatsApp Reporting",
    description: "Critical business data sent via chat. No accountability, no audit trail."
  },
  {
    icon: AlertTriangle,
    title: "OTA Double Bookings",
    description: "Hotels.ng, Booking.com out of sync. Guest arrives to find no room available."
  },
  {
    icon: Wifi,
    title: "Power & Internet Outages",
    description: "When NEPA strikes, your system goes dark. Operations halt, losses mount."
  }
];

export const ProblemSection = () => {
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
            The Reality
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Running a Hotel in Nigeria?
            <span className="block text-muted-foreground">You Know These Problems.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Every day, Nigerian hotel owners lose money to theft, inefficiency, and broken systems. 
            You work hard. Your staff should too.
          </p>
        </motion.div>

        {/* Problems Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              className="group relative rounded-2xl border border-border bg-card p-6 hover:border-destructive/50 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Red Indicator */}
              <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-destructive/20 group-hover:bg-destructive animate-pulse" />
              
              <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>
              
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-muted-foreground">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Statement */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xl text-foreground font-medium">
            By the time you discover these losses, <span className="text-destructive font-bold">it's already too late.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
