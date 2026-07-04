"use client";

import { MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface EntityRowAction {
  id: string;
  label: string;
  onSelect: () => void;
  destructive?: boolean;
}

interface EntityRowActionsProps {
  label: string;
  actions: EntityRowAction[];
}

export function EntityRowActions({ label, actions }: EntityRowActionsProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`${t("common.actions")} ${label}`}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={dir === "rtl" ? "start" : "end"}
        className="w-48"
      >
        <DropdownMenuLabel className="text-start">{t("common.actions")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            onClick={action.onSelect}
            className={cn(
              "text-start",
              action.destructive ? "text-destructive focus:text-destructive" : undefined
            )}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
