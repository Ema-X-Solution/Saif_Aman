"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth-store";

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const session = useAuthStore((s) => s.session);
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      router.replace(ROUTES.login);
    }
  }, [ready, session, router]);

  if (!ready || !session) {
    return (
      <div className="flex min-h-[50vh] flex-col gap-4 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full max-w-3xl" />
      </div>
    );
  }

  return children;
}
