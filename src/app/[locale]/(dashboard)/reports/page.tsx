import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { ReportsView } from "@/features/reports/components/reports-view";

export default function ReportsPage() {
  return (
    <AuthGate>
      <DashboardShell title="Reports">
        <ReportsView />
      </DashboardShell>
    </AuthGate>
  );
}
