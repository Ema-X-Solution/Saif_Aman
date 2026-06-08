"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

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
    <Card className="h-full border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          {t("dashboard.home.newRequests")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("dashboard.home.requestDate")}</TableHead>
              <TableHead>{t("dashboard.home.requestSchool")}</TableHead>
              <TableHead>{t("dashboard.home.requestStudent")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="text-sm text-muted-foreground">
                  {req.submittedAt
                    ? format(new Date(req.submittedAt), "dd/MM/yyyy", { locale: dateLocale })
                    : "—"}
                </TableCell>
                <TableCell className="max-w-[120px] truncate text-sm">
                  {req.schoolName}
                </TableCell>
                <TableCell className="text-sm font-medium">{req.parentName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Link
          href={localizedHref(locale, ROUTES.parentRequests)}
          className="mt-3 block text-center text-sm font-medium text-primary hover:underline"
        >
          {t("dashboard.home.viewAllRequests")}
        </Link>
      </CardContent>
    </Card>
  );
}
