import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { SchoolsPageClient } from "@/features/schools/components/schools-page-client";
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
        <SchoolsPageClient />
      </DashboardShell>
    </AuthGate>
  );
}
