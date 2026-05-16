"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { buildParentRequestColumns } from "@/features/parent-requests/lib/parent-request-columns";
import { parentRequestsService } from "@/services/parent-requests.service";
import type { ParentRequest } from "@/types/parent-request";
import { useT } from "@/i18n/use-t";

export function ParentRequestsView() {
  const t = useT();
  const [data, setData] = useState<ParentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = useMemo(() =>
    buildParentRequestColumns(async (id, status) => {
      try {
        await parentRequestsService.updateStatus(id, status);
        const rows = await parentRequestsService.list();
        setData(rows);
      } catch {
        // error handled in columns
      }
    }, t),
    [t],
  );

  useEffect(() => {
    let c = false;
    (async () => {
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
  }, []);

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
    </div>
  );
}
