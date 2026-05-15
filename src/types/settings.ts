import type { AppLocale } from "@/constants/app";

export interface PlatformSettings {
  platformName: string;
  defaultLocale: AppLocale;
  rtlPreferred: boolean;
  theme: "light" | "dark" | "system";
  notifyEmail: boolean;
  notifyPush: boolean;
  sessionTimeoutMinutes: number;
}
