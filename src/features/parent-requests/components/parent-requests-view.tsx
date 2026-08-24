"use client";

import { useMemo, useState } from "react";

import RemoteTable, { type RemoteColumn } from "@/components/tables/remote-table";
import { PageHeader } from "@/components/shared/page-header";
import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { ParentDetailsDialog } from "@/features/parent-requests/components/parent-details-dialog";
import { EditParentDialog } from "@/features/parent-requests/components/edit-parent-dialog";
import { DeleteParentDialog } from "@/features/parent-requests/components/delete-parent-dialog";
import { usersAdminService } from "@/services/users-admin.service";
import { parentRequestsService } from "@/services/parent-requests.service";
import type { ApiUserRow } from "@/types/api";
import type { ParentRequest } from "@/types/parent-request";
import { useT } from "@/i18n/use-t";
import { MapPin } from "lucide-react";
import { toast } from "sonner";

type ParentRow = {
  id: string;
  parentName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  studentsCount: number;
  status: "approved" | "pending" | "rejected";
  raw: ApiUserRow;
};

function toParentRequest(u: ApiUserRow): ParentRequest {
  return {
    id: String(u.id),
    parentName: u.name,
    studentName: u.students_count ? String(u.students_count) : "—",
    schoolId: u.school ? String(u.school.id) : "",
    schoolName: u.school?.name ?? "—",
    routeNote: u.address ?? "",
    status: (u.status === "approved" || u.status === "rejected") ? u.status : "pending",
    submittedAt: u.created_at,
    email: u.email,
    phone: u.phone,
    type: u.type,
    address: u.address,
    latitude: u.latitude,
    longitude: u.longitude,
    studentsCount: u.students_count,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
    image: u.image,
    homeImage: u.home_image,
  };
}

function openMap(lat: number | null | undefined, lng: number | null | undefined, t: (k: string) => string) {
  if (typeof lat !== "number" || typeof lng !== "number") {
    toast.error(t("parentRequests.locationNotAvailable"));
    return;
  }
  window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank", "noopener,noreferrer");
}

export function ParentRequestsView() {
  const t = useT();
  const [reloadKey, setReloadKey] = useState(0);
  const [editingParent, setEditingParent] = useState<ParentRequest | null>(null);
  const [viewingParent, setViewingParent] = useState<ParentRequest | null>(null);
  const [deletingParent, setDeletingParent] = useState<ParentRequest | null>(null);

  const fetcher = async ({ page, pageSize, search }: { page: number; pageSize: number; search?: string }) => {
    const res = await usersAdminService.list({ page, per_page: pageSize, type: "parent", search });
    const rows = (res.data ?? []).map((u): ParentRow => ({
      id: String(u.id),
      parentName: u.name,
      email: u.email,
      phone: u.phone,
      address: u.address,
      latitude: u.latitude,
      longitude: u.longitude,
      studentsCount: u.students_count,
      status: (u.status === "approved" || u.status === "rejected") ? u.status : "pending",
      raw: u,
    }));
    return {
      data: rows,
      total: res.meta?.total ?? rows.length,
      lastPage: res.meta?.last_page,
    };
  };

  const columns: RemoteColumn<ParentRow>[] = useMemo(
    () => [
      { key: "id",           header: t("common.id") },
      { key: "parentName",   header: t("common.name") },
      { key: "email",        header: t("common.email"), render: (r) => r.email ?? "—" },
      { key: "phone",        header: t("common.phone"), render: (r) => r.phone ?? "—" },
      { key: "address",      header: t("common.address"), render: (r) => r.address ?? "—" },
      {
        key: "location",
        header: t("common.location"),
        render: (r) => (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label={t("common.location")}
            onClick={() => openMap(r.latitude, r.longitude, t)}
          >
            <MapPin className="h-4 w-4" />
          </Button>
        ),
      },
      {
        key: "studentsCount",
        header: t("schools.studentCount"),
        render: (r) => typeof r.studentsCount === "number" ? r.studentsCount : "—",
      },
      {
        key: "status",
        header: t("common.status"),
        render: (r) => <StatusBadge status={r.status} />,
      },
      {
        key: "actions",
        header: t("common.actions"),
        render: (r) => {
          const pr = toParentRequest(r.raw);
          const statusActions = [];
          if (r.status !== "approved") {
            statusActions.push({
              id: "approve",
              label: t("common.approved"),
              onSelect: async () => {
                try {
                  await parentRequestsService.updateStatus(r.id, "approved");
                  toast.success(t("parentRequests.approveSuccess"));
                  setReloadKey((k) => k + 1);
                } catch {
                  toast.error(t("parentRequests.approveFailed"));
                }
              },
            });
          }
          if (r.status !== "rejected") {
            statusActions.push({
              id: "reject",
              label: t("common.rejected"),
              onSelect: async () => {
                try {
                  await parentRequestsService.updateStatus(r.id, "rejected");
                  toast.success(t("parentRequests.rejectSuccess"));
                  setReloadKey((k) => k + 1);
                } catch {
                  toast.error(t("parentRequests.rejectFailed"));
                }
              },
            });
          }
          return (
            <EntityRowActions
              label={r.parentName}
              actions={[
                { id: "view", label: t("common.viewDetails"), onSelect: () => setViewingParent(pr) },
                { id: "edit", label: t("common.edit"),        onSelect: () => setEditingParent(pr) },
                ...statusActions,
                {
                  id: "delete",
                  label: t("common.delete"),
                  onSelect: () => setDeletingParent(pr),
                  destructive: true,
                },
              ]}
            />
          );
        },
      },
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("parentRequests.title")}
        description={t("parentRequests.description")}
      />

      <RemoteTable<ParentRow>
        key={reloadKey}
        columns={columns}
        fetcher={fetcher}
        initialPageSize={10}
        searchPlaceholder={t("parentRequests.searchParents")}
      />

      <EditParentDialog
        parent={editingParent}
        onClose={() => setEditingParent(null)}
        onUpdated={() => setReloadKey((k) => k + 1)}
      />
      <ParentDetailsDialog
        parent={viewingParent}
        onClose={() => setViewingParent(null)}
      />
      <DeleteParentDialog
        parent={deletingParent}
        onClose={() => setDeletingParent(null)}
        onDeleted={() => setReloadKey((k) => k + 1)}
      />
    </div>
  );
}
