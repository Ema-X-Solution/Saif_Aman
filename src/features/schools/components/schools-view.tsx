"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { buildSchoolColumns } from "@/features/schools/lib/schools-columns";
import { schoolsService } from "@/services/schools.service";
import type { School } from "@/types/school";

export function SchoolsView() {
  const [data, setData] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = useMemo(() => buildSchoolColumns(), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await schoolsService.list();
        if (!cancelled) setData(rows);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schools"
        description="Manage partner schools, fleet allocation, and operational status."
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder="Search schools..."
        globalSearchAccessor={(row) =>
          `${row.name} ${row.city} ${row.status}`
        }
      />
    </div>
  );
}
