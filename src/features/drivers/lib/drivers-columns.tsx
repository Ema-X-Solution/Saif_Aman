"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Driver } from "@/types/driver";

function actions(driver: Driver, t: (key: string) => string) {
  return [
    {
      id: "profile",
      label: t("users.openProfile"),
      onSelect: () => {},
    },
  ];
}

export function buildDriverColumns(t: (key: string) => string): ColumnDef<Driver>[] {
  return [
    { accessorKey: "fullName", header: t("common.driver"), enableSorting: true },
    { accessorKey: "licenseNumber", header: t("common.license"), enableSorting: true },
    { accessorKey: "schoolName", header: t("schools.school"), enableSorting: true },
    { accessorKey: "phone", header: t("common.phone"), enableSorting: false },
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
        <EntityRowActions label={row.original.fullName} actions={actions(row.original, t)} />
      ),
    },
  ];
}
