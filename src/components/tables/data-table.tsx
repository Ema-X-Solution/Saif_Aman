"use client";

import type { ReactNode } from "react";
import React from "react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ExpandedState,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

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
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
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
  renderSubComponent?: (props: { row: any }) => React.ReactElement; // eslint-disable-line @typescript-eslint/no-explicit-any
  filterFn?: (row: TData) => boolean;
}

export function DataTable<TData extends object>({
  columns,
  data,
  searchPlaceholder,
  globalSearchAccessor,
  isLoading,
  emptyMessage: emptyMessageProp,
  filtersSlot,
  initialPageSize = 10,
  getRowId,
  className,
  renderSubComponent,
  filterFn,
}: DataTableProps<TData>) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const tableDir = locale === "ar" ? "rtl" : "ltr";
  const emptyMessage = emptyMessageProp ?? t("table.noRecords");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 220);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const filtered = useMemo(() => {
    let result = data;
    if (globalSearchAccessor && debouncedSearch) {
      result = result.filter((row) =>
        matchesSearch(globalSearchAccessor(row), debouncedSearch),
      );
    }
    if (filterFn) {
      result = result.filter(filterFn);
    }
    return result;
  }, [data, debouncedSearch, globalSearchAccessor, filterFn]);

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, expanded },
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    initialState: {
      pagination: { pageSize: initialPageSize, pageIndex: 0 },
    },
    getRowId,
  });

  return (
    <div
      dir={tableDir}
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
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    onClick={
                      renderSubComponent
                        ? () => row.toggleExpanded()
                        : undefined
                    }
                    className={
                      renderSubComponent ? "cursor-pointer hover:bg-accent/50" : ""
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && renderSubComponent && (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="p-0">
                        <div className="bg-muted/30 p-4">
                          {renderSubComponent({ row })}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
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
