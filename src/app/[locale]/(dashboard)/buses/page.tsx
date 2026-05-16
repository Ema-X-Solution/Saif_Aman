import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { BusesView } from "@/features/buses/components/buses-view";
import { getMessages } from "@/lib/locale-messages";

export default async function BusesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.buses}>
        <BusesView />
      </DashboardShell>
    </AuthGate>
  );
}
