import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { AreasView } from "@/features/areas/components/areas-view";

export default function AreasPage() {
  return (
    <AuthGate>
      <DashboardShell title="Areas">
        <AreasView />
      </DashboardShell>
    </AuthGate>
  );
}
