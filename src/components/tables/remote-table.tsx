"use client";

import { useEffect, useMemo, useState } from "react";
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
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { cn } from "@/lib/utils";

export type RemoteColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
};

interface FetchResult<T> {
  data: T[];
  total: number;
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetcher({ page, pageSize, q: q || undefined });
        if (cancelled) return;
        setData(res.data);
        setTotal(res.total);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, q, fetcher]);

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
            onChange={(e) => setQ(e.target.value)}
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
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  {t("table.loading")}
                </TableCell>
              </TableRow>
            ) : data.length ? (
              data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render ? col.render(row) : (row as any)[col.key]}
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
          onPageChange={(p) => setPage(p)}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
      </div>
    </div>
  );
}

export default RemoteTable;
