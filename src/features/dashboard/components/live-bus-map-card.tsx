"use client";

import { Bus, Minus, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT } from "@/i18n/use-t";
import type { LiveBusPoint } from "@/types/dashboard";

interface LiveBusMapCardProps {
  buses: LiveBusPoint[];
}

export function LiveBusMapCard({ buses }: LiveBusMapCardProps) {
  const t = useT();

  return (
    <Card className="h-full border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          {t("dashboard.liveTracking.mapTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[280px] overflow-hidden rounded-xl border border-border/60 bg-[#e8f4fc] dark:bg-[#0e2a47]">
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <rect width="100" height="100" className="fill-[#d4eaf7] dark:fill-[#12395e]" />
            <path
              d="M0 75 Q30 70 50 78 T100 72 L100 100 L0 100 Z"
              className="fill-[#a8d4f0] dark:fill-[#1a4a73]"
            />
            <path
              d="M10 20 Q40 10 70 18 T100 12"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="0.4"
              strokeDasharray="2 2"
            />
            <path
              d="M15 45 Q35 55 55 48 T90 52"
              fill="none"
              stroke="#2563eb"
              strokeWidth="0.8"
              opacity="0.7"
            />
            <path
              d="M20 60 Q45 50 65 62 T95 58"
              fill="none"
              stroke="#16a34a"
              strokeWidth="0.8"
              opacity="0.7"
            />
            <path
              d="M5 35 Q30 42 50 35 T85 40"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="0.8"
              opacity="0.7"
            />
            <path
              d="M25 25 Q50 30 75 22"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="0.8"
              opacity="0.7"
            />
            <path
              d="M40 70 Q60 65 80 72"
              fill="none"
              stroke="#dc2626"
              strokeWidth="0.8"
              opacity="0.7"
            />
          </svg>

          {buses.map((bus) => (
            <div
              key={bus.id}
              className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-bold text-white shadow-md"
              style={{
                left: `${bus.mapX}%`,
                top: `${bus.mapY}%`,
                backgroundColor: bus.color,
              }}
            >
              {bus.busNumber}
            </div>
          ))}

          <div className="absolute end-3 top-3 rounded-lg border border-border/60 bg-background/90 px-2 py-1.5 text-xs shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-1.5 font-medium">
              <Bus className="h-3.5 w-3.5 text-primary" />
              {buses.length} {t("dashboard.liveTracking.activeBuses")}
            </div>
          </div>

          <div className="absolute bottom-3 end-3 flex flex-col gap-1">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-background/90 shadow-sm"
              aria-label="Zoom in"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-background/90 shadow-sm"
              aria-label="Zoom out"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
