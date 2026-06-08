"use client";

import { StatCard } from "@/components/shared/stat-card";
import { useT } from "@/i18n/use-t";
import type { DashboardStat } from "@/types/dashboard";

interface DashboardStatsSectionProps {
  stats: DashboardStat[];
}

export function DashboardStatsSection({ stats }: DashboardStatsSectionProps) {
  const t = useT();
  return (
    <section
      aria-label={t("dashboard.home.keyMetricsAria")}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
    >
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </section>
  );
}
