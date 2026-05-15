import type {
  ActivityPoint,
  DashboardStat,
  LiveBusPoint,
} from "@/types/dashboard";

export const MOCK_DASHBOARD_STATS: DashboardStat[] = [
  {
    id: "st-1",
    label: "Active buses",
    value: "128",
    change: "+6.2%",
    trend: "up",
  },
  {
    id: "st-2",
    label: "Alerts (24h)",
    value: "14",
    change: "-12%",
    trend: "down",
  },
  {
    id: "st-3",
    label: "On-time arrivals",
    value: "94.6%",
    change: "+1.1%",
    trend: "up",
  },
  {
    id: "st-4",
    label: "Schools connected",
    value: "32",
    change: "+2",
    trend: "up",
  },
];

export const MOCK_ACTIVITY_SERIES: ActivityPoint[] = [
  { label: "Mon", trips: 420, alerts: 6 },
  { label: "Tue", trips: 438, alerts: 4 },
  { label: "Wed", trips: 401, alerts: 9 },
  { label: "Thu", trips: 456, alerts: 3 },
  { label: "Fri", trips: 390, alerts: 5 },
];

export const MOCK_LIVE_BUSES: LiveBusPoint[] = [
  {
    id: "bus-1",
    plate: "RJD 8841",
    schoolName: "Al Noor International School",
    speedKmh: 38,
    route: "North Riyadh Loop",
  },
  {
    id: "bus-2",
    plate: "JED 1200",
    schoolName: "Future Leaders Academy",
    speedKmh: 0,
    route: "Maintenance bay",
  },
];
