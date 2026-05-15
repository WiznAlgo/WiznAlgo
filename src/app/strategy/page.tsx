"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import {
  Activity, Waves, LineChart, BarChart3, Target,
  Layers, TrendingUp, Brain, Cpu, BookOpen,
} from "lucide-react";

const strategies = [
  {
    icon: Activity,
    title: "Order Flow Analysis",
    description: "Analyze real-time bid/ask activity to identify aggressive buying and selling pressure.",
    details: [
      "Track aggressive market orders vs passive limit orders",
      "Identify institutional footprints through large order clustering",
      "Calculate bid/ask imbalance ratio for directional bias",
      "Monitor cumulative delta for divergence signals",
    ],
    formula: "Imbalance = (BuyVolume - SellVolume) / TotalVolume",
  },
  {
    icon: LineChart,
    title: "VWAP Reversion",
    description: "Volume Weighted Average Price serves as institutional fair value benchmark.",
    details: [
      "Identify premium zones (above VWAP) for sell opportunities",
      "Identify discount zones (below VWAP) for buy opportunities",
      "Track deviation bands for mean reversion entries",
      "Use anchored VWAP from key swing points",
    ],
    formula: "VWAP = Sum(Price x Volume) / Sum(Volume)",
  },
  {
    icon: BarChart3,
    title: "Volume Profile Analysis",
    description: "Map volume distribution across price levels to find key support and resistance.",
    details: [
      "High Volume Nodes (HVN) act as magnets and support/resistance",
      "Low Volume Nodes (LVN) create fast-moving price areas",
      "Point of Control (POC) represents fair value",
      "Value Area (VA) defines the 70% volume range",
    ],
    formula: "VP[price] = Sum(volume) at each price level",
  },
  {
    icon: Waves,
    title: "Absorption Detection",
    description: "Detect when large orders absorb opposing pressure without price movement.",
    details: [
      "High volume with minimal price change indicates absorption",
      "Identifies hidden institutional orders at key levels",
      "Precursor to significant directional moves",
      "Combined with delta analysis for confirmation",
    ],
    formula: "IF (HighVolume AND SmallPriceMove) THEN Absorption = True",
  },
  {
    icon: Target,
    title: "Liquidity Sweep",
    description: "Track smart money hunting stop-loss clusters and liquidity pools.",
    details: [
      "Identify stop-loss clusters above/below key levels",
      "Monitor false breakouts as liquidity grabs",
      "Track order book depth for liquidity mapping",
      "Combine with SMC for high-probability reversals",
    ],
    formula: "Sweep = PriceExceedsLevel AND RapidReversal AND HighVolume",
  },
  {
    icon: Layers,
    title: "Smart Money Concept",
    description: "Follow institutional trading patterns using structural analysis.",
    details: [
      "Order Blocks: Last opposing candle before impulsive move",
      "Breaker Blocks: Failed order blocks become new S/R",
      "Fair Value Gaps: Price inefficiencies to be filled",
      "Break of Structure (BOS) and Change of Character (CHoCH)",
    ],
    formula: "OB = LastOpposingCandle(BeforeImpulse); BOS = NewHigherHigh OR NewLowerLow",
  },
  {
    icon: TrendingUp,
    title: "Delta Imbalance",
    description: "Net buying/selling pressure analysis for directional momentum.",
    details: [
      "Positive delta: More aggressive buying than selling",
      "Negative delta: More aggressive selling than buying",
      "Delta divergence with price signals potential reversal",
      "Cumulative delta trends confirm market direction",
    ],
    formula: "Delta = AggressiveBuyVolume - AggressiveSellVolume",
  },
  {
    icon: Brain,
    title: "AI Momentum Forecasting",
    description: "Machine learning models predict short-term price direction with confidence scores.",
    details: [
      "LSTM networks capture temporal dependencies in price data",
      "Transformer models identify complex cross-asset patterns",
      "Feature inputs: VWAP deviation, delta, absorption, liquidity, momentum",
      "Output: BUY/SELL/HOLD signal with confidence percentage",
    ],
    formula: "Signal = Model(VWAP_dev, Delta, Absorption, Liquidity, Momentum, VP)",
  },
];

const algorithms = [
  {
    title: "VWAP Algorithm",
    formula: "VWAP = Σ(Price × Volume) / Σ(Volume)",
    usage: ["Institutional bias detection", "Mean reversion entry points", "Premium/Discount area identification", "Intraday fair value reference"],
  },
  {
    title: "Order Flow Algorithm",
    formula: "Imbalance = (BuyVol - SellVol) / TotalVol",
    usage: ["Aggressive buyer/seller identification", "Bid/ask imbalance ratio", "Delta volume calculation", "Institutional footprint detection"],
  },
  {
    title: "Absorption Detection",
    formula: "IF (Volume > 2σ) AND (|ΔPrice| < 0.5σ) → Absorption",
    usage: ["Hidden order detection", "Support/resistance confirmation", "Pre-breakout accumulation", "Smart money positioning"],
  },
  {
    title: "Volume Profile",
    formula: "VP[p] = Σ Volume(candles where Low ≤ p ≤ High)",
    usage: ["HVN/LVN identification", "Point of Control (POC)", "Value Area calculation", "Price acceptance/rejection zones"],
  },
  {
    title: "AI Prediction Engine",
    formula: "ŷ = Transformer(LSTM(X_features))",
    usage: ["Multi-timeframe directional forecasting", "Confidence-weighted signal generation", "Adaptive learning from market regimes", "Cross-asset correlation analysis"],
  },
];

export default function StrategyPage() {
  return (
    <div className="p-4 space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-6 h-6 text-neon-purple" />
        <h1 className="text-2xl font-bold text-white">Trading Strategy</h1>
      </div>

      {/* Strategies */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Analysis Methods</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {strategies.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className="h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-neon-blue/10">
                    <s.icon className="w-5 h-5 text-neon-blue" />
                  </div>
                  <h3 className="font-bold text-white">{s.title}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-3">{s.description}</p>
                <ul className="space-y-1.5 mb-3">
                  {s.details.map((d, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-blue mt-1.5 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="bg-dark-700/50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Formula</div>
                  <code className="text-xs text-neon-green font-mono">{s.formula}</code>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Algorithms */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <Cpu className="w-5 h-5 text-neon-green" />
          <h2 className="text-xl font-bold text-white">Algorithm Details</h2>
        </div>
        <div className="space-y-4">
          {algorithms.map((algo, i) => (
            <motion.div
              key={algo.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard>
                <h3 className="font-bold text-white text-lg mb-3">{algo.title}</h3>
                <div className="bg-dark-700/50 rounded-lg p-4 mb-4 border-l-2 border-neon-blue">
                  <code className="text-sm text-neon-green font-mono">{algo.formula}</code>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {algo.usage.map((u, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-purple shrink-0" />
                      {u}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
