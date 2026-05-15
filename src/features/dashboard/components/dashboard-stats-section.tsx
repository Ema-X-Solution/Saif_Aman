import { StatCard } from "@/components/shared/stat-card";
import type { DashboardStat } from "@/types/dashboard";

interface DashboardStatsSectionProps {
  stats: DashboardStat[];
}

export function DashboardStatsSection({ stats }: DashboardStatsSectionProps) {
  return (
    <section
      aria-label="Key metrics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </section>
  );
}
