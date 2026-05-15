"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge } from "@/components/shared/status-badge";
import type { AppNotification } from "@/types/notification";

export function buildNotificationColumns(): ColumnDef<AppNotification>[] {
  return [
    { accessorKey: "title", header: "Title", enableSorting: true },
    {
      accessorKey: "channel",
      header: "Channel",
      cell: ({ row }) => <StatusBadge status="info" label={row.original.channel} />,
      enableSorting: true,
    },
    {
      accessorKey: "read",
      header: "State",
      cell: ({ row }) => (
        <StatusBadge status={row.original.read ? "inactive" : "pending"} label={row.original.read ? "Read" : "Unread"} />
      ),
      enableSorting: true,
    },
    { accessorKey: "createdAt", header: "Created", enableSorting: true },
  ];
}
