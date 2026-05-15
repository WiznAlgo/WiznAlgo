"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { Brain, Cpu, Database, Zap } from "lucide-react";

const techStack = [
  {
    icon: Brain,
    title: "LSTM Networks",
    desc: "Long Short-Term Memory networks capture temporal dependencies in price action, volume, and order flow data across multiple timeframes.",
    color: "blue" as const,
  },
  {
    icon: Cpu,
    title: "Transformer Models",
    desc: "Self-attention mechanisms identify complex market patterns and cross-asset correlations for superior directional prediction.",
    color: "purple" as const,
  },
  {
    icon: Database,
    title: "Feature Engineering",
    desc: "VWAP deviation, delta imbalance, absorption zones, liquidity levels, momentum, and volume profile as model inputs.",
    color: "green" as const,
  },
  {
    icon: Zap,
    title: "Low-Latency Inference",
    desc: "Sub-50ms prediction pipeline with Redis caching, WebSocket streaming, and optimized model serving architecture.",
    color: "blue" as const,
  },
];

export default function AITechSection() {
  return (
    <section className="py-24 px-6 bg-dark-800/50" id="ai-technology">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI <span className="text-gradient">Technology</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            State-of-the-art machine learning models trained on institutional order flow data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {techStack.map((t) => (
            <GlassCard key={t.title} hover glow={t.color}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-neon-blue/10 shrink-0">
                  <t.icon className="w-6 h-6 text-neon-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{t.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{t.desc}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
