
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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
  content: z.string().min(1, "Content is required"),
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
      active: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (page) {
        form.reset({
          key: page.key,
          title: page.title,
          content: page.content,
          active: page.active,
        });
      } else {
        form.reset({
          key: "",
          title: "",
          content: "",
          active: true,
        });
      }
    }
  }, [open, page, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditing) {
        await settingPagesService.update(page.id, values);
        toast.success(t("pages.toastUpdateSuccess"));
      } else {
        await settingPagesService.create(values);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? t("pages.editPage") : t("pages.addPage")}</DialogTitle>
          <DialogDescription>
            {t("pages.dialogDesc")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input placeholder="privacy_policy, terms_conditions, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("pages.content")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("pages.contentPlaceholder")} className="min-h-[150px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
