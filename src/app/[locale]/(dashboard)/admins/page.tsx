import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { AdminsView } from "@/features/admins/components/admins-view";
import { getMessages } from "@/lib/locale-messages";

export default async function AdminsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.admins}>
        <AdminsView />
      </DashboardShell>
    </AuthGate>
  );
}
