"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { AppNotification } from "@/types/notification";

export function buildNotificationColumns(): ColumnDef<AppNotification>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "body",
      header: "Message",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-muted-foreground line-clamp-2 max-w-xs">
          {row.original.body}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      enableSorting: true,
      cell: ({ row }) => {
        const val = row.original.createdAt;
        if (!val) return <span className="text-muted-foreground">—</span>;
        const date = new Date(val);
        if (isNaN(date.getTime())) return <span className="text-muted-foreground">{val}</span>;
        return (
          <span className="text-sm text-muted-foreground">
            {date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
            {" "}
            <span className="opacity-70">
              {date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
            </span>
          </span>
        );
      },
    },
  ];
}
