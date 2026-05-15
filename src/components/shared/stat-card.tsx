import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardStat } from "@/types/dashboard";

interface StatCardProps {
  stat: DashboardStat;
}

export function StatCard({ stat }: StatCardProps) {
  const Icon =
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
      <CardContent className="p-5">
        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium",
              tone,
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {stat.change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
