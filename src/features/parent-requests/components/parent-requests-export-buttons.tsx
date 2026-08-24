"use client";

import { FileSpreadsheet, FileText } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { getAxiosErrorMessage } from "@/lib/http-error-message";
import { downloadExcelTable, printPdfTable } from "@/lib/export-table";
import { parentRequestsService } from "@/services/parent-requests.service";
import type { ParentRequest } from "@/types/parent-request";

function statusLabel(t: (key: string) => string, status: ParentRequest["status"]) {
  if (status === "approved") return t("common.approved");
  if (status === "rejected") return t("common.rejected");
  return t("common.pending");
}

function locationText(row: ParentRequest) {
  if (typeof row.latitude === "number" && typeof row.longitude === "number") {
    return `${row.latitude.toFixed(4)}, ${row.longitude.toFixed(4)}`;
  }
  return "—";
}

function toRows(t: (key: string) => string, rows: ParentRequest[]) {
  return rows.map((r) => [
    r.id,
    r.parentName,
    r.email ?? "—",
    r.phone ?? "—",
    r.address ?? "—",
    locationText(r),
    String(r.studentsCount ?? 0),
    statusLabel(t, r.status),
  ]);
}

export function ParentRequestsExportButtons() {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dir = locale === "ar" ? "rtl" : "ltr";
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);

  const headers = [
    t("common.id"),
    t("common.name"),
    t("common.email"),
    t("common.phone"),
    t("common.address"),
    t("common.location"),
    t("schools.studentCount"),
    t("common.status"),
  ];

  async function handleExcel() {
    setExporting("excel");
    try {
      const rows = await parentRequestsService.listAll();
      downloadExcelTable("parent-requests", headers, toRows(t, rows));
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    } finally {
      setExporting(null);
    }
  }

  async function handlePdf() {
    setExporting("pdf");
    try {
      const rows = await parentRequestsService.listAll();
      await printPdfTable({
        title: t("parentRequests.title"),
        filename: "parent-requests",
        brand: "SAIF AMAN",
        dir,
        headers,
        rows: toRows(t, rows),
        subtitle: `${t("parentRequests.exportGenerated")}: ${new Date().toLocaleString(locale === "ar" ? "ar" : "en")}\n${t("parentRequests.exportTotal")}: ${rows.length}`,
      });
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    } finally {
      setExporting(null);
    }
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={handleExcel} disabled={exporting !== null}>
        <FileSpreadsheet />
        {exporting === "excel" ? t("parentRequests.exporting") : t("parentRequests.exportExcel")}
      </Button>
      <Button type="button" variant="outline" onClick={handlePdf} disabled={exporting !== null}>
        <FileText />
        {exporting === "pdf" ? t("parentRequests.exporting") : t("parentRequests.exportPdf")}
      </Button>
    </>
  );
}
