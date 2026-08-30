"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { getAxiosErrorMessage } from "@/lib/http-error-message";
import { busesService } from "@/services/buses.service";
import { usersAdminService } from "@/services/users-admin.service";
import type { Bus } from "@/types/bus";

const NONE_VALUE = "__none__";

const getSchema = (t: ReturnType<typeof useT>) =>
  z.object({
    backup_driver_id: z.string().min(1, t("common.required")),
    backup_supervisor_id: z.string().min(1, t("common.required")),
  });

type FormValues = z.infer<ReturnType<typeof getSchema>>;

interface Option {
  id: number;
  label: string;
}

interface AssignBackupCrewDialogProps {
  bus: Bus | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export function AssignBackupCrewDialog({
  bus,
  onClose,
  onUpdated,
}: AssignBackupCrewDialogProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dialogDir = locale === "ar" ? "rtl" : "ltr";
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [drivers, setDrivers] = useState<Option[]>([]);
  const [supervisors, setSupervisors] = useState<Option[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(getSchema(t)),
    defaultValues: {
      backup_driver_id: NONE_VALUE,
      backup_supervisor_id: NONE_VALUE,
    },
  });

  useEffect(() => {
    if (!bus) return;
    let cancelled = false;
    (async () => {
      setLoadingRefs(true);
      try {
        const [busDetails, driversRes, supervisorsRes] = await Promise.all([
          busesService.get(bus.id),
          usersAdminService.list({ type: "driver", per_page: 100 }),
          usersAdminService.list({ type: "supervisor", per_page: 100 }),
        ]);
        if (cancelled) return;

        setDrivers(
          (driversRes.data ?? []).map((u) => ({ id: u.id, label: `${u.name} (#${u.id})` })),
        );
        setSupervisors(
          (supervisorsRes.data ?? []).map((u) => ({ id: u.id, label: `${u.name} (#${u.id})` })),
        );

        form.reset({
          backup_driver_id: busDetails.backup_driver
            ? String(busDetails.backup_driver.id)
            : NONE_VALUE,
          backup_supervisor_id: busDetails.backup_supervisor
            ? String(busDetails.backup_supervisor.id)
            : NONE_VALUE,
        });
      } catch (err) {
        if (!cancelled) toast.error(getAxiosErrorMessage(err));
      } finally {
        if (!cancelled) setLoadingRefs(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bus, form]);

  async function onSubmit(values: FormValues) {
    if (!bus) return;
    try {
      await busesService.updateBackupCrew(bus.id, {
        backup_driver_id:
          values.backup_driver_id === NONE_VALUE
            ? null
            : Number(values.backup_driver_id),
        backup_supervisor_id:
          values.backup_supervisor_id === NONE_VALUE
            ? null
            : Number(values.backup_supervisor_id),
      });
      toast.success(t("buses.backupCrewUpdated"));
      onClose();
      onUpdated?.();
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  }

  return (
    <Dialog open={!!bus} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md" dir={dialogDir}>
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl">{t("buses.assignBackupCrew")}</DialogTitle>
              {bus ? (
                <p className="text-sm text-muted-foreground">
                  {bus.label} · {bus.plateNumber}
                </p>
              ) : null}
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="backup_driver_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("buses.backupDriver")}</FormLabel>
                  <Select
                    disabled={loadingRefs}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("buses.selectBackupDriver")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE}>{t("buses.noneAssigned")}</SelectItem>
                      {drivers.map((d) => (
                        <SelectItem key={d.id} value={String(d.id)}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backup_supervisor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("buses.backupSupervisor")}</FormLabel>
                  <Select
                    disabled={loadingRefs}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("buses.selectBackupSupervisor")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE}>{t("buses.noneAssigned")}</SelectItem>
                      {supervisors.map((s) => (
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

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || loadingRefs}
              >
                {form.formState.isSubmitting ? t("buses.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
