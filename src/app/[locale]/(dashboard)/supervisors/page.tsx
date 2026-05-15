import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { SupervisorsView } from "@/features/supervisors/components/supervisors-view";

export default function SupervisorsPage() {
  return (
    <AuthGate>
      <DashboardShell title="Supervisors">
        <SupervisorsView />
      </DashboardShell>
    </AuthGate>
  );
}
