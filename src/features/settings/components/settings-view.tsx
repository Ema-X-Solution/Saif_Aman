"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AppLocale } from "@/constants/app";
import { useT } from "@/i18n/use-t";
import { useSettingsStore } from "@/store/settings-store";
import { SettingPagesTab } from "./setting-pages-tab";

const generalSchema = z.object({
  platformName: z.string().min(2),
});

const notificationSchema = z.object({
  notifyEmail: z.boolean(),
  notifyPush: z.boolean(),
});

const securitySchema = z.object({
  sessionTimeoutMinutes: z.coerce.number().min(5).max(240),
});

type GeneralValues = z.infer<typeof generalSchema>;

export function SettingsView() {
  const t = useT();
  const { settings, setSettings, locale, setLocale } = useSettingsStore();

  const generalForm = useForm<GeneralValues>({
    resolver: zodResolver(generalSchema),
    values: { platformName: settings.platformName },
  });

  const notificationForm = useForm({
    resolver: zodResolver(notificationSchema),
    values: {
      notifyEmail: settings.notifyEmail,
      notifyPush: settings.notifyPush,
    },
  });

  const securityForm = useForm({
    resolver: zodResolver(securitySchema),
    values: { sessionTimeoutMinutes: settings.sessionTimeoutMinutes },
  });

  const onLocaleChange = (next: AppLocale) => {
    setLocale(next);
    setSettings({ defaultLocale: next, rtlPreferred: next === "ar" });
    toast.success(t("settings.toastLocaleSaved"));
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t("settings.title")} description={t("settings.description")} />
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="general">{t("settings.tabGeneral")}</TabsTrigger>
          <TabsTrigger value="theme">{t("settings.tabTheme")}</TabsTrigger>
          <TabsTrigger value="language">{t("settings.tabLanguage")}</TabsTrigger>
          <TabsTrigger value="pages">{t("settings.tabPages") || "App Pages"}</TabsTrigger>
          <TabsTrigger value="notifications">{t("settings.tabNotifications")}</TabsTrigger>
          <TabsTrigger value="security">{t("settings.tabSecurity")}</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle>{t("settings.generalHeading")}</CardTitle>
              <CardDescription>{t("settings.generalCardDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form
                  className="space-y-4"
                  onSubmit={generalForm.handleSubmit((values) => {
                    setSettings({ platformName: values.platformName });
                    toast.success(t("settings.toastGeneralSaved"));
                  })}
                >
                  <FormField
                    control={generalForm.control}
                    name="platformName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("settings.platformName")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">{t("settings.saveChanges")}</Button>
                </form>
              </Form>
              <Separator className="my-8" />
              <div>
                <p className="text-sm font-medium">{t("settings.logoPlaceholder")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("settings.logoPlaceholderHint")}
                </p>
                <div className="mt-4 flex h-24 max-w-xs items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 text-sm text-muted-foreground">
                  {t("settings.logoSlot")}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle>{t("settings.themeHeading")}</CardTitle>
              <CardDescription>{t("settings.themeCardDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>{t("settings.themeHint")}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle>{t("settings.languageHeading")}</CardTitle>
              <CardDescription>{t("settings.languageCardDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant={locale === "en" ? "default" : "outline"}
                onClick={() => onLocaleChange("en")}
              >
                {t("settings.languageEnglish")}
              </Button>
              <Button
                type="button"
                variant={locale === "ar" ? "default" : "outline"}
                onClick={() => onLocaleChange("ar")}
              >
                {t("settings.languageArabic")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages">
          <Card className="border-border/80">
            <CardContent className="pt-6">
              <SettingPagesTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle>{t("settings.notificationsHeading")}</CardTitle>
              <CardDescription>{t("settings.notificationsCardDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form
                  className="space-y-6"
                  onSubmit={notificationForm.handleSubmit((values) => {
                    setSettings(values);
                    toast.success(t("settings.toastNotificationsSaved"));
                  })}
                >
                  <FormField
                    control={notificationForm.control}
                    name="notifyEmail"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/70 p-4">
                        <div>
                          <FormLabel className="text-base">{t("settings.notifyEmail")}</FormLabel>
                          <p className="text-sm text-muted-foreground">{t("settings.notifyEmailHint")}</p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="notifyPush"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border/70 p-4">
                        <div>
                          <FormLabel className="text-base">{t("settings.notifyPush")}</FormLabel>
                          <p className="text-sm text-muted-foreground">{t("settings.notifyPushHint")}</p>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">{t("settings.savePreferences")}</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle>{t("settings.securityHeading")}</CardTitle>
              <CardDescription>{t("settings.securityCardDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form
                  className="space-y-4"
                  onSubmit={securityForm.handleSubmit((values) => {
                    setSettings(values);
                    toast.success(t("settings.toastSecuritySaved"));
                  })}
                >
                  <FormField
                    control={securityForm.control}
                    name="sessionTimeoutMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("settings.sessionTimeout")}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">{t("settings.updatePolicy")}</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
