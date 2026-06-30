"use client";

import { Bus, Car } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT } from "@/i18n/use-t";
import type { LiveBusPoint } from "@/types/dashboard";

interface MovingBusesCardProps {
  buses: LiveBusPoint[];
}

export function MovingBusesCard({ buses }: MovingBusesCardProps) {
  const t = useT();

  return (
    <Card className="h-full border-border/80 bg-gradient-to-br from-card to-card/80 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15">
            <Car className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <CardTitle className="text-base font-semibold">
            {t("dashboard.liveTracking.movingBuses")}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {buses.map((bus) => (
          <div
            key={bus.id}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-background px-3 py-2.5 hover:bg-muted/30 transition-colors"
          >
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: bus.color }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{bus.plate}</p>
              <p className="truncate text-xs text-muted-foreground">{bus.schoolName}</p>
            </div>
            <div className="text-end">
              <p className="text-sm font-medium">
                {bus.speedKmh} {t("dashboard.liveTracking.speedUnit")}
              </p>
              <Bus className="ms-auto mt-0.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
