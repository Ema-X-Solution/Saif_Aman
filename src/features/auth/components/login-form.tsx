"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { localizedHref } from "@/lib/localized-href";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export function LoginForm() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const setSession = useAuthStore((s) => s.setSession);
  const t = useT();

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("loginPage.validationEmail")),
        password: z.string().min(4, t("loginPage.validationPasswordMin")),
        remember: z.boolean(),
      }),
    [t],
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const session = await authService.login({
        email: values.email,
        password: values.password,
        remember: values.remember,
      });
      setSession(session);
      toast.success(t("loginPage.toastSuccess"));
      router.replace(localizedHref(locale, ROUTES.dashboard));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("loginPage.toastError");
      toast.error(message);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="mb-8 flex justify-center">
        <BrandLogo
          href={localizedHref(locale, ROUTES.home)}
          className="[&_img]:h-12 [&_img]:w-auto [&_img]:sm:h-14"
        />
      </div>
      <Card className="border-border/80 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">{t("loginPage.cardTitle")}</CardTitle>
          <CardDescription>{t("loginPage.cardDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-5" onSubmit={onSubmit} noValidate>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.password")}</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">{t("loginPage.rememberMe")}</FormLabel>
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t("loginPage.signingIn") : t("loginPage.signIn")}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link
              className="text-primary underline-offset-4 hover:underline"
              href={localizedHref(locale, ROUTES.home)}
            >
              {t("loginPage.backToWebsite")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
