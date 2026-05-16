import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { ParentRequestsView } from "@/features/parent-requests/components/parent-requests-view";
import { getMessages } from "@/lib/locale-messages";

export default async function ParentRequestsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.parentRequests}>
        <ParentRequestsView />
      </DashboardShell>
    </AuthGate>
  );
}
