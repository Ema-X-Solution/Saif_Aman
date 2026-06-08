import {
  DEMO_ACTIVITY,
  DEMO_LIVE_BUSES,
  DEMO_SCHOOL_STATS,
  DEMO_STATS,
  DEMO_SUBSCRIPTIONS,
  DEMO_TODAY_TRIPS,
} from "@/features/dashboard/data/dashboard-demo";
import { http } from "@/services/http";
import type {
  ActivityPoint,
  DashboardStat,
  LiveBusPoint,
  SchoolStudentStat,
  SubscriptionStatus,
  TodayTripsSummary,
} from "@/types/dashboard";

async function fetchOrFallback<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await http.get<{ data: T }>(path);
    const data = res.data?.data;
    if (data === undefined || data === null) return fallback;
    if (Array.isArray(data) && data.length === 0) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

export const dashboardService = {
  async stats(): Promise<DashboardStat[]> {
    return fetchOrFallback("/dashboard/stats", DEMO_STATS);
  },
  async activity(): Promise<ActivityPoint[]> {
    return fetchOrFallback("/dashboard/activity", DEMO_ACTIVITY);
  },
  async liveBuses(): Promise<LiveBusPoint[]> {
    return fetchOrFallback("/dashboard/live-buses", DEMO_LIVE_BUSES);
  },
  async schoolStats(): Promise<SchoolStudentStat[]> {
    return fetchOrFallback("/dashboard/school-stats", DEMO_SCHOOL_STATS);
  },
  async subscriptions(): Promise<SubscriptionStatus> {
    return fetchOrFallback("/dashboard/subscriptions", DEMO_SUBSCRIPTIONS);
  },
  async todayTrips(): Promise<TodayTripsSummary> {
    return fetchOrFallback("/dashboard/today-trips", DEMO_TODAY_TRIPS);
  },
};
