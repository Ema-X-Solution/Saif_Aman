"use client";

import { useEffect } from "react";

import { useSettingsStore } from "@/store/settings-store";

export function LocaleAttributes() {
  const locale = useSettingsStore((s) => s.locale);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale === "ar" ? "ar" : "en";
    root.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
