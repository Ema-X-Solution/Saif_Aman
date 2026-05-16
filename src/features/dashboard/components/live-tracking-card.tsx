"use client";

import { MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useT } from "@/i18n/use-t";
import type { LiveBusPoint } from "@/types/dashboard";

interface LiveTrackingCardProps {
  buses: LiveBusPoint[];
}

export function LiveTrackingCard({ buses }: LiveTrackingCardProps) {
  const t = useT();
  const lt = (key: string) => t(`dashboard.liveTracking.${key}`);

  return (
    <Card className="border-border/80">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-semibold">{lt("title")}</CardTitle>
        <p className="text-sm text-muted-foreground">{lt("subtitle")}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {lt("coverage")}
            </p>
            <p className="mt-2 text-2xl font-semibold">{lt("coverageValue")}</p>
            <p className="text-sm text-muted-foreground">{lt("coverageHint")}</p>
          </div>
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {lt("signalHealth")}
            </p>
            <p className="mt-2 text-2xl font-semibold">{lt("signalValue")}</p>
            <p className="text-sm text-muted-foreground">{lt("signalHint")}</p>
          </div>
        </div>
        <Separator />
        <ul className="space-y-3">
          {buses.map((bus) => (
            <li
              key={bus.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-card px-3 py-2"
            >
              <div>
                <p className="font-medium">{bus.plate}</p>
                <p className="text-sm text-muted-foreground">{bus.schoolName}</p>
              </div>
              <div className="text-end text-sm">
                <p className="inline-flex items-center gap-1 font-medium">
                  <MapPin className="h-4 w-4 text-primary" />
                  {bus.speedKmh} {lt("speedUnit")}
                </p>
                <p className="text-muted-foreground">{bus.route}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
