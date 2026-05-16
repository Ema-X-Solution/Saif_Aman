"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { buildAdminColumns } from "@/features/admins/lib/admin-columns";
import { adminsService } from "@/services/admins.service";
import type { AdminUser } from "@/types/admin";
import { useT } from "@/i18n/use-t";

export function AdminsView() {
  const t = useT();
  const [data, setData] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = useMemo(() => buildAdminColumns(t), [t]);

  useEffect(() => {
    let c = false;
    (async () => {
      setLoading(true);
      try {
        const rows = await adminsService.list();
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
        title={t("admins.title")}
        description={t("admins.description")}
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder={t("admins.searchAdmins")}
        globalSearchAccessor={(row) => `${row.fullName} ${row.email}`}
      />
    </div>
  );
}
