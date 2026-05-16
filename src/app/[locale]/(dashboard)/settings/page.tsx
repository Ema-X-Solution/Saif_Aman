import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { SettingsView } from "@/features/settings/components/settings-view";
import { getMessages } from "@/lib/locale-messages";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.settings}>
        <SettingsView />
      </DashboardShell>
    </AuthGate>
  );
}
