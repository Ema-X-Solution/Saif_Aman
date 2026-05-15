"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { buildReportColumns } from "@/features/reports/lib/report-columns";
import { reportsService } from "@/services/reports.service";
import type { ReportDefinition } from "@/types/report";

export function ReportsView() {
  const [data, setData] = useState<ReportDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = useMemo(() => buildReportColumns(), []);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const rows = await reportsService.list();
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
        title="Reports"
        description="Operational, safety, and finance exports with audit-friendly timestamps."
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder="Search reports..."
        globalSearchAccessor={(row) => `${row.name} ${row.category}`}
      />
    </div>
  );
}
