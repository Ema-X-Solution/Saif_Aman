"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { EntityRowActions } from "@/components/tables/entity-row-actions";
import type { Area } from "@/types/area";
export function buildAreaColumns(t: (key: string) => string): ColumnDef<Area>[] {
  return [
    { accessorKey: "name", header: t("common.area"), enableSorting: true },
    { accessorKey: "schoolName", header: t("schools.school"), enableSorting: true },
    { accessorKey: "district", header: t("areas.district"), enableSorting: true },
    { accessorKey: "stops", header: t("areas.stops"), enableSorting: true },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <EntityRowActions
          label={row.original.name}
          actions={[
            {
              id: "edit",
              label: t("areas.editGeometry"),
              onSelect: () => {},
            },
          ]}
        />
      ),
    },
  ];
}
