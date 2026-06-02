"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, FileText, Loader2, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { getLocaleFromPathname, useT } from "@/i18n/use-t";
import { localizedHref } from "@/lib/localized-href";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SettingPage } from "@/types/settings";

const PAGE_ICONS: Record<string, LucideIcon> = {
  privacy_policy: Shield,
  terms_conditions: Shield,
  terms_of_service: FileText,
  terms: FileText,
};

function getPageIcon(key: string): LucideIcon {
  return PAGE_ICONS[key] ?? FileText;
}

function formatPageContent(content: string, locale: string): string {
  const trimmed = content.trim();
  if (!trimmed) return "";

  // Try parsing as JSON array (new format)
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          const title = locale === "ar" ? (item.title_ar || item.title) : (item.title_en || item.title);
          const itemContent = locale === "ar" ? (item.content_ar || item.content) : (item.content_en || item.content);

          if (!title && !itemContent) return "";
          let html = "";
          if (title) {
            html += `<h2>${title}</h2>\n`;
          }
          if (itemContent) {
            const contentHtml = itemContent
              .split(/\n{2,}/)
              .map((p: string) => p.trim())
              .filter(Boolean)
              .map((p: string) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
              .join("");
            html += contentHtml;
          }
          return html;
        })
        .join("\n");
    }
  } catch {
    // Ignore and fallback to raw text/html parsing
  }

  if (/<[a-z][\s\S]*>/i.test(trimmed)) return trimmed;

  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");
}

interface PublicSettingPageViewProps {
  page: SettingPage | null;
  loading: boolean;
  error: boolean;
}

export function PublicSettingPageView({
  page,
  loading,
  error,
}: PublicSettingPageViewProps) {
  const t = useT();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const homeHref = localizedHref(locale, ROUTES.home);
  const PageIcon = page ? getPageIcon(page.key) : FileText;

  return (
    <div className="relative flex min-h-screen flex-col">
      <ShellBackground />

      <div className="relative flex min-h-screen flex-col">
        <PublicHeader />

        <main className="flex-1">
          <PageContainer className="py-10 md:py-14">
            {loading ? (
              <LoadingState label={t("publicPage.loading")} />
            ) : error || !page ? (
              <NotFoundState
                title={t("publicPage.notFound")}
                description={t("publicPage.notFoundDescription")}
                backLabel={t("publicPage.backHome")}
                homeHref={homeHref}
              />
            ) : (
              <article className="mx-auto max-w-3xl">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="-ms-2 mb-6 text-muted-foreground hover:text-foreground"
                >
                  <Link href={homeHref}>
                    <ArrowLeft className="h-4 w-4" />
                    {t("publicPage.backHome")}
                  </Link>
                </Button>

                <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/90 shadow-xl shadow-primary/5 backdrop-blur-sm">
                  <div
                    className="pointer-events-none absolute -end-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
                    aria-hidden
                  />

                  <div className="relative border-b border-border/50 px-6 py-8 md:px-10 md:py-10">
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      {t("publicPage.legalDocument")}
                    </span>
                    <div className="mt-5 flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                        <PageIcon className="h-6 w-6 text-primary" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                          {page.title}
                        </h1>
                        <p className="text-sm text-muted-foreground">{t("publicPage.subtitle")}</p>
                      </div>
                    </div>
                  </div>

                  <PageContent html={formatPageContent(page.content, locale)} />
                </div>
              </article>
            )}
          </PageContainer>
        </main>

        <PublicFooter />
      </div>
    </div>
  );
}

function ShellBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-muted/30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(44,95,143,0.12),transparent_50%)] dark:bg-[radial-gradient(circle_at_top,_rgba(227,168,37,0.08),transparent_45%)]" />
    </>
  );
}

function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("container mx-auto max-w-5xl px-4 sm:px-6", className)}>
      {children}
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <CenteredState>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
    </CenteredState>
  );
}

function CenteredState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      {children}
    </div>
  );
}

function NotFoundState({
  title,
  description,
  backLabel,
  homeHref,
}: {
  title: string;
  description: string;
  backLabel: string;
  homeHref: string;
}) {
  return (
    <CenteredState>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="max-w-md text-muted-foreground">{description}</p>
      <Button asChild variant="outline" className="mt-2">
        <Link href={homeHref}>
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </Button>
    </CenteredState>
  );
}

function PageContent({ html }: { html: string }) {
  return (
    <div
      className={cn(
        "px-6 py-8 text-base leading-8 text-foreground/90 md:px-10 md:py-10",
        "[&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline",
        "[&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground",
        "[&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground",
        "[&_li]:mb-2 [&_li]:leading-7",
        "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:ps-6",
        "[&_p]:mb-4 [&_p:last-child]:mb-0",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:ps-6",
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
