"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { AddStudentDialog } from "@/features/students/components/add-student-dialog";
import { EditStudentDialog } from "@/features/students/components/edit-student-dialog";
import { StudentDetailsDialog } from "@/features/students/components/student-details-dialog";
import { DeleteStudentDialog } from "@/features/students/components/delete-student-dialog";
import { buildStudentColumns } from "@/features/students/lib/students-columns";
import { studentsService } from "@/services/students.service";
import type { Student } from "@/types/student";
import { useT } from "@/i18n/use-t";

export function StudentsView() {
  const t = useT();
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  const columns = useMemo(
    () => buildStudentColumns(t, setEditingStudent, setViewingStudent, setDeletingStudent),
    [t]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const rows = await studentsService.list();
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
        title={t("students.title")}
        description={t("students.description")}
        actions={<AddStudentDialog onCreated={() => setReloadKey((k) => k + 1)} />}
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={loading}
        searchPlaceholder={t("students.searchStudents")}
        globalSearchAccessor={(row) =>
          `${row.name} ${row.grade} ${row.parentName} ${row.schoolName} ${row.schoolBusLabel} ${row.notes ?? ""}`
        }
      />
      <EditStudentDialog
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onUpdated={() => setReloadKey((k) => k + 1)}
      />
      <StudentDetailsDialog
        studentId={viewingStudent?.id ?? null}
        onClose={() => setViewingStudent(null)}
      />
      <DeleteStudentDialog
        student={deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onDeleted={() => setReloadKey((k) => k + 1)}
      />
    </div>
  );
}
