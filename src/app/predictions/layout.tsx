import DashboardShell from "@/components/dashboard/DashboardShell";

export default function PredictionsLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
