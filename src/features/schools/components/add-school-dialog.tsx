"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { School, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import dynamic from "next/dynamic";

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
const LocationPicker = dynamic(() => import("@/components/map").then(mod => mod.LocationPicker), { ssr: false });
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { getAxiosErrorMessage } from "@/lib/http-error-message";
import { schoolsService } from "@/services/schools.service";

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
  grades: z.array(z.object({
    name: z.string().min(1, t("common.required")),
  })),
});

type FormValues = z.infer<ReturnType<typeof getSchema>>;

interface AddSchoolDialogProps {
  onCreated?: () => void;
}

export function AddSchoolDialog({ onCreated }: AddSchoolDialogProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dialogDir = locale === "ar" ? "rtl" : "ltr";
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(getSchema(t)),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      website: "",
      notes: "",
      address: "",
      latitude: 21.0,
      longitude: 57.0,
      grades: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "grades",
  });

  const watchedLatitude = useWatch({
    control: form.control,
    name: "latitude",
  });

  const watchedLongitude = useWatch({
    control: form.control,
    name: "longitude",
  });

  async function onSubmit(values: FormValues) {
    try {
      await schoolsService.create({
        name: values.name,
        phone: values.phone,
        email: values.email,
        website:
          values.website.trim() ||
          `https://${values.name.toLowerCase().replace(/\s+/g, "")}.example.com`,
        notes: values.notes?.trim() || null,
        address: values.address,
        latitude: values.latitude,
        longitude: values.longitude,
        grades: values.grades,
      });
      toast.success(t("schools.created"));
      form.reset();
      setOpen(false);
      onCreated?.();
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
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        dir={dialogDir}
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 shrink-0" aria-hidden />
        {t("schools.addSchool")}
      </Button>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto" dir={dialogDir} suppressHydrationWarning={true}>
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <School className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl">{t("schools.addSchool")}</DialogTitle>
              
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
              <div className="space-y-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common.latitude")}</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("common.longitude")}</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <LocationPicker
                  latitude={watchedLatitude}
                  longitude={watchedLongitude}
                  onPositionChange={(lat, lng) => {
                    form.setValue("latitude", lat);
                    form.setValue("longitude", lng);
                  }}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t("students.grade")}</label>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => append({ name: "" })}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  {t("common.add")}
                </Button>
              </div>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-3">
                    <FormField
                      control={form.control}
                      name={`grades.${index}.name`}
                      render={({ field: inputField }) => (
                        <FormItem className="flex-1 m-0">
                          <FormControl>
                            <Input placeholder="Grade name" {...inputField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
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
                onClick={() => setOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t("schools.saving") : t("schools.createSchool")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
