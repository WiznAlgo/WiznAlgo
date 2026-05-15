"use client";

import Link from "next/link";
import { Activity } from "lucide-react";

const links = {
  Platform: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "AI Predictions", href: "/predictions" },
    { label: "AI Signals", href: "/signals" },
    { label: "Strategy", href: "/strategy" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Legal", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-neon-blue/10 bg-dark-900 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <Activity className="w-6 h-6 text-neon-blue" />
              WiznAlgo
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Institutional-grade market analysis powered by AI. Real-time order flow, smart money detection, and predictive analytics.
            </p>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-gray-500 hover:text-neon-blue transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-neon-blue/10 mt-12 pt-8 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Market Analysis WiznAlgo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
