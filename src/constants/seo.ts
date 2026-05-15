import { APP_NAME_EN } from "@/constants/app";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://saif-aman.example.com";

export const DEFAULT_TITLE_TEMPLATE = `%s | ${APP_NAME_EN}`;

export const LANDING_KEYWORDS = [
  "School Bus Tracking System",
  "School Transportation Management",
  "Smart School Bus Platform",
  "GPS School Bus Tracking",
  "Parent School Bus Monitoring",
  "إدارة وتتبع باصات المدارس",
  "منصة تتبع الباصات المدرسية",
  "SAIF AMAN",
  "سيف أمان",
] as const;

export const DEFAULT_DESCRIPTION =
  "SAIF AMAN delivers real-time GPS school bus tracking, parent alerts, and admin oversight for safe, compliant student transportation—Arabic & English.";
