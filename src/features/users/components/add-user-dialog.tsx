"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { getAxiosErrorMessage } from "@/lib/http-error-message";
import { schoolsService } from "@/services/schools.service";
import { usersAdminService } from "@/services/users-admin.service";

const statusEnum = z.enum(["pending", "approved", "rejected"]);

const getBaseSchema = (t: ReturnType<typeof useT>) => z.object({
  school_id: z.string(),
  name: z.string().min(1, t("common.required")),
  email: z.string().trim(),
  phone: z.string().min(1, t("common.required")),
  password: z.string().min(6, t("validation.atLeast6")),
  status: statusEnum,
  address: z.string().trim(),
  latitude: z.string().trim(),
  longitude: z.string().trim(),
});

type FormValues = z.infer<ReturnType<typeof getBaseSchema>>;

interface SchoolOption {
  id: number;
  label: string;
}

interface AddUserDialogProps {
  userType: "supervisor" | "driver";
  onCreated?: () => void;
}

export function AddUserDialog({ userType, onCreated }: AddUserDialogProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dialogDir = locale === "ar" ? "rtl" : "ltr";
  const requireSchool = userType === "supervisor";

  const schema = useMemo(
    () =>
      getBaseSchema(t).superRefine((data, ctx) => {
        if (requireSchool && !data.school_id) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("common.pickSchool"),
            path: ["school_id"],
          });
        }
      }),
    [requireSchool, t],
  );

  const [open, setOpen] = useState(false);
  const [schools, setSchools] = useState<SchoolOption[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      school_id: "",
      name: "",
      email: "",
      phone: "",
      password: "",
      status: "approved",
      address: "",
      latitude: "",
      longitude: "",
    },
  });

  useEffect(() => {
    if (!open || !requireSchool) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await schoolsService.list();
        if (cancelled) return;
        setSchools(rows.map((s) => ({ id: Number(s.id), label: s.name })));
      } catch (err) {
        if (!cancelled) toast.error(getAxiosErrorMessage(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, requireSchool]);

  async function onSubmit(values: FormValues) {
    try {
      const lat =
        values.latitude.trim() === ""
          ? null
          : Number(values.latitude);
      const lng =
        values.longitude.trim() === ""
          ? null
          : Number(values.longitude);
      await usersAdminService.create({
        school_id:
          requireSchool && values.school_id
            ? Number(values.school_id)
            : null,
        name: values.name,
        type: userType,
        email: values.email.trim() || null,
        phone: values.phone,
        password: values.password,
        status: values.status,
        address: values.address.trim() || null,
        latitude: lat !== null && !Number.isNaN(lat) ? lat : null,
        longitude: lng !== null && !Number.isNaN(lng) ? lng : null,
      });
      toast.success(
        userType === "supervisor" ? t("users.createdSupervisor") : t("users.createdDriver"),
      );
      form.reset({
        school_id: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        status: "approved",
        address: "",
        latitude: "",
        longitude: "",
      });
      setOpen(false);
      onCreated?.();
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  }

  const title =
    userType === "supervisor" ? t("users.addSupervisor") : t("users.addDriver");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        dir={dialogDir}
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 shrink-0" aria-hidden />
        {userType === "supervisor" ? t("users.addSupervisor") : t("users.addDriver")}
      </Button>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto" dir={dialogDir}>
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl">{title}</DialogTitle>            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {requireSchool ? (
              <FormField
                control={form.control}
                name="school_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.selectSchool")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("common.selectSchool")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schools.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.password")}</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {/* Latitude and Longitude hidden visually similar to AddSchool */}
            <div className="hidden">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
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
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t("buses.saving") : t("common.add")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
