import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { NotificationsView } from "@/features/notifications/components/notifications-view";
import { getMessages } from "@/lib/locale-messages";

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.notifications}>
        <NotificationsView />
      </DashboardShell>
    </AuthGate>
  );
}
