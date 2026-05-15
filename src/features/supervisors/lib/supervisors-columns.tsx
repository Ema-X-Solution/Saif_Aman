"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Supervisor } from "@/types/supervisor";

export function buildSupervisorColumns(): ColumnDef<Supervisor>[] {
  return [
    { accessorKey: "fullName", header: "Supervisor", enableSorting: true },
    { accessorKey: "schoolName", header: "School", enableSorting: true },
    { accessorKey: "shift", header: "Shift", enableSorting: true },
    { accessorKey: "phone", header: "Phone", enableSorting: false },
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
          label={row.original.fullName}
          actions={[
            {
              id: "open",
              label: "Open profile",
              onSelect: () => toast.message(row.original.fullName),
            },
          ]}
        />
      ),
    },
  ];
}
