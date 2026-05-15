"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

export default function ConfidenceBar({ value, label = "Confidence" }: { value: number; label?: string }) {
  const color = value >= 75 ? "bg-neon-green" : value >= 50 ? "bg-neon-yellow" : "bg-neon-red";
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className={clsx(value >= 75 ? "text-neon-green" : value >= 50 ? "text-neon-yellow" : "text-neon-red")}>
          {value}%
        </span>
      </div>
      <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={clsx("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}
