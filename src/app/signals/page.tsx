"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PAIRS, generatePrediction, type AIPrediction } from "@/lib/market-data";
import SignalBadge from "@/components/ui/SignalBadge";
import { clsx } from "clsx";
import { BarChart3, ArrowUpDown, Filter, RefreshCw } from "lucide-react";

type SortField = "symbol" | "signal" | "confidence" | "trend" | "risk" | "volatility";

function SortHeader({
  field,
  label,
  activeField,
  onSort,
}: {
  field: SortField;
  label: string;
  activeField: SortField;
  onSort: (field: SortField) => void;
}) {
  return (
    <button
      onClick={() => onSort(field)}
      className={clsx(
        "flex items-center gap-1 text-xs font-medium uppercase tracking-wider hover:text-neon-blue transition-colors",
        activeField === field ? "text-neon-blue" : "text-gray-500"
      )}
    >
      {label}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );
}

function generateAllPredictions(): Record<string, AIPrediction> {
  const preds: Record<string, AIPrediction> = {};
  PAIRS.forEach((p) => { preds[p.symbol] = generatePrediction(p.symbol); });
  return preds;
}

export default function SignalsPage() {
  const [predictions, setPredictions] = useState<Record<string, AIPrediction>>(generateAllPredictions);
  const [sortField, setSortField] = useState<SortField>("confidence");
  const [sortAsc, setSortAsc] = useState(false);
  const [filter, setFilter] = useState<"all" | "BUY" | "SELL" | "HOLD">("all");

  useEffect(() => {
    const id = setInterval(() => {
      setPredictions(generateAllPredictions());
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortAsc((a) => !a);
        return prev;
      }
      setSortAsc(false);
      return field;
    });
  }, []);

  const sortedPairs = [...PAIRS].filter((p) => {
    if (filter === "all") return true;
    return predictions[p.symbol]?.signal === filter;
  }).sort((a, b) => {
    const predA = predictions[a.symbol];
    const predB = predictions[b.symbol];
    if (!predA || !predB) return 0;
    let cmp = 0;
    switch (sortField) {
      case "symbol": cmp = a.symbol.localeCompare(b.symbol); break;
      case "confidence": cmp = predA.confidence - predB.confidence; break;
      case "signal": cmp = predA.signal.localeCompare(predB.signal); break;
      case "trend": cmp = predA.trend.localeCompare(predB.trend); break;
      case "risk": cmp = predA.riskLevel.localeCompare(predB.riskLevel); break;
      case "volatility": cmp = predA.volatility.localeCompare(predB.volatility); break;
    }
    return sortAsc ? cmp : -cmp;
  });

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <BarChart3 className="w-6 h-6 text-neon-blue" />
        <h1 className="text-2xl font-bold text-white">AI Signal Scanner</h1>
        <div className="flex items-center gap-1 ml-auto text-xs text-gray-500">
          <RefreshCw className="w-3 h-3 animate-spin" />
          Auto-refresh 5s
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter className="w-4 h-4 text-gray-500" />
        {(["all", "BUY", "SELL", "HOLD"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "px-3 py-1 rounded-lg text-xs font-medium transition-all",
              filter === f ? "bg-neon-blue/20 text-neon-blue" : "bg-dark-700 text-gray-500 hover:text-white"
            )}
          >
            {f === "all" ? "All Signals" : f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neon-blue/10">
                <th className="text-left px-4 py-3"><SortHeader field="symbol" label="Pair" activeField={sortField} onSort={handleSort} /></th>
                <th className="text-left px-4 py-3"><SortHeader field="signal" label="Signal" activeField={sortField} onSort={handleSort} /></th>
                <th className="text-left px-4 py-3"><SortHeader field="trend" label="Trend" activeField={sortField} onSort={handleSort} /></th>
                <th className="text-left px-4 py-3"><SortHeader field="confidence" label="AI Confidence" activeField={sortField} onSort={handleSort} /></th>
                <th className="text-left px-4 py-3"><SortHeader field="risk" label="Risk" activeField={sortField} onSort={handleSort} /></th>
                <th className="text-left px-4 py-3">Expected Move</th>
                <th className="text-left px-4 py-3"><SortHeader field="volatility" label="Volatility" activeField={sortField} onSort={handleSort} /></th>
                <th className="text-left px-4 py-3">Liquidity</th>
              </tr>
            </thead>
            <tbody>
              {sortedPairs.map((pair, i) => {
                const pred = predictions[pair.symbol];
                if (!pred) return null;
                return (
                  <motion.tr
                    key={pair.symbol}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-neon-blue/5 hover:bg-dark-700/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/analysis/${pair.symbol}`} className="hover:text-neon-blue transition-colors">
                        <div className="font-semibold text-white text-sm">{pair.symbol}</div>
                        <div className="text-xs text-gray-500">{pair.name}</div>
                      </Link>
                    </td>
                    <td className="px-4 py-3"><SignalBadge signal={pred.signal} size="sm" /></td>
                    <td className="px-4 py-3">
                      <span className={clsx(
                        "text-sm font-medium",
                        pred.trend === "Bullish" ? "text-neon-green" : pred.trend === "Bearish" ? "text-neon-red" : "text-neon-yellow"
                      )}>
                        {pred.trend}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                          <div
                            className={clsx(
                              "h-full rounded-full",
                              pred.confidence >= 75 ? "bg-neon-green" : pred.confidence >= 50 ? "bg-neon-yellow" : "bg-neon-red"
                            )}
                            style={{ width: `${pred.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono text-gray-300">{pred.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx(
                        "text-xs font-medium px-2 py-0.5 rounded",
                        pred.riskLevel === "Low" ? "bg-neon-green/10 text-neon-green" :
                        pred.riskLevel === "High" ? "bg-neon-red/10 text-neon-red" :
                        "bg-neon-yellow/10 text-neon-yellow"
                      )}>
                        {pred.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx(
                        "text-sm font-mono",
                        pred.expectedMove.startsWith("+") ? "text-neon-green" : "text-neon-red"
                      )}>
                        {pred.expectedMove}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{pred.volatility}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-neon-purple" style={{ width: `${pred.liquidityHeat}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{pred.liquidityHeat}</span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
