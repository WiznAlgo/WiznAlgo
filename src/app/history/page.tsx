"use client";

import { useState, useMemo } from "react";
import { PAIRS, generateSignalHistory, calculateWinRate, type SignalHistoryEntry } from "@/lib/market-data";
import SignalBadge from "@/components/ui/SignalBadge";
import { clsx } from "clsx";
import { History, Trophy, TrendingUp, TrendingDown, Target, ShieldAlert, Filter } from "lucide-react";

function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function HistoryPage() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>("all");
  const [resultFilter, setResultFilter] = useState<string>("all");

  const allHistory = useMemo(() => {
    const histories: SignalHistoryEntry[] = [];
    PAIRS.forEach((p) => {
      histories.push(...generateSignalHistory(p.symbol));
    });
    return histories.sort((a, b) => b.openedAt - a.openedAt);
  }, []);

  const filteredHistory = useMemo(() => {
    return allHistory.filter((h) => {
      if (selectedSymbol !== "all" && h.symbol !== selectedSymbol) return false;
      if (resultFilter !== "all" && h.result !== resultFilter) return false;
      return true;
    });
  }, [allHistory, selectedSymbol, resultFilter]);

  const stats = useMemo(() => {
    const relevant = selectedSymbol === "all" ? allHistory : allHistory.filter((h) => h.symbol === selectedSymbol);
    return calculateWinRate(relevant);
  }, [allHistory, selectedSymbol]);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <History className="w-6 h-6 text-neon-yellow" />
        <h1 className="text-2xl font-bold text-white">Signal History</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="glass-card p-3 text-center">
          <Trophy className="w-4 h-4 text-neon-yellow mx-auto mb-1" />
          <div className="text-[10px] text-gray-500 uppercase">Win Rate</div>
          <div className={clsx("text-xl font-bold", stats.winRate >= 60 ? "text-neon-green" : stats.winRate >= 40 ? "text-neon-yellow" : "text-neon-red")}>
            {stats.winRate}%
          </div>
        </div>
        <div className="glass-card p-3 text-center">
          <Target className="w-4 h-4 text-neon-blue mx-auto mb-1" />
          <div className="text-[10px] text-gray-500 uppercase">Total</div>
          <div className="text-xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="glass-card p-3 text-center">
          <TrendingUp className="w-4 h-4 text-neon-green mx-auto mb-1" />
          <div className="text-[10px] text-gray-500 uppercase">Wins</div>
          <div className="text-xl font-bold text-neon-green">{stats.wins}</div>
        </div>
        <div className="glass-card p-3 text-center">
          <TrendingDown className="w-4 h-4 text-neon-red mx-auto mb-1" />
          <div className="text-[10px] text-gray-500 uppercase">Losses</div>
          <div className="text-xl font-bold text-neon-red">{stats.losses}</div>
        </div>
        <div className="glass-card p-3 text-center">
          <ShieldAlert className="w-4 h-4 text-neon-purple mx-auto mb-1" />
          <div className="text-[10px] text-gray-500 uppercase">Active</div>
          <div className="text-xl font-bold text-neon-purple">{stats.active}</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-[10px] text-gray-500 uppercase mt-4">Avg Win</div>
          <div className="text-xl font-bold text-neon-green">+{stats.avgWin}%</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-[10px] text-gray-500 uppercase mt-4">Avg Loss</div>
          <div className="text-xl font-bold text-neon-red">-{stats.avgLoss}%</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="text-[10px] text-gray-500 uppercase mt-4">Profit Factor</div>
          <div className={clsx("text-xl font-bold", stats.profitFactor >= 1.5 ? "text-neon-green" : stats.profitFactor >= 1 ? "text-neon-yellow" : "text-neon-red")}>
            {stats.profitFactor}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Filter className="w-4 h-4 text-gray-500" />
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="bg-dark-700 border border-neon-blue/20 rounded-lg px-3 py-1.5 text-sm text-white"
        >
          <option value="all">All Pairs</option>
          {PAIRS.map((p) => (
            <option key={p.symbol} value={p.symbol}>{p.symbol}</option>
          ))}
        </select>
        <div className="flex items-center gap-1">
          {["all", "ACTIVE", "TP_HIT", "SL_HIT"].map((f) => (
            <button
              key={f}
              onClick={() => setResultFilter(f)}
              className={clsx(
                "px-3 py-1 rounded-lg text-xs font-medium transition-all",
                resultFilter === f ? "bg-neon-blue/20 text-neon-blue" : "bg-dark-700 text-gray-500 hover:text-white"
              )}
            >
              {f === "all" ? "All" : f === "TP_HIT" ? "TP Hit" : f === "SL_HIT" ? "SL Hit" : "Active"}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neon-blue/10">
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Pair</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Signal</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Entry</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">SL</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">TP</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Confidence</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Opened</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Result</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">PnL</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((entry) => (
                <tr key={entry.id} className="border-b border-neon-blue/5 hover:bg-dark-700/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white text-sm">{entry.symbol}</td>
                  <td className="px-4 py-3"><SignalBadge signal={entry.signal} size="sm" /></td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-300">{entry.entryPrice}</td>
                  <td className="px-4 py-3 text-sm font-mono text-neon-red">{entry.stopLoss}</td>
                  <td className="px-4 py-3 text-sm font-mono text-neon-green">{entry.takeProfit}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                        <div
                          className={clsx("h-full rounded-full", entry.confidence >= 75 ? "bg-neon-green" : entry.confidence >= 50 ? "bg-neon-yellow" : "bg-neon-red")}
                          style={{ width: `${entry.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{entry.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatTime(entry.openedAt)}</td>
                  <td className="px-4 py-3">
                    <span className={clsx(
                      "text-xs font-medium px-2 py-0.5 rounded",
                      entry.result === "TP_HIT" ? "bg-neon-green/10 text-neon-green" :
                      entry.result === "SL_HIT" ? "bg-neon-red/10 text-neon-red" :
                      entry.result === "ACTIVE" ? "bg-neon-blue/10 text-neon-blue" :
                      "bg-gray-600/10 text-gray-400"
                    )}>
                      {entry.result === "TP_HIT" ? "TP Hit" : entry.result === "SL_HIT" ? "SL Hit" : entry.result === "ACTIVE" ? "Active" : "Expired"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {entry.pnlPercent != null ? (
                      <span className={clsx("text-sm font-bold font-mono", entry.pnlPercent > 0 ? "text-neon-green" : "text-neon-red")}>
                        {entry.pnlPercent > 0 ? "+" : ""}{entry.pnlPercent}%
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 max-w-[200px] truncate">{entry.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
