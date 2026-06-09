import { http } from "@/services/http";
import type { ApiDashboardResponse } from "@/types/api";
import type {
  DashboardStat,
  LiveBusPoint,
  SchoolStudentStat,
  TodayTripsSummary,
} from "@/types/dashboard";

export interface DashboardData {
  stats: DashboardStat[];
  schoolStats: SchoolStudentStat[];
  todayTrips: TodayTripsSummary;
  liveBuses: LiveBusPoint[];
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const res = await http.get<{ data: ApiDashboardResponse }>("/dashboard");
    const data = res.data.data;

    // Build the stats array based on data.statistics
    const stats: DashboardStat[] = [
      {
        id: "students",
        label: "students",
        value: String(data.statistics.students),
        icon: "students",
      },
      {
        id: "parents",
        label: "requests", // corresponds to dashboard.stats.requests
        value: String(data.statistics.users.parents.total),
        icon: "requests",
      },
      {
        id: "schools",
        label: "schools",
        value: String(data.statistics.schools),
        icon: "schools",
      },
      {
        id: "buses",
        label: "buses",
        value: String(data.statistics.buses),
        icon: "buses",
      },
      {
        id: "drivers",
        label: "drivers",
        value: String(data.statistics.users.drivers.total),
        icon: "drivers",
      },
      {
        id: "supervisors",
        label: "supervisors",
        value: String(data.statistics.users.supervisors.total),
        icon: "supervisors",
      },
    ];

    // Build school stats array
    const schoolStats: SchoolStudentStat[] = data.statistics.top_schools.map((school) => ({
      school: school.name,
      students: school.students_count,
      color: "hsl(var(--chart-1))", // You can use a dynamic color map if desired
    }));

    // Today's trips
    const todayTrips: TodayTripsSummary = {
      started: data.today.trips.started,
      active: data.today.trips.active,
      ended: data.today.trips.ended,
      going: data.today.trips.going,
      back: data.today.trips.back,
    };

    const liveBuses: LiveBusPoint[] = (data.active_trips as Record<string, unknown>[]).map((trip) => ({
      id: String(trip.id || Math.random()),
      plate: String(trip.plate || "N/A"),
      schoolName: String(trip.schoolName || "N/A"),
      speedKmh: Number(trip.speed || 0),
      route: String(trip.route || "N/A"),
      busNumber: String(trip.busNumber || "N/A"),
      color: "#000",
      mapX: Number(trip.mapX || 0),
      mapY: Number(trip.mapY || 0),
    }));

    return {
      stats,
      schoolStats,
      todayTrips,
      liveBuses,
    };
  },
};
