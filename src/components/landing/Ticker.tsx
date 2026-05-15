"use client";

import { useEffect, useState } from "react";
import { generateTickerData } from "@/lib/market-data";
import { clsx } from "clsx";

export default function Ticker() {
  const [data, setData] = useState(generateTickerData());

  useEffect(() => {
    const id = setInterval(() => setData(generateTickerData()), 3000);
    return () => clearInterval(id);
  }, []);

  const items = [...data, ...data];

  return (
    <div className="w-full overflow-hidden border-y border-neon-blue/10 bg-dark-900/80 backdrop-blur">
      <div className="animate-ticker flex whitespace-nowrap py-2">
        {items.map((t, i) => (
          <div key={i} className="inline-flex items-center gap-2 px-6 text-sm">
            <span className="font-semibold text-white">{t.symbol}</span>
            <span className="text-gray-400">{t.price.toFixed(t.price > 100 ? 2 : 5)}</span>
            <span className={clsx("font-mono text-xs", t.change >= 0 ? "text-neon-green" : "text-neon-red")}>
              {t.change >= 0 ? "+" : ""}
              {t.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
