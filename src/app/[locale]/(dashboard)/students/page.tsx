import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { StudentsView } from "@/features/students/components/students-view";
import { getMessages } from "@/lib/locale-messages";

export default async function StudentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.students}>
        <StudentsView />
      </DashboardShell>
    </AuthGate>
  );
}
