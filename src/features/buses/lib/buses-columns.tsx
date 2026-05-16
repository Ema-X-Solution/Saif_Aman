"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Bus } from "@/types/bus";
import { toast } from "sonner";

export function buildBusColumns(t: (key: string) => string): ColumnDef<Bus>[] {
  return [
    { accessorKey: "plateNumber", header: t("common.plate"), enableSorting: true },
    { accessorKey: "schoolName", header: t("schools.school"), enableSorting: true },
    {
      id: "crew",
      header: t("common.primaryCrew"),
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-sm">
          <p>{row.original.mainDriverName}</p>
          <p className="text-muted-foreground">{row.original.mainSupervisorName}</p>
        </div>
      ),
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
          label={row.original.plateNumber}
          actions={[
            {
              id: "map",
              label: t("buses.openLiveMap"),
              onSelect: () => {},
            },
          ]}
        />
      ),
    },
  ];
}
