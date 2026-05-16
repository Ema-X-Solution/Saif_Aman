"use client";

import { Loader2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Mirrors `login/page.tsx` shell + `LoginForm` card shape for Next.js `loading.tsx`.
 * Relies on `[locale]/layout` `dir` for RTL/LTR (no locale prop needed).
 */
export function LoginPageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A3D91]/10 via-background to-[#1D5FD0]/10 px-4 py-12",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(29,95,208,0.15),transparent_45%)]" />
      <div
        className="relative z-10 w-full max-w-md"
        role="status"
        aria-busy="true"
        aria-live="polite"
      >
        <span className="sr-only">Loading</span>
        <div className="mb-8 flex flex-col items-center gap-4">
          <Loader2
            className="h-9 w-9 shrink-0 animate-spin text-primary"
            aria-hidden
          />
          {/* <Skeleton className="h-12 w-44 rounded-md sm:h-14" /> */}
        </div>
        {/* <div className="rounded-xl border border-border/80 bg-card/95 p-6 shadow-lg backdrop-blur-sm">
          <div className="space-y-2 border-b border-border/60 pb-4">
            <Skeleton className="h-8 w-3/5 max-w-[220px] rounded-md" />
            <Skeleton className="h-4 w-full max-w-sm rounded-md" />
          </div>
          <div className="space-y-5 pt-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 shrink-0 rounded-sm" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <Skeleton className="mx-auto mt-6 h-4 w-40 rounded-md" />
        </div> */}
      </div>
    </div>
  );
}
