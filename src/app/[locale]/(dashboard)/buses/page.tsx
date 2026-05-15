import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { BusesView } from "@/features/buses/components/buses-view";

export default function BusesPage() {
  return (
    <AuthGate>
      <DashboardShell title="Buses">
        <BusesView />
      </DashboardShell>
    </AuthGate>
  );
}
