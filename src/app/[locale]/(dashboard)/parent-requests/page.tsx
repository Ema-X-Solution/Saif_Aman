import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { ParentRequestsView } from "@/features/parent-requests/components/parent-requests-view";

export default function ParentRequestsPage() {
  return (
    <AuthGate>
      <DashboardShell title="Parent Requests">
        <ParentRequestsView />
      </DashboardShell>
    </AuthGate>
  );
}
