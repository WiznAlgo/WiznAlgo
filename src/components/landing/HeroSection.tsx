"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Activity, Brain, BarChart3, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, -50, 0], y: [0, -80, 60, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neon-blue/5 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -70, 80, 0], y: [0, 60, -40, 0], scale: [1, 0.8, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-purple/5 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 50, -30, 0], y: [0, -30, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-neon-green/3 blur-[100px]"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-neon-blue/20 bg-neon-blue/5 text-neon-blue text-sm">
            <Activity className="w-4 h-4" />
            <span>AI-Powered Market Intelligence</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
        >
          <span className="text-gradient">Institutional Grade</span>
          <br />
          <span className="text-white">Market Analysis</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          AI-powered order flow and smart money analytics.
          Real-time institutional-level market intelligence for professional traders.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all duration-300"
          >
            <Zap className="w-5 h-5" />
            Launch Dashboard
          </Link>
          <Link
            href="/predictions"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-neon-blue/30 text-neon-blue rounded-xl hover:bg-neon-blue/10 transition-all duration-300"
          >
            <Brain className="w-5 h-5" />
            AI Predictions
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto"
        >
          {[
            { label: "Markets Analyzed", value: "150+", icon: BarChart3 },
            { label: "AI Accuracy", value: "89.4%", icon: Brain },
            { label: "Signals / Day", value: "2,400+", icon: Activity },
            { label: "Latency", value: "<50ms", icon: Zap },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <stat.icon className="w-5 h-5 text-neon-blue mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
