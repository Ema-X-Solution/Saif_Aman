"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import type { AdminUser } from "@/types/admin";

export function buildAdminColumns(t: (key: string) => string): ColumnDef<AdminUser>[] {
  return [
    { accessorKey: "fullName", header: t("common.admin"), enableSorting: true },
    { accessorKey: "email", header: t("common.email"), enableSorting: true },
    { accessorKey: "role", header: t("common.role"), enableSorting: true },
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
          actions={[
            {
              id: "audit",
              label: t("admins.auditTrail"),
              onSelect: () => {},
            },
          ]}
        />
      ),
    },
  ];
}
