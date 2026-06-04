"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { School as SchoolIcon, MapPin } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Textarea } from "@/components/ui/textarea";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { getAxiosErrorMessage } from "@/lib/http-error-message";
import { schoolsService } from "@/services/schools.service";
import type { School } from "@/types/school";

const getSchema = (t: ReturnType<typeof useT>) => z.object({
  name: z.string().min(1, t("common.required")),
  phone: z.string().min(1, t("common.required")),
  email: z.string().email(t("validation.invalidEmail")),
  website: z.string().trim(),
  notes: z.string().optional(),
  address: z.string().min(1, t("common.required")),
  latitude: z.coerce.number({
    invalid_type_error: t("common.required"),
  }),
  longitude: z.coerce.number({
    invalid_type_error: t("common.required"),
  }),
});

type FormValues = z.infer<ReturnType<typeof getSchema>>;

interface EditSchoolDialogProps {
  school: School | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export function EditSchoolDialog({ school, onClose, onUpdated }: EditSchoolDialogProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dialogDir = locale === "ar" ? "rtl" : "ltr";

  const form = useForm<FormValues>({
    resolver: zodResolver(getSchema(t)),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      website: "",
      notes: "",
      address: "",
      latitude: 30.0444,
      longitude: 31.2357,
    },
  });

  useEffect(() => {
    if (school) {
      form.reset({
        name: school.name || "",
        phone: school.phone || "",
        email: school.email || "",
        website: school.website || "",
        notes: school.notes || "",
        address: school.address || "",
        latitude: school.latitude !== null ? school.latitude : 30.0444,
        longitude: school.longitude !== null ? school.longitude : 31.2357,
      });
    }
  }, [school, form]);

  async function onSubmit(values: FormValues) {
    if (!school) return;
    try {
      await schoolsService.update(school.id, {
        name: values.name,
        phone: values.phone,
        email: values.email,
        website:
          values.website.trim() ||
          `https://${values.name.toLowerCase().replace(/\\s+/g, "")}.example.com`,
        notes: values.notes?.trim() || null,
        address: values.address,
        latitude: values.latitude,
        longitude: values.longitude,
      });
      toast.success(t("common.edit") + " " + t("schools.created")); // Using available translation keys
      onClose();
      onUpdated?.();
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  }

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      toast.error(t("schools.locationNotSupported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        form.setValue("latitude", Number(pos.coords.latitude));
        form.setValue("longitude", Number(pos.coords.longitude));
        toast.success(t("schools.locationSet"));
      },
      (err) => {
        toast.error(t("schools.locationError") + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <Dialog open={!!school} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto" dir={dialogDir}>
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <SchoolIcon className="h-5 w-5 text-primary" />
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
                  <FormLabel>{t("common.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("schools.schoolNamePlaceholder")} {...field} />
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
                      <Input placeholder={t("schools.phonePlaceholder")} {...field} />
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
                      <Input type="email" placeholder={t("schools.emailPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("schools.website")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("schools.websitePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.address")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("schools.addressPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={useCurrentLocation}
                  className="gap-2"
                >
                  <MapPin className="h-4 w-4" aria-hidden />
                  {t("schools.useCurrentLocation")}
                </Button>
              </div>
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("schools.notes")}</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder={t("schools.notesPlaceholder")} {...field} />
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
                {form.formState.isSubmitting ? t("schools.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
