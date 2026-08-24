"use client";

import { usePathname } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { getAxiosErrorMessage } from "@/lib/http-error-message";
import { parentRequestsService } from "@/services/parent-requests.service";
import type { ParentRequest } from "@/types/parent-request";

interface DeleteParentDialogProps {
  parent: ParentRequest | null;
  onClose: () => void;
  onDeleted?: () => void;
}

export function DeleteParentDialog({ parent, onClose, onDeleted }: DeleteParentDialogProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dialogDir = locale === "ar" ? "rtl" : "ltr";
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!parent) return;
    setIsDeleting(true);
    try {
      await parentRequestsService.remove(parent.id);
      toast.success(t("parentRequests.deleted"));
      onClose();
      onDeleted?.();
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={!!parent} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md" dir={dialogDir}>
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl">{t("common.delete")}</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        <DialogDescription>
          {t("common.confirmDelete")}{" "}
          <span className="font-semibold">{parent?.parentName}</span>?
        </DialogDescription>
        <DialogFooter className="gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? t("common.loading") || "Loading..." : t("common.delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
