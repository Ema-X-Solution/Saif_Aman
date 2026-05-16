import { LoginPageSkeleton } from "@/features/auth/components/login-page-skeleton";

/** Matches unauthenticated UX: `AuthGate` + server `loading` both use the login-style shell. */
export default function DashboardLoading() {
  return <LoginPageSkeleton />;
}
