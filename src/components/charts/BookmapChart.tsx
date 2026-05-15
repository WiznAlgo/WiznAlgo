"use client";

import { useMemo } from "react";
import { generateBookmapData, type BookmapLevel } from "@/lib/market-data";
import { useMarketStore } from "@/store/market-store";
import { clsx } from "clsx";

interface BookmapChartProps {
  pairOverride?: string;
}

function heatColor(heat: number): string {
  if (heat > 0.8) return "bg-neon-red/80";
  if (heat > 0.6) return "bg-orange-500/70";
  if (heat > 0.4) return "bg-neon-yellow/60";
  if (heat > 0.2) return "bg-neon-blue/40";
  return "bg-neon-blue/15";
}

function heatTextColor(heat: number): string {
  if (heat > 0.6) return "text-white";
  if (heat > 0.3) return "text-gray-200";
  return "text-gray-500";
}

export default function BookmapChart({ pairOverride }: BookmapChartProps) {
  const { selectedPair } = useMarketStore();
  const pair = pairOverride ?? selectedPair;

  const data: BookmapLevel[] = useMemo(() => generateBookmapData(pair), [pair]);
  const maxDepth = useMemo(() => Math.max(...data.map((d) => Math.max(d.bidDepth, d.askDepth))), [data]);
  const midIdx = Math.floor(data.length / 2);

  return (
    <div className="space-y-0.5">
      {/* Header */}
      <div className="grid grid-cols-[80px_1fr_70px_1fr_80px] gap-0.5 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-neon-blue/10">
        <span className="text-right">Bid Depth</span>
        <span className="text-center">Bid Heat</span>
        <span className="text-center">Price</span>
        <span className="text-center">Ask Heat</span>
        <span>Ask Depth</span>
      </div>

      {/* Levels */}
      <div className="max-h-[500px] overflow-y-auto">
        {data.slice().reverse().map((level, i) => {
          const actualIdx = data.length - 1 - i;
          const isSpread = actualIdx === midIdx || actualIdx === midIdx - 1;
          const bidPct = (level.bidDepth / maxDepth) * 100;
          const askPct = (level.askDepth / maxDepth) * 100;

          return (
            <div
              key={level.price}
              className={clsx(
                "grid grid-cols-[80px_1fr_70px_1fr_80px] gap-0.5 px-2 py-px items-center text-[11px]",
                isSpread && "border-y border-neon-yellow/30 bg-neon-yellow/5"
              )}
            >
              <span className="text-right font-mono text-neon-green/70">{level.bidDepth.toLocaleString()}</span>

              {/* Bid heatmap bar */}
              <div className="flex justify-end h-5">
                <div
                  className={clsx("h-full rounded-l-sm flex items-center justify-end px-1", heatColor(level.heat))}
                  style={{ width: `${bidPct}%` }}
                >
                  {bidPct > 20 && (
                    <span className={clsx("text-[9px] font-mono", heatTextColor(level.heat))}>
                      {level.bidDepth.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <span className={clsx(
                "text-center font-mono font-semibold text-[11px]",
                actualIdx > midIdx ? "text-neon-red/70" : "text-neon-green/70"
              )}>
                {level.price}
              </span>

              {/* Ask heatmap bar */}
              <div className="flex justify-start h-5">
                <div
                  className={clsx("h-full rounded-r-sm flex items-center px-1", heatColor(level.heat * 0.9))}
                  style={{ width: `${askPct}%` }}
                >
                  {askPct > 20 && (
                    <span className={clsx("text-[9px] font-mono", heatTextColor(level.heat))}>
                      {level.askDepth.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <span className="font-mono text-neon-red/70">{level.askDepth.toLocaleString()}</span>
            </div>
          );
        })}
      </div>

      {/* Heat legend */}
      <div className="flex items-center gap-2 px-2 pt-2 text-[10px] text-gray-500 border-t border-neon-blue/10">
        <span>Liquidity Heat:</span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-2 bg-neon-blue/15 rounded-sm" /> Low
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-2 bg-neon-blue/40 rounded-sm" /> Med
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-2 bg-neon-yellow/60 rounded-sm" /> High
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-2 bg-orange-500/70 rounded-sm" /> V.High
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-2 bg-neon-red/80 rounded-sm" /> Extreme
        </span>
      </div>
    </div>
  );
}
