"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME_AR, APP_NAME_EN } from "@/constants/app";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { localizedHref } from "@/lib/localized-href";

export function PublicFooter() {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);

  return (
    <footer className="border-t border-border/40 bg-background/60 py-8 backdrop-blur-sm mt-auto">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME_EN} · {APP_NAME_AR}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <Link href={localizedHref(locale, "terms_conditions" as any)} className="hover:text-foreground transition-colors">
            {t("landing.terms") || "Terms & Conditions"}
          </Link>
          <Link href={localizedHref(locale, "privacy_policy" as any)} className="hover:text-foreground transition-colors">
            {t("landing.privacy") || "Privacy Policy"}
          </Link>
          <Link href={localizedHref(locale, "faq" as any)} className="hover:text-foreground transition-colors">
            {t("landing.faq") || "FAQ"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
