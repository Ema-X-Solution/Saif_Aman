"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/use-t";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DataTablePaginationProps {
  page: number;
  pageSize: number;
  totalRows: number;
  /** When provided, used directly as the page count (from API meta.last_page). */
  lastPage?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export function DataTablePagination({
  page,
  pageSize,
  totalRows,
  lastPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: DataTablePaginationProps) {
  const t = useT();
  // Prefer last_page from the API (exact); fall back to local computation.
  const pageCount = lastPage ?? Math.max(1, Math.ceil(totalRows / pageSize));
  const canPrev = page > 1;
  const canNext = page < pageCount;

  return (
    <div className="flex flex-col gap-3 border-t border-border/80 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {t("table.showing")}{" "}
        <span className="font-medium text-foreground">
          {totalRows === 0 ? 0 : (page - 1) * pageSize + 1}
        </span>{" "}
        {t("table.to")}{" "}
        <span className="font-medium text-foreground">
          {Math.min(page * pageSize, totalRows)}
        </span>{" "}
        {t("table.of")}{" "}
        <span className="font-medium text-foreground">{totalRows}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("table.rows")}</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger className="h-9 w-[84px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={t("table.prevPage")}
            disabled={!canPrev}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <span className="px-2 text-sm text-muted-foreground">
            {page} / {pageCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={t("table.nextPage")}
            disabled={!canNext}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
