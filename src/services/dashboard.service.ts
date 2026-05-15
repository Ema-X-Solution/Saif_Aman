import {
  MOCK_ACTIVITY_SERIES,
  MOCK_DASHBOARD_STATS,
  MOCK_LIVE_BUSES,
} from "@/mock/dashboard";
import { withMockLatency } from "@/services/mock-delay";
import type {
  ActivityPoint,
  DashboardStat,
  LiveBusPoint,
} from "@/types/dashboard";

export const dashboardService = {
  stats(): Promise<DashboardStat[]> {
    return withMockLatency([...MOCK_DASHBOARD_STATS]);
  },
  activity(): Promise<ActivityPoint[]> {
    return withMockLatency([...MOCK_ACTIVITY_SERIES]);
  },
  liveBuses(): Promise<LiveBusPoint[]> {
    return withMockLatency([...MOCK_LIVE_BUSES]);
  },
};
