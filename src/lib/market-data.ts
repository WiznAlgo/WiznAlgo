export interface MarketPair {
  symbol: string;
  name: string;
  category: "crypto" | "forex" | "index" | "commodity";
}

export const PAIRS: MarketPair[] = [
  { symbol: "BTCUSD", name: "Bitcoin / USD", category: "crypto" },
  { symbol: "ETHUSD", name: "Ethereum / USD", category: "crypto" },
  { symbol: "XAUUSD", name: "Gold / USD", category: "commodity" },
  { symbol: "US30", name: "Dow Jones 30", category: "index" },
  { symbol: "NAS100", name: "Nasdaq 100", category: "index" },
  { symbol: "SPX500", name: "S&P 500", category: "index" },
  { symbol: "EURUSD", name: "EUR / USD", category: "forex" },
  { symbol: "GBPUSD", name: "GBP / USD", category: "forex" },
  { symbol: "USDJPY", name: "USD / JPY", category: "forex" },
];

export type Signal = "BUY" | "SELL" | "HOLD";
export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface AIPrediction {
  signal: Signal;
  confidence: number;
  reasons: string[];
  expectedMove: string;
  volatility: "Low" | "Medium" | "High";
  riskLevel: "Low" | "Medium" | "High";
  liquidityHeat: number;
  trend: "Bullish" | "Bearish" | "Neutral";
}

const BASE_PRICES: Record<string, number> = {
  BTCUSD: 67500,
  ETHUSD: 3450,
  XAUUSD: 2340,
  US30: 39200,
  NAS100: 18500,
  SPX500: 5200,
  EURUSD: 1.085,
  GBPUSD: 1.267,
  USDJPY: 154.5,
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateCandles(
  symbol: string,
  count: number,
  timeframe: Timeframe = "1h"
): CandleData[] {
  const basePrice = BASE_PRICES[symbol] ?? 100;
  const candles: CandleData[] = [];
  let price = basePrice;
  const now = Math.floor(Date.now() / 1000);
  const intervals: Record<Timeframe, number> = {
    "1m": 60,
    "5m": 300,
    "15m": 900,
    "1h": 3600,
    "4h": 14400,
    "1d": 86400,
  };
  const interval = intervals[timeframe];
  const volatilityFactor = basePrice > 1000 ? 0.003 : 0.001;

  for (let i = count; i > 0; i--) {
    const seed = now - i * interval + symbol.charCodeAt(0);
    const r = seededRandom(seed);
    const change = (r - 0.48) * basePrice * volatilityFactor;
    const open = price;
    price += change;
    const close = price;
    const high = Math.max(open, close) * (1 + r * 0.002);
    const low = Math.min(open, close) * (1 - r * 0.002);
    const volume = Math.floor(1000 + r * 9000);

    candles.push({
      time: now - i * interval,
      open: parseFloat(open.toFixed(basePrice > 100 ? 2 : 5)),
      high: parseFloat(high.toFixed(basePrice > 100 ? 2 : 5)),
      low: parseFloat(low.toFixed(basePrice > 100 ? 2 : 5)),
      close: parseFloat(close.toFixed(basePrice > 100 ? 2 : 5)),
      volume,
    });
  }
  return candles;
}

export function generatePrediction(symbol: string): AIPrediction {
  const seed = symbol.charCodeAt(0) + symbol.charCodeAt(symbol.length - 1) + Date.now() % 10000;
  const r = seededRandom(seed);
  const signals: Signal[] = ["BUY", "SELL", "HOLD"];
  const signal = signals[Math.floor(r * 3)];
  const confidence = Math.floor(60 + r * 35);

  const buyReasons = [
    "Strong buy imbalance detected",
    "Price above VWAP",
    "Bullish absorption at support",
    "Positive delta volume surge",
    "Smart money accumulation zone",
    "Liquidity sweep completed below lows",
  ];
  const sellReasons = [
    "Sell-side absorption at resistance",
    "Price below VWAP",
    "Bearish delta imbalance increasing",
    "Distribution pattern detected",
    "Liquidity grab above highs completed",
    "Order flow turning aggressive sellers",
  ];
  const holdReasons = [
    "Low volume consolidation",
    "Price at VWAP equilibrium",
    "No clear imbalance detected",
    "Awaiting liquidity sweep",
    "Market in balanced range",
    "Mixed order flow signals",
  ];

  const reasonPool = signal === "BUY" ? buyReasons : signal === "SELL" ? sellReasons : holdReasons;
  const reasons = reasonPool.slice(0, 3 + Math.floor(r * 2));

  const moves = signal === "BUY" ? ["+1.2%", "+2.4%", "+0.8%"] : signal === "SELL" ? ["-1.5%", "-2.1%", "-0.9%"] : ["+0.2%", "-0.1%", "+0.3%"];

  return {
    signal,
    confidence,
    reasons,
    expectedMove: moves[Math.floor(r * 3)],
    volatility: r > 0.66 ? "High" : r > 0.33 ? "Medium" : "Low",
    riskLevel: r > 0.66 ? "High" : r > 0.33 ? "Medium" : "Low",
    liquidityHeat: Math.floor(30 + r * 70),
    trend: signal === "BUY" ? "Bullish" : signal === "SELL" ? "Bearish" : "Neutral",
  };
}

export function generateTickerData() {
  return PAIRS.map((pair) => {
    const basePrice = BASE_PRICES[pair.symbol] ?? 100;
    const r = seededRandom(Date.now() % 10000 + pair.symbol.charCodeAt(0));
    const change = (r - 0.5) * 2;
    return {
      symbol: pair.symbol,
      price: basePrice * (1 + change * 0.01),
      change: parseFloat(change.toFixed(2)),
    };
  });
}

export interface VolumeProfileLevel {
  price: number;
  volume: number;
  type: "HVN" | "LVN" | "normal";
}

export function generateVolumeProfile(symbol: string, levels: number = 30): VolumeProfileLevel[] {
  const basePrice = BASE_PRICES[symbol] ?? 100;
  const range = basePrice * 0.03;
  const result: VolumeProfileLevel[] = [];

  for (let i = 0; i < levels; i++) {
    const price = basePrice - range + (i / levels) * range * 2;
    const seed = price * 1000 + symbol.charCodeAt(0);
    const r = seededRandom(seed);
    const volume = Math.floor(500 + r * 4500);
    result.push({
      price: parseFloat(price.toFixed(basePrice > 100 ? 2 : 5)),
      volume,
      type: volume > 3500 ? "HVN" : volume < 1000 ? "LVN" : "normal",
    });
  }
  return result;
}
