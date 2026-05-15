"use client";

import { useMarketStore } from "@/store/market-store";
import FootprintChart from "@/components/charts/FootprintChart";
import TradingChart from "@/components/charts/TradingChart";
import { isBinanceSupported, useBinanceKline } from "@/lib/binance-ws";
import { Footprints, Wifi } from "lucide-react";

export default function FootprintPage() {
  const { selectedPair, selectedTimeframe } = useMarketStore();
  const isLive = isBinanceSupported(selectedPair);
  const { candles, connected } = useBinanceKline(selectedPair, selectedTimeframe);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Footprints className="w-6 h-6 text-neon-green" />
        <h1 className="text-2xl font-bold text-white">Footprint Chart</h1>
        <span className="text-sm text-gray-500">{selectedPair}</span>
        {isLive && connected && (
          <div className="flex items-center gap-1 text-xs text-neon-green">
            <Wifi className="w-3 h-3" /> Live
          </div>
        )}
      </div>

      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Price Chart — {selectedPair}</h3>
        <TradingChart
          height={300}
          showVolume
          showVWAP
          liveCandles={isLive && candles.length > 0 ? candles : undefined}
        />
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Footprint — Bid vs Ask Volume per Price Level</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            {isLive ? "Binance Live" : "Simulated"}
          </div>
        </div>
        <FootprintChart />
      </div>
    </div>
  );
}
