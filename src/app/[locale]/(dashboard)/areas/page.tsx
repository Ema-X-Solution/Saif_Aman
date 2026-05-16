import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { AreasView } from "@/features/areas/components/areas-view";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export default function AreasPage({ params }: { params: { locale: string } }) {
  const messages = params.locale === "ar" ? (ar as any) : (en as any);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.areas}>
        <AreasView />
      </DashboardShell>
    </AuthGate>
  );
}
