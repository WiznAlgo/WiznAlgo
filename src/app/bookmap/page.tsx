"use client";

import { useMarketStore } from "@/store/market-store";
import BookmapChart from "@/components/charts/BookmapChart";
import TradingChart from "@/components/charts/TradingChart";
import { Map } from "lucide-react";

export default function BookmapPage() {
  const { selectedPair } = useMarketStore();

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Map className="w-6 h-6 text-neon-purple" />
        <h1 className="text-2xl font-bold text-white">Bookmap</h1>
        <span className="text-sm text-gray-500">{selectedPair}</span>
      </div>

      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Price Chart — {selectedPair}</h3>
        <TradingChart height={300} showVolume showVWAP />
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Bookmap — Order Book Depth Heatmap</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" />
            Live Data
          </div>
        </div>
        <BookmapChart />
      </div>
    </div>
  );
}
