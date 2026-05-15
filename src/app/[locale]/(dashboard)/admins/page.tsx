import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { AdminsView } from "@/features/admins/components/admins-view";

export default function AdminsPage() {
  return (
    <AuthGate>
      <DashboardShell title="Admins">
        <AdminsView />
      </DashboardShell>
    </AuthGate>
  );
}
