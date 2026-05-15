"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { buildAreaColumns } from "@/features/areas/lib/areas-columns";
import { areasService } from "@/services/areas.service";
import type { Area } from "@/types/area";

export function AreasView() {
  const [data, setData] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = useMemo(() => buildAreaColumns(), []);

  useEffect(() => {
    let c = false;
    (async () => {
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
        title="Areas"
        description="Areas are defined by admins and scoped per school for precise routing."
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder="Search areas..."
        globalSearchAccessor={(row) => `${row.name} ${row.district} ${row.schoolName}`}
      />
    </div>
  );
}
