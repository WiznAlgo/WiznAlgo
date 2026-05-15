"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import AIPanel from "@/components/dashboard/AIPanel";
import SignalNotifier from "@/components/SignalNotifier";
import { useMarketStore } from "@/store/market-store";
import { clsx } from "clsx";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, aiPanelOpen } = useMarketStore();

  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar />
      <TopBar />
      <AIPanel />
      <SignalNotifier />
      <main
        className={clsx(
          "pt-14 transition-all duration-300",
          sidebarOpen ? "ml-56" : "ml-16",
          aiPanelOpen ? "mr-72" : "mr-0"
        )}
      >
        {children}
      </main>
    </div>
  );
}
