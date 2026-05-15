"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Driver } from "@/types/driver";

function actions(driver: Driver) {
  return [
    {
      id: "profile",
      label: "Open profile",
      onSelect: () => toast.message(driver.fullName),
    },
  ];
}

export function buildDriverColumns(): ColumnDef<Driver>[] {
  return [
    { accessorKey: "fullName", header: "Driver", enableSorting: true },
    { accessorKey: "licenseNumber", header: "License", enableSorting: true },
    { accessorKey: "schoolName", header: "School", enableSorting: true },
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
        <EntityRowActions label={row.original.fullName} actions={actions(row.original)} />
      ),
    },
  ];
}
