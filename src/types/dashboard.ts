import type { EntityId } from "@/types/common";

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
}

export interface ActivityPoint {
  label: string;
  trips: number;
  alerts: number;
}

export interface LiveBusPoint {
  id: EntityId;
  plate: string;
  schoolName: string;
  speedKmh: number;
  route: string;
}
