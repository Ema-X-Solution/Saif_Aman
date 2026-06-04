"use client";

import { usePathname } from "next/navigation";
import { Bus as BusIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import type { Bus } from "@/types/bus";

interface BusDetailsDialogProps {
  bus: Bus | null;
  onClose: () => void;
}

export function BusDetailsDialog({ bus, onClose }: BusDetailsDialogProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dialogDir = locale === "ar" ? "rtl" : "ltr";

  return (
    <Dialog open={!!bus} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md" dir={dialogDir}>
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <BusIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl">{t("common.viewDetails")}</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        {bus && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("buses.label")}</p>
                <p className="font-medium">{bus.label}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("buses.code")}</p>
                <p className="font-medium">{bus.code}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.plate")}</p>
                <p className="font-medium" dir="ltr">{bus.plateNumber}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("buses.model")}</p>
                <p className="font-medium">{bus.model}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("buses.color")}</p>
                <p className="font-medium">{bus.color}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.school")}</p>
                <p className="font-medium">{bus.schoolName}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.primaryCrew")}</p>
                <p className="font-medium">{bus.mainDriverName}</p>
                <p className="text-muted-foreground text-xs">{bus.mainSupervisorName}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.status")}</p>
                <p className="font-medium capitalize">{bus.status}</p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
