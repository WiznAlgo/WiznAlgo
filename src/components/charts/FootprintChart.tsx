"use client";

import { useMemo } from "react";
import { generateFootprintData, type FootprintLevel } from "@/lib/market-data";
import { useMarketStore } from "@/store/market-store";
import { clsx } from "clsx";

interface FootprintChartProps {
  pairOverride?: string;
}

export default function FootprintChart({ pairOverride }: FootprintChartProps) {
  const { selectedPair } = useMarketStore();
  const pair = pairOverride ?? selectedPair;

  const data: FootprintLevel[] = useMemo(() => generateFootprintData(pair), [pair]);
  const maxVol = useMemo(() => Math.max(...data.map((d) => Math.max(d.bidVolume, d.askVolume))), [data]);

  return (
    <div className="space-y-0.5">
      {/* Header */}
      <div className="grid grid-cols-[100px_1fr_60px_1fr_100px] gap-1 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-gray-500 border-b border-neon-blue/10">
        <span className="text-right">Bid Vol</span>
        <span />
        <span className="text-center">Price</span>
        <span />
        <span>Ask Vol</span>
      </div>

      {/* Levels */}
      {data.slice().reverse().map((level, i) => {
        const bidPct = (level.bidVolume / maxVol) * 100;
        const askPct = (level.askVolume / maxVol) * 100;
        const isNearCenter = i >= data.length / 2 - 2 && i <= data.length / 2 + 2;

        return (
          <div
            key={level.price}
            className={clsx(
              "grid grid-cols-[100px_1fr_60px_1fr_100px] gap-1 px-2 py-0.5 items-center text-xs transition-colors",
              isNearCenter && "bg-dark-600/30",
              level.imbalance && "ring-1 ring-neon-yellow/30"
            )}
          >
            {/* Bid volume number */}
            <span className="text-right font-mono text-neon-green/80">{level.bidVolume.toLocaleString()}</span>

            {/* Bid bar (right-aligned) */}
            <div className="flex justify-end">
              <div
                className="h-4 rounded-l-sm bg-neon-green/30"
                style={{ width: `${bidPct}%` }}
              />
            </div>

            {/* Price */}
            <span className={clsx(
              "text-center font-mono text-[11px] font-semibold",
              level.delta > 0 ? "text-neon-green" : level.delta < 0 ? "text-neon-red" : "text-gray-400"
            )}>
              {level.price}
            </span>

            {/* Ask bar (left-aligned) */}
            <div className="flex justify-start">
              <div
                className="h-4 rounded-r-sm bg-neon-red/30"
                style={{ width: `${askPct}%` }}
              />
            </div>

            {/* Ask volume number */}
            <div className="flex items-center gap-1">
              <span className="font-mono text-neon-red/80">{level.askVolume.toLocaleString()}</span>
              {level.imbalance && (
                <span className="text-[9px] px-1 rounded bg-neon-yellow/20 text-neon-yellow font-bold">IMB</span>
              )}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex items-center gap-4 px-2 pt-2 text-[10px] text-gray-500 border-t border-neon-blue/10">
        <span className="flex items-center gap-1">
          <span className="w-3 h-2 bg-neon-green/30 rounded-sm" /> Bid (Buyers)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-2 bg-neon-red/30 rounded-sm" /> Ask (Sellers)
        </span>
        <span className="flex items-center gap-1">
          <span className="px-1 bg-neon-yellow/20 text-neon-yellow rounded-sm">IMB</span> Imbalance
        </span>
      </div>
    </div>
  );
}
