"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LoginPageSkeleton } from "@/features/auth/components/login-page-skeleton";
import { ROUTES } from "@/constants/routes";
import { getLocaleFromPathname } from "@/i18n/use-t";
import { localizedHref } from "@/lib/localized-href";
import { useAuthStore } from "@/store/auth-store";

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const session = useAuthStore((s) => s.session);
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      const locale = getLocaleFromPathname(pathname ?? null);
      router.replace(localizedHref(locale, ROUTES.login));
    }
  }, [ready, session, router, pathname]);

  if (!ready || !session) {
    return <LoginPageSkeleton />;
  }

  return children;
}
