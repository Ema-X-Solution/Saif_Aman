"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
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
import { busesService } from "@/services/buses.service";
import { usersAdminService } from "@/services/users-admin.service";
import { schoolsService } from "@/services/schools.service";
const schema = z.object({
  label: z.string().min(1),
  code: z.string().min(1),
  plate_number: z.string().min(1),
  model: z.string().min(1),
  color: z.string().min(1),
  school_id: z.string().min(1, "Pick a school."),
  driver_id: z.string().min(1, "Pick a driver."),
  supervisor_id: z.string().min(1, "Pick a supervisor."),
});

type FormValues = z.infer<typeof schema>;

interface Option {
  id: number;
  label: string;
}

interface AddBusDialogProps {
  onCreated?: () => void;
}

export function AddBusDialog({ onCreated }: AddBusDialogProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dialogDir = locale === "ar" ? "rtl" : "ltr";
  const [open, setOpen] = useState(false);
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [schools, setSchools] = useState<Option[]>([]);
  const [drivers, setDrivers] = useState<Option[]>([]);
  const [supervisors, setSupervisors] = useState<Option[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      label: "",
      code: "",
      plate_number: "",
      model: "",
      color: "",
      school_id: "",
      driver_id: "",
      supervisor_id: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setLoadingRefs(true);
      try {
        const [schoolRows, usersRes] = await Promise.all([
          schoolsService.list(),
          usersAdminService.list(),
        ]);
        if (cancelled) return;
        setSchools(
          schoolRows.map((s) => ({ id: Number(s.id), label: s.name })),
        );
        const rows = usersRes.data ?? [];
        setDrivers(
          rows
            .filter((u) => u.type === "driver")
            .map((u) => ({ id: u.id, label: `${u.name} (#${u.id})` })),
        );
        setSupervisors(
          rows
            .filter((u) => u.type === "supervisor")
            .map((u) => ({ id: u.id, label: `${u.name} (#${u.id})` })),
        );
      } catch (err) {
        if (!cancelled) toast.error(getAxiosErrorMessage(err));
      } finally {
        if (!cancelled) setLoadingRefs(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  async function onSubmit(values: FormValues) {
    try {
      await busesService.create({
        label: values.label,
        code: values.code,
        plate_number: values.plate_number,
        model: values.model,
        color: values.color,
        school_id: Number(values.school_id),
        driver_id: Number(values.driver_id),
        supervisor_id: Number(values.supervisor_id),
      });
      toast.success(t("buses.created"));
      form.reset();
      setOpen(false);
      onCreated?.();
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        dir={dialogDir}
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 shrink-0" aria-hidden />
        {t("buses.addBus")}
      </Button>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto" dir={dialogDir}>
        {/* Header removed per request */}
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input placeholder="Bus A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="BUS-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="plate_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plate number</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC-123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="White" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Toyota Coaster" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="school_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School</FormLabel>
                  <Select
                    disabled={loadingRefs}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select school" />
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

            <FormField
              control={form.control}
              name="driver_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver</FormLabel>
                  <Select
                    disabled={loadingRefs}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
              name="supervisor_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor</FormLabel>
                  <Select
                    disabled={loadingRefs}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supervisor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || loadingRefs}
              >
                {form.formState.isSubmitting ? "Saving…" : "Create bus"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
