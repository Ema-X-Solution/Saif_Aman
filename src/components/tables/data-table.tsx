"use client";

import type { ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { DataTablePagination } from "@/components/tables/data-table-pagination";
import { DataTableToolbar } from "@/components/tables/data-table-toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { matchesSearch } from "@/lib/table-helpers";
import { cn } from "@/lib/utils";

export interface DataTableProps<TData extends object> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  searchPlaceholder: string;
  globalSearchAccessor?: (row: TData) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  filtersSlot?: ReactNode;
  initialPageSize?: number;
  getRowId?: (row: TData, index: number) => string;
  className?: string;
}

export function DataTable<TData extends object>({
  columns,
  data,
  searchPlaceholder,
  globalSearchAccessor,
  isLoading,
  emptyMessage = "No records found.",
  filtersSlot,
  initialPageSize = 10,
  getRowId,
  className,
}: DataTableProps<TData>) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 220);
  const [sorting, setSorting] = useState<SortingState>([]);

  const filtered = useMemo(() => {
    if (!globalSearchAccessor || !debouncedSearch) {
      return data;
    }
    return data.filter((row) =>
      matchesSearch(globalSearchAccessor(row), debouncedSearch),
    );
  }, [data, debouncedSearch, globalSearchAccessor]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: initialPageSize, pageIndex: 0 },
    },
    getRowId,
  });

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm",
        className,
      )}
    >
      <DataTableToolbar
        searchPlaceholder={searchPlaceholder}
        searchValue={search}
        onSearchChange={setSearch}
        filtersSlot={filtersSlot}
      />
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {columns.map((_, j) => (
                    <TableCell key={`skc-${j}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        page={table.getState().pagination.pageIndex + 1}
        pageSize={table.getState().pagination.pageSize}
        totalRows={filtered.length}
        onPageChange={(next) => table.setPageIndex(next - 1)}
        onPageSizeChange={(size) => table.setPageSize(size)}
      />
    </div>
  );
}
