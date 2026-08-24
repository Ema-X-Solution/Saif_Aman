"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import RemoteTable, { type RemoteColumn } from "@/components/tables/remote-table";
import { PageHeader } from "@/components/shared/page-header";
import { EntityRowActions } from "@/components/tables/entity-row-actions";
import { AddStudentDialog } from "@/features/students/components/add-student-dialog";
import { EditStudentDialog } from "@/features/students/components/edit-student-dialog";
import { StudentDetailsDialog } from "@/features/students/components/student-details-dialog";
import { DeleteStudentDialog } from "@/features/students/components/delete-student-dialog";
import { AssignBusDialog } from "@/features/students/components/assign-bus-dialog";
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
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [assigningBusStudent, setAssigningBusStudent] = useState<Student | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string>("all");

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

  const fetcher = async ({
    page,
    pageSize,
    search,
  }: {
    page: number;
    pageSize: number;
    search?: string;
  }) => {
    const res = await studentsService.list({
      page,
      per_page: pageSize,
      search,
      school_id: selectedSchool === "all" ? undefined : Number(selectedSchool),
    });
    return {
      data: res.data,
      total: res.meta?.total ?? res.data.length,
      lastPage: res.meta?.last_page,
    };
  };

  const columns: RemoteColumn<Student>[] = useMemo(
    () => [
      {
        key: "name",
        header: t("common.name"),
        render: (row) => (
          <div className="flex items-center gap-3">
            {row.image ? (
              <Image
                src={row.image}
                alt={row.name}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {row.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-medium">{row.name}</span>
          </div>
        ),
      },
      { key: "grade", header: t("students.grade") },
      { key: "parentName", header: t("common.parent") },
      { key: "schoolName", header: t("schools.school") },
      { key: "schoolBusLabel", header: t("students.bus") },
      {
        key: "actions",
        header: "",
        render: (row) => (
          <EntityRowActions
            label={row.name}
            actions={[
              {
                id: "view",
                label: t("common.viewDetails"),
                onSelect: () => setViewingStudent(row),
              },
              {
                id: "edit",
                label: t("common.edit"),
                onSelect: () => setEditingStudent(row),
              },
              {
                id: "assign-bus",
                label: t("students.assignBus"),
                onSelect: () => setAssigningBusStudent(row),
              },
              {
                id: "delete",
                label: t("common.delete") || "Delete",
                onSelect: () => setDeletingStudent(row),
                destructive: true,
              },
            ]}
          />
        ),
      },
    ],
    [t],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("students.title")}
        description={t("students.description")}
        actions={<AddStudentDialog onCreated={() => setReloadKey((k) => k + 1)} />}
      />
      <RemoteTable<Student>
        key={`${reloadKey}-${selectedSchool}`}
        columns={columns}
        fetcher={fetcher}
        initialPageSize={25}
        pageSizeOptions={[10, 25, 50]}
        searchPlaceholder={t("students.searchStudents")}
        filtersSlot={
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
