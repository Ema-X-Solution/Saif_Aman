import { Suspense } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { UsersHubSkeleton } from "@/components/layout/dashboard-shell-skeleton";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { UsersHubView } from "@/features/users/components/users-hub-view";
import { getMessages } from "@/lib/locale-messages";

export default async function UsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
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
