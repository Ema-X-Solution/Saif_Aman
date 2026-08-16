"use client";

import { useMemo, useState } from "react";

import RemoteTable, { RemoteColumn } from "@/components/tables/remote-table";
import { PageHeader } from "@/components/shared/page-header";
import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import { ChangeParentStatusDialog } from "@/features/users/components/change-parent-status-dialog";
import { useT } from "@/i18n/use-t";
import { usersAdminService } from "@/services/users-admin.service";
import type { ApiUserRow } from "@/types/api";

type ParentRow = {
  id: string;
  fullName: string;
  phone: string;
  status: "approved" | "pending" | "rejected";
  updatedAt: string;
  raw: ApiUserRow;
};

export function ParentsView() {
  const t = useT();
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedUser, setSelectedUser] = useState<ApiUserRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetcher = async ({ page, pageSize, search }: { page: number; pageSize: number; search?: string }) => {
    const res = await usersAdminService.list({ page, per_page: pageSize, type: "parent", search });
    const rows = res.data ?? [];
    const mapped: ParentRow[] = rows.map((p) => ({
      id: String(p.id),
      fullName: p.name,
      phone: p.phone ?? "—",
      status: p.status === "approved" || p.status === "rejected" ? p.status : "pending",
      updatedAt: p.updated_at,
      raw: p,
    }));
    return {
      data: mapped,
      total: res.meta?.total ?? mapped.length,
      lastPage: res.meta?.last_page,
    };
  };

  const columns: RemoteColumn<ParentRow>[] = useMemo(
    () => [
      { key: "fullName", header: t("users.columnParent") },
      { key: "phone", header: t("common.phone") },
      {
        key: "status",
        header: t("common.status"),
        render: (r) => <StatusBadge status={r.status} />,
      },
      {
        key: "actions",
        header: "",
        render: (r) => (
          <EntityRowActions
            label={r.fullName}
            actions={[
              {
                id: "change-status",
                label: t("users.changeStatus"),
                onSelect: () => {
                  setSelectedUser(r.raw);
                  setDialogOpen(true);
                },
              },
            ]}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("users.parents")}
        description={t("users.parentsPageDescription")}
      />

      <RemoteTable<ParentRow>
        key={reloadKey}
        columns={columns}
        fetcher={fetcher}
        initialPageSize={10}
        searchPlaceholder={t("users.searchParents")}
        className=""
      />

      <ChangeParentStatusDialog
        open={dialogOpen}
        onOpenChange={(o) => setDialogOpen(o)}
        user={selectedUser}
        onUpdated={() => setReloadKey((k) => k + 1)}
      />
    </div>
  );
}
