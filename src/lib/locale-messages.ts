import { DEFAULT_LOCALE, type AppLocale } from "@/constants/app";
import ar from "@/locales/ar.json";
import en from "@/locales/en.json";

export type Messages = typeof en;

export function getMessages(locale: string): Messages {
  const resolved: AppLocale = locale === "ar" ? "ar" : locale === "en" ? "en" : DEFAULT_LOCALE;
  return resolved === "ar" ? (ar as Messages) : en;
}
