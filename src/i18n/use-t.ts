"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { DEFAULT_LOCALE, type AppLocale } from "@/constants/app";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

type Messages = typeof en;

type AnyRecord = Record<string, unknown>;

function getByPath(obj: AnyRecord, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as AnyRecord)) {
      return (acc as AnyRecord)[key];
    }
    return undefined;
  }, obj);
}

export function getMessages(locale: AppLocale): Messages {
  return locale === "ar" ? (ar as unknown as Messages) : (en as unknown as Messages);
}

export function getLocaleFromPathname(pathname: string | null): AppLocale {
  if (!pathname || pathname === "/") {
    return DEFAULT_LOCALE;
  }
  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    return "ar";
  }
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return "en";
  }
  return DEFAULT_LOCALE;
}

export function useT() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);

  return useMemo(() => {
    const messages = getMessages(locale);

    return (key: string) => {
      const value = getByPath(messages as unknown as AnyRecord, key);
      return typeof value === "string" ? value : key;
    };
  }, [locale]);
}
