"use client";

import type { ColumnDef } from "@tanstack/react-table";
import
 { EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Driver } from "@/types/driver";

function actions(
  driver: Driver,
  t: (key: string) => string,
  onEdit: (d: Driver) => void,
  onDelete: (d: Driver) => void
) {
  return [
    {
      id: "profile",
      label: t("users.openProfile"),
      onSelect: () => {},
    },
    {
      id: "edit",
      label: t("common.edit"),
      onSelect: () => onEdit(driver),
    },
    {
      id: "delete",
      label: t("common.delete"),
      onSelect: () => onDelete(driver),
      destructive: true,
    },
  ];
}

export function buildDriverColumns(
  t: (key: string) => string,
  onEdit: (d: Driver) => void,
  onDelete: (d: Driver) => void
): ColumnDef<Driver>[] {
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
        <EntityRowActions label={row.original.fullName} actions={actions(row.original, t, onEdit, onDelete)} />
      ),
    },
  ];
}
