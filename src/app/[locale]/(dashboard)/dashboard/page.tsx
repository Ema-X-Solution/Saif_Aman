import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { DashboardHomeView } from "@/features/dashboard/components/dashboard-home-view";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export default function DashboardPage({ params }: { params: { locale: string } }) {
  const messages = params.locale === "ar" ? (ar as any) : (en as any);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.dashboard}>
        <DashboardHomeView />
      </DashboardShell>
    </AuthGate>
  );
}
