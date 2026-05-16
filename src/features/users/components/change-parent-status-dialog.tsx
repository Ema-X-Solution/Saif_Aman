"use client";

import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useT } from "@/i18n/use-t";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { usersAdminService } from "@/services/users-admin.service";
import type { ApiUserRow } from "@/types/api";

const schema = z.object({ status: z.enum(["pending", "approved", "rejected"]) });

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ApiUserRow | null;
  onUpdated?: () => void;
}

export function ChangeParentStatusDialog({ open, onOpenChange, user, onUpdated }: Props) {
  const t = useT();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { status: (user?.status as any) ?? "pending" },
  });

  // reset when user changes
  React.useEffect(() => {
    form.reset({ status: (user?.status as any) ?? "pending" });
  }, [user]);

  async function onSubmit(values: FormValues) {
    if (!user) return;
    try {
      await usersAdminService.update(user.id, {
        // required fields for update
        name: user.name,
        type: "parent",
        phone: user.phone ?? "",
        status: values.status,
        email: user.email ?? null,
        school_id: user.school ? user.school.id : null,
        address: user.address ?? null,
        latitude: user.latitude ?? null,
        longitude: user.longitude ?? null,
      });
      toast.success(t("users.changedStatus"));
      onOpenChange(false);
      onUpdated?.();
    } catch (err) {
      toast.error((err as any)?.message ?? "Failed to update status.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialogs.changeParentStatus")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.status")}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{t("common.pending")}</SelectItem>
                        <SelectItem value="approved">{t("common.approved")}</SelectItem>
                        <SelectItem value="rejected">{t("common.rejected")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit">{t("common.save")}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
