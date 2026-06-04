"use client";

import { usePathname } from "next/navigation";
import { User as UserIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import type { ParentRequest } from "@/types/parent-request";

interface ParentDetailsDialogProps {
  parent: ParentRequest | null;
  onClose: () => void;
}

export function ParentDetailsDialog({ parent, onClose }: ParentDetailsDialogProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dialogDir = locale === "ar" ? "rtl" : "ltr";

  return (
    <Dialog open={!!parent} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md overflow-y-auto max-h-[90vh]" dir={dialogDir}>
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <UserIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl">{t("common.viewDetails")}</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        {parent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.name")}</p>
                <p className="font-medium">{parent.parentName}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.phone")}</p>
                <p className="font-medium" dir="ltr">{parent.phone || "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.email")}</p>
                <p className="font-medium truncate">{parent.email || "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.studentCount")}</p>
                <p className="font-medium">{parent.studentsCount ?? "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.address")}</p>
                <p className="font-medium">{parent.address || "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.status")}</p>
                <p className="font-medium capitalize">{parent.status}</p>
              </div>
            </div>

            {(parent.image || parent.homeImage) && (
              <div className="pt-4 border-t space-y-4">
                {parent.image && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{t("common.image") || "Image"}</p>
                    <img 
                      src={parent.image} 
                      alt="Parent" 
                      className="w-full h-auto rounded-md border object-cover max-h-64"
                    />
                  </div>
                )}
                {parent.homeImage && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{t("common.homeImage") || "Home Image"}</p>
                    <img 
                      src={parent.homeImage} 
                      alt="Home" 
                      className="w-full h-auto rounded-md border object-cover max-h-64"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
