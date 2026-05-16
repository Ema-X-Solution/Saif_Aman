import Link from "next/link";

import { APP_NAME_AR, APP_NAME_EN } from "@/constants/app";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  className?: string;
  compact?: boolean;
}

/** Uses `/Logo.svg` from `public/` for login, sidebar, and browser chrome metadata. */
export function BrandLogo({
  href = "/",
  className,
  compact = false,
}: BrandLogoProps) {
  const title = `${APP_NAME_EN} · ${APP_NAME_AR}`;
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 rounded-lg outline-none ring-ring transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-offset-2",
        className,
      )}
      aria-label={title}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG asset may be large/complex */}
      <img
        src="/Logo.svg"
        alt=""
        width={compact ? 132 : 176}
        height={44}
        className={cn(
          "h-9 w-auto shrink-0 object-contain object-start transition-opacity group-hover:opacity-95 sm:h-10",
          compact && "h-8 sm:h-8",
        )}
        decoding="async"
      />
      <span className="sr-only">{title}</span>
      {!compact ? (
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="text-xs font-medium tracking-wide text-muted-foreground">
            {APP_NAME_EN}
          </span>

        </span>
      ) : null}
    </Link>
  );
}
