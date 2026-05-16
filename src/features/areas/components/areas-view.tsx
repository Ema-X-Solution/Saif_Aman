"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { buildAreaColumns } from "@/features/areas/lib/areas-columns";
import { areasService } from "@/services/areas.service";
import type { Area } from "@/types/area";
import { useT } from "@/i18n/use-t";

export function AreasView() {
  const t = useT();
  const [data, setData] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = useMemo(() => buildAreaColumns(t), [t]);

  useEffect(() => {
    let c = false;
    (async () => {
      setLoading(true);
      try {
        const rows = await areasService.list();
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
        title={t("areas.title")}
        description={t("areas.description")}
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder={t("areas.searchAreas")}
        globalSearchAccessor={(row) => `${row.name} ${row.district} ${row.schoolName}`}
      />
    </div>
  );
}
