"use client";

import { clsx } from "clsx";
import type { Signal } from "@/lib/market-data";

export default function SignalBadge({ signal, size = "md" }: { signal: Signal; size?: "sm" | "md" | "lg" }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center font-bold rounded-md uppercase tracking-wider",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        size === "lg" && "px-4 py-1.5 text-base",
        signal === "BUY" && "bg-neon-green/15 text-neon-green border border-neon-green/30",
        signal === "SELL" && "bg-neon-red/15 text-neon-red border border-neon-red/30",
        signal === "HOLD" && "bg-neon-yellow/15 text-neon-yellow border border-neon-yellow/30"
      )}
    >
      {signal}
    </span>
  );
}
