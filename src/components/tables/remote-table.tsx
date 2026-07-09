"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/tables/data-table-pagination";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { cn } from "@/lib/utils";

export type RemoteColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
};

export interface FetchResult<T> {
  data: T[];
  /** Total number of records across all pages (meta.total) */
  total: number;
  /** Last page number from API (meta.last_page). Falls back to ceil(total/pageSize) if omitted. */
  lastPage?: number;
}

interface Props<T> {
  columns: RemoteColumn<T>[];
  fetcher: (opts: { page: number; pageSize: number; q?: string }) => Promise<FetchResult<T>>;
  initialPage?: number;
  initialPageSize?: number;
  searchPlaceholder?: string;
  className?: string;
}

export function RemoteTable<T>({
  columns,
  fetcher,
  initialPage = 1,
  initialPageSize = 10,
  searchPlaceholder = "Search...",
  className,
}: Props<T>) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [q, setQ] = useState("");
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Store the latest fetcher in a ref so the data-fetching effect never needs
  // it as a dependency — this prevents infinite re-runs caused by inline
  // arrow functions being recreated on every parent render.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  // Re-fetch whenever page, pageSize, or search query changes.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetcherRef.current({ page, pageSize, q: q || undefined });
        if (cancelled) return;
        setData(res.data);
        setTotal(res.total);
        // Use last_page from API meta when available; otherwise compute it.
        setLastPage(res.lastPage ?? Math.max(1, Math.ceil(res.total / pageSize)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, q]);

  // Typing in the search box resets to page 1 immediately.
  const handleSearch = useCallback((value: string) => {
    setQ(value);
    setPage(1);
  }, []);

  const headers = useMemo(
    () => columns.map((c) => (
      <TableHead key={c.key} className={c.className}>{c.header}</TableHead>
    )),
    [columns],
  );

  return (
    <div
      dir={dir}
      className={cn("overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm", className)}
    >
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder={searchPlaceholder}
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label={t("common.search")}
          />
          <Button type="button" onClick={() => setPage(1)}>
            {t("table.searchAction")}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>{headers}</TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                  {columns.map((col, colIndex) => (
                    <TableCell key={`skeleton-col-${colIndex}`} className={col.className}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length ? (
              data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {t("table.noRecords")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-3">
        <DataTablePagination
          page={page}
          pageSize={pageSize}
          totalRows={total}
          lastPage={lastPage}
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      </div>
    </div>
  );
}

export default RemoteTable;
