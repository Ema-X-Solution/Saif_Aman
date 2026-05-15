export const APP_NAME_EN = "SAIF AMAN";
export const APP_NAME_AR = "سيف أمان";
export const APP_TAGLINE_EN =
  "Enterprise school bus tracking and transportation safety.";
export const APP_TAGLINE_AR = "منصة متكاملة لتتبع الباصات المدرسية وسلامة النقل.";

export const BRAND = {
  primary: "#0A3D91",
  primaryMid: "#1D5FD0",
  accent: "#F4B400",
  surface: "#F8FAFC",
  mutedSurface: "#F1F5F9",
} as const;

export const SUPPORTED_LOCALES = ["en", "ar"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";
