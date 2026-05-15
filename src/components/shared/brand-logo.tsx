import { Bus } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  className?: string;
  compact?: boolean;
}

export function BrandLogo({
  href = "/",
  className,
  compact = false,
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2", className)}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20 transition group-hover:bg-primary/90">
        <Bus className="h-5 w-5" aria-hidden />
      </span>
      {!compact ? (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-wide text-foreground">
            SAIF AMAN
          </span>
          <span className="text-xs text-muted-foreground" dir="rtl">
            سيف أمان
          </span>
        </span>
      ) : null}
    </Link>
  );
}
