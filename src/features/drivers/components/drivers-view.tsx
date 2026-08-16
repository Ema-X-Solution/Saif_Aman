"use client";

import { useMemo, useState } from "react";

import RemoteTable, { type RemoteColumn } from "@/components/tables/remote-table";
import { PageHeader } from "@/components/shared/page-header";
import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import { AddUserDialog } from "@/features/users/components/add-user-dialog";
import { EditDriverDialog } from "@/features/drivers/components/edit-driver-dialog";
import { DeleteDriverDialog } from "@/features/drivers/components/delete-driver-dialog";
import { DriverDetailsDialog } from "@/features/drivers/components/driver-details-dialog";
import { usersAdminService } from "@/services/users-admin.service";
import type { ApiUserRow } from "@/types/api";
import type { Driver } from "@/types/driver";
import { useT } from "@/i18n/use-t";

type DriverRow = {
  id: string;
  fullName: string;
  phone: string;
  status: "approved" | "pending" | "rejected";
  raw: ApiUserRow;
};

function toDriver(u: ApiUserRow): Driver {
  return {
    id: String(u.id),
    fullName: u.name,
    licenseNumber: "—",
    schoolId: u.school ? String(u.school.id) : "",
    schoolName: u.school?.name ?? "—",
    phone: u.phone ?? "—",
    status: u.status === "approved" || u.status === "rejected" ? u.status : "pending",
    updatedAt: u.updated_at,
  };
}

export function DriversView() {
  const t = useT();
  const [reloadKey, setReloadKey] = useState(0);
  const [viewingDriver, setViewingDriver] = useState<Driver | null>(null);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);

  const fetcher = async ({ page, pageSize, search }: { page: number; pageSize: number; search?: string }) => {
    const res = await usersAdminService.list({ page, per_page: pageSize, type: "driver", search });
    const rows = (res.data ?? []).map((u): DriverRow => ({
      id: String(u.id),
      fullName: u.name,
      phone: u.phone ?? "—",
      status: u.status === "approved" || u.status === "rejected" ? u.status : "pending",
      raw: u,
    }));
    return {
      data: rows,
      total: res.meta?.total ?? rows.length,
      lastPage: res.meta?.last_page,
    };
  };

  const columns: RemoteColumn<DriverRow>[] = useMemo(
    () => [
      { key: "fullName", header: t("common.driver") },
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
              { id: "profile", label: t("users.openProfile"), onSelect: () => setViewingDriver(toDriver(r.raw)) },
              { id: "edit",    label: t("common.edit"),        onSelect: () => setEditingDriver(toDriver(r.raw)) },
              { id: "delete",  label: t("common.delete"),      onSelect: () => setDeletingDriver(toDriver(r.raw)), destructive: true },
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
        title={t("users.drivers")}
        description={t("users.driversDesc")}
        actions={
          <AddUserDialog
            userType="driver"
            onCreated={() => setReloadKey((k) => k + 1)}
          />
        }
      />

      <RemoteTable<DriverRow>
        key={reloadKey}
        columns={columns}
        fetcher={fetcher}
        initialPageSize={10}
        searchPlaceholder={t("users.searchDrivers")}
      />

      <DriverDetailsDialog driver={viewingDriver} onClose={() => setViewingDriver(null)} />
      <EditDriverDialog driver={editingDriver} onClose={() => setEditingDriver(null)} onUpdated={() => setReloadKey((k) => k + 1)} />
      <DeleteDriverDialog driver={deletingDriver} onClose={() => setDeletingDriver(null)} onDeleted={() => setReloadKey((k) => k + 1)} />
    </div>
  );
}
