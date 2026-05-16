"use client";

import { LogOut, Menu, User } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

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

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border/80 bg-background/80 px-4 backdrop-blur-md">
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
