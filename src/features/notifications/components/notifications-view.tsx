"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { buildNotificationColumns } from "@/features/notifications/lib/notification-columns";
import { useT } from "@/i18n/use-t";
import { notificationsService } from "@/services/notifications.service";
import type { AppNotification } from "@/types/notification";

export function NotificationsView() {
  const t = useT();
  const [data, setData] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const columns = useMemo(() => buildNotificationColumns(), []);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const rows = await notificationsService.list();
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
        title={t("notifications.title")}
        description={t("notifications.description")}
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder={t("notifications.searchPlaceholder")}
        globalSearchAccessor={(row) => `${row.title} ${row.body}`}
      />
    </div>
  );
}
