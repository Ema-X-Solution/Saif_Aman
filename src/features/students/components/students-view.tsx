"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/tables/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { AddStudentDialog } from "@/features/students/components/add-student-dialog";
import { EditStudentDialog } from "@/features/students/components/edit-student-dialog";
import { StudentDetailsDialog } from "@/features/students/components/student-details-dialog";
import { DeleteStudentDialog } from "@/features/students/components/delete-student-dialog";
import { AssignBusDialog } from "@/features/students/components/assign-bus-dialog";
import { buildStudentColumns } from "@/features/students/lib/students-columns";
import { studentsService } from "@/services/students.service";
import { schoolsService } from "@/services/schools.service";
import type { Student } from "@/types/student";
import type { School } from "@/types/school";
import { useT } from "@/i18n/use-t";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StudentsView() {
  const t = useT();
  const [data, setData] = useState<Student[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [assigningBusStudent, setAssigningBusStudent] = useState<Student | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string>("all");

  const columns = useMemo(
    () => buildStudentColumns(t, setEditingStudent, setViewingStudent, setDeletingStudent, setAssigningBusStudent),
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setSchoolsLoading(true);
      try {
        const rows = await schoolsService.list();
        if (!cancelled) setSchools(rows);
      } finally {
        if (!cancelled) setSchoolsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filterFn = useMemo(() => {
    if (selectedSchool === "all") {
      return () => true;
    }
    return (student: Student) => student.schoolId === selectedSchool;
  }, [selectedSchool]);

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
        filterFn={filterFn}
        filtersSlot={
          <div className="flex items-center gap-3">
            <Select value={selectedSchool} onValueChange={setSelectedSchool} disabled={schoolsLoading}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t("schools.selectSchool")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
      <AssignBusDialog
        student={assigningBusStudent}
        onClose={() => setAssigningBusStudent(null)}
        onAssigned={() => setReloadKey((k) => k + 1)}
      />
    </div>
  );
}
