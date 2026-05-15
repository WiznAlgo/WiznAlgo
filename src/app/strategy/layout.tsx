import DashboardShell from "@/components/dashboard/DashboardShell";

export default function StrategyLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
