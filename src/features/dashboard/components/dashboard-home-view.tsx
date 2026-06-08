"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/i18n/use-t";
import { DashboardStatsSection } from "@/features/dashboard/components/dashboard-stats-section";
import { LiveBusMapCard } from "@/features/dashboard/components/live-bus-map-card";
import { MovingBusesCard } from "@/features/dashboard/components/moving-buses-card";
import { NewRequestsTableCard } from "@/features/dashboard/components/new-requests-table-card";
import { NotificationsAlertsCard } from "@/features/dashboard/components/notifications-alerts-card";
import { StudentStatsDonut } from "@/features/dashboard/components/student-stats-donut";
import { SubscriptionStatusCard } from "@/features/dashboard/components/subscription-status-card";
import { TodaysTripsCard } from "@/features/dashboard/components/todays-trips-card";
import {
  dashboardService,
  notificationsService,
  parentRequestsService,
} from "@/services";
import type {
  DashboardStat,
  LiveBusPoint,
  SchoolStudentStat,
  SubscriptionStatus,
  TodayTripsSummary,
} from "@/types/dashboard";
import type { AppNotification } from "@/types/notification";
import type { ParentRequest } from "@/types/parent-request";

export function DashboardHomeView() {
  const t = useT();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [live, setLive] = useState<LiveBusPoint[]>([]);
  const [requests, setRequests] = useState<ParentRequest[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [schoolStats, setSchoolStats] = useState<SchoolStudentStat[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionStatus | null>(null);
  const [todayTrips, setTodayTrips] = useState<TodayTripsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, l, r, n, ss, sub, trips] = await Promise.all([
          dashboardService.stats(),
          dashboardService.liveBuses(),
          parentRequestsService.list(),
          notificationsService.list(),
          dashboardService.schoolStats(),
          dashboardService.subscriptions(),
          dashboardService.todayTrips(),
        ]);
        if (!cancelled) {
          setStats(s);
          setLive(l);
          setRequests(r.slice(0, 5));
          setNotifications(n.slice(0, 6));
          setSchoolStats(ss);
          setSubscriptions(sub);
          setTodayTrips(trips);
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
        <div className="grid gap-6 lg:grid-cols-12">
          <Skeleton className="h-80 rounded-xl lg:col-span-3" />
          <Skeleton className="h-80 rounded-xl lg:col-span-6" />
          <Skeleton className="h-80 rounded-xl lg:col-span-3" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
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

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <NotificationsAlertsCard notifications={notifications} />
        </div>
        <div className="lg:col-span-6">
          <LiveBusMapCard buses={live} />
        </div>
        <div className="lg:col-span-3">
          <MovingBusesCard buses={live} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <NewRequestsTableCard requests={requests} />
        <StudentStatsDonut data={schoolStats} />
        {subscriptions ? <SubscriptionStatusCard data={subscriptions} /> : null}
        {todayTrips ? <TodaysTripsCard data={todayTrips} /> : null}
      </div>
    </div>
  );
}
