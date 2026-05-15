"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "AI Technology", href: "#ai-technology" },
  { label: "Pricing", href: "#pricing" },
  { label: "Strategy", href: "/strategy" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
          <Activity className="w-6 h-6 text-neon-blue" />
          <span>WiznAlgo</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link key={l.label} href={l.href} className="text-sm text-gray-400 hover:text-neon-blue transition-colors">
              {l.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="px-5 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all"
          >
            Launch App
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-neon-blue/10"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-gray-400 hover:text-neon-blue transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold rounded-lg"
              >
                Launch App
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
