"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bus as BusIcon } from "lucide-react";
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
import { studentsService } from "@/services/students.service";
import type { Student } from "@/types/student";

const getSchema = () =>
  z.object({
    school_bus_id: z.string().optional(),
  });

type FormValues = z.infer<ReturnType<typeof getSchema>>;

interface BusOption {
  id: number;
  label: string;
  plateNumber: string;
  mainDriverName: string;
  mainSupervisorName: string;
  studentsCount: number;
}

interface AssignBusDialogProps {
  student: Student | null;
  onClose: () => void;
  onAssigned?: () => void;
}

export function AssignBusDialog({
  student,
  onClose,
  onAssigned,
}: AssignBusDialogProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dialogDir = locale === "ar" ? "rtl" : "ltr";
  const [loadingBuses, setLoadingBuses] = useState(false);
  const [buses, setBuses] = useState<BusOption[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      school_bus_id: "",
    },
  });

  useEffect(() => {
    if (!student) return;
    let cancelled = false;
    (async () => {
      setLoadingBuses(true);
      try {
        const busRows = await busesService.list();
        if (cancelled) return;
        // Filter buses to only those that belong to the student's school
        const filteredBuses = busRows.filter(b => b.schoolId === student.schoolId);
        setBuses(
          filteredBuses.map((b) => ({
            id: Number(b.id),
            label: `${b.label} — ${b.schoolName}`,
            plateNumber: b.plateNumber,
            mainDriverName: b.mainDriverName,
            mainSupervisorName: b.mainSupervisorName,
            studentsCount: b.studentsCount,
          }))
        );
        if (student.schoolBusId) {
          form.setValue("school_bus_id", student.schoolBusId);
        } else {
          form.setValue("school_bus_id", "none");
        }
      } catch (err) {
        if (!cancelled) toast.error(getAxiosErrorMessage(err));
      } finally {
        if (!cancelled) setLoadingBuses(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [student, form]);

  async function onSubmit(values: FormValues) {
    if (!student) return;
    try {
      await studentsService.update(student.id, {
        name: student.name,
        grade: student.grade,
        age: student.age,
        notes: student.notes,
        parent_id: Number(student.parentId),
        school_id: Number(student.schoolId),
        school_bus_id: values.school_bus_id && values.school_bus_id !== "none" ? Number(values.school_bus_id) : null,
      });
      toast.success(t("students.assignedBusSuccess"));
      onClose();
      onAssigned?.();
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  }

  return (
    <Dialog open={!!student} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[90vh] max-w-lg overflow-y-auto"
        dir={dialogDir}
      >
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <BusIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-xl">{t("students.assignBus")}</DialogTitle>
              {student ? (
                <p className="text-sm text-muted-foreground">{student.name}</p>
              ) : null}
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="school_bus_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("students.bus")}</FormLabel>
                  <Select
                    disabled={loadingBuses}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("students.selectBus")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">{t("students.noBus")}</SelectItem>
                      {buses.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          <div className="flex flex-col gap-0.5">
                            <div className="font-medium">{b.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {b.plateNumber} • {b.mainDriverName} • {b.mainSupervisorName} • {b.studentsCount} {t("schools.students")}
                            </div>
                          </div>
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
                disabled={form.formState.isSubmitting || loadingBuses}
              >
                {form.formState.isSubmitting ? t("students.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
