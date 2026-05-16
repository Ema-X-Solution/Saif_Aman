import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { ReviewsView } from "@/features/reviews/components/reviews-view";
import { getMessages } from "@/lib/locale-messages";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return (
    <AuthGate>
      <DashboardShell title={messages.sidebar.reviews}>
        <ReviewsView />
      </DashboardShell>
    </AuthGate>
  );
}
