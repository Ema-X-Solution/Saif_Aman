"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SIDEBAR_NAV } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { localizedHref } from "@/lib/localized-href";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";

/** Supports locale-prefixed paths (e.g. `/ar/dashboard`) vs href `/dashboard`. */
function pathMatchesNav(pathname: string, href: string) {
  const pathOnly = href.split("?")[0].replace(/^\//, "") ?? "";
  if (!pathOnly) {
    return pathname === "/" || pathname.endsWith("/");
  }
  return pathname === `/${pathOnly}` || pathname.endsWith(`/${pathOnly}`);
}

interface AppSidebarProps {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

export function AppSidebar({ variant = "desktop", onNavigate }: AppSidebarProps) {
  const pathname = usePathname();
  const t = useT();
  const locale = getLocaleFromPathname(pathname ?? null);
  const asideDir = locale === "ar" ? "rtl" : "ltr";
  const { sidebarCollapsed, setSidebarCollapsed } = useUiStore();

  const widthClass =
    variant === "mobile"
      ? "w-full"
      : sidebarCollapsed
        ? "w-[84px]"
        : "w-[260px]";

  return (
    <aside
      dir={asideDir}
      className={cn(
        "flex h-full flex-col border-e border-border/80 bg-card/80 backdrop-blur-md transition-[width] duration-200",
        widthClass,
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center gap-2 px-4",
          sidebarCollapsed && variant === "desktop" && "justify-center px-2",
        )}
      >
        <BrandLogo
          href={localizedHref(locale, ROUTES.dashboard)}
          compact={variant === "mobile" ? false : sidebarCollapsed}
          className="min-w-0"
        />
        {variant === "desktop" ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="ms-auto hidden xl:inline-flex"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? "»" : "«"}
          </Button>
        ) : null}
      </div>
      <Separator />
      <ScrollArea dir={asideDir} className="flex-1 py-3">
        <nav
          dir={asideDir}
          className="flex flex-col gap-1 px-2"
          aria-label="Main navigation"
        >
          {SIDEBAR_NAV.map((item) => {
            const Icon = item.icon;
            const navHref = localizedHref(locale, item.href);
            const active =
              pathMatchesNav(pathname, item.href) ||
              pathname.startsWith(localizedHref(locale, item.href.split("?")[0]));
            return (
              <Link
                key={item.href}
                href={navHref}
                dir={asideDir}
                onClick={onNavigate}
                className={cn(
                  "flex flex-row items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  sidebarCollapsed &&
                  variant === "desktop" &&
                  "justify-center px-0",
                )}
                title={sidebarCollapsed && variant === "desktop" ? t(item.labelKey) : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!(sidebarCollapsed && variant === "desktop") ? (
                  <span className="truncate">{t(item.labelKey)}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <Separator />
      <div className="p-3 text-xs text-muted-foreground">
        {!(sidebarCollapsed && variant === "desktop") ? (
          <p>{t("sidebar.footer")}</p>
        ) : null}
      </div>
    </aside>
  );
}
