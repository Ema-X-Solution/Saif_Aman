import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { SettingsView } from "@/features/settings/components/settings-view";

export default function SettingsPage() {
  return (
    <AuthGate>
      <DashboardShell title="Settings">
        <SettingsView />
      </DashboardShell>
    </AuthGate>
  );
}
