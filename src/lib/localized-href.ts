import type { AppLocale } from "@/constants/app";

/** Locale-prefixed path for `Link` and the app router (e.g. `/en/dashboard`). */
export function localizedHref(locale: AppLocale, pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `/${locale}${path}`;
}
