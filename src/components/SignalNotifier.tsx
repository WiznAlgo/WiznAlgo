"use client";

import { useEffect, useRef } from "react";
import { PAIRS, generatePrediction, type AIPrediction } from "@/lib/market-data";

function getStored(key: string): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(key) ?? "";
}

function formatSignalMessage(symbol: string, pred: AIPrediction): string {
  const emoji = pred.signal === "BUY" ? "\u{1F7E2}" : pred.signal === "SELL" ? "\u{1F534}" : "\u{1F7E1}";
  const lines = [
    `${emoji} <b>${pred.signal} Signal — ${symbol}</b>`,
    "",
    `<b>Confidence:</b> ${pred.confidence}%`,
    `<b>Entry:</b> ${pred.entryPrice}`,
    `<b>Stop Loss:</b> ${pred.stopLoss}`,
    `<b>Take Profit:</b> ${pred.takeProfit}`,
    `<b>R:R:</b> ${pred.riskRewardRatio}`,
    `<b>VWAP:</b> ${pred.vwapBasis}`,
    `<b>Expected Move:</b> ${pred.expectedMove}`,
    `<b>Risk:</b> ${pred.riskLevel} | <b>Volatility:</b> ${pred.volatility}`,
    "",
    `<b>Reasoning:</b>`,
    ...pred.reasons.map((r) => `• ${r}`),
    "",
    `<i>📊 WiznAlgo AI Signal</i>`,
  ];
  return lines.join("\n");
}

async function sendTelegram(botToken: string, chatId: string, message: string) {
  try {
    await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ botToken, chatId, message }),
    });
  } catch {
    // silently fail
  }
}

export default function SignalNotifier() {
  const prevSignals = useRef<Record<string, string>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const enabled = getStored("tg_notif_enabled") === "true";
      const botToken = getStored("tg_bot_token");
      const chatId = getStored("tg_chat_id");

      if (!enabled || !botToken || !chatId) return;

      const cryptoPairs = PAIRS.filter((p) => p.category === "crypto");

      for (const pair of cryptoPairs) {
        const pred = generatePrediction(pair.symbol);
        if (pred.signal === "HOLD") continue;

        const key = `${pair.symbol}-${pred.signal}`;
        const prevKey = prevSignals.current[pair.symbol];

        if (prevKey !== key && pred.confidence >= 70) {
          prevSignals.current[pair.symbol] = key;
          const msg = formatSignalMessage(pair.symbol, pred);
          sendTelegram(botToken, chatId, msg);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
