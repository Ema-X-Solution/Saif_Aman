"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useT } from "@/i18n/use-t";
import { accountService } from "@/services/account.service";

type Step = "login" | "confirm" | "success";

export function DeleteAccountView() {
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("login");
  const [token, setToken] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loginSchema = z.object({
    identity: z.string().min(1, t("common.required")),
    password: z.string().min(1, t("common.required")),
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identity: "",
      password: "",
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state on close
      setStep("login");
      setToken(null);
      form.reset();
    }
    setIsOpen(open);
  };

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const newToken = await accountService.userLogin(values.identity, values.password);
      setToken(newToken);
      setStep("confirm");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("loginPage.toastError"));
    }
  };

  const confirmDelete = async () => {
    if (!token) return;
    setIsDeleting(true);
    try {
      await accountService.deleteMyAccount(token);
      setStep("success");
      toast.success(t("deleteAccountPage.success"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("deleteAccountPage.error"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/40 p-4">
      <div className="mb-8">
        <BrandLogo className="[&_img]:h-14 [&_img]:w-auto" />
      </div>

      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t("deleteAccountPage.title")}</h1>
        <p className="text-muted-foreground">{t("deleteAccountPage.description")}</p>

        <Button variant="destructive" size="lg" onClick={() => setIsOpen(true)}>
          {t("deleteAccountPage.button")}
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          {step === "login" && (
            <>
              <DialogHeader>
                <DialogTitle>{t("deleteAccountPage.loginToVerify")}</DialogTitle>
                <DialogDescription>
                  {t("deleteAccountPage.description")}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="identity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("deleteAccountPage.identityLabel")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>{t("deleteAccountPage.passwordLabel")}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                      {t("common.cancel")}
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? t("table.loading") : t("common.actions")}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}

          {step === "confirm" && (
            <>
              <DialogHeader>
                <DialogTitle>{t("deleteAccountPage.title")}</DialogTitle>
                <DialogDescription className="text-destructive font-medium mt-2">
                  {t("deleteAccountPage.confirmDelete")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  {t("deleteAccountPage.cancel")}
                </Button>
                <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
                  {isDeleting ? t("deleteAccountPage.deleting") : t("deleteAccountPage.yesDelete")}
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "success" && (
            <>
              <DialogHeader>
                <DialogTitle>{t("common.success")}</DialogTitle>
                <DialogDescription>
                  {t("deleteAccountPage.success")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="pt-4">
                <Button onClick={() => handleOpenChange(false)}>
                  {t("common.cancel")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
