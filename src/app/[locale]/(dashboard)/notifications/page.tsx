import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { NotificationsView } from "@/features/notifications/components/notifications-view";

export default function NotificationsPage() {
  return (
    <AuthGate>
      <DashboardShell title="Notifications">
        <NotificationsView />
      </DashboardShell>
    </AuthGate>
  );
}
