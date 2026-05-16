"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useT } from "@/i18n/use-t";
import { useAuthStore } from "@/store/auth-store";

const profileSchema = z.object({
  name: z.string().min(2),
  jobTitle: z.string().min(2),
  phone: z.string().min(6),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function ProfileView() {
  const t = useT();
  const session = useAuthStore((s) => s.session);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: session?.name ?? t("profilePage.demoName"),
      jobTitle: t("profilePage.demoJobTitle"),
      phone: t("profilePage.demoPhone"),
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader title={t("profilePage.title")} description={t("profilePage.description")} />
      <Card className="border-border/80">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar className="h-14 w-14">
            <AvatarFallback>
              {session?.name?.slice(0, 2).toUpperCase() ?? t("profilePage.avatarFallback")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{session?.name ?? t("profilePage.fallbackName")}</CardTitle>
            <p className="text-sm text-muted-foreground">{session?.email}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={form.handleSubmit(() => {
                toast.success(t("profilePage.toastSaved"));
              })}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("profilePage.fullName")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("profilePage.roleTitle")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t("profilePage.phone")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <Button type="submit">{t("profilePage.saveProfile")}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
