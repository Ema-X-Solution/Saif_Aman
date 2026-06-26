"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { getLocaleFromPathname } from "@/i18n/use-t";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div
      dir={dir}
      className={cn(
        "flex flex-col gap-4 border-b border-border/80 pb-6 lg:flex-row lg:items-start lg:justify-between",
        className,
      )}
      suppressHydrationWarning={true}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div dir={dir} className="flex shrink-0 flex-wrap gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
