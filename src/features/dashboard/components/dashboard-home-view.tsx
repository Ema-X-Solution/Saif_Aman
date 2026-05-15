"use client";

import { useEffect, useState } from "react";

import { ActivityAreaChart } from "@/components/charts/activity-area-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  dashboardService,
  notificationsService,
  parentRequestsService,
  reviewsService,
} from "@/services";
import { DashboardStatsSection } from "@/features/dashboard/components/dashboard-stats-section";
import { LiveTrackingCard } from "@/features/dashboard/components/live-tracking-card";
import { QuickActionsCard } from "@/features/dashboard/components/quick-actions-card";
import type { ActivityPoint, DashboardStat, LiveBusPoint } from "@/types/dashboard";
import type { AppNotification } from "@/types/notification";
import type { ParentRequest } from "@/types/parent-request";
import type { Review } from "@/types/review";

export function DashboardHomeView() {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [activity, setActivity] = useState<ActivityPoint[]>([]);
  const [live, setLive] = useState<LiveBusPoint[]>([]);
  const [requests, setRequests] = useState<ParentRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [s, a, l, r, rv, n] = await Promise.all([
          dashboardService.stats(),
          dashboardService.activity(),
          dashboardService.liveBuses(),
          parentRequestsService.list(),
          reviewsService.list(),
          notificationsService.list(),
        ]);
        if (!cancelled) {
          setStats(s);
          setActivity(a);
          setLive(l);
          setRequests(r.slice(0, 4));
          setReviews(rv.slice(0, 4));
          setNotifications(n.slice(0, 4));
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Operations overview"
        description="Monitor schools, buses, and parent workflows from a single admin surface."
      />
      <DashboardStatsSection stats={stats} />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <ActivityAreaChart data={activity} />
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Recent parent requests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-lg border border-border/70 px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{req.parentName}</p>
                      <StatusBadge status={req.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{req.schoolName}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-border/80">
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Recent reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="rounded-lg border border-border/70 px-3 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{rev.parentName}</p>
                      <span className="text-sm text-amber-600">{rev.rating.toFixed(1)} ★</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{rev.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-6">
          <LiveTrackingCard buses={live} />
          <QuickActionsCard />
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((note) => (
                <div key={note.id} className="rounded-lg border border-border/70 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{note.title}</p>
                    <StatusBadge status={note.read ? "inactive" : "pending"} label={note.read ? "Read" : "New"} />
                  </div>
                  <p className="text-sm text-muted-foreground">{note.body}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <Separator />
    </div>
  );
}
