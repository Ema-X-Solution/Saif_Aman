"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { buildSupervisorColumns } from "@/features/supervisors/lib/supervisors-columns";
import { supervisorsService } from "@/services/supervisors.service";
import type { Supervisor } from "@/types/supervisor";

export function SupervisorsView() {
  const [data, setData] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = useMemo(() => buildSupervisorColumns(), []);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const rows = await supervisorsService.list();
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
        title="Supervisors"
        description="Supervisors are assigned per school to escort students and verify manifests."
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder="Search supervisors..."
        globalSearchAccessor={(row) => `${row.fullName} ${row.schoolName}`}
      />
    </div>
  );
}
