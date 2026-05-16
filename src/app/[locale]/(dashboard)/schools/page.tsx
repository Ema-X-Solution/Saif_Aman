import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { SchoolsView } from "@/features/schools/components/schools-view";
import { getMessages } from "@/lib/locale-messages";

export default async function SchoolsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.schools}>
        <SchoolsView />
      </DashboardShell>
    </AuthGate>
  );
}
