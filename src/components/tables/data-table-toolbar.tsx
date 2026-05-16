"use client";

import type { ReactNode } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useT } from "@/i18n/use-t";

export interface DataTableToolbarProps {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filtersSlot?: ReactNode;
}

export function DataTableToolbar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filtersSlot,
}: DataTableToolbarProps) {
  const t = useT();
  return (
    <div className="flex flex-col gap-3 border-b border-border/80 bg-card px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-sm">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="ps-9"
          aria-label={t("common.search")}
        />
      </div>
      {filtersSlot ? (
        <div className="flex flex-wrap items-center gap-2">{filtersSlot}</div>
      ) : null}
    </div>
  );
}
