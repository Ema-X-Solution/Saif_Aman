"use client";

import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/brand-logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { getLocaleFromPathname } from "@/i18n/use-t";
import { ROUTES } from "@/constants/routes";
import { localizedHref } from "@/lib/localized-href";
import { cn } from "@/lib/utils";

export function PublicHeader({ className }: { className?: string }) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const homeHref = localizedHref(locale, ROUTES.home);

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLogo href={homeHref} />
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
