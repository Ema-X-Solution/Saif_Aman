import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { SchoolsView } from "@/features/schools/components/schools-view";

export default function SchoolsPage() {
  return (
    <AuthGate>
      <DashboardShell title="Schools">
        <SchoolsView />
      </DashboardShell>
    </AuthGate>
  );
}
