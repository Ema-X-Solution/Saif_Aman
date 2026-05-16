"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Bus, ClipboardList, School } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { localizedHref } from "@/lib/localized-href";

const ACTION_KEYS = [
  {
    titleKey: "dashboard.quickActions.registerSchool",
    hintKey: "dashboard.quickActions.registerSchoolHint",
    href: ROUTES.schools,
    icon: School,
  },
  {
    titleKey: "dashboard.quickActions.reviewRequests",
    hintKey: "dashboard.quickActions.reviewRequestsHint",
    href: ROUTES.parentRequests,
    icon: ClipboardList,
  },
  {
    titleKey: "dashboard.quickActions.fleetRoster",
    hintKey: "dashboard.quickActions.fleetRosterHint",
    href: ROUTES.buses,
    icon: Bus,
  },
] as const;

export function QuickActionsCard() {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {t("dashboard.quickActions.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ACTION_KEYS.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.titleKey}
              className="flex flex-col gap-2 rounded-lg border border-border/70 bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium leading-none">{t(action.titleKey)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(action.hintKey)}</p>
                </div>
              </div>
              <Button asChild size="sm" variant="secondary" className="shrink-0">
                <Link href={localizedHref(locale, action.href)}>
                  {t("dashboard.quickActions.open")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
