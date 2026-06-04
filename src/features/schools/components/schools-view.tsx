"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { AddSchoolDialog } from "@/features/schools/components/add-school-dialog";
import { EditSchoolDialog } from "@/features/schools/components/edit-school-dialog";
import { SchoolDetailsDialog } from "@/features/schools/components/school-details-dialog";
import { DeleteSchoolDialog } from "@/features/schools/components/delete-school-dialog";
import { buildSchoolColumns } from "@/features/schools/lib/schools-columns";
import { schoolsService } from "@/services/schools.service";
import type { School } from "@/types/school";
import { useT } from "@/i18n/use-t";

export function SchoolsView() {
  const t = useT();
  const [data, setData] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [viewingSchool, setViewingSchool] = useState<School | null>(null);
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null);

  const columns = useMemo(
    () => buildSchoolColumns(t, setEditingSchool, setViewingSchool, setDeletingSchool),
    [t]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const rows = await schoolsService.list();
        if (!cancelled) setData(rows);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("schools.title")}
        description={t("schools.description")}
        actions={
          <AddSchoolDialog onCreated={() => setReloadKey((k) => k + 1)} />
        }
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder={t("schools.searchSchools")}
        globalSearchAccessor={(row) =>
          `${row.name} ${row.city} ${row.status}`
        }
      />
      
      <EditSchoolDialog
        school={editingSchool}
        onClose={() => setEditingSchool(null)}
        onUpdated={() => setReloadKey((k) => k + 1)}
      />
      <SchoolDetailsDialog
        school={viewingSchool}
        onClose={() => setViewingSchool(null)}
      />
      <DeleteSchoolDialog
        school={deletingSchool}
        onClose={() => setDeletingSchool(null)}
        onDeleted={() => setReloadKey((k) => k + 1)}
      />
    </div>
  );
}
