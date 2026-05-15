import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AppLocale } from "@/constants/app";
import { DEFAULT_LOCALE } from "@/constants/app";
import type { PlatformSettings } from "@/types/settings";

const defaultSettings: PlatformSettings = {
  platformName: "SAIF AMAN",
  defaultLocale: DEFAULT_LOCALE,
  rtlPreferred: false,
  theme: "system",
  notifyEmail: true,
  notifyPush: true,
  sessionTimeoutMinutes: 45,
};

interface SettingsState {
  settings: PlatformSettings;
  setSettings: (patch: Partial<PlatformSettings>) => void;
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      locale: DEFAULT_LOCALE,
      setSettings: (patch) =>
        set((s) => ({
          settings: { ...s.settings, ...patch },
          locale: patch.defaultLocale ?? s.locale,
        })),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "saif-aman-settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
