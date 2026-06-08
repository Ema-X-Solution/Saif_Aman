"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { EntityRowActions } from "@/components/tables/entity-row-actions";
import type { Student } from "@/types/student";

export function buildStudentColumns(
  t: (key: string) => string,
  onEdit: (s: Student) => void,
  onView: (s: Student) => void,
  onDelete: (s: Student) => void
): ColumnDef<Student>[] {
  return [
    {
      accessorKey: "name",
      header: t("common.name"),
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.image ? (
            <Image
              src={row.original.image}
              alt={row.original.name}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {row.original.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "grade",
      header: t("students.grade"),
      enableSorting: true,
    },
    {
      accessorKey: "parentName",
      header: t("common.parent"),
      enableSorting: true,
    },
    {
      accessorKey: "schoolName",
      header: t("schools.school"),
      enableSorting: true,
    },
    {
      accessorKey: "schoolBusLabel",
      header: t("students.bus"),
      enableSorting: true,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <EntityRowActions
          label={row.original.name}
          actions={[
            {
              id: "view",
              label: t("common.viewDetails"),
              onSelect: () => onView(row.original),
            },
            {
              id: "edit",
              label: t("common.edit"),
              onSelect: () => onEdit(row.original),
            },
            {
              id: "delete",
              label: t("common.delete") || "Delete",
              onSelect: () => onDelete(row.original),
              destructive: true,
            },
          ]}
        />
      ),
    },
  ];
}
