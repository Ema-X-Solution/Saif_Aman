"use client";

import { usePathname } from "next/navigation";
import { School as SchoolIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import type { School } from "@/types/school";

interface SchoolDetailsDialogProps {
  school: School | null;
  onClose: () => void;
}

export function SchoolDetailsDialog({ school, onClose }: SchoolDetailsDialogProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dialogDir = locale === "ar" ? "rtl" : "ltr";

  return (
    <Dialog open={!!school} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md" dir={dialogDir}>
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <SchoolIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl">{t("common.viewDetails")}</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        {school && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.schoolName")}</p>
                <p className="font-medium">{school.name}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.phone")}</p>
                <p className="font-medium" dir="ltr">{school.phone || "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.email")}</p>
                <p className="font-medium truncate">{school.email || "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.website")}</p>
                <p className="font-medium truncate">{school.website || "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.city")}</p>
                <p className="font-medium">{school.city}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.studentCount")}</p>
                <p className="font-medium">{school.studentCount}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.busCount")}</p>
                <p className="font-medium">{school.busCount}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.status")}</p>
                <p className="font-medium capitalize">{school.status}</p>
              </div>
              {school.notes && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">{t("schools.notes")}</p>
                  <p className="font-medium">{school.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
