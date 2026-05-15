"use client";

import { useMemo } from "react";
import { generateCandles, type CandleData } from "@/lib/market-data";
import { useMarketStore } from "@/store/market-store";
import { clsx } from "clsx";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface OrderFlowChartProps {
  pairOverride?: string;
  count?: number;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface FlowCandle extends CandleData {
  buyVol: number;
  sellVol: number;
  delta: number;
  cumDelta: number;
  aggBuyers: number;
  aggSellers: number;
}

export default function OrderFlowChart({ pairOverride, count = 30 }: OrderFlowChartProps) {
  const { selectedPair, selectedTimeframe } = useMarketStore();
  const pair = pairOverride ?? selectedPair;

  const flowData: FlowCandle[] = useMemo(() => {
    const candles = generateCandles(pair, count, selectedTimeframe);

    const result: FlowCandle[] = [];
    candles.reduce((acc, c) => {
      const r = seededRandom(c.time + pair.charCodeAt(0));
      const bullish = c.close >= c.open;
      const buyRatio = bullish ? 0.5 + r * 0.3 : 0.2 + r * 0.3;
      const buyVol = Math.floor(c.volume * buyRatio);
      const sellVol = c.volume - buyVol;
      const delta = buyVol - sellVol;
      const nextCum = acc + delta;

      result.push({
        ...c,
        buyVol,
        sellVol,
        delta,
        cumDelta: nextCum,
        aggBuyers: Math.floor(buyVol * (0.3 + r * 0.4)),
        aggSellers: Math.floor(sellVol * (0.3 + r * 0.4)),
      });
      return nextCum;
    }, 0);
    return result;
  }, [pair, selectedTimeframe, count]);
  const maxAbsDelta = useMemo(() => Math.max(...flowData.map((d) => Math.abs(d.delta))), [flowData]);

  const totalBuyVol = flowData.reduce((s, d) => s + d.buyVol, 0);
  const totalSellVol = flowData.reduce((s, d) => s + d.sellVol, 0);
  const totalDelta = totalBuyVol - totalSellVol;
  const buyPct = ((totalBuyVol / (totalBuyVol + totalSellVol)) * 100).toFixed(1);

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-dark-700/50 rounded-lg p-2 text-center">
          <div className="text-[10px] text-gray-500 uppercase">Buy Volume</div>
          <div className="text-sm font-bold text-neon-green">{(totalBuyVol / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-dark-700/50 rounded-lg p-2 text-center">
          <div className="text-[10px] text-gray-500 uppercase">Sell Volume</div>
          <div className="text-sm font-bold text-neon-red">{(totalSellVol / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-dark-700/50 rounded-lg p-2 text-center">
          <div className="text-[10px] text-gray-500 uppercase">Net Delta</div>
          <div className={clsx("text-sm font-bold", totalDelta > 0 ? "text-neon-green" : "text-neon-red")}>
            {totalDelta > 0 ? "+" : ""}{(totalDelta / 1000).toFixed(0)}K
          </div>
        </div>
        <div className="bg-dark-700/50 rounded-lg p-2 text-center">
          <div className="text-[10px] text-gray-500 uppercase">Buy Ratio</div>
          <div className="text-sm font-bold text-neon-blue">{buyPct}%</div>
        </div>
      </div>

      {/* Buy/Sell pressure bar */}
      <div>
        <div className="flex h-2 rounded-full overflow-hidden bg-dark-700">
          <div className="bg-neon-green/60 h-full transition-all" style={{ width: `${buyPct}%` }} />
          <div className="bg-neon-red/60 h-full transition-all" style={{ width: `${100 - parseFloat(buyPct)}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
          <span>Buyers {buyPct}%</span>
          <span>Sellers {(100 - parseFloat(buyPct)).toFixed(1)}%</span>
        </div>
      </div>

      {/* Per-candle flow */}
      <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
        <div className="grid grid-cols-[40px_60px_60px_1fr_80px_60px] gap-1 px-1 py-1 text-[9px] font-medium uppercase tracking-wider text-gray-600 border-b border-neon-blue/10 sticky top-0 bg-dark-800">
          <span>Time</span>
          <span className="text-right">Buy</span>
          <span className="text-right">Sell</span>
          <span className="text-center">Delta</span>
          <span className="text-center">Cum.Delta</span>
          <span className="text-center">Flow</span>
        </div>
        {flowData.slice(-20).map((d) => {
          const deltaPct = (Math.abs(d.delta) / maxAbsDelta) * 100;
          const time = new Date(d.time * 1000);
          const timeStr = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`;

          return (
            <div key={d.time} className="grid grid-cols-[40px_60px_60px_1fr_80px_60px] gap-1 px-1 py-0.5 items-center text-[11px] hover:bg-dark-600/30">
              <span className="text-gray-500 font-mono">{timeStr}</span>
              <span className="text-right font-mono text-neon-green/80">{d.buyVol.toLocaleString()}</span>
              <span className="text-right font-mono text-neon-red/80">{d.sellVol.toLocaleString()}</span>

              {/* Delta bar */}
              <div className="flex items-center h-4">
                <div className="relative w-full h-3 bg-dark-700 rounded-sm">
                  {d.delta > 0 ? (
                    <div className="absolute left-1/2 h-full bg-neon-green/40 rounded-sm" style={{ width: `${deltaPct / 2}%` }} />
                  ) : (
                    <div className="absolute h-full bg-neon-red/40 rounded-sm" style={{ width: `${deltaPct / 2}%`, right: "50%" }} />
                  )}
                </div>
              </div>

              {/* Cumulative delta */}
              <div className="flex items-center justify-center">
                <span className={clsx("text-[10px] font-mono", d.cumDelta > 0 ? "text-neon-green" : "text-neon-red")}>
                  {d.cumDelta > 0 ? "+" : ""}{(d.cumDelta / 1000).toFixed(1)}K
                </span>
              </div>

              {/* Flow indicator */}
              <div className="flex justify-center">
                {d.delta > d.volume * 0.15 ? (
                  <TrendingUp className="w-3.5 h-3.5 text-neon-green" />
                ) : d.delta < -d.volume * 0.15 ? (
                  <TrendingDown className="w-3.5 h-3.5 text-neon-red" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-gray-600" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
