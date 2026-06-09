"use client";

import { Cloud, Moon, Sun } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT } from "@/i18n/use-t";
import type { TodayTripsSummary } from "@/types/dashboard";

interface TodaysTripsCardProps {
  data: TodayTripsSummary;
}

export function TodaysTripsCard({ data }: TodaysTripsCardProps) {
  const t = useT();

  const items = [
    {
      key: "started",
      label: t("dashboard.home.startedTrips") || "Started",
      value: data.started,
      icon: Sun,
      color: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    },
    {
      key: "active",
      label: t("dashboard.home.activeTrips") || "Active",
      value: data.active,
      icon: Cloud,
      color: "bg-green-500/15 text-green-600 dark:text-green-400",
    },
    {
      key: "ended",
      label: t("dashboard.home.endedTrips") || "Ended",
      value: data.ended,
      icon: Moon,
      color: "bg-gray-500/15 text-gray-600 dark:text-gray-400",
    },
    {
      key: "going",
      label: t("dashboard.home.goingTrips") || "Going",
      value: data.going,
      icon: Sun,
      color: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    },
    {
      key: "back",
      label: t("dashboard.home.backTrips") || "Returning",
      value: data.back,
      icon: Moon,
      color: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
    },
  ] as const;

  return (
    <Card className="h-full border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          {t("dashboard.home.todaysTrips")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-center">
          <p className="text-sm text-muted-foreground">{t("dashboard.home.totalTrips")}</p>
          <p className="text-3xl font-bold">{data.started + data.active + data.ended}</p>
        </div>
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.key}
                className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.color}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                <span className="text-lg font-bold">{item.value}</span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
