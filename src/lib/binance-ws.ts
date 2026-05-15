"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { CandleData, Timeframe } from "./market-data";

const BINANCE_WS = "wss://stream.binance.com:9443/ws";

const SYMBOL_MAP: Record<string, string> = {
  BTCUSD: "btcusdt",
  ETHUSD: "ethusdt",
};

const TF_MAP: Record<Timeframe, string> = {
  "1m": "1m",
  "5m": "5m",
  "15m": "15m",
  "1h": "1h",
  "4h": "4h",
  "1d": "1d",
};

export function isBinanceSupported(symbol: string): boolean {
  return symbol in SYMBOL_MAP;
}

export function getBinanceSymbol(symbol: string): string | null {
  return SYMBOL_MAP[symbol] ?? null;
}

interface BinanceKline {
  t: number; // open time
  o: string; // open
  h: string; // high
  l: string; // low
  c: string; // close
  v: string; // volume
  x: boolean; // is closed
}

interface BinanceKlineMsg {
  e: string;
  k: BinanceKline;
}

export async function fetchKlines(
  symbol: string,
  timeframe: Timeframe,
  limit = 200
): Promise<CandleData[]> {
  const binSymbol = SYMBOL_MAP[symbol];
  if (!binSymbol) return [];

  const url = `https://api.binance.com/api/v3/klines?symbol=${binSymbol.toUpperCase()}&interval=${TF_MAP[timeframe]}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data: (string | number)[][] = await res.json();

  return data.map((k) => ({
    time: Math.floor((k[0] as number) / 1000),
    open: parseFloat(k[1] as string),
    high: parseFloat(k[2] as string),
    low: parseFloat(k[3] as string),
    close: parseFloat(k[4] as string),
    volume: parseFloat(k[5] as string),
  }));
}

export function useBinanceKline(symbol: string, timeframe: Timeframe) {
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [connected, setConnected] = useState(false);
  const [price, setPrice] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const candlesRef = useRef<CandleData[]>([]);

  const binSymbol = SYMBOL_MAP[symbol];
  const supported = !!binSymbol;

  useEffect(() => {
    if (!supported) return;

    let cancelled = false;

    fetchKlines(symbol, timeframe).then((history) => {
      if (cancelled) return;
      candlesRef.current = history;
      setCandles(history);
      if (history.length > 0) {
        setPrice(history[history.length - 1].close);
      }
    });

    const stream = `${binSymbol}@kline_${TF_MAP[timeframe]}`;
    const ws = new WebSocket(`${BINANCE_WS}/${stream}`);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!cancelled) setConnected(true);
    };

    ws.onmessage = (ev) => {
      if (cancelled) return;
      try {
        const msg: BinanceKlineMsg = JSON.parse(ev.data);
        if (msg.e !== "kline") return;
        const k = msg.k;
        const candle: CandleData = {
          time: Math.floor(k.t / 1000),
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
          volume: parseFloat(k.v),
        };

        setPrice(candle.close);

        const arr = [...candlesRef.current];
        const last = arr[arr.length - 1];
        if (last && last.time === candle.time) {
          arr[arr.length - 1] = candle;
        } else {
          arr.push(candle);
          if (arr.length > 500) arr.shift();
        }
        candlesRef.current = arr;
        setCandles(arr);
      } catch {
        // ignore parse errors
      }
    };

    ws.onclose = () => {
      if (!cancelled) setConnected(false);
    };

    ws.onerror = () => {
      if (!cancelled) setConnected(false);
    };

    return () => {
      cancelled = true;
      ws.close();
      wsRef.current = null;
    };
  }, [symbol, timeframe, binSymbol, supported]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
  }, []);

  return { candles, connected, price, supported, disconnect };
}
