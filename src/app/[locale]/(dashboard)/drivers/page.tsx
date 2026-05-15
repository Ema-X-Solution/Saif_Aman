import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { DriversView } from "@/features/drivers/components/drivers-view";

export default function DriversPage() {
  return (
    <AuthGate>
      <DashboardShell title="Drivers">
        <DriversView />
      </DashboardShell>
    </AuthGate>
  );
}
