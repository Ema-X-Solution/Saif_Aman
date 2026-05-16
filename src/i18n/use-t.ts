"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { DEFAULT_LOCALE, type AppLocale } from "@/constants/app";
import { getMessages, type Messages } from "@/lib/locale-messages";

type AnyRecord = Record<string, unknown>;

function getByPath(obj: AnyRecord, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as AnyRecord)) {
      return (acc as AnyRecord)[key];
    }
    return undefined;
  }, obj);
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
    const messages = getMessages(locale) as Messages;

    return (key: string) => {
      const value = getByPath(messages as unknown as AnyRecord, key);
      return typeof value === "string" ? value : key;
    };
  }, [locale]);
}
