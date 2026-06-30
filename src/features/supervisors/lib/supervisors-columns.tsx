"use client";

import type { ColumnDef } from "@tanstack/react-table";
import
{ EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Supervisor } from "@/types/supervisor";

function actions(
  supervisor: Supervisor,
  t: (key: string) => string,
  onView: (s: Supervisor) => void,
  onEdit: (s: Supervisor) => void,
  onDelete: (s: Supervisor) => void
) {
  return [
    {
      id: "profile",
      label: t("users.openProfile"),
      onSelect: () => onView(supervisor),
    },
    {
      id: "edit",
      label: t("common.edit"),
      onSelect: () => onEdit(supervisor),
    },
    {
      id: "delete",
      label: t("common.delete"),
      onSelect: () => onDelete(supervisor),
      destructive: true,
    },
  ];
}

export function buildSupervisorColumns(
  t: (key: string) => string,
  onEdit: (s: Supervisor) => void,
  onView: (s: Supervisor) => void,
  onDelete: (s: Supervisor) => void
): ColumnDef<Supervisor>[] {
  return [
    { accessorKey: "fullName", header: t("common.supervisor"), enableSorting: true },
    { accessorKey: "schoolName", header: t("schools.school"), enableSorting: true },
    {
      accessorKey: "shift",
      header: t("common.shift"),
      cell: ({ row }) => {
        const raw = String(row.original.shift ?? "").toLowerCase();
        if (raw === "full") return t("users.shiftFull");
        if (raw === "part") return t("users.shiftPart");
        return row.original.shift;
      },
      enableSorting: true,
    },
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
        <EntityRowActions 
          label={row.original.fullName} 
          actions={actions(row.original, t, onView, onEdit, onDelete)} 
        />
      ),
    },
  ];
}
