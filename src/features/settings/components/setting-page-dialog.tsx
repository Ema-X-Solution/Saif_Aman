"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { settingPagesService } from "@/services/index";
import type { SettingPage } from "@/types/settings";
import { getAxiosErrorMessage } from "@/lib/http-error-message";
import { useT } from "@/i18n/use-t";

const pageSchema = z.object({
  key: z.string().min(1, "Key is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  faqs: z.array(z.object({
    title_ar: z.string().optional(),
    title_en: z.string().optional(),
    content_ar: z.string().optional(),
    content_en: z.string().optional()
  })).optional(),
  active: z.boolean(),
});

type FormValues = z.infer<typeof pageSchema>;

interface SettingPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: SettingPage | null;
  onSaved: () => void;
}

export function SettingPageDialog({
  open,
  onOpenChange,
  page,
  onSaved,
}: SettingPageDialogProps) {
  const t = useT();
  const isEditing = !!page;

  const form = useForm<FormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      key: "",
      title: "",
      content: "",
      faqs: [],
      active: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  useEffect(() => {
    if (open) {
      if (page) {
        let faqs: NonNullable<FormValues["faqs"]> = [];
        let content = page.content;
        
        try {
          const parsed = JSON.parse(page.content);
          if (Array.isArray(parsed)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            faqs = parsed.map((item: any) => ({
              title_ar: item.title_ar || item.title || "",
              title_en: item.title_en || "",
              content_ar: item.content_ar || item.content || "",
              content_en: item.content_en || ""
            }));
          }
          content = "";
        } catch {
          // fallback if not valid JSON
        }
        
        form.reset({
          key: page.key,
          title: page.title,
          content: content,
          faqs: faqs,
          active: page.active,
        });
      } else {
        form.reset({
          key: "",
          title: "",
          content: "",
          faqs: [],
          active: true,
        });
      }
    }
  }, [open, page, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const finalContent = JSON.stringify(values.faqs || []);

      const payload = {
        key: values.key,
        title: values.title,
        content: finalContent,
        active: values.active,
      };

      if (isEditing) {
        await settingPagesService.update(page.id, payload);
        toast.success(t("pages.toastUpdateSuccess"));
      } else {
        await settingPagesService.create(payload);
        toast.success(t("pages.toastCreateSuccess"));
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? t("pages.editPage") : t("pages.addPage")}</DialogTitle>
          <DialogDescription>
            {t("pages.dialogDesc")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("pages.title")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("pages.privacyPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("pages.key")}</FormLabel>
                    <FormControl>
                      <Input placeholder="faq, privacy_policy, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 border p-4 rounded-lg bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="text-base font-medium">{t("pages.content")}</div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ title_ar: "", title_en: "", content_ar: "", content_en: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("pages.addSection") || "Add Section"}
                </Button>
              </div>
              
              {fields.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-4">
                  {t("table.noRecords")}
                </div>
              )}
              
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-3 p-4 bg-background border rounded-md">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <FormField
                        control={form.control}
                        name={`faqs.${index}.title_ar`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("pages.sectionTitle")} (AR)</FormLabel>
                            <FormControl>
                              <Input placeholder="..." dir="rtl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`faqs.${index}.title_en`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("pages.sectionTitle")} (EN)</FormLabel>
                            <FormControl>
                              <Input placeholder="..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-8 text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={() => remove(index)}
                      title={t("pages.removeSection") || "Remove"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`faqs.${index}.content_ar`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("pages.sectionContent")} (AR)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="..." className="min-h-[80px]" dir="rtl" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`faqs.${index}.content_en`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("pages.sectionContent")} (EN)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="..." className="min-h-[80px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t("pages.status")}</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("common.cancel") || "Cancel"}
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {t("pages.saveDetails")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
