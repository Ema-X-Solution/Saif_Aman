"use client";

import dynamic from "next/dynamic";

import { ChartCard } from "@/components/charts/chart-card";
import { useT } from "@/i18n/use-t";
import type { SchoolStudentStat } from "@/types/dashboard";

const DonutChartInner = dynamic(
  () => import("@/features/dashboard/components/student-stats-donut-inner"),
  { ssr: false, loading: () => <div className="h-[200px] animate-pulse rounded-lg bg-muted" /> },
);

interface StudentStatsDonutProps {
  data: SchoolStudentStat[];
}

export function StudentStatsDonut({ data }: StudentStatsDonutProps) {
  const t = useT();

  return (
    <ChartCard
      title={t("dashboard.home.studentStats")}
      description={t("dashboard.home.studentStatsHint")}
      className="h-full"
    >
      <DonutChartInner data={data} />
    </ChartCard>
  );
}
