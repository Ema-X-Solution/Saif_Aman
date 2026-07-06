import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { SendNotificationView } from "@/features/notifications/components/send-notification-view";
import { getMessages } from "@/lib/locale-messages";

export default async function SendNotificationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.sendNotification}>
        <SendNotificationView />
      </DashboardShell>
    </AuthGate>
  );
}
