"use client";

import type { ReactNode } from "react";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

interface DashboardShellProps {
  children: ReactNode;
  title?: string;
}

export function DashboardShell({ children, title }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-muted/30" suppressHydrationWarning={true}>
      <div className="hidden xl:flex sticky top-0 h-screen" suppressHydrationWarning={true}>
        <AppSidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col transition-[margin] duration-200" suppressHydrationWarning={true}>
        <DashboardHeader title={title} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
