"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { AddUserDialog } from "@/features/users/components/add-user-dialog";
import { buildDriverColumns } from "@/features/drivers/lib/drivers-columns";
import { driversService } from "@/services/drivers.service";
import type { Driver } from "@/types/driver";
import { useT } from "@/i18n/use-t";

export function DriversView() {
  const t = useT();
  const [data, setData] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const columns = useMemo(() => buildDriverColumns(t), [t]);

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
    </div>
  );
}
