"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { buildDriverColumns } from "@/features/drivers/lib/drivers-columns";
import { driversService } from "@/services/drivers.service";
import type { Driver } from "@/types/driver";

export function DriversView() {
  const [data, setData] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = useMemo(() => buildDriverColumns(), []);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const rows = await driversService.list();
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
        title="Drivers"
        description="Drivers belong to schools and rotate across approved buses."
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder="Search drivers..."
        globalSearchAccessor={(row) =>
          `${row.fullName} ${row.schoolName} ${row.licenseNumber}`
        }
      />
    </div>
  );
}
