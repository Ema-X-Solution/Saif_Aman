"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { UserPlus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { localizedHref } from "@/lib/localized-href";
import type { ParentRequest } from "@/types/parent-request";

interface NewRequestsTableCardProps {
  requests: ParentRequest[];
}

export function NewRequestsTableCard({ requests }: NewRequestsTableCardProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dateLocale = locale === "ar" ? ar : enUS;

  return (
    <Card className="h-full border-border/80 bg-gradient-to-br from-card to-card/80 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15">
            <UserPlus className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-base font-semibold">
            {t("dashboard.home.newRequests")}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-border/60 bg-muted/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-medium">{t("dashboard.home.requestDate")}</TableHead>
                <TableHead className="text-xs font-medium">{t("dashboard.home.requestSchool")}</TableHead>
                <TableHead className="text-xs font-medium">{t("dashboard.home.requestStudent")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="text-sm text-muted-foreground py-2">
                    {req.submittedAt
                      ? format(new Date(req.submittedAt), "dd/MM/yyyy", { locale: dateLocale })
                      : "—"}
                  </TableCell>
                  <TableCell className="max-w-[120px] truncate text-sm py-2">
                    {req.schoolName}
                  </TableCell>
                  <TableCell className="text-sm font-medium py-2">{req.parentName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Link
          href={localizedHref(locale, ROUTES.parentRequests)}
          className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm font-medium text-primary hover:bg-muted/30 transition-colors"
        >
          {t("dashboard.home.viewAllRequests")}
        </Link>
      </CardContent>
    </Card>
  );
}
