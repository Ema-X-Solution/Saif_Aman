import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { ProfileView } from "@/features/profile/components/profile-view";

export default function ProfilePage() {
  return (
    <AuthGate>
      <DashboardShell title="Profile">
        <ProfileView />
      </DashboardShell>
    </AuthGate>
  );
}
