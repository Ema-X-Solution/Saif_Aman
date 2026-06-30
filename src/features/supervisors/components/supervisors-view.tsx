"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { AddUserDialog } from "@/features/users/components/add-user-dialog";
import { EditSupervisorDialog } from "@/features/supervisors/components/edit-supervisor-dialog";
import { DeleteSupervisorDialog } from "@/features/supervisors/components/delete-supervisor-dialog";
import { SupervisorDetailsDialog } from "@/features/supervisors/components/supervisor-details-dialog";
import { buildSupervisorColumns } from "@/features/supervisors/lib/supervisors-columns";
import { supervisorsService } from "@/services/supervisors.service";
import type { Supervisor } from "@/types/supervisor";
import { useT } from "@/i18n/use-t";

export function SupervisorsView() {
  const t = useT();
  const [data, setData] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingSupervisor, setEditingSupervisor] = useState<Supervisor | null>(null);
  const [viewingSupervisor, setViewingSupervisor] = useState<Supervisor | null>(null);
  const [deletingSupervisor, setDeletingSupervisor] = useState<Supervisor | null>(null);

  const columns = useMemo(
    () => buildSupervisorColumns(t, setEditingSupervisor, setViewingSupervisor, setDeletingSupervisor),
    [t]
  );

  useEffect(() => {
    let c = false;
    (async () => {
      setLoading(true);
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
  }, [reloadKey]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("users.supervisors")}
        description={t("users.supervisorsDesc")}
        actions={
          <AddUserDialog
            userType="supervisor"
            onCreated={() => setReloadKey((k) => k + 1)}
          />
        }
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder={t("users.searchSupervisors")}
        globalSearchAccessor={(row) => `${row.fullName} ${row.schoolName}`}
      />
      
      <EditSupervisorDialog
        supervisor={editingSupervisor}
        onClose={() => setEditingSupervisor(null)}
        onUpdated={() => setReloadKey((k) => k + 1)}
      />
      <SupervisorDetailsDialog
        supervisor={viewingSupervisor}
        onClose={() => setViewingSupervisor(null)}
      />
      <DeleteSupervisorDialog
        supervisor={deletingSupervisor}
        onClose={() => setDeletingSupervisor(null)}
        onDeleted={() => setReloadKey((k) => k + 1)}
      />
    </div>
  );
}
