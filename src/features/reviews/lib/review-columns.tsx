"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { EntityRowActions } from "@/components/tables/entity-row-actions";
import type { Review } from "@/types/review";
import { toast } from "sonner";

export function buildReviewColumns(): ColumnDef<Review>[] {
  return [
    { accessorKey: "schoolName", header: "School", enableSorting: true },
    { accessorKey: "parentName", header: "Parent", enableSorting: true },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.rating.toFixed(1)} ★</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => (
        <span className="line-clamp-2 text-sm text-muted-foreground">
          {row.original.comment}
        </span>
      ),
      enableSorting: false,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <EntityRowActions
          label={row.original.id}
          actions={[
            {
              id: "reply",
              label: "Mark reviewed",
              onSelect: () => toast.message("Marked reviewed"),
            },
          ]}
        />
      ),
    },
  ];
}
