"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bus as BusIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import type { Bus } from "@/types/bus";
import { busesService } from "@/services/buses.service";
import type { ApiSchoolBusRow } from "@/types/api";

interface BusDetailsDialogProps {
  bus: Bus | null;
  refreshKey?: number;
  onClose: () => void;
  onAssignBackupCrew?: (bus: Bus) => void;
}

function formatDateTime(value: string | null | undefined, locale: "ar" | "en") {
  if (!value) return "—";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return format(date, "dd/MM/yyyy HH:mm", {
    locale: locale === "ar" ? ar : enUS,
  });
}

export function BusDetailsDialog({
  bus,
  refreshKey = 0,
  onClose,
  onAssignBackupCrew,
}: BusDetailsDialogProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dialogDir = locale === "ar" ? "rtl" : "ltr";

  const [details, setDetails] = useState<ApiSchoolBusRow | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (bus?.id) {
      setLoading(true);
      busesService
        .get(bus.id)
        .then((data) => {
          if (mounted) {
            setDetails(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (mounted) {
            setLoading(false);
          }
        });
    } else {
      setDetails(null);
    }
    return () => {
      mounted = false;
    };
  }, [bus, refreshKey]);

  return (
    <Dialog open={!!bus} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg overflow-y-auto max-h-[90vh]" dir={dialogDir}>
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <BusIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl">{t("common.viewDetails")}</DialogTitle>
              {details ? (
                <p className="text-sm text-muted-foreground">{details.label}</p>
              ) : null}
            </div>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : details ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.id")}</p>
                <p className="font-medium">{details.id}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("buses.label")}</p>
                <p className="font-medium">{details.label}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("buses.code")}</p>
                <p className="font-medium">
                  {details.code}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.plate")}</p>
                <p className="font-medium">
                  {details.plate_number}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("buses.model")}</p>
                <p className="font-medium">{details.model}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("buses.color")}</p>
                <p className="font-medium">{details.color}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.school")}</p>
                <p className="font-medium">{details.school?.name ?? "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.studentCount")}</p>
                <p className="font-medium">{details.students_count}</p>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <p className="text-sm font-medium">{t("buses.primaryCrew")}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-muted-foreground">{t("buses.driver")}</p>
                  <p className="font-medium">{details.driver?.name ?? "—"}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-muted-foreground">{t("buses.supervisor")}</p>
                  <p className="font-medium">{details.supervisor?.name ?? "—"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{t("buses.backupCrew")}</p>
                {onAssignBackupCrew && bus ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onAssignBackupCrew(bus)}
                  >
                    {t("buses.assignBackupCrew")}
                  </Button>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-muted-foreground">{t("buses.backupDriver")}</p>
                  <p className="font-medium">{details.backup_driver?.name ?? "—"}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-muted-foreground">{t("buses.backupSupervisor")}</p>
                  <p className="font-medium">{details.backup_supervisor?.name ?? "—"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <p className="text-sm font-medium">
                {t("buses.assignedStudents")} ({details.students_count})
              </p>
              {details.students?.length ? (
                <ul className="space-y-2 text-sm">
                  {details.students.map((student) => (
                    <li
                      key={student.id}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <span className="font-medium">{student.name}</span>
                      <span className="text-muted-foreground">#{student.id}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">{t("buses.noStudents")}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("buses.createdAt")}</p>
                <p className="font-medium">
                  {formatDateTime(details.created_at, locale)}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("buses.updatedAt")}</p>
                <p className="font-medium">
                  {formatDateTime(details.updated_at, locale)}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
