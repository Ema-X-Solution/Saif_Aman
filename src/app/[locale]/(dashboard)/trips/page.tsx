import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { TripsView } from "@/features/trips/components/trips-view";
import { getMessages } from "@/lib/locale-messages";

export default async function TripsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.trips}>
        <TripsView />
      </DashboardShell>
    </AuthGate>
  );
}
