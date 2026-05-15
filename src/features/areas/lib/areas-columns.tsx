"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { EntityRowActions } from "@/components/tables/entity-row-actions";
import type { Area } from "@/types/area";
import { toast } from "sonner";

export function buildAreaColumns(): ColumnDef<Area>[] {
  return [
    { accessorKey: "name", header: "Area", enableSorting: true },
    { accessorKey: "schoolName", header: "School", enableSorting: true },
    { accessorKey: "district", header: "District", enableSorting: true },
    { accessorKey: "stops", header: "Stops", enableSorting: true },
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
              label: "Edit geometry",
              onSelect: () => toast.message(row.original.name),
            },
          ]}
        />
      ),
    },
  ];
}
