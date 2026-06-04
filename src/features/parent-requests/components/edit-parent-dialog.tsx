"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { getAxiosErrorMessage } from "@/lib/http-error-message";
import { usersAdminService } from "@/services/users-admin.service";
import type { ParentRequest } from "@/types/parent-request";

const getBaseSchema = (t: ReturnType<typeof useT>) => z.object({
  name: z.string().min(1, t("common.required")),
  email: z.string().trim(),
  phone: z.string().min(1, t("common.required")),
  password: z.string().optional(),
  address: z.string().trim(),
  latitude: z.string().trim(),
  longitude: z.string().trim(),
});

type FormValues = z.infer<ReturnType<typeof getBaseSchema>>;

interface EditParentDialogProps {
  parent: ParentRequest | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export function EditParentDialog({ parent, onClose, onUpdated }: EditParentDialogProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dialogDir = locale === "ar" ? "rtl" : "ltr";

  const schema = getBaseSchema(t);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      latitude: "",
      longitude: "",
    },
  });

  useEffect(() => {
    if (!parent) return;
    
    // Pre-fill form
    form.reset({
      name: parent.parentName || "",
      email: parent.email || "",
      phone: parent.phone || "",
      password: "",
      address: parent.address || "",
      latitude: parent.latitude ? String(parent.latitude) : "",
      longitude: parent.longitude ? String(parent.longitude) : "",
    });
  }, [parent, form]);

  async function onSubmit(values: FormValues) {
    if (!parent) return;
    try {
      const lat = values.latitude.trim() === "" ? null : Number(values.latitude);
      const lng = values.longitude.trim() === "" ? null : Number(values.longitude);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        name: values.name,
        type: "parent",
        email: values.email.trim() || null,
        phone: values.phone,
        status: parent.status,
        address: values.address.trim() || null,
        latitude: lat !== null && !Number.isNaN(lat) ? lat : null,
        longitude: lng !== null && !Number.isNaN(lng) ? lng : null,
      };
      
      if (values.password) {
          payload.password = values.password;
      }

      await usersAdminService.update(parent.id, payload);
      toast.success(t("common.edit") + " " + t("common.success"));
      onClose();
      onUpdated?.();
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  }

  return (
    <Dialog open={!!parent} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto" dir={dialogDir}>
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl">{t("common.edit")}</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.fullName")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Ahmed Ali" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.phone")}</FormLabel>
                    <FormControl>
                      <Input placeholder="010098765432" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("common.optional")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.address")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("common.optional")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.password")}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={t("common.optional")} autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t("common.loading") || "Saving..." : t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
