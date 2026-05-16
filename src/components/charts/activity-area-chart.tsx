"use client";

import dynamic from "next/dynamic";

import { ChartCard } from "@/components/charts/chart-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/i18n/use-t";
import type { ActivityPoint } from "@/types/dashboard";

const ActivityAreaChartInner = dynamic(
  () => import("@/components/charts/activity-area-chart-inner"),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[260px] w-full rounded-lg" />,
  },
);

interface ActivityAreaChartProps {
  data: ActivityPoint[];
}

export function ActivityAreaChart({ data }: ActivityAreaChartProps) {
  const t = useT();
  return (
    <ChartCard
      title={t("dashboard.chart.title")}
      description={t("dashboard.chart.description")}
    >
      <div className="h-[280px] w-full min-w-0">
        <ActivityAreaChartInner data={data} />
      </div>
    </ChartCard>
  );
}
