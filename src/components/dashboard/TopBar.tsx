"use client";

import { useMarketStore } from "@/store/market-store";
import { PAIRS, type Timeframe } from "@/lib/market-data";
import { clsx } from "clsx";
import { Bell, Search, Settings, Maximize } from "lucide-react";

const timeframes: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1d"];

export default function TopBar() {
  const { selectedPair, selectedTimeframe, setSelectedPair, setSelectedTimeframe, sidebarOpen } = useMarketStore();

  return (
    <header
      className={clsx(
        "fixed top-0 right-0 z-30 h-14 flex items-center justify-between px-4 glass border-b border-neon-blue/10 transition-all duration-300",
        sidebarOpen ? "left-56" : "left-16"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Pair selector */}
        <select
          value={selectedPair}
          onChange={(e) => setSelectedPair(e.target.value)}
          className="bg-dark-700 border border-neon-blue/20 text-white px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:border-neon-blue/40"
        >
          {PAIRS.map((p) => (
            <option key={p.symbol} value={p.symbol}>
              {p.symbol}
            </option>
          ))}
        </select>

        {/* Timeframe selector */}
        <div className="hidden sm:flex items-center gap-1 bg-dark-700 rounded-lg p-0.5">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={clsx(
                "px-3 py-1 rounded-md text-xs font-medium transition-all",
                selectedTimeframe === tf
                  ? "bg-neon-blue/20 text-neon-blue"
                  : "text-gray-500 hover:text-white"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 text-gray-500 hover:text-white transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-500 hover:text-white transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-neon-red rounded-full" />
        </button>
        <button className="p-2 text-gray-500 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-500 hover:text-white transition-colors">
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
