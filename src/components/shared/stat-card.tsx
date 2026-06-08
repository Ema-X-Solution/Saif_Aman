"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Bus,
  GraduationCap,
  Minus,
  School,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/use-t";
import type { DashboardStat, DashboardStatIcon } from "@/types/dashboard";

const ICON_MAP: Record<DashboardStatIcon, typeof Users> = {
  students: GraduationCap,
  requests: UserPlus,
  schools: School,
  buses: Bus,
  drivers: UserCog,
  supervisors: Users,
};

const COLOR_MAP: Record<DashboardStatIcon, string> = {
  students: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  requests: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  schools: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  buses: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  drivers: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  supervisors: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
};

const SPARKLINE_COLOR: Record<DashboardStatIcon, string> = {
  students: "#2563eb",
  requests: "#f59e0b",
  schools: "#8b5cf6",
  buses: "#0ea5e9",
  drivers: "#16a34a",
  supervisors: "#f97316",
};

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 24" className="h-6 w-full" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

interface StatCardProps {
  stat: DashboardStat;
}

export function StatCard({ stat }: StatCardProps) {
  const t = useT();
  const iconKey = stat.icon ?? "students";
  const Icon = ICON_MAP[iconKey];
  const label = stat.label.startsWith("dashboard.")
    ? t(stat.label)
    : t(`dashboard.stats.${stat.label}`);

  const TrendIcon =
    stat.trend === "up"
      ? ArrowUpRight
      : stat.trend === "down"
        ? ArrowDownRight
        : Minus;
  const tone =
    stat.trend === "up"
      ? "text-emerald-600 dark:text-emerald-400"
      : stat.trend === "down"
        ? "text-rose-600 dark:text-rose-400"
        : "text-muted-foreground";

  return (
    <Card className="border-border/80 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight">{stat.value}</p>
            {stat.change ? (
              <span
                className={cn(
                  "mt-1 inline-flex items-center gap-1 text-xs font-medium",
                  tone,
                )}
              >
                <TrendIcon className="h-3.5 w-3.5" />
                {stat.change}
              </span>
            ) : null}
          </div>
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              COLOR_MAP[iconKey],
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
        </div>
        {stat.sparkline?.length ? (
          <div className="mt-3 opacity-80">
            <MiniSparkline values={stat.sparkline} color={SPARKLINE_COLOR[iconKey]} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
