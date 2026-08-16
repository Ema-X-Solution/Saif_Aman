"use client";

import { useMemo, useState } from "react";

import RemoteTable, { type RemoteColumn } from "@/components/tables/remote-table";
import { PageHeader } from "@/components/shared/page-header";
import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import { AddUserDialog } from "@/features/users/components/add-user-dialog";
import { EditSupervisorDialog } from "@/features/supervisors/components/edit-supervisor-dialog";
import { DeleteSupervisorDialog } from "@/features/supervisors/components/delete-supervisor-dialog";
import { SupervisorDetailsDialog } from "@/features/supervisors/components/supervisor-details-dialog";
import { usersAdminService } from "@/services/users-admin.service";
import type { ApiUserRow } from "@/types/api";
import type { Supervisor } from "@/types/supervisor";
import { useT } from "@/i18n/use-t";

type SupervisorRow = {
  id: string;
  fullName: string;
  phone: string;
  status: "approved" | "pending" | "rejected";
  raw: ApiUserRow;
};

function toSupervisor(u: ApiUserRow): Supervisor {
  return {
    id: String(u.id),
    fullName: u.name,
    schoolId: u.school ? String(u.school.id) : "",
    schoolName: u.school?.name ?? "—",
    phone: u.phone ?? "—",
    email: u.email,
    address: u.address,
    latitude: u.latitude,
    longitude: u.longitude,
    image: u.image,
    homeImage: u.home_image,
    shift: "full",
    status: u.status === "approved" || u.status === "rejected" ? u.status : "pending",
    updatedAt: u.updated_at,
  };
}

export function SupervisorsView() {
  const t = useT();
  const [reloadKey, setReloadKey] = useState(0);
  const [viewingSupervisor, setViewingSupervisor] = useState<Supervisor | null>(null);
  const [editingSupervisor, setEditingSupervisor] = useState<Supervisor | null>(null);
  const [deletingSupervisor, setDeletingSupervisor] = useState<Supervisor | null>(null);

  const fetcher = async ({ page, pageSize, search }: { page: number; pageSize: number; search?: string }) => {
    const res = await usersAdminService.list({ page, per_page: pageSize, type: "supervisor", search });
    const rows = (res.data ?? []).map((u): SupervisorRow => ({
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

  const columns: RemoteColumn<SupervisorRow>[] = useMemo(
    () => [
      { key: "fullName", header: t("common.supervisor") },
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
              { id: "profile", label: t("users.openProfile"), onSelect: () => setViewingSupervisor(toSupervisor(r.raw)) },
              { id: "edit",    label: t("common.edit"),        onSelect: () => setEditingSupervisor(toSupervisor(r.raw)) },
              { id: "delete",  label: t("common.delete"),      onSelect: () => setDeletingSupervisor(toSupervisor(r.raw)), destructive: true },
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
        title={t("users.supervisors")}
        description={t("users.supervisorsDesc")}
        actions={
          <AddUserDialog
            userType="supervisor"
            onCreated={() => setReloadKey((k) => k + 1)}
          />
        }
      />

      <RemoteTable<SupervisorRow>
        key={reloadKey}
        columns={columns}
        fetcher={fetcher}
        initialPageSize={10}
        searchPlaceholder={t("users.searchSupervisors")}
      />

      <SupervisorDetailsDialog supervisor={viewingSupervisor} onClose={() => setViewingSupervisor(null)} />
      <EditSupervisorDialog supervisor={editingSupervisor} onClose={() => setEditingSupervisor(null)} onUpdated={() => setReloadKey((k) => k + 1)} />
      <DeleteSupervisorDialog supervisor={deletingSupervisor} onClose={() => setDeletingSupervisor(null)} onDeleted={() => setReloadKey((k) => k + 1)} />
    </div>
  );
}
