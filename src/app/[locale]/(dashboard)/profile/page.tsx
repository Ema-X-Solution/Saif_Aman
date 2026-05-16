import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { ProfileView } from "@/features/profile/components/profile-view";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export default function ProfilePage({ params }: { params: { locale: string } }) {
  const messages = params.locale === "ar" ? (ar as any) : (en as any);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.profile}>
        <ProfileView />
      </DashboardShell>
    </AuthGate>
  );
}
