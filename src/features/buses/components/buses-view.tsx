"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { AddBusDialog } from "@/features/buses/components/add-bus-dialog";
import { EditBusDialog } from "@/features/buses/components/edit-bus-dialog";
import { BusDetailsDialog } from "@/features/buses/components/bus-details-dialog";
import { DeleteBusDialog } from "@/features/buses/components/delete-bus-dialog";
import { buildBusColumns } from "@/features/buses/lib/buses-columns";
import { busesService } from "@/services/buses.service";
import type { Bus } from "@/types/bus";
import { useT } from "@/i18n/use-t";

export function BusesView() {
  const t = useT();
  const [data, setData] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [viewingBus, setViewingBus] = useState<Bus | null>(null);
  const [deletingBus, setDeletingBus] = useState<Bus | null>(null);

  const columns = useMemo(
    () => buildBusColumns(t, setEditingBus, setViewingBus, setDeletingBus),
    [t]
  );

  useEffect(() => {
    let c = false;
    (async () => {
      setLoading(true);
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
  }, [reloadKey]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("buses.title")}
        description={t("buses.description")}
        actions={<AddBusDialog onCreated={() => setReloadKey((k) => k + 1)} />}
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder={t("buses.searchBuses")}
        globalSearchAccessor={(row) =>
          `${row.plateNumber} ${row.schoolName} ${row.areaLabels.join(" ")}`
        }
      />
      <EditBusDialog
        bus={editingBus}
        onClose={() => setEditingBus(null)}
        onUpdated={() => setReloadKey((k) => k + 1)}
      />
      <BusDetailsDialog
        bus={viewingBus}
        onClose={() => setViewingBus(null)}
      />
      <DeleteBusDialog
        bus={deletingBus}
        onClose={() => setDeletingBus(null)}
        onDeleted={() => setReloadKey((k) => k + 1)}
      />
    </div>
  );
}
