"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";

export function LocaleAttributes() {
  const pathname = usePathname();
  const locale = pathname?.startsWith('/ar') ? 'ar' : 'en';

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale === "ar" ? "ar" : "en";
    root.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
