"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SIDEBAR_NAV } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";

interface AppSidebarProps {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

export function AppSidebar({ variant = "desktop", onNavigate }: AppSidebarProps) {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useUiStore();

  const widthClass =
    variant === "mobile"
      ? "w-full"
      : sidebarCollapsed
        ? "w-[84px]"
        : "w-[260px]";

  return (
    <aside
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
          href={ROUTES.dashboard}
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
      <ScrollArea className="flex-1 py-3">
        <nav className="flex flex-col gap-1 px-2" aria-label="Main navigation">
          {SIDEBAR_NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  sidebarCollapsed &&
                    variant === "desktop" &&
                    "justify-center px-0",
                )}
                title={sidebarCollapsed && variant === "desktop" ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!(sidebarCollapsed && variant === "desktop") ? (
                  <span>{item.label}</span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <Separator />
      <div className="p-3 text-xs text-muted-foreground">
        {!(sidebarCollapsed && variant === "desktop") ? (
          <p>Admin console · SAIF AMAN</p>
        ) : null}
      </div>
    </aside>
  );
}
