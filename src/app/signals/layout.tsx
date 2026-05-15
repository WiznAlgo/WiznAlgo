import DashboardShell from "@/components/dashboard/DashboardShell";

export default function SignalsLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
