import { http } from "@/services/http";
import type {
  ActivityPoint,
  DashboardStat,
  LiveBusPoint,
} from "@/types/dashboard";

export const dashboardService = {
  async stats(): Promise<DashboardStat[]> {
    const res = await http.get<{ data: DashboardStat[] }>("/dashboard/stats");
    return res.data?.data ?? [];
  },
  async activity(): Promise<ActivityPoint[]> {
    const res = await http.get<{ data: ActivityPoint[] }>("/dashboard/activity");
    return res.data?.data ?? [];
  },
  async liveBuses(): Promise<LiveBusPoint[]> {
    const res = await http.get<{ data: LiveBusPoint[] }>("/dashboard/live-buses");
    return res.data?.data ?? [];
  },
};
