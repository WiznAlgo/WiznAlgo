"use client";

import { useMarketStore } from "@/store/market-store";
import OrderFlowChart from "@/components/charts/OrderFlowChart";
import TradingChart from "@/components/charts/TradingChart";
import { Activity } from "lucide-react";

export default function OrderFlowPage() {
  const { selectedPair } = useMarketStore();

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Activity className="w-6 h-6 text-neon-blue" />
        <h1 className="text-2xl font-bold text-white">Order Flow</h1>
        <span className="text-sm text-gray-500">{selectedPair}</span>
      </div>

      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Price Chart — {selectedPair}</h3>
        <TradingChart height={300} showVolume showVWAP />
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Order Flow — Buy/Sell Pressure & Delta Analysis</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
            Live Data
          </div>
        </div>
        <OrderFlowChart />
      </div>
    </div>
  );
}
