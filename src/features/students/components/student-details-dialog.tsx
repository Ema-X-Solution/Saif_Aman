"use client";

import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import type { Student } from "@/types/student";

interface StudentDetailsDialogProps {
  student: Student | null;
  onClose: () => void;
}

export function StudentDetailsDialog({ student, onClose }: StudentDetailsDialogProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dialogDir = locale === "ar" ? "rtl" : "ltr";

  return (
    <Dialog open={!!student} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md" dir={dialogDir}>
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl">{t("common.viewDetails")}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {student && (
          <div className="space-y-4">
            {student.image ? (
              <div className="flex justify-center">
                <Image
                  src={student.image}
                  alt={student.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover"
                  unoptimized
                />
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.name")}</p>
                <p className="font-medium">{student.name}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("students.grade")}</p>
                <p className="font-medium">{student.grade}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.parent")}</p>
                <p className="font-medium">{student.parentName}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.school")}</p>
                <p className="font-medium">{student.schoolName}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("students.bus")}</p>
                <p className="font-medium">{student.schoolBusLabel}</p>
              </div>
              {student.age !== null ? (
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-muted-foreground">{t("students.age")}</p>
                  <p className="font-medium">{student.age}</p>
                </div>
              ) : null}
              {student.notes ? (
                <div className="col-span-2">
                  <p className="text-muted-foreground">{t("schools.notes")}</p>
                  <p className="font-medium">{student.notes}</p>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
