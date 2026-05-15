import type { AppNotification } from "@/types/notification";

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "ntf-1",
    title: "Route deviation detected",
    body: "Bus RJD 8841 left geofence for 3 minutes—supervisor notified.",
    channel: "route",
    read: false,
    createdAt: "2026-05-08T07:40:00.000Z",
  },
  {
    id: "ntf-2",
    title: "Weekly operations digest ready",
    body: "PDF summary of trips and on-time performance is available.",
    channel: "system",
    read: true,
    createdAt: "2026-05-07T22:10:00.000Z",
  },
];
