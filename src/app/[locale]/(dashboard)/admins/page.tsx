import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { AdminsView } from "@/features/admins/components/admins-view";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export default function AdminsPage({ params }: { params: { locale: string } }) {
  const messages = params.locale === "ar" ? (ar as any) : (en as any);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.admins}>
        <AdminsView />
      </DashboardShell>
    </AuthGate>
  );
}
