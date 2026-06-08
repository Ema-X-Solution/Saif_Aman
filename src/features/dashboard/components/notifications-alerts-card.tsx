"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  Clock,
  Shield,
  UserPlus,
  Wrench,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { localizedHref } from "@/lib/localized-href";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/types/notification";

const CHANNEL_ICONS = {
  system: UserPlus,
  route: Clock,
  safety: AlertTriangle,
  billing: Shield,
} as const;

const CHANNEL_COLORS = {
  system: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  route: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  safety: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  billing: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
} as const;

interface NotificationsAlertsCardProps {
  notifications: AppNotification[];
}

export function NotificationsAlertsCard({ notifications }: NotificationsAlertsCardProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dateLocale = locale === "ar" ? ar : enUS;

  return (
    <Card className="h-full border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          {t("dashboard.home.notificationsAlerts")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {notifications.map((note) => {
          const Icon = CHANNEL_ICONS[note.channel] ?? Wrench;
          return (
            <div
              key={note.id}
              className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/50"
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
                  {formatDistanceToNow(new Date(note.createdAt), {
                    addSuffix: true,
                    locale: dateLocale,
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <Link
          href={localizedHref(locale, ROUTES.notifications)}
          className="mt-2 block text-center text-sm font-medium text-primary hover:underline"
        >
          {t("dashboard.home.viewAllNotifications")}
        </Link>
      </CardContent>
    </Card>
  );
}
