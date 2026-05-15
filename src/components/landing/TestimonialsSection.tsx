"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Michael Chen",
    role: "Quantitative Trader",
    text: "The order flow and absorption detection completely transformed my trading. I can see institutional activity in real-time now.",
    rating: 5,
  },
  {
    name: "Sarah Williams",
    role: "Fund Manager",
    text: "Best market analysis platform I've used. The AI predictions are remarkably accurate, especially the VWAP reversion signals.",
    rating: 5,
  },
  {
    name: "David Rodriguez",
    role: "Prop Trader",
    text: "The Smart Money Concept indicators and liquidity detection saved my portfolio. Essential tool for any serious trader.",
    rating: 5,
  },
  {
    name: "Emma Thompson",
    role: "Crypto Analyst",
    text: "Multi-timeframe analysis with AI confidence scores gives me the edge I need. The delta volume insights are incredibly valuable.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-dark-800/50" id="testimonials">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What <span className="text-gradient">Traders</span> Say
          </h2>
          <p className="text-gray-400">Trusted by professional traders worldwide.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <GlassCard key={t.name} hover>
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-neon-yellow text-neon-yellow" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">&quot;{t.text}&quot;</p>
              <div>
                <div className="font-semibold text-white">{t.name}</div>
                <div className="text-xs text-gray-500">{t.role}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
