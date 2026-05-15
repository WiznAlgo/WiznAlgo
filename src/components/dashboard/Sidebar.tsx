"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useMarketStore } from "@/store/market-store";
import {
  Activity, LayoutDashboard, BarChart3, Brain,
  BookOpen, ChevronLeft, ChevronRight, Footprints,
  Map, History, Settings,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/predictions", icon: Brain, label: "AI Predictions" },
  { href: "/signals", icon: BarChart3, label: "AI Signals" },
  { href: "/history", icon: History, label: "Signal History" },
  { href: "/footprint", icon: Footprints, label: "Footprint" },
  { href: "/bookmap", icon: Map, label: "Bookmap" },
  { href: "/orderflow", icon: Activity, label: "Order Flow" },
  { href: "/strategy", icon: BookOpen, label: "Strategy" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useMarketStore();

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-dark-800 border-r border-neon-blue/10 transition-all duration-300",
        sidebarOpen ? "w-56" : "w-16"
      )}
    >
      <div className="flex items-center gap-2 p-4 border-b border-neon-blue/10">
        <Activity className="w-6 h-6 text-neon-blue shrink-0" />
        {sidebarOpen && <span className="font-bold text-white text-sm">WiznAlgo</span>}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                active
                  ? "bg-neon-blue/10 text-neon-blue"
                  : "text-gray-400 hover:text-white hover:bg-dark-600"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={toggleSidebar}
        className="p-3 border-t border-neon-blue/10 text-gray-500 hover:text-white transition-colors"
      >
        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>
    </aside>
  );
}
