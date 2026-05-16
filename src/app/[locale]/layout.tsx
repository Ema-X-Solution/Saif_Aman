import type { Metadata, Viewport } from "next";
import { Cairo, Inter } from "next/font/google";

import { APP_NAME_AR, APP_NAME_EN, BRAND } from "@/constants/app";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE_TEMPLATE, LANDING_KEYWORDS, SITE_URL } from "@/constants/seo";
import { AppProviders } from "@/providers/app-providers";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const viewport: Viewport = {
  themeColor: BRAND.navy900,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [{ url: "/Logo.svg", type: "image/svg+xml" }],
    shortcut: "/Logo.svg",
    apple: "/Logo.svg",
  },
  title: {
    default: `${APP_NAME_EN} | ${APP_NAME_AR}`,
    template: DEFAULT_TITLE_TEMPLATE,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [...LANDING_KEYWORDS],
  openGraph: {
    title: `${APP_NAME_EN} | ${APP_NAME_AR}`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: APP_NAME_EN,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME_EN} | ${APP_NAME_AR}`,
    description: DEFAULT_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: localeParam } = await params;
  const locale = localeParam ?? "en";
  const lang = locale === "ar" ? "ar" : "en";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={lang}
      dir={dir}
      suppressHydrationWarning
      className={`${inter.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
