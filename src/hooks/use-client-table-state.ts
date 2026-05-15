"use client";

import { useMemo, useState } from "react";
import type { SortDirection } from "@/types/common";

export interface ClientTableState<TData> {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  sorting: { id: keyof TData | string; desc: boolean } | null;
  setSorting: (
    next: { id: keyof TData | string; desc: boolean } | null,
  ) => void;
}

export function useClientTableState<TData>(
  initialPageSize = 10,
): ClientTableState<TData> {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<{
    id: keyof TData | string;
    desc: boolean;
  } | null>(null);

  return useMemo(
    () => ({
      page,
      pageSize,
      setPage,
      setPageSize,
      globalFilter,
      setGlobalFilter,
      sorting,
      setSorting,
    }),
    [page, pageSize, globalFilter, sorting],
  );
}

export function toggleSortDirection(
  current: SortDirection | undefined,
): SortDirection {
  return current === "asc" ? "desc" : "asc";
}
