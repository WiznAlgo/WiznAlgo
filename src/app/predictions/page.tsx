"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import TradingChart from "@/components/charts/TradingChart";
import SignalBadge from "@/components/ui/SignalBadge";
import ConfidenceBar from "@/components/ui/ConfidenceBar";
import { PAIRS, generatePrediction, type AIPrediction } from "@/lib/market-data";
import { clsx } from "clsx";
import { Brain } from "lucide-react";

export default function PredictionsPage() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 8000);
    return () => clearInterval(id);
  }, []);

  const predictions = useMemo(() => {
    const preds: Record<string, AIPrediction> = {};
    PAIRS.forEach((p) => { preds[p.symbol] = generatePrediction(p.symbol); });
    return preds;
  }, [tick]);

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-neon-purple" />
        <h1 className="text-2xl font-bold text-white">AI Predictions</h1>
        <div className="flex items-center gap-1 ml-auto text-xs text-gray-500">
          <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
          Real-time
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {PAIRS.map((pair, i) => {
          const pred = predictions[pair.symbol];
          if (!pred) return null;
          return (
            <motion.div
              key={pair.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/analysis/${pair.symbol}`}>
                <div className="glass-card p-4 hover:border-neon-blue/30 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-base font-bold text-white group-hover:text-neon-blue transition-colors">
                        {pair.symbol}
                      </div>
                      <div className="text-xs text-gray-500">{pair.name}</div>
                    </div>
                    <SignalBadge signal={pred.signal} />
                  </div>

                  <div className="mb-3 rounded-lg overflow-hidden bg-dark-900/50">
                    <TradingChart height={140} showVolume={false} mini pairOverride={pair.symbol} />
                  </div>

                  <ConfidenceBar value={pred.confidence} />

                  {/* SL/TP Section */}
                  {pred.signal !== "HOLD" && (
                    <div className="grid grid-cols-3 gap-2 mt-3 bg-dark-700/30 rounded-lg p-2">
                      <div className="text-center">
                        <div className="text-[10px] text-gray-500">Entry</div>
                        <div className="text-xs font-mono text-white">{pred.entryPrice}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-gray-500">SL</div>
                        <div className="text-xs font-mono text-neon-red">{pred.stopLoss}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-gray-500">TP</div>
                        <div className="text-xs font-mono text-neon-green">{pred.takeProfit}</div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Trend</div>
                      <div className={clsx(
                        "text-xs font-semibold",
                        pred.trend === "Bullish" ? "text-neon-green" : pred.trend === "Bearish" ? "text-neon-red" : "text-neon-yellow"
                      )}>
                        {pred.trend}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">R:R</div>
                      <div className="text-xs font-semibold text-neon-blue">{pred.riskRewardRatio}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Move</div>
                      <div className={clsx(
                        "text-xs font-semibold",
                        pred.expectedMove.startsWith("+") ? "text-neon-green" : "text-neon-red"
                      )}>
                        {pred.expectedMove}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neon-blue/5">
                    <div className="text-xs text-gray-500 mb-1">AI Reasoning:</div>
                    {pred.reasons.slice(0, 3).map((r, j) => (
                      <div key={j} className="flex items-start gap-1.5 text-xs text-gray-400 mb-0.5">
                        <span className="w-1 h-1 rounded-full bg-neon-blue mt-1.5 shrink-0" />
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
