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
import { useAuthStore } from "@/store/auth-store";

const profileSchema = z.object({
  name: z.string().min(2),
  jobTitle: z.string().min(2),
  phone: z.string().min(6),
});

type ProfileValues = z.infer<typeof profileSchema>;

export function ProfileView() {
  const session = useAuthStore((s) => s.session);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: session?.name ?? "Admin User",
      jobTitle: "Transport safety lead",
      phone: "+966 50 000 0000",
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Administrative identity surfaced to other operators (mock form)."
      />
      <Card className="border-border/80">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar className="h-14 w-14">
            <AvatarFallback>
              {session?.name?.slice(0, 2).toUpperCase() ?? "SA"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{session?.name ?? "Administrator"}</CardTitle>
            <p className="text-sm text-muted-foreground">{session?.email}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={form.handleSubmit(() => {
                toast.success("Profile updated (mock).");
              })}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
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
                    <FormLabel>Role title</FormLabel>
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <Button type="submit">Save profile</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
