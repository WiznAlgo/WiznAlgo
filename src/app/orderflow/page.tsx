"use client";

import { useMarketStore } from "@/store/market-store";
import OrderFlowChart from "@/components/charts/OrderFlowChart";
import TradingChart from "@/components/charts/TradingChart";
import { isBinanceSupported, useBinanceKline } from "@/lib/binance-ws";
import { Activity, Wifi } from "lucide-react";

export default function OrderFlowPage() {
  const { selectedPair, selectedTimeframe } = useMarketStore();
  const isLive = isBinanceSupported(selectedPair);
  const { candles, connected } = useBinanceKline(selectedPair, selectedTimeframe);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Activity className="w-6 h-6 text-neon-blue" />
        <h1 className="text-2xl font-bold text-white">Order Flow</h1>
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
          <h3 className="text-sm font-semibold text-white">Order Flow — Buy/Sell Pressure & Delta Analysis</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
            {isLive ? "Binance Live" : "Simulated"}
          </div>
        </div>
        <OrderFlowChart />
      </div>
    </div>
  );
}
