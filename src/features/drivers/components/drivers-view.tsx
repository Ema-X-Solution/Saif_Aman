"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { AddUserDialog } from "@/features/users/components/add-user-dialog";
import { EditDriverDialog } from "@/features/drivers/components/edit-driver-dialog";
import { DeleteDriverDialog } from "@/features/drivers/components/delete-driver-dialog";
import { DriverDetailsDialog } from "@/features/drivers/components/driver-details-dialog";
import { buildDriverColumns } from "@/features/drivers/lib/drivers-columns";
import { driversService } from "@/services/drivers.service";
import type { Driver } from "@/types/driver";
import { useT } from "@/i18n/use-t";

export function DriversView() {
  const t = useT();
  const [data, setData] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [viewingDriver, setViewingDriver] = useState<Driver | null>(null);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null);

  const columns = useMemo(() => buildDriverColumns(t, setViewingDriver, setEditingDriver, setDeletingDriver), [t]);

  useEffect(() => {
    let c = false;
    (async () => {
      setLoading(true);
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
  }, [reloadKey]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("users.drivers")}
        description={t("users.driversDesc")}
        actions={
          <AddUserDialog
            userType="driver"
            onCreated={() => setReloadKey((k) => k + 1)}
          />
        }
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder={t("users.searchDrivers")}
        globalSearchAccessor={(row) =>
          `${row.fullName} ${row.schoolName} ${row.licenseNumber}`
        }
      />
      
      <DriverDetailsDialog
        driver={viewingDriver}
        onClose={() => setViewingDriver(null)}
      />

      <EditDriverDialog
        driver={editingDriver}
        onClose={() => setEditingDriver(null)}
        onUpdated={() => setReloadKey((k) => k + 1)}
      />
      
      <DeleteDriverDialog
        driver={deletingDriver}
        onClose={() => setDeletingDriver(null)}
        onDeleted={() => setReloadKey((k) => k + 1)}
      />
    </div>
  );
}
