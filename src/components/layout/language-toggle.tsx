"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { AppLocale } from "@/constants/app";
import { useSettingsStore } from "@/store/settings-store";

export function LanguageToggle() {
  const locale = useSettingsStore((s) => s.locale);
  const setLocale = useSettingsStore((s) => s.setLocale);
  const pathname = usePathname();
  const router = useRouter();

  const next = locale === "en" ? "ar" : "en";

  function handleToggle() {
    setLocale(next as AppLocale);
    // Build new path preserving existing route after locale prefix
    const rest = pathname.replace(/^\/(en|ar)/, "") || "/";
    const newPath = `/${next}${rest}`;
    router.replace(newPath);
  }

  return (
    <Button variant="ghost" size="icon" aria-label="Toggle language" onClick={handleToggle}>
      <span className="sr-only">Switch language</span>
      <span className="text-xs font-medium">{locale != "en" ? "EN" : "ع"}</span>
    </Button>
  );
}
