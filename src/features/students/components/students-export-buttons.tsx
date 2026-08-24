"use client";

import { FileSpreadsheet, FileText } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { getAxiosErrorMessage } from "@/lib/http-error-message";
import { downloadExcelTable, printPdfTable } from "@/lib/export-table";
import { studentsService } from "@/services/students.service";
import type { Student } from "@/types/student";

interface StudentsExportButtonsProps {
  schoolId?: string;
}

function toRows(students: Student[]) {
  return students.map((s) => [
    s.name,
    s.grade,
    s.parentName,
    s.schoolName,
    s.schoolBusLabel,
  ]);
}

export function StudentsExportButtons({ schoolId }: StudentsExportButtonsProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dir = locale === "ar" ? "rtl" : "ltr";
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);

  const headers = [
    t("common.name"),
    t("students.grade"),
    t("common.parent"),
    t("schools.school"),
    t("students.bus"),
  ];

  async function loadRows() {
    return studentsService.listAll({
      school_id: schoolId && schoolId !== "all" ? Number(schoolId) : undefined,
    });
  }

  async function handleExcel() {
    setExporting("excel");
    try {
      const students = await loadRows();
      downloadExcelTable("students", headers, toRows(students));
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    } finally {
      setExporting(null);
    }
  }

  async function handlePdf() {
    setExporting("pdf");
    try {
      const students = await loadRows();
      await printPdfTable({
        title: t("students.title"),
        filename: "students",
        brand: "SAIF AMAN",
        dir,
        headers,
        rows: toRows(students),
        subtitle: `${t("students.exportGenerated")}: ${new Date().toLocaleString(locale === "ar" ? "ar" : "en")}\n${t("students.exportTotal")}: ${students.length}`,
      });
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    } finally {
      setExporting(null);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleExcel}
        disabled={exporting !== null}
      >
        <FileSpreadsheet />
        {exporting === "excel" ? t("students.exporting") : t("students.exportExcel")}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={handlePdf}
        disabled={exporting !== null}
      >
        <FileText />
        {exporting === "pdf" ? t("students.exporting") : t("students.exportPdf")}
      </Button>
    </>
  );
}
