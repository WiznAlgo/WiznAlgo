"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    features: ["5 Market Pairs", "Basic AI Signals", "1h+ Timeframes", "Email Alerts", "Community Access"],
    highlight: false,
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    features: [
      "All Market Pairs",
      "Advanced AI Predictions",
      "All Timeframes",
      "Order Flow Analysis",
      "VWAP & Volume Profile",
      "Smart Money Detection",
      "Real-time WebSocket",
      "Priority Support",
    ],
    highlight: true,
  },
  {
    name: "Institutional",
    price: "$499",
    period: "/month",
    features: [
      "Everything in Pro",
      "Custom AI Models",
      "API Access",
      "White-label Option",
      "Dedicated Infrastructure",
      "Custom Integrations",
      "24/7 Support",
      "Strategy Consulting",
    ],
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-24 px-6" id="pricing">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient">Pricing</span> Plans
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your trading needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className={`glass-card p-6 flex flex-col ${
                plan.highlight ? "border-neon-blue/40 glow-blue ring-1 ring-neon-blue/20" : ""
              }`}
            >
              {plan.highlight && (
                <div className="text-xs font-bold text-neon-blue uppercase tracking-wider mb-2">Most Popular</div>
              )}
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <div className="flex items-end gap-1 mt-4 mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-500 mb-1">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-neon-green shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className={`block text-center py-3 rounded-lg font-semibold transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                    : "border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10"
                }`}
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
