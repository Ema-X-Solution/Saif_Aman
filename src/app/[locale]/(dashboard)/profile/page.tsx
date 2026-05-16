import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { ProfileView } from "@/features/profile/components/profile-view";
import { getMessages } from "@/lib/locale-messages";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.profile}>
        <ProfileView />
      </DashboardShell>
    </AuthGate>
  );
}
