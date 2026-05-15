"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ReportDefinition } from "@/types/report";

export function buildReportColumns(): ColumnDef<ReportDefinition>[] {
  return [
    { accessorKey: "name", header: "Report", enableSorting: true },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <StatusBadge status="neutral" label={row.original.category} />,
      enableSorting: true,
    },
    { accessorKey: "lastGeneratedAt", header: "Last run", enableSorting: true },
    {
      accessorKey: "format",
      header: "Format",
      cell: ({ row }) => row.original.format.toUpperCase(),
      enableSorting: true,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <EntityRowActions
          label={row.original.name}
          actions={[
            {
              id: "download",
              label: "Download",
              onSelect: () => toast.success("Download started (mock)."),
            },
          ]}
        />
      ),
    },
  ];
}
