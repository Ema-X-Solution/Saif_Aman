"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { buildAdminColumns } from "@/features/admins/lib/admin-columns";
import { adminsService } from "@/services/admins.service";
import type { AdminUser } from "@/types/admin";

export function AdminsView() {
  const [data, setData] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = useMemo(() => buildAdminColumns(), []);

  useEffect(() => {
    let c = false;
    (async () => {
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
        title="Admins"
        description="Platform administrators who configure schools, areas, and governance."
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder="Search admins..."
        globalSearchAccessor={(row) => `${row.fullName} ${row.email}`}
      />
    </div>
  );
}
