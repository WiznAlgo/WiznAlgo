"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import {
  BarChart3, Brain, Activity, Waves, Target, Shield,
  TrendingUp, Layers, Cpu, LineChart, Gauge, Eye,
} from "lucide-react";

const features = [
  { icon: Activity, title: "Order Flow Analysis", desc: "Real-time bid/ask imbalance detection with aggressive buyer/seller identification." },
  { icon: Waves, title: "Absorption Detection", desc: "Identify large hidden orders absorbing liquidity at key price levels." },
  { icon: LineChart, title: "VWAP Analytics", desc: "Volume Weighted Average Price with institutional bias and mean reversion zones." },
  { icon: BarChart3, title: "Volume Profile", desc: "Price-at-volume analysis with HVN/LVN detection for key support and resistance." },
  { icon: Target, title: "Liquidity Detection", desc: "Map stop-loss clusters and liquidity pools targeted by smart money." },
  { icon: Layers, title: "Market Structure", desc: "Automated break-of-structure and change-of-character detection." },
  { icon: TrendingUp, title: "Delta Volume", desc: "Net buying/selling pressure analysis with cumulative delta tracking." },
  { icon: Gauge, title: "Imbalance Zones", desc: "Detect price inefficiencies and fair value gaps for high-probability setups." },
  { icon: Eye, title: "Smart Money Concept", desc: "Track institutional order blocks, breaker blocks, and mitigation zones." },
  { icon: Brain, title: "AI Prediction Engine", desc: "LSTM and Transformer models for multi-timeframe directional forecasting." },
  { icon: Cpu, title: "Reinforcement Learning", desc: "Self-improving trading strategies with adaptive market environment modeling." },
  { icon: Shield, title: "Risk Management", desc: "Dynamic position sizing and volatility-adjusted stop-loss optimization." },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 relative" id="features">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful <span className="text-gradient">Features</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Institutional-grade analytics powered by cutting-edge AI and real-time data processing.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((f) => (
            <GlassCard key={f.title} hover className="group">
              <f.icon className="w-8 h-8 text-neon-blue mb-3 group-hover:text-neon-purple transition-colors" />
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
