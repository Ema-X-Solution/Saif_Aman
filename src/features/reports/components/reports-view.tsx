"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { buildReportColumns } from "@/features/reports/lib/report-columns";
import { useT } from "@/i18n/use-t";
import { reportsService } from "@/services/reports.service";
import type { ReportDefinition } from "@/types/report";

export function ReportsView() {
  const t = useT();
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
        title={t("reports.title")}
        description={t("reports.description")}
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder={t("reports.searchPlaceholder")}
        globalSearchAccessor={(row) => `${row.name} ${row.category}`}
      />
    </div>
  );
}
