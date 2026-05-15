import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { DashboardHomeView } from "@/features/dashboard/components/dashboard-home-view";

export default function DashboardPage() {
  return (
    <AuthGate>
      <DashboardShell title="Dashboard">
        <DashboardHomeView />
      </DashboardShell>
    </AuthGate>
  );
}
