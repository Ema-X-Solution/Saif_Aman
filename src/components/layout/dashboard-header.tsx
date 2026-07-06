"use client";

import { LogOut, Menu, User, Bell } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ROUTES } from "@/constants/routes";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { localizedHref } from "@/lib/localized-href";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";
import { notificationsService } from "@/services";
import type { AppNotification } from "@/types/notification";
import { cn } from "@/lib/utils";

const CHANNEL_ICONS = {
  system: User,
  route: Bell,
  safety: LogOut,
  billing: User,
} as const;

const CHANNEL_COLORS = {
  system: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  route: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  safety: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  billing: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
} as const;

interface DashboardHeaderProps {
  title?: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  const session = useAuthStore((s) => s.session);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const pathname = usePathname();
  const t = useT();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dateLocale = locale === "ar" ? ar : enUS;
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const n = await notificationsService.list();
        if (!cancelled) {
          setNotifications(n.slice(0, 6));
        }
      } catch {
        // Handle errors silently
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="sticky top-0 z-[9999] flex h-16 items-center gap-3 border-b border-border/80 bg-background/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-2 xl:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label={t("header.openMenu")}>
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side={locale === "ar" ? "right" : "left"} className="p-0">
            <AppSidebar variant="mobile" />
          </SheetContent>
        </Sheet>
      </div>
      <div className="min-w-0 flex-1">
        {title ? (
          <p className="truncate text-sm font-medium text-muted-foreground">
            {title}
          </p>
        ) : null}
      </div>
      <LanguageToggle />
      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {notifications.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>
            {t("dashboard.home.notificationsAlerts")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((note) => {
              const Icon = CHANNEL_ICONS[note.channel] ?? Bell;
              return (
                <div
                  key={note.id}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      CHANNEL_COLORS[note.channel],
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug">{note.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {note.body}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/80">
                      {note.createdAt && !isNaN(new Date(note.createdAt).getTime())
                        ? formatDistanceToNow(new Date(note.createdAt), {
                            addSuffix: true,
                            locale: dateLocale,
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={localizedHref(locale, ROUTES.notifications)}
              className="justify-center font-medium text-primary"
            >
              {t("dashboard.home.viewAllNotifications")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">
              {session?.name ?? t("header.administrator")}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>
            <div className="text-xs font-normal text-muted-foreground">
              {session?.email}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={localizedHref(locale, ROUTES.profile)}>{t("header.profile")}</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await authService.logoutRemote();
              logout();
              router.replace(localizedHref(locale, ROUTES.login));
            }}
          >
            <LogOut className="me-2 h-4 w-4" />
            {t("header.logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
