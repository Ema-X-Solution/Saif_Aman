import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { ReportsView } from "@/features/reports/components/reports-view";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export default function ReportsPage({ params }: { params: { locale: string } }) {
  const messages = params.locale === "ar" ? (ar as any) : (en as any);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.reports}>
        <ReportsView />
      </DashboardShell>
    </AuthGate>
  );
}
