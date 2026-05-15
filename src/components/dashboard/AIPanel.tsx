"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketStore } from "@/store/market-store";
import { generatePrediction } from "@/lib/market-data";
import SignalBadge from "@/components/ui/SignalBadge";
import ConfidenceBar from "@/components/ui/ConfidenceBar";
import { Brain, ChevronRight, ChevronLeft, Flame, TrendingUp, AlertTriangle, Zap } from "lucide-react";
import { clsx } from "clsx";

export default function AIPanel() {
  const { selectedPair, aiPanelOpen, toggleAiPanel } = useMarketStore();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(id);
  }, []);

  const prediction = useMemo(() => generatePrediction(selectedPair), [selectedPair, tick]);

  return (
    <>
      <button
        onClick={toggleAiPanel}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 p-2 bg-dark-700 border border-neon-blue/20 rounded-l-lg text-gray-400 hover:text-neon-blue transition-colors"
      >
        {aiPanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {aiPanelOpen && (
          <motion.aside
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-14 bottom-0 w-72 z-20 bg-dark-800 border-l border-neon-blue/10 overflow-y-auto"
          >
            <div className="p-4 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-neon-purple" />
                <h3 className="font-bold text-white">AI Analysis</h3>
                <span className="ml-auto text-xs text-gray-600">Live</span>
                <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
              </div>

              {/* Pair & Signal */}
              <div className="glass-card p-4 text-center">
                <div className="text-lg font-bold text-white mb-2">{selectedPair}</div>
                <SignalBadge signal={prediction.signal} size="lg" />
              </div>

              {/* Confidence */}
              <ConfidenceBar value={prediction.confidence} />

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <TrendingUp className="w-3 h-3" />
                    Trend
                  </div>
                  <div className={clsx(
                    "font-semibold text-sm",
                    prediction.trend === "Bullish" ? "text-neon-green" : prediction.trend === "Bearish" ? "text-neon-red" : "text-neon-yellow"
                  )}>
                    {prediction.trend}
                  </div>
                </div>
                <div className="glass-card p-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <Zap className="w-3 h-3" />
                    Expected
                  </div>
                  <div className={clsx(
                    "font-semibold text-sm",
                    prediction.expectedMove.startsWith("+") ? "text-neon-green" : "text-neon-red"
                  )}>
                    {prediction.expectedMove}
                  </div>
                </div>
                <div className="glass-card p-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <AlertTriangle className="w-3 h-3" />
                    Risk
                  </div>
                  <div className={clsx(
                    "font-semibold text-sm",
                    prediction.riskLevel === "Low" ? "text-neon-green" : prediction.riskLevel === "High" ? "text-neon-red" : "text-neon-yellow"
                  )}>
                    {prediction.riskLevel}
                  </div>
                </div>
                <div className="glass-card p-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <Flame className="w-3 h-3" />
                    Volatility
                  </div>
                  <div className="font-semibold text-sm text-gray-300">{prediction.volatility}</div>
                </div>
              </div>

              {/* Liquidity Heat */}
              <ConfidenceBar value={prediction.liquidityHeat} label="Liquidity Heat" />

              {/* AI Reasoning */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">AI Reasoning</h4>
                <ul className="space-y-2">
                  {prediction.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-blue mt-1.5 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
