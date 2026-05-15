"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { buildParentRequestColumns } from "@/features/parent-requests/lib/parent-request-columns";
import { parentRequestsService } from "@/services/parent-requests.service";
import type { ParentRequest } from "@/types/parent-request";

export function ParentRequestsView() {
  const [data, setData] = useState<ParentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = useMemo(() => buildParentRequestColumns(), []);

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
        title="Parent requests"
        description="Structured intake for schedule tweaks, new stops, and safety notes."
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder="Search requests..."
        globalSearchAccessor={(row) =>
          `${row.parentName} ${row.studentName} ${row.routeNote}`
        }
      />
    </div>
  );
}
