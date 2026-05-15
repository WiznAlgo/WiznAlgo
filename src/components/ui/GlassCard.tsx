"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "blue" | "purple" | "green" | "red";
}

export default function GlassCard({ children, className, hover = false, glow }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      className={clsx(
        "glass-card p-5",
        glow === "blue" && "glow-blue",
        glow === "purple" && "glow-purple",
        glow === "green" && "glow-green",
        glow === "red" && "glow-red",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
