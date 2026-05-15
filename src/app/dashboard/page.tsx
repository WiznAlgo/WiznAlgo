"use client";

import { useEffect, useState, useMemo } from "react";
import TradingChart from "@/components/charts/TradingChart";
import { useMarketStore } from "@/store/market-store";
import { generatePrediction, generateVolumeProfile, PAIRS, type AIPrediction } from "@/lib/market-data";
import SignalBadge from "@/components/ui/SignalBadge";
import { clsx } from "clsx";
import { TrendingUp, TrendingDown, BarChart3, Activity, Layers } from "lucide-react";

export default function DashboardPage() {
  const { selectedPair, watchlist } = useMarketStore();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 8000);
    return () => clearInterval(id);
  }, []);

  const prediction = useMemo(() => generatePrediction(selectedPair), [selectedPair, tick]);
  const volumeProfile = useMemo(() => generateVolumeProfile(selectedPair), [selectedPair, tick]);
  const watchlistPredictions = useMemo(() => {
    const preds: Record<string, AIPrediction> = {};
    watchlist.forEach((s) => { preds[s] = generatePrediction(s); });
    return preds;
  }, [watchlist, tick]);

  return (
    <div className="p-4 space-y-4">
      {/* Chart Area */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white">{selectedPair}</h2>
            {prediction && <SignalBadge signal={prediction.signal} size="sm" />}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            Live
          </div>
        </div>
        <TradingChart height={450} showVolume />
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Volume Profile */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-neon-blue" />
            <h3 className="text-sm font-semibold text-white">Volume Profile</h3>
          </div>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {volumeProfile.map((level, i) => {
              const maxVol = Math.max(...volumeProfile.map((l) => l.volume));
              const pct = (level.volume / maxVol) * 100;
              return (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-16 text-gray-500 text-right font-mono">{level.price}</span>
                  <div className="flex-1 h-3 bg-dark-700 rounded-sm overflow-hidden">
                    <div
                      className={clsx(
                        "h-full rounded-sm",
                        level.type === "HVN" ? "bg-neon-blue/60" : level.type === "LVN" ? "bg-neon-red/40" : "bg-gray-600/40"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={clsx(
                    "w-8 text-right",
                    level.type === "HVN" ? "text-neon-blue" : level.type === "LVN" ? "text-neon-red" : "text-gray-600"
                  )}>
                    {level.type === "normal" ? "" : level.type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Flow */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-neon-purple" />
            <h3 className="text-sm font-semibold text-white">Order Flow</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neon-green">Buyers</span>
                <span className="text-neon-red">Sellers</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-dark-700">
                <div className="bg-neon-green/60 h-full" style={{ width: "58%" }} />
                <div className="bg-neon-red/60 h-full" style={{ width: "42%" }} />
              </div>
              <div className="flex justify-between text-xs mt-1 text-gray-500">
                <span>58%</span>
                <span>42%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                <TrendingUp className="w-4 h-4 text-neon-green mx-auto mb-1" />
                <div className="text-xs text-gray-500">Buy Volume</div>
                <div className="text-sm font-bold text-neon-green">1,247K</div>
              </div>
              <div className="bg-dark-700/50 rounded-lg p-2 text-center">
                <TrendingDown className="w-4 h-4 text-neon-red mx-auto mb-1" />
                <div className="text-xs text-gray-500">Sell Volume</div>
                <div className="text-sm font-bold text-neon-red">892K</div>
              </div>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-2">
              <div className="text-xs text-gray-500 mb-1">Delta Imbalance</div>
              <div className="text-lg font-bold text-neon-green">+355K</div>
              <div className="text-xs text-gray-500">Bullish accumulation detected</div>
            </div>
          </div>
        </div>

        {/* Watchlist */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-neon-yellow" />
            <h3 className="text-sm font-semibold text-white">Watchlist</h3>
          </div>
          <div className="space-y-2">
            {watchlist.map((symbol) => {
              const pred = watchlistPredictions[symbol];
              if (!pred) return null;
              const pair = PAIRS.find((p) => p.symbol === symbol);
              return (
                <div key={symbol} className="flex items-center justify-between bg-dark-700/50 rounded-lg p-2.5">
                  <div>
                    <div className="text-sm font-semibold text-white">{symbol}</div>
                    <div className="text-xs text-gray-500">{pair?.name}</div>
                  </div>
                  <div className="text-right">
                    <SignalBadge signal={pred.signal} size="sm" />
                    <div className="text-xs text-gray-500 mt-1">{pred.confidence}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
