import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuthGate } from "@/features/auth/components/auth-gate";
import { ReviewsView } from "@/features/reviews/components/reviews-view";

export default function ReviewsPage() {
  return (
    <AuthGate>
      <DashboardShell title="Reviews">
        <ReviewsView />
      </DashboardShell>
    </AuthGate>
  );
}
