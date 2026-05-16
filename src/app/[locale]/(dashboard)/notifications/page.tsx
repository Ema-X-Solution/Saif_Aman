import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { NotificationsView } from "@/features/notifications/components/notifications-view";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export default function NotificationsPage({ params }: { params: { locale: string } }) {
  const messages = params.locale === "ar" ? (ar as any) : (en as any);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.notifications}>
        <NotificationsView />
      </DashboardShell>
    </AuthGate>
  );
}
