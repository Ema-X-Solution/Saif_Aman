import { MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { LiveBusPoint } from "@/types/dashboard";

interface LiveTrackingCardProps {
  buses: LiveBusPoint[];
}

export function LiveTrackingCard({ buses }: LiveTrackingCardProps) {
  return (
    <Card className="border-border/80">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base font-semibold">Live fleet snapshot</CardTitle>
        <p className="text-sm text-muted-foreground">
          Simulated telemetry for demonstration purposes.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Coverage
            </p>
            <p className="mt-2 text-2xl font-semibold">+18 regions</p>
            <p className="text-sm text-muted-foreground">
              Mix of urban & gated communities.
            </p>
          </div>
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Signal health
            </p>
            <p className="mt-2 text-2xl font-semibold">99.2%</p>
            <p className="text-sm text-muted-foreground">
              Rolling 24h GPS + LTE handshake.
            </p>
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
                  {bus.speedKmh} km/h
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
