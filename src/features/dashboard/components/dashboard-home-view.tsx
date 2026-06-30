"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/i18n/use-t";
import { DashboardStatsSection } from "@/features/dashboard/components/dashboard-stats-section";
import { LiveBusMapCard } from "@/features/dashboard/components/live-bus-map-card";
import { NewRequestsTableCard } from "@/features/dashboard/components/new-requests-table-card";
import { StudentStatsDonut } from "@/features/dashboard/components/student-stats-donut";
import { TodaysTripsCard } from "@/features/dashboard/components/todays-trips-card";
import {
  dashboardService,
  parentRequestsService,
} from "@/services";
import type {
  DashboardStat,
  SchoolStudentStat,
  TodayTripsSummary,
} from "@/types/dashboard";
import type { ParentRequest } from "@/types/parent-request";
import type { School } from "@/types/school";
import type { Bus } from "@/types/bus";
import type { ApiTrip } from "@/types/trip";

export function DashboardHomeView() {
  const t = useT();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [requests, setRequests] = useState<ParentRequest[]>([]);
  const [schoolStats, setSchoolStats] = useState<SchoolStudentStat[]>([]);
  const [todayTrips, setTodayTrips] = useState<TodayTripsSummary | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [dashboardData, r] = await Promise.all([
          dashboardService.getDashboardData(),
          parentRequestsService.list(),
        ]);
        if (!cancelled) {
          setStats(dashboardData.stats);
          setRequests(r.slice(0, 5));
          setSchoolStats(dashboardData.schoolStats);
          setTodayTrips(dashboardData.todayTrips);
          setSchools(dashboardData.schools);
          setBuses(dashboardData.buses);
          setTrips(dashboardData.trips);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-1">
          <Skeleton className="h-80 rounded-xl" />
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">{t("dashboard.home.mainTitle")}</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("dashboard.home.description")}
        </p>
      </div>

      <DashboardStatsSection stats={stats} />

      <div className="grid gap-6 lg:grid-cols-1">
        <LiveBusMapCard schools={schools} buses={buses} trips={trips} />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <NewRequestsTableCard requests={requests} />
        <StudentStatsDonut data={schoolStats} />
        {todayTrips ? <TodaysTripsCard data={todayTrips} /> : null}
      </div>
    </div>
  );
}
