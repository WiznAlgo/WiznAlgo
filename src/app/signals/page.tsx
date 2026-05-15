"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PAIRS, generatePrediction, generateSignalHistory, calculateWinRate, type AIPrediction, type SignalHistoryEntry } from "@/lib/market-data";
import SignalBadge from "@/components/ui/SignalBadge";
import { clsx } from "clsx";
import { BarChart3, ArrowUpDown, Filter, RefreshCw, Target, Shield, ChevronDown, ChevronUp, Trophy } from "lucide-react";

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
  const [filter, setFilter] = useState<"all" | "BUY" | "SELL">("all");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [removedSignals, setRemovedSignals] = useState<Set<string>>(new Set());

  useEffect(() => {
    const id = setInterval(() => {
      setPredictions((prev) => {
        const next = generateAllPredictions();
        const newRemoved = new Set(removedSignals);

        Object.entries(next).forEach(([symbol, pred]) => {
          const prevPred = prev[symbol];
          if (!prevPred) return;
          const price = pred.entryPrice;
          if (prevPred.signal === "BUY") {
            if (price <= prevPred.stopLoss || price >= prevPred.takeProfit) {
              newRemoved.add(symbol);
            }
          } else if (prevPred.signal === "SELL") {
            if (price >= prevPred.stopLoss || price <= prevPred.takeProfit) {
              newRemoved.add(symbol);
            }
          }
        });

        if (newRemoved.size !== removedSignals.size) {
          setRemovedSignals(newRemoved);
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [removedSignals]);

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
    if (removedSignals.has(p.symbol)) return false;
    if (filter === "all") return predictions[p.symbol]?.signal !== "HOLD";
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

  const overallStats = useMemo(() => {
    const allHist: SignalHistoryEntry[] = [];
    PAIRS.forEach((p) => allHist.push(...generateSignalHistory(p.symbol)));
    return calculateWinRate(allHist);
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <BarChart3 className="w-6 h-6 text-neon-blue" />
        <h1 className="text-2xl font-bold text-white">AI Signal Scanner</h1>
        <div className="flex items-center gap-1 ml-auto text-xs text-gray-500">
          <RefreshCw className="w-3 h-3 animate-spin" />
          Auto-refresh 5s
        </div>
      </div>

      {/* Win Rate Summary Bar */}
      <div className="glass-card p-3 mb-4">
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-neon-yellow" />
            <span className="text-gray-400">Win Rate:</span>
            <span className={clsx("font-bold", overallStats.winRate >= 60 ? "text-neon-green" : "text-neon-yellow")}>{overallStats.winRate}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">W/L:</span>
            <span className="text-neon-green font-bold">{overallStats.wins}</span>
            <span className="text-gray-600">/</span>
            <span className="text-neon-red font-bold">{overallStats.losses}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Avg Win:</span>
            <span className="text-neon-green font-mono">+{overallStats.avgWin}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Avg Loss:</span>
            <span className="text-neon-red font-mono">-{overallStats.avgLoss}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">PF:</span>
            <span className={clsx("font-bold", overallStats.profitFactor >= 1.5 ? "text-neon-green" : "text-neon-yellow")}>{overallStats.profitFactor}</span>
          </div>
          <Link href="/history" className="ml-auto text-xs text-neon-blue hover:underline">View Full History</Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter className="w-4 h-4 text-gray-500" />
        {(["all", "BUY", "SELL"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "px-3 py-1 rounded-lg text-xs font-medium transition-all",
              filter === f ? "bg-neon-blue/20 text-neon-blue" : "bg-dark-700 text-gray-500 hover:text-white"
            )}
          >
            {f === "all" ? "All Active" : f}
          </button>
        ))}
        {removedSignals.size > 0 && (
          <button
            onClick={() => setRemovedSignals(new Set())}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-dark-700 text-gray-500 hover:text-white transition-all"
          >
            Reset ({removedSignals.size} cleared)
          </button>
        )}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neon-blue/10">
                <th className="text-left px-4 py-3"><SortHeader field="symbol" label="Pair" activeField={sortField} onSort={handleSort} /></th>
                <th className="text-left px-4 py-3"><SortHeader field="signal" label="Signal" activeField={sortField} onSort={handleSort} /></th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Entry</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">SL</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">TP</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">R:R</th>
                <th className="text-left px-4 py-3"><SortHeader field="confidence" label="Confidence" activeField={sortField} onSort={handleSort} /></th>
                <th className="text-left px-4 py-3"><SortHeader field="risk" label="Risk" activeField={sortField} onSort={handleSort} /></th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">VWAP Basis</th>
                <th className="w-10 px-2" />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {sortedPairs.map((pair, i) => {
                  const pred = predictions[pair.symbol];
                  if (!pred) return null;
                  const isExpanded = expandedRow === pair.symbol;
                  return (
                    <motion.tr
                      key={pair.symbol}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-neon-blue/5 hover:bg-dark-700/30 transition-colors cursor-pointer"
                      onClick={() => setExpandedRow(isExpanded ? null : pair.symbol)}
                    >
                      <td className="px-4 py-3" colSpan={10}>
                        <div className="grid grid-cols-[1fr] gap-0">
                          {/* Main row */}
                          <div className="grid grid-cols-[minmax(80px,1fr)_80px_80px_80px_80px_60px_120px_70px_140px_30px] items-center gap-0">
                            <Link href={`/analysis/${pair.symbol}`} className="hover:text-neon-blue transition-colors" onClick={(e) => e.stopPropagation()}>
                              <div className="font-semibold text-white text-sm">{pair.symbol}</div>
                              <div className="text-xs text-gray-500">{pair.name}</div>
                            </Link>
                            <SignalBadge signal={pred.signal} size="sm" />
                            <span className="text-sm font-mono text-gray-300">{pred.entryPrice}</span>
                            <span className="text-sm font-mono text-neon-red">{pred.stopLoss}</span>
                            <span className="text-sm font-mono text-neon-green">{pred.takeProfit}</span>
                            <span className="text-xs font-mono text-neon-blue">{pred.riskRewardRatio}</span>
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
                            <span className={clsx(
                              "text-xs font-medium px-2 py-0.5 rounded",
                              pred.riskLevel === "Low" ? "bg-neon-green/10 text-neon-green" :
                              pred.riskLevel === "High" ? "bg-neon-red/10 text-neon-red" :
                              "bg-neon-yellow/10 text-neon-yellow"
                            )}>
                              {pred.riskLevel}
                            </span>
                            <span className="text-xs text-gray-400 truncate">{pred.vwapBasis}</span>
                            <div className="flex justify-center">
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                            </div>
                          </div>

                          {/* Expanded reasoning */}
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-neon-blue/10"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Reasoning */}
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Shield className="w-4 h-4 text-neon-purple" />
                                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">AI Reasoning</h4>
                                  </div>
                                  <div className="space-y-1.5">
                                    {pred.reasons.map((reason, ri) => (
                                      <div key={ri} className="flex items-start gap-2 text-xs">
                                        <span className="w-4 h-4 rounded-full bg-neon-blue/10 text-neon-blue flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                                          {ri + 1}
                                        </span>
                                        <span className="text-gray-300">{reason}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* SL/TP Details */}
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Target className="w-4 h-4 text-neon-green" />
                                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Trade Setup</h4>
                                  </div>
                                  <div className="bg-dark-700/50 rounded-lg p-3 space-y-2 text-xs">
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Entry Price</span>
                                      <span className="font-mono text-white">{pred.entryPrice}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Stop Loss</span>
                                      <span className="font-mono text-neon-red">{pred.stopLoss}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Take Profit</span>
                                      <span className="font-mono text-neon-green">{pred.takeProfit}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-neon-blue/10 pt-2">
                                      <span className="text-gray-400">Risk:Reward</span>
                                      <span className="font-mono text-neon-blue font-bold">{pred.riskRewardRatio}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">VWAP Basis</span>
                                      <span className="text-neon-purple">{pred.vwapBasis}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400">Expected Move</span>
                                      <span className={clsx("font-mono", pred.expectedMove.startsWith("+") ? "text-neon-green" : "text-neon-red")}>
                                        {pred.expectedMove}
                                      </span>
                                    </div>
                                  </div>
                                  <Link
                                    href={`/analysis/${pair.symbol}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-2 block text-center py-1.5 rounded-lg text-xs font-medium border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 transition-all"
                                  >
                                    View Full Analysis with Chart
                                  </Link>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
