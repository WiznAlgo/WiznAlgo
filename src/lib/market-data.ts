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
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: string;
  vwapBasis: string;
}

export interface SignalHistoryEntry {
  id: string;
  symbol: string;
  signal: Signal;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  openedAt: number;
  closedAt: number | null;
  result: "TP_HIT" | "SL_HIT" | "ACTIVE" | "EXPIRED";
  pnlPercent: number | null;
  reason: string;
}

export interface FootprintLevel {
  price: number;
  bidVolume: number;
  askVolume: number;
  delta: number;
  imbalance: boolean;
}

export interface BookmapLevel {
  price: number;
  bidDepth: number;
  askDepth: number;
  heat: number;
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

function formatPrice(value: number, symbol: string): number {
  const base = BASE_PRICES[symbol] ?? 100;
  return parseFloat(value.toFixed(base > 100 ? 2 : 5));
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

export function computeVWAP(candles: CandleData[]): { time: number; value: number }[] {
  let cumPV = 0;
  let cumVol = 0;
  return candles.map((c) => {
    const typical = (c.high + c.low + c.close) / 3;
    cumPV += typical * c.volume;
    cumVol += c.volume;
    return { time: c.time, value: parseFloat((cumPV / cumVol).toFixed(c.close > 100 ? 2 : 5)) };
  });
}

export function computeVWAPBands(candles: CandleData[]): {
  upper2: { time: number; value: number }[];
  upper1: { time: number; value: number }[];
  vwap: { time: number; value: number }[];
  lower1: { time: number; value: number }[];
  lower2: { time: number; value: number }[];
} {
  const vwapData = computeVWAP(candles);
  let cumPV = 0;
  let cumVol = 0;
  let cumSqDev = 0;

  const upper2: { time: number; value: number }[] = [];
  const upper1: { time: number; value: number }[] = [];
  const lower1: { time: number; value: number }[] = [];
  const lower2: { time: number; value: number }[] = [];

  candles.forEach((c) => {
    const typical = (c.high + c.low + c.close) / 3;
    cumPV += typical * c.volume;
    cumVol += c.volume;
    const vwap = cumPV / cumVol;
    cumSqDev += c.volume * Math.pow(typical - vwap, 2);
    const variance = cumSqDev / cumVol;
    const stdDev = Math.sqrt(variance);
    const dec = c.close > 100 ? 2 : 5;

    upper2.push({ time: c.time, value: parseFloat((vwap + 2 * stdDev).toFixed(dec)) });
    upper1.push({ time: c.time, value: parseFloat((vwap + stdDev).toFixed(dec)) });
    lower1.push({ time: c.time, value: parseFloat((vwap - stdDev).toFixed(dec)) });
    lower2.push({ time: c.time, value: parseFloat((vwap - 2 * stdDev).toFixed(dec)) });
  });

  return { upper2, upper1, vwap: vwapData, lower1, lower2 };
}

export function generatePrediction(symbol: string): AIPrediction {
  const seed = symbol.charCodeAt(0) + symbol.charCodeAt(symbol.length - 1) + Date.now() % 10000;
  const r = seededRandom(seed);
  const signals: Signal[] = ["BUY", "SELL", "HOLD"];
  const signal = signals[Math.floor(r * 3)];
  const confidence = Math.floor(60 + r * 35);
  const basePrice = BASE_PRICES[symbol] ?? 100;
  const currentPrice = basePrice * (1 + (r - 0.5) * 0.01);

  const buyReasons = [
    "Strong buy imbalance detected — aggressive buyers dominate order flow with +32% delta",
    "Price trading above VWAP (+0.8% deviation) — institutional bias remains bullish",
    "Bullish absorption at support — 2.4x volume absorbed at key HVN level",
    "Positive delta volume surge — cumulative delta shifted +450K in last 4 candles",
    "Smart money accumulation — large limit orders detected at discount zone below VWAP -1σ",
    "Liquidity sweep completed below previous lows — stop hunt followed by aggressive buying",
    "Fair Value Gap identified below — price expected to hold above FVG as support",
    "Break of Structure (BOS) confirmed — higher high established with momentum",
  ];
  const sellReasons = [
    "Sell-side absorption at resistance — 3.1x volume absorbed without price advance",
    "Price trading below VWAP (-1.2% deviation) — institutional bias shifting bearish",
    "Bearish delta imbalance — aggressive sellers dominate with -28% net delta",
    "Distribution pattern detected — large iceberg orders at premium zone above VWAP +2σ",
    "Liquidity grab above highs completed — stop hunt confirmed, reversal expected",
    "Order flow turning aggressive sellers — bid stack diminishing rapidly",
    "CHoCH (Change of Character) detected — market structure shifting from bullish to bearish",
    "Order block rejection — price rejected from bearish OB with strong selling pressure",
  ];
  const holdReasons = [
    "Low volume consolidation — no significant order flow imbalance detected",
    "Price at VWAP equilibrium — oscillating within ±0.2% of fair value",
    "No clear delta imbalance — buyers and sellers balanced within 5% margin",
    "Awaiting liquidity sweep — stop clusters building above and below range",
    "Market in balanced range — volume profile shows symmetric distribution around POC",
    "Mixed order flow signals — absorption detected on both sides equally",
  ];

  const reasonPool = signal === "BUY" ? buyReasons : signal === "SELL" ? sellReasons : holdReasons;
  const reasons = reasonPool.slice(0, 3 + Math.floor(r * 3));

  const moves = signal === "BUY" ? ["+1.2%", "+2.4%", "+0.8%"] : signal === "SELL" ? ["-1.5%", "-2.1%", "-0.9%"] : ["+0.2%", "-0.1%", "+0.3%"];

  const slMultiplier = signal === "BUY" ? (1 - (0.005 + r * 0.01)) : (1 + (0.005 + r * 0.01));
  const tpMultiplier = signal === "BUY" ? (1 + (0.01 + r * 0.025)) : (1 - (0.01 + r * 0.025));
  const stopLoss = signal === "HOLD" ? currentPrice * (1 - 0.005) : currentPrice * slMultiplier;
  const takeProfit = signal === "HOLD" ? currentPrice * (1 + 0.005) : currentPrice * tpMultiplier;

  const slDist = Math.abs(currentPrice - stopLoss);
  const tpDist = Math.abs(takeProfit - currentPrice);
  const rrRatio = slDist > 0 ? (tpDist / slDist).toFixed(1) : "0";

  const vwapBases = signal === "BUY"
    ? ["TP at VWAP +2σ band", "TP at upper VWAP deviation", "TP near VWAP +1.5σ"]
    : signal === "SELL"
    ? ["TP at VWAP -2σ band", "TP at lower VWAP deviation", "TP near VWAP -1.5σ"]
    : ["Range-bound within VWAP bands"];

  return {
    signal,
    confidence,
    reasons,
    expectedMove: moves[Math.floor(r * 3)],
    volatility: r > 0.66 ? "High" : r > 0.33 ? "Medium" : "Low",
    riskLevel: r > 0.66 ? "High" : r > 0.33 ? "Medium" : "Low",
    liquidityHeat: Math.floor(30 + r * 70),
    trend: signal === "BUY" ? "Bullish" : signal === "SELL" ? "Bearish" : "Neutral",
    entryPrice: formatPrice(currentPrice, symbol),
    stopLoss: formatPrice(stopLoss, symbol),
    takeProfit: formatPrice(takeProfit, symbol),
    riskRewardRatio: `${rrRatio}:1`,
    vwapBasis: vwapBases[Math.floor(r * vwapBases.length)],
  };
}

export function generateSignalHistory(symbol: string): SignalHistoryEntry[] {
  const base = BASE_PRICES[symbol] ?? 100;
  const history: SignalHistoryEntry[] = [];
  const now = Date.now();

  for (let i = 0; i < 20; i++) {
    const seed = symbol.charCodeAt(0) * 1000 + i * 137;
    const r = seededRandom(seed);
    const r2 = seededRandom(seed + 77);
    const signal: Signal = r > 0.6 ? "BUY" : r > 0.3 ? "SELL" : "HOLD";
    if (signal === "HOLD") continue;

    const entry = base * (1 + (r - 0.5) * 0.02);
    const slDist = base * (0.005 + r2 * 0.008);
    const tpDist = slDist * (1.5 + r2 * 2);

    const sl = signal === "BUY" ? entry - slDist : entry + slDist;
    const tp = signal === "BUY" ? entry + tpDist : entry - tpDist;

    const isActive = i < 2;
    const hitTp = r2 > 0.4;
    const result = isActive ? "ACTIVE" as const : hitTp ? "TP_HIT" as const : "SL_HIT" as const;
    const pnl = isActive ? null : hitTp ? parseFloat(((tpDist / entry) * 100).toFixed(2)) : parseFloat(((-slDist / entry) * 100).toFixed(2));

    const buyReasonOptions = [
      "Buy imbalance + VWAP support confluence",
      "Bullish absorption at HVN + BOS confirmed",
      "Smart money accumulation below VWAP -1σ",
      "FVG support + positive delta surge",
    ];
    const sellReasonOptions = [
      "Sell absorption at resistance + CHoCH detected",
      "Distribution at VWAP +2σ + negative delta",
      "Liquidity grab above highs + OB rejection",
      "Bearish imbalance at premium zone",
    ];

    history.push({
      id: `${symbol}-${i}`,
      symbol,
      signal,
      entryPrice: formatPrice(entry, symbol),
      stopLoss: formatPrice(sl, symbol),
      takeProfit: formatPrice(tp, symbol),
      confidence: Math.floor(60 + r * 35),
      openedAt: now - (i + 1) * 3600000 * (2 + Math.floor(r * 8)),
      closedAt: isActive ? null : now - i * 3600000 * (1 + Math.floor(r2 * 4)),
      result,
      pnlPercent: pnl,
      reason: signal === "BUY"
        ? buyReasonOptions[Math.floor(r2 * buyReasonOptions.length)]
        : sellReasonOptions[Math.floor(r2 * sellReasonOptions.length)],
    });
  }
  return history;
}

export function calculateWinRate(history: SignalHistoryEntry[]): {
  total: number;
  wins: number;
  losses: number;
  active: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
} {
  const closed = history.filter((h) => h.result !== "ACTIVE");
  const wins = closed.filter((h) => h.result === "TP_HIT");
  const losses = closed.filter((h) => h.result === "SL_HIT");
  const active = history.filter((h) => h.result === "ACTIVE");

  const avgWin = wins.length > 0 ? wins.reduce((s, h) => s + (h.pnlPercent ?? 0), 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((s, h) => s + (h.pnlPercent ?? 0), 0) / losses.length) : 0;
  const totalWin = wins.reduce((s, h) => s + (h.pnlPercent ?? 0), 0);
  const totalLoss = Math.abs(losses.reduce((s, h) => s + (h.pnlPercent ?? 0), 0));

  return {
    total: closed.length,
    wins: wins.length,
    losses: losses.length,
    active: active.length,
    winRate: closed.length > 0 ? parseFloat(((wins.length / closed.length) * 100).toFixed(1)) : 0,
    avgWin: parseFloat(avgWin.toFixed(2)),
    avgLoss: parseFloat(avgLoss.toFixed(2)),
    profitFactor: totalLoss > 0 ? parseFloat((totalWin / totalLoss).toFixed(2)) : 0,
  };
}

export function generateFootprintData(symbol: string): FootprintLevel[] {
  const base = BASE_PRICES[symbol] ?? 100;
  const levels: FootprintLevel[] = [];
  const step = base > 1000 ? base * 0.001 : base * 0.0005;

  for (let i = -15; i <= 15; i++) {
    const price = base + i * step;
    const seed = price * 100 + symbol.charCodeAt(0);
    const r = seededRandom(seed);
    const r2 = seededRandom(seed + 42);
    const bidVol = Math.floor(200 + r * 2000);
    const askVol = Math.floor(200 + r2 * 2000);
    const delta = askVol - bidVol;
    const imbalance = Math.abs(delta) > (bidVol + askVol) * 0.3;

    levels.push({
      price: formatPrice(price, symbol),
      bidVolume: bidVol,
      askVolume: askVol,
      delta,
      imbalance,
    });
  }
  return levels;
}

export function generateBookmapData(symbol: string): BookmapLevel[] {
  const base = BASE_PRICES[symbol] ?? 100;
  const levels: BookmapLevel[] = [];
  const step = base > 1000 ? base * 0.0005 : base * 0.0002;

  for (let i = -25; i <= 25; i++) {
    const price = base + i * step;
    const seed = price * 200 + symbol.charCodeAt(1);
    const r = seededRandom(seed);
    const r2 = seededRandom(seed + 99);
    const isCluster = Math.abs(i) < 5 || (Math.abs(i) > 15 && Math.abs(i) < 20);
    const multiplier = isCluster ? 3 : 1;

    levels.push({
      price: formatPrice(price, symbol),
      bidDepth: Math.floor((100 + r * 900) * multiplier),
      askDepth: Math.floor((100 + r2 * 900) * multiplier),
      heat: parseFloat((r * multiplier * 0.4).toFixed(2)),
    });
  }
  return levels;
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
