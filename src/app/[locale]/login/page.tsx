import type { Metadata } from "next";

import { LoginForm } from "@/features/auth/components/login-form";
import ar from "@/locales/ar.json";
import en from "@/locales/en.json";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (locale === "ar" ? ar : en) as typeof en;
  return {
    title: messages.loginPage.metaTitle,
    description: messages.loginPage.metaDescription,
  };
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0A3D91]/10 via-background to-[#1D5FD0]/10 px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(29,95,208,0.15),transparent_45%)]" />
      <div className="relative z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
