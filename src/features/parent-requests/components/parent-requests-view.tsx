"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { ParentDetailsDialog } from "@/features/parent-requests/components/parent-details-dialog";
import { EditParentDialog } from "@/features/parent-requests/components/edit-parent-dialog";
import { buildParentRequestColumns } from "@/features/parent-requests/lib/parent-request-columns";
import { parentRequestsService } from "@/services/parent-requests.service";
import type { ParentRequest } from "@/types/parent-request";
import { useT } from "@/i18n/use-t";

export function ParentRequestsView() {
  const t = useT();
  const [data, setData] = useState<ParentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingParent, setEditingParent] = useState<ParentRequest | null>(null);
  const [viewingParent, setViewingParent] = useState<ParentRequest | null>(null);

  const columns = useMemo(() =>
    buildParentRequestColumns(
      async (id, status) => {
        try {
          await parentRequestsService.updateStatus(id, status);
          setReloadKey((k) => k + 1);
        } catch {
          // error handled in columns
        }
      },
      t,
      setEditingParent,
      setViewingParent
    ),
    [t],
  );

  useEffect(() => {
    let c = false;
    (async () => {
      setLoading(true);
      try {
        const rows = await parentRequestsService.list();
        if (!c) setData(rows);
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => {
      c = true;
    };
  }, [reloadKey]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("parentRequests.title")}
        description={t("parentRequests.description")}
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder={t("parentRequests.searchParents")}
        globalSearchAccessor={(row) =>
          `${row.id} ${row.parentName} ${row.email ?? ""} ${row.phone ?? ""} ${row.type ?? ""} ${row.address ?? ""} ${row.studentsCount ?? ""} ${row.schoolName} ${row.createdAt ?? ""} ${row.status}`
        }
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
    </div>
  );
}
