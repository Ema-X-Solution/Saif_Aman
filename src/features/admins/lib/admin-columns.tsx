"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import type { AdminUser } from "@/types/admin";

export function buildAdminColumns(): ColumnDef<AdminUser>[] {
  return [
    { accessorKey: "fullName", header: "Admin", enableSorting: true },
    { accessorKey: "email", header: "Email", enableSorting: true },
    { accessorKey: "role", header: "Role", enableSorting: true },
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
          label={row.original.fullName}
          actions={[
            {
              id: "audit",
              label: "Audit trail",
              onSelect: () => toast.message(`Audit ${row.original.email}`),
            },
          ]}
        />
      ),
    },
  ];
}
