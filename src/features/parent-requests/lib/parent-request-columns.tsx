"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ParentRequest } from "@/types/parent-request";

export function buildParentRequestColumns(): ColumnDef<ParentRequest>[] {
  return [
    { accessorKey: "parentName", header: "Parent", enableSorting: true },
    { accessorKey: "studentName", header: "Student", enableSorting: true },
    { accessorKey: "schoolName", header: "School", enableSorting: true },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      enableSorting: true,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <EntityRowActions
          label={row.original.parentName}
          actions={[
            {
              id: "resolve",
              label: "Resolve",
              onSelect: () => toast.success("Marked as resolved (mock)."),
            },
          ]}
        />
      ),
    },
  ];
}
