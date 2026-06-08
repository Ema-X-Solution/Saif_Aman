/* eslint-disable @next/next/no-img-element */
"use strict";
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { User as UserIcon, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import type { Driver } from "@/types/driver";
import { usersAdminService } from "@/services/users-admin.service";
import type { ApiUserRow } from "@/types/api";

interface DriverDetailsDialogProps {
  driver: Driver | null;
  onClose: () => void;
}

export function DriverDetailsDialog({ driver, onClose }: DriverDetailsDialogProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dialogDir = locale === "ar" ? "rtl" : "ltr";

  const [details, setDetails] = useState<ApiUserRow | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (driver?.id) {
      setLoading(true);
      usersAdminService.get(driver.id).then((data) => {
        if (mounted) {
          setDetails(data);
          setLoading(false);
        }
      }).catch(() => {
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
  }, [driver]);

  return (
    <Dialog open={!!driver} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md overflow-y-auto max-h-[90vh]" dir={dialogDir}>
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <UserIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl">{t("users.openProfile")}</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : details ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.name")}</p>
                <p className="font-medium">{details.name}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.school")}</p>
                <p className="font-medium">{details.school?.name || "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.phone")}</p>
                <p className="font-medium" dir="ltr">{details.phone || "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.email")}</p>
                <p className="font-medium truncate">{details.email || "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.address")}</p>
                <p className="font-medium">{details.address || "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.status")}</p>
                <p className="font-medium capitalize">{details.status || "—"}</p>
              </div>
              {(details as any).driver_school_bus && (
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-muted-foreground">{t("buses.bus")}</p>
                  <p className="font-medium">{(details as any).driver_school_bus.label || "—"}</p>
                </div>
              )}
            </div>

            {(details.image || details.home_image) && (
              <div className="pt-4 border-t space-y-4">
                {details.image && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{t("common.image") || "Image"}</p>
                    <img 
                      src={details.image} 
                      alt="Driver" 
                      className="w-full h-auto rounded-md border object-cover max-h-64"
                    />
                  </div>
                )}
                {details.home_image && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{t("common.homeImage") || "Home Image"}</p>
                    <img 
                      src={details.home_image} 
                      alt="Home" 
                      className="w-full h-auto rounded-md border object-cover max-h-64"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
