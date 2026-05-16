import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { AreasView } from "@/features/areas/components/areas-view";
import { getMessages } from "@/lib/locale-messages";

export default async function AreasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.areas}>
        <AreasView />
      </DashboardShell>
    </AuthGate>
  );
}
