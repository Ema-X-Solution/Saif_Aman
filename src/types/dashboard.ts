import type { EntityId } from "@/types/common";

export type DashboardStatIcon =
  | "students"
  | "requests"
  | "schools"
  | "buses"
  | "drivers"
  | "supervisors";

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "flat";
  icon?: DashboardStatIcon;
  sparkline?: number[];
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
  busNumber: string;
  color: string;
  mapX: number;
  mapY: number;
}

export interface SchoolStudentStat {
  school: string;
  students: number;
  color: string;
}

export interface SubscriptionStatus {
  paid: number;
  dueSoon: number;
  late: number;
}

export interface TodayTripsSummary {
  started: number;
  active: number;
  ended: number;
  going: number;
  back: number;
}
