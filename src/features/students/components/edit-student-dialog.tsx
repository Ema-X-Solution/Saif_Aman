"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GRADE_OPTIONS } from "@/features/students/lib/grade-options";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { getAxiosErrorMessage } from "@/lib/http-error-message";
import { busesService } from "@/services/buses.service";
import { schoolsService } from "@/services/schools.service";
import { studentsService } from "@/services/students.service";
import { usersAdminService } from "@/services/users-admin.service";
import type { Student } from "@/types/student";

const getSchema = (t: ReturnType<typeof useT>) =>
  z.object({
    name: z.string().min(1, t("common.required")),
    grade: z.string().min(1, t("common.required")),
    notes: z.string().optional(),
    parent_id: z.string().min(1, t("students.pickParent")),
    school_id: z.string().min(1, t("common.pickSchool")),
    school_bus_id: z.string().min(1, t("students.pickBus")),
  });

type FormValues = z.infer<ReturnType<typeof getSchema>>;

interface Option {
  id: number;
  label: string;
}

interface EditStudentDialogProps {
  student: Student | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export function EditStudentDialog({ student, onClose, onUpdated }: EditStudentDialogProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const dialogDir = locale === "ar" ? "rtl" : "ltr";
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [parents, setParents] = useState<Option[]>([]);
  const [schools, setSchools] = useState<Option[]>([]);
  const [buses, setBuses] = useState<Option[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(getSchema(t)),
    defaultValues: {
      name: "",
      grade: "",
      notes: "",
      parent_id: "",
      school_id: "",
      school_bus_id: "",
    },
  });

  useEffect(() => {
    if (!student) return;
    let cancelled = false;
    (async () => {
      setLoadingRefs(true);
      try {
        const [parentsRes, schoolRows, busRows] = await Promise.all([
          usersAdminService.list({ type: "parent" }),
          schoolsService.list(),
          busesService.list(),
        ]);
        if (cancelled) return;
        setParents(
          (parentsRes.data ?? []).map((p) => ({
            id: p.id,
            label: `${p.name} (#${p.id})`,
          }))
        );
        setSchools(schoolRows.map((s) => ({ id: Number(s.id), label: s.name })));
        setBuses(
          busRows.map((b) => ({
            id: Number(b.id),
            label: `${b.label} — ${b.schoolName}`,
          }))
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
  }, [student]);

  useEffect(() => {
    if (student) {
      form.reset({
        name: student.name,
        grade: student.grade,
        notes: student.notes ?? "",
        parent_id: student.parentId,
        school_id: student.schoolId,
        school_bus_id: student.schoolBusId,
      });
    }
  }, [student, form]);

  async function onSubmit(values: FormValues) {
    if (!student) return;
    try {
      await studentsService.update(student.id, {
        name: values.name,
        grade: values.grade,
        notes: values.notes?.trim() || null,
        parent_id: Number(values.parent_id),
        school_id: Number(values.school_id),
        school_bus_id: Number(values.school_bus_id),
      });
      toast.success(t("students.updated"));
      onClose();
      onUpdated?.();
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  }

  return (
    <Dialog open={!!student} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto" dir={dialogDir}>
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
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
                    <Input placeholder={t("students.namePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("students.grade")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("students.selectGrade")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GRADE_OPTIONS.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                      {!GRADE_OPTIONS.includes(field.value) && field.value ? (
                        <SelectItem value={field.value}>{field.value}</SelectItem>
                      ) : null}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.parent")}</FormLabel>
                  <Select
                    disabled={loadingRefs}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("students.selectParent")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {parents.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.label}
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
              name="school_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("schools.school")}</FormLabel>
                  <Select
                    disabled={loadingRefs}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("buses.selectSchool")} />
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
              name="school_bus_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("students.bus")}</FormLabel>
                  <Select
                    disabled={loadingRefs}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("students.selectBus")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {buses.map((b) => (
                        <SelectItem key={b.id} value={String(b.id)}>
                          {b.label}
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("schools.notes")}</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder={t("students.notesPlaceholder")} {...field} />
                  </FormControl>
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
                {form.formState.isSubmitting ? t("students.saving") : t("common.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
