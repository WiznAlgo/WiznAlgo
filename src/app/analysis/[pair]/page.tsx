"use client";

import { useEffect, useState, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import TradingChart from "@/components/charts/TradingChart";
import SignalBadge from "@/components/ui/SignalBadge";
import ConfidenceBar from "@/components/ui/ConfidenceBar";
import { generatePrediction, PAIRS, type AIPrediction } from "@/lib/market-data";
import { useMarketStore } from "@/store/market-store";
import { clsx } from "clsx";
import { ArrowLeft, Brain, Activity, Target, Layers, Shield, TrendingUp } from "lucide-react";

export default function AnalysisDetailPage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = use(params);
  const router = useRouter();
  const { setSelectedPair } = useMarketStore();
  const [tick, setTick] = useState(0);

  const pairInfo = PAIRS.find((p) => p.symbol === pair);

  useEffect(() => {
    setSelectedPair(pair);
  }, [pair, setSelectedPair]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(id);
  }, []);

  const prediction: AIPrediction = useMemo(() => generatePrediction(pair), [pair, tick]);

  const narratives: Record<string, string> = {
    BUY: `Large buy-side absorption detected near support area. Price currently trading above VWAP. Bullish delta imbalance increasing significantly. Liquidity sweep detected below previous lows, suggesting smart money accumulation. Order flow shows aggressive buying with institutional footprint detected at key volume nodes. Fair value gap identified below, providing strong support. Market structure remains bullish with higher highs and higher lows intact.`,
    SELL: `Large sell-side absorption detected near resistance area. Price currently trading below VWAP. Bearish delta imbalance increasing. Liquidity sweep detected above previous highs, suggesting distribution phase. Smart money appears to be offloading positions with significant sell-side imbalances at premium levels. Order blocks above showing rejection patterns. Market structure shifting bearish with break of structure confirmed.`,
    HOLD: `Market currently in consolidation phase with balanced order flow. VWAP acting as equilibrium with price oscillating around fair value. No significant imbalance detected in current range. Liquidity building on both sides suggests imminent breakout. Volume profile shows balanced distribution indicating uncertainty. Waiting for clear directional catalyst before entering position.`,
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <button onClick={() => router.back()} className="p-2 rounded-lg bg-dark-700 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{pair}</h1>
          <p className="text-sm text-gray-500">{pairInfo?.name} - AI Deep Analysis</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <SignalBadge signal={prediction.signal} size="lg" />
          <span className="text-sm text-gray-500">{prediction.confidence}% confidence</span>
        </div>
      </div>

      {/* Full Chart */}
      <div className="glass-card p-4">
        <TradingChart height={500} showVolume pairOverride={pair} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI Market Narrative */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-neon-purple" />
            <h3 className="font-bold text-white">AI Market Narrative</h3>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{narratives[prediction.signal]}</p>
        </div>

        {/* Institutional Analysis */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-neon-blue" />
            <h3 className="font-bold text-white">Institutional Analysis</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Institutional Bias</span>
              <span className={clsx(prediction.trend === "Bullish" ? "text-neon-green" : prediction.trend === "Bearish" ? "text-neon-red" : "text-neon-yellow")}>
                {prediction.trend}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Smart Money Flow</span>
              <span className="text-neon-blue">{prediction.signal === "BUY" ? "Accumulation" : prediction.signal === "SELL" ? "Distribution" : "Neutral"}</span>
            </div>
            <ConfidenceBar value={prediction.confidence} label="AI Model Confidence" />
            <ConfidenceBar value={prediction.liquidityHeat} label="Liquidity Heat Index" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Risk/Reward</span>
              <span className="text-white font-mono">{prediction.riskLevel === "Low" ? "3.2:1" : prediction.riskLevel === "Medium" ? "2.1:1" : "1.4:1"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Order Flow */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-neon-green" />
            <h3 className="font-bold text-white">Order Flow</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Aggressive Buyers</span><span className="text-neon-green">1,247K</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Aggressive Sellers</span><span className="text-neon-red">892K</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Bid/Ask Imbalance</span><span className="text-white">+28.4%</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Delta Volume</span><span className="text-neon-green">+355K</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Absorption Detected</span><span className="text-neon-blue">Yes - Support</span></div>
          </div>
        </div>

        {/* Liquidity Map */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-neon-red" />
            <h3 className="font-bold text-white">Liquidity Map</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Above Price</span><span className="text-neon-red">High Liquidity</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Below Price</span><span className="text-neon-green">Swept</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Stop Clusters</span><span className="text-neon-yellow">Detected</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Volume Nodes</span><span className="text-white">3 HVN, 2 LVN</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Fair Value Gap</span><span className="text-neon-purple">Active Below</span></div>
          </div>
        </div>

        {/* Market Structure */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-neon-yellow" />
            <h3 className="font-bold text-white">Market Structure</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Structure</span><span className={clsx(prediction.trend === "Bullish" ? "text-neon-green" : "text-neon-red")}>{prediction.trend}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Last BOS</span><span className="text-white">Confirmed</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Order Block</span><span className="text-neon-blue">Active</span></div>
            <div className="flex justify-between"><span className="text-gray-400">CHoCH</span><span className="text-gray-400">Not Detected</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Premium/Discount</span><span className="text-neon-green">{prediction.signal === "BUY" ? "Discount Zone" : "Premium Zone"}</span></div>
          </div>
        </div>
      </div>

      {/* AI Reasoning Detail */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-neon-blue" />
          <h3 className="font-bold text-white">Detailed AI Reasoning</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {prediction.reasons.map((reason, i) => (
            <div key={i} className="flex items-start gap-3 bg-dark-700/30 rounded-lg p-3">
              <span className="w-6 h-6 rounded-full bg-neon-blue/10 text-neon-blue text-xs flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-gray-300">{reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
