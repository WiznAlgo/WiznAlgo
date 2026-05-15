import DashboardShell from "@/components/dashboard/DashboardShell";

export default function AnalysisLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
