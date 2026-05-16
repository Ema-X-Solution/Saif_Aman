import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { ParentRequestsView } from "@/features/parent-requests/components/parent-requests-view";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export default function ParentRequestsPage({ params }: { params: { locale: string } }) {
  const messages = params.locale === "ar" ? (ar as any) : (en as any);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.parentRequests}>
        <ParentRequestsView />
      </DashboardShell>
    </AuthGate>
  );
}
