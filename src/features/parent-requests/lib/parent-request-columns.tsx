"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ParentRequest } from "@/types/parent-request";
import { MapPin } from "lucide-react";

function openMap(lat?: number | null, lng?: number | null) {
  if (typeof lat !== "number" || typeof lng !== "number") {
    toast.error("Location not available.");
    return;
  }
  const url = `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function buildParentRequestColumns(
  onUpdateStatus: (id: string, status: "approved" | "rejected" | "pending") => Promise<void>,
  t: (key: string) => string,
  onEdit: (p: ParentRequest) => void,
  onView: (p: ParentRequest) => void
): ColumnDef<ParentRequest>[] {
  return [
    { accessorKey: "id", header: t("common.id"), enableSorting: true },
    { accessorKey: "parentName", header: t("common.name"), enableSorting: true },
    { accessorKey: "email", header: t("common.email"), enableSorting: true },
    { accessorKey: "phone", header: t("common.phone"), enableSorting: true },
    { accessorKey: "type", header: t("common.type"), enableSorting: true },
    { accessorKey: "address", header: t("common.address"), enableSorting: true },
    {
      id: "location",
      header: t("common.location"),
      enableSorting: false,
      cell: ({ row }) => (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open location"
          onClick={() => openMap(row.original.latitude ?? null, row.original.longitude ?? null)}
          className="h-8 w-8"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "studentsCount",
      header: t("schools.studentCount"),
      enableSorting: true,
      cell: ({ row }) => {
        const v = row.original.studentsCount;
        return typeof v === "number" ? v : "—";
      },
    },
    { accessorKey: "schoolName", header: t("schools.school"), enableSorting: true },
    { accessorKey: "createdAt", header: t("parentRequests.created"), enableSorting: true },
    {
      accessorKey: "status",
      header: t("common.status"),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      enableSorting: true,
    },
    {
      id: "actions",
      header: t("common.actions"),
      enableSorting: false,
      cell: ({ row }) => {
        const status = row.original.status;

        const actions: { id: string; label: string; onSelect: () => Promise<void> | void }[] = [];

        actions.push({
          id: "view",
          label: t("common.viewDetails"),
          onSelect: () => onView(row.original),
        });

        actions.push({
          id: "edit",
          label: t("common.edit"),
          onSelect: () => onEdit(row.original),
        });

        if (status !== "approved") {
          actions.push({
            id: "approve",
            label: t("common.approved"),
            onSelect: async () => {
              try {
                await onUpdateStatus(row.original.id, "approved");
                toast.success("Request approved.");
              } catch {
                toast.error("Failed to approve request.");
              }
            },
          });
        }

        if (status !== "rejected") {
          actions.push({
            id: "reject",
            label: t("common.rejected"),
            onSelect: async () => {
              try {
                await onUpdateStatus(row.original.id, "rejected");
                toast.success("Request rejected.");
              } catch {
                toast.error("Failed to reject request.");
              }
            },
          });
        }

        return (
          <EntityRowActions
            label={row.original.parentName}
            actions={actions}
          />
        );
      },
    },
  ];
}
