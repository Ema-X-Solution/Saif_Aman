"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { buildBusColumns } from "@/features/buses/lib/buses-columns";
import { busesService } from "@/services/buses.service";
import type { Bus } from "@/types/bus";

export function BusesView() {
  const [data, setData] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = useMemo(() => buildBusColumns(), []);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const rows = await busesService.list();
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
        title="Buses"
        description="Each bus links main/backup drivers & supervisors plus assigned areas."
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder="Search buses..."
        globalSearchAccessor={(row) =>
          `${row.plateNumber} ${row.schoolName} ${row.areaLabels.join(" ")}`
        }
      />
    </div>
  );
}
