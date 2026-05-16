"use client";

import { cn } from "@/lib/utils";
import { useT } from "@/i18n/use-t";

/** Placeholder blocks tuned for navy UI (matches design / dark refresh state). */
function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-primary/18 dark:bg-[#163252]",
        className,
      )}
    />
  );
}

/** Mirrors `DashboardShell` chrome — refresh, auth hydrate, and Next.js `loading.tsx`. */
export function DashboardShellSkeleton() {
  const t = useT();

  return (
    <div
      className="flex min-h-screen bg-background"
      aria-busy="true"
      aria-label={t("shell.loadingDashboard")}
    >
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col gap-4 border-e border-border/80 bg-card/90 p-4 backdrop-blur-md xl:flex dark:bg-[#0e2a47]/95">
        <SkeletonBar className="h-10 w-[168px] shrink-0 rounded-lg" />
        <div className="flex flex-col gap-2 pt-2">
          {Array.from({ length: 10 }, (_, i) => (
            <SkeletonBar key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b border-border/80 bg-background/90 px-4 backdrop-blur-md">
          <SkeletonBar className="h-9 w-9 shrink-0 rounded-lg xl:hidden" />
          <SkeletonBar className="h-4 max-w-[40%] flex-1 rounded-md sm:max-w-xs" />
          <div className="ms-auto flex items-center gap-2">
            <SkeletonBar className="h-9 w-9 shrink-0 rounded-lg" />
            <SkeletonBar className="h-9 w-[120px] shrink-0 rounded-lg" />
          </div>
        </header>

        <main className="flex-1 space-y-6 bg-background p-4 sm:p-6 lg:p-8">
          <div className="space-y-2">
            <SkeletonBar className="h-8 w-52 max-w-[70%] rounded-lg" />
            <SkeletonBar className="h-4 w-full max-w-xl" />
          </div>
          <SkeletonBar className="h-10 w-full max-w-lg rounded-lg" />
          <SkeletonBar className="min-h-[min(320px,45vh)] w-full rounded-xl" />
          <div className="grid gap-3 sm:grid-cols-3">
            <SkeletonBar className="h-24 rounded-lg" />
            <SkeletonBar className="h-24 rounded-lg" />
            <SkeletonBar className="h-24 rounded-lg" />
          </div>
        </main>
      </div>
    </div>
  );
}

/** Main-area skeleton for `/users` Suspense (tabs + table block). */
export function UsersHubSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1 rounded-lg bg-muted/40 p-1 dark:bg-[#0e2a47]/80">
        <SkeletonBar className="h-9 w-32 rounded-md sm:w-36" />
        <SkeletonBar className="h-9 w-28 rounded-md sm:w-32" />
      </div>
      <SkeletonBar className="h-10 w-full max-w-lg rounded-lg" />
      <SkeletonBar className="min-h-[min(22rem,48vh)] w-full rounded-xl" />
      <div className="grid grid-cols-4 gap-2 max-sm:hidden">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonBar key={i} className="h-8 rounded-md" />
        ))}
      </div>
    </div>
  );
}
