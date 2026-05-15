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
import { useSettingsStore } from "@/store/settings-store";

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
    toast.success("Language preference saved locally.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Control branding, localization, notifications, and security posture."
      />
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="language">Language</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>Platform name and identity placeholders.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form
                  className="space-y-4"
                  onSubmit={generalForm.handleSubmit((values) => {
                    setSettings({ platformName: values.platformName });
                    toast.success("General settings saved.");
                  })}
                >
                  <FormField
                    control={generalForm.control}
                    name="platformName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save changes</Button>
                </form>
              </Form>
              <Separator className="my-8" />
              <div>
                <p className="text-sm font-medium">Logo placeholder</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload pipeline hooks to your storage bucket—this frontend ships with a branded mark in the navigation.
                </p>
                <div className="mt-4 flex h-24 max-w-xs items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 text-sm text-muted-foreground">
                  Logo slot
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Light, dark, or follow the operating system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>Use the toggle in the top navigation to experiment with themes—preference syncs via next-themes.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle>Language</CardTitle>
              <CardDescription>Arabic & English interfaces with RTL support.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant={locale === "en" ? "default" : "outline"}
                onClick={() => onLocaleChange("en")}
              >
                English
              </Button>
              <Button
                type="button"
                variant={locale === "ar" ? "default" : "outline"}
                onClick={() => onLocaleChange("ar")}
              >
                العربية
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose how administrators receive operational notices.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form
                  className="space-y-6"
                  onSubmit={notificationForm.handleSubmit((values) => {
                    setSettings(values);
                    toast.success("Notification preferences saved.");
                  })}
                >
                  <FormField
                    control={notificationForm.control}
                    name="notifyEmail"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-border/70 p-4">
                        <div>
                          <FormLabel className="text-base">Email digests</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Morning summary of alerts and SLA breaches.
                          </p>
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
                  <FormField
                    control={notificationForm.control}
                    name="notifyPush"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-border/70 p-4">
                        <div>
                          <FormLabel className="text-base">Push notifications</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Realtime prompts for critical safety events.
                          </p>
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
                  <Button type="submit">Save preferences</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Session policy for this workstation.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form
                  className="space-y-4"
                  onSubmit={securityForm.handleSubmit((values) => {
                    setSettings(values);
                    toast.success("Security settings saved.");
                  })}
                >
                  <FormField
                    control={securityForm.control}
                    name="sessionTimeoutMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session timeout (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Update policy</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
