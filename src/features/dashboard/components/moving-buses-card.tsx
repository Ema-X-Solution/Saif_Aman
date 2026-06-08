"use client";

import { Bus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT } from "@/i18n/use-t";
import type { LiveBusPoint } from "@/types/dashboard";

interface MovingBusesCardProps {
  buses: LiveBusPoint[];
}

export function MovingBusesCard({ buses }: MovingBusesCardProps) {
  const t = useT();

  return (
    <Card className="h-full border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          {t("dashboard.liveTracking.movingBuses")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {buses.map((bus) => (
          <div
            key={bus.id}
            className="flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2.5"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
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
