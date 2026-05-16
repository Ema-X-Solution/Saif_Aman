import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { ReportsView } from "@/features/reports/components/reports-view";
import { getMessages } from "@/lib/locale-messages";

export default async function ReportsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.reports}>
        <ReportsView />
      </DashboardShell>
    </AuthGate>
  );
}
