"use client";

import dynamic from "next/dynamic";

import { ChartCard } from "@/components/charts/chart-card";
import { Skeleton } from "@/components/ui/skeleton";
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
  return (
    <ChartCard
      title="Operational pulse"
      description="Trips vs alerts across the week."
    >
      <div className="h-[280px] w-full min-w-0">
        <ActivityAreaChartInner data={data} />
      </div>
    </ChartCard>
  );
}
