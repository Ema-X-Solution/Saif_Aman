"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SchoolIcon } from "lucide-react";
import { toast } from "sonner";
import { schoolsService } from "@/services/schools.service";

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
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedSchool, setFetchedSchool] = useState<School | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchSchool = async () => {
      if (school) {
        setIsLoading(true);
        try {
          const fetched = await schoolsService.get(school.id);
          if (isMounted) {
            setFetchedSchool(fetched);
          }
        } catch (error) {
          console.error("Failed to fetch school:", error);
          toast.error(t("common.error"));
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } else {
        setFetchedSchool(null);
      }
    };

    fetchSchool();
    
    return () => {
      isMounted = false;
    };
  }, [school, t]);

  return (
    <Dialog open={!!school} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md" dir={dialogDir} suppressHydrationWarning={true}>
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
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : fetchedSchool ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.schoolName")}</p>
                <p className="font-medium">{fetchedSchool.name}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.phone")}</p>
                <p className="font-medium">{fetchedSchool.phone || "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.email")}</p>
                <p className="font-medium truncate">{fetchedSchool.email || "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.website")}</p>
                <p className="font-medium truncate">{fetchedSchool.website || "—"}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.city")}</p>
                <p className="font-medium">{fetchedSchool.city}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.studentCount")}</p>
                <p className="font-medium">{fetchedSchool.studentCount}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("schools.busCount")}</p>
                <p className="font-medium">{fetchedSchool.busCount}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-muted-foreground">{t("common.status")}</p>
                <p className="font-medium capitalize">{fetchedSchool.status}</p>
              </div>
              {fetchedSchool.grades && fetchedSchool.grades.length > 0 && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">{t("students.grade")}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {fetchedSchool.grades.map((grade, index) => (
                      <span
                        key={grade.id || index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      >
                        {grade.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {fetchedSchool.notes && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">{t("schools.notes")}</p>
                  <p className="font-medium">{fetchedSchool.notes}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
