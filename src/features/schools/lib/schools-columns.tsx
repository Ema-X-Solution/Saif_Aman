"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import type { School } from "@/types/school";

function rowActions(school: School, t: (key: string) => string) {
  return [
    {
      id: "view",
      label: t("common.viewDetails"),
      onSelect: () => {},
    },
    {
      id: "edit",
      label: t("common.edit"),
      onSelect: () => {},
    },
  ];
}

export function buildSchoolColumns(t: (key: string) => string): ColumnDef<School>[] {
  return [
    {
      accessorKey: "name",
      header: t("schools.schoolName"),
      enableSorting: true,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "city",
      header: t("schools.city"),
      enableSorting: true,
    },
    {
      accessorKey: "studentCount",
      header: t("schools.studentCount"),
      enableSorting: true,
    },
    {
      accessorKey: "busCount",
      header: t("schools.busCount"),
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: t("common.status"),
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
          actions={rowActions(row.original, t)}
        />
      ),
    },
  ];
}
