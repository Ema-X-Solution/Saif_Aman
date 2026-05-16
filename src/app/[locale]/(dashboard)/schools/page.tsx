import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { SchoolsView } from "@/features/schools/components/schools-view";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export default function SchoolsPage({ params }: { params: { locale: string } }) {
  const messages = params.locale === "ar" ? (ar as any) : (en as any);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.schools}>
        <SchoolsView />
      </DashboardShell>
    </AuthGate>
  );
}
