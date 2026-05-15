"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import type { School } from "@/types/school";
import { toast } from "sonner";

function rowActions(school: School) {
  return [
    {
      id: "view",
      label: "View details",
      onSelect: () => toast.message(`View ${school.name}`),
    },
    {
      id: "edit",
      label: "Edit school",
      onSelect: () => toast.message(`Edit ${school.name}`),
    },
  ];
}

export function buildSchoolColumns(): ColumnDef<School>[] {
  return [
    {
      accessorKey: "name",
      header: "School",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "city",
      header: "City",
      enableSorting: true,
    },
    {
      accessorKey: "studentCount",
      header: "Students",
      enableSorting: true,
    },
    {
      accessorKey: "busCount",
      header: "Buses",
      enableSorting: true,
    },
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
          label={row.original.name}
          actions={rowActions(row.original)}
        />
      ),
    },
  ];
}
