import { create } from "zustand";
import type { Timeframe, Signal } from "@/lib/market-data";

interface MarketState {
  selectedPair: string;
  selectedTimeframe: Timeframe;
  sidebarOpen: boolean;
  aiPanelOpen: boolean;
  watchlist: string[];
  setSelectedPair: (pair: string) => void;
  setSelectedTimeframe: (tf: Timeframe) => void;
  toggleSidebar: () => void;
  toggleAiPanel: () => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  selectedPair: "BTCUSD",
  selectedTimeframe: "1h",
  sidebarOpen: true,
  aiPanelOpen: true,
  watchlist: ["BTCUSD", "ETHUSD", "XAUUSD", "SPX500", "NAS100"],
  setSelectedPair: (pair) => set({ selectedPair: pair }),
  setSelectedTimeframe: (tf) => set({ selectedTimeframe: tf }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleAiPanel: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen })),
  addToWatchlist: (symbol) =>
    set((s) => ({
      watchlist: s.watchlist.includes(symbol) ? s.watchlist : [...s.watchlist, symbol],
    })),
  removeFromWatchlist: (symbol) =>
    set((s) => ({ watchlist: s.watchlist.filter((w) => w !== symbol) })),
}));

export type { Signal, Timeframe };
