export const APP_NAME_EN = "SAIF AMAN";
export const APP_NAME_AR = "سيف أمان";
export const APP_TAGLINE_EN =
  "Enterprise school bus tracking and transportation safety.";
export const APP_TAGLINE_AR = "منصة متكاملة لتتبع الباصات المدرسية وسلامة النقل.";

/** Matches SAIF AMAN color system (navy · amber · neutrals · status). */
export const BRAND = {
  navy900: "#091F3A",
  navy800: "#0E2A47",
  navy700: "#12395E",
  navy600: "#1A4A73",
  navy500: "#2C5F8F",
  amber500: "#E3A825",
  amber400: "#F2B93B",
  amber300: "#F7CF6A",
  amber200: "#FAE3A6",
  amber100: "#FFF4D6",
  bgSoft: "#F7F9FC",
  bgMuted: "#F1F5F9",
  border: "#E2E8F0",
  borderStrong: "#CBD5E1",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textPlaceholder: "#94A3B8",
  success: "#16A34A",
  warning: "#F59E0B",
  error: "#DC2626",
  info: "#2563EB",
} as const;

export const SUPPORTED_LOCALES = ["en", "ar"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";
