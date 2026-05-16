import { Suspense } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { UsersHubSkeleton } from "@/components/layout/dashboard-shell-skeleton";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { UsersHubView } from "@/features/users/components/users-hub-view";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export default function UsersPage({ params }: { params: { locale: string } }) {
  const messages = params.locale === "ar" ? (ar as any) : (en as any);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.users}>
        <Suspense fallback={<UsersHubSkeleton />}>
          <UsersHubView />
        </Suspense>
      </DashboardShell>
    </AuthGate>
  );
}
