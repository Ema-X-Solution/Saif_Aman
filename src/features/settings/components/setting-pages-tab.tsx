
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { SettingPageDialog } from "./setting-page-dialog";
import { settingPagesService } from "@/services/index";
import type { SettingPage } from "@/types/settings";
import { useT } from "@/i18n/use-t";

export function SettingPagesTab() {
  const t = useT();
  const [data, setData] = useState<SettingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<SettingPage | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const rows = await settingPagesService.list();
        if (!cancelled) setData(rows);
      } catch {
        if (!cancelled) toast.error(t("pages.toastLoadError"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey, t]);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await settingPagesService.remove(id);
      toast.success(t("pages.toastDeleteSuccess"));
      setReloadKey((k) => k + 1);
    } catch {
      toast.error(t("pages.toastDeleteError"));
    }
  }, [t]);

  const columns = useMemo<ColumnDef<SettingPage>[]>(
    () => [
      {
        accessorKey: "title",
        header: t("pages.title") || "Title",
      },
      {
        accessorKey: "key",
        header: t("pages.key") || "Key",
      },
      {
        accessorKey: "active",
        header: t("pages.status") || "Status",
        cell: ({ row }) => {
          return (
            <StatusBadge
              status={row.original.active ? "active" : "inactive"}
            />
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const page = row.original;
          return (
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingPage(page);
                  setDialogOpen(true);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => {
                  if (confirm(t("pages.deletePrompt"))) {
                    handleDelete(page.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [t, handleDelete]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{t("pages.managerTitle")}</h3>
          <p className="text-sm text-muted-foreground">{t("pages.managerDesc")}</p>
        </div>
        <Button
          onClick={() => {
            setEditingPage(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("pages.addPage")}
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder={t("pages.search") || "Search pages..."}
        globalSearchAccessor={(row) => `${row.title} ${row.key}`}
      />

      <SettingPageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        page={editingPage}
        onSaved={() => setReloadKey((k) => k + 1)}
      />
    </div>
  );
}
