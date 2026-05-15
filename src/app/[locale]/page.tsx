import type { Metadata } from "next";

import { APP_NAME_AR, APP_NAME_EN } from "@/constants/app";
import { DEFAULT_DESCRIPTION, LANDING_KEYWORDS, SITE_URL } from "@/constants/seo";
import { LandingView } from "@/features/landing/components/landing-view";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${APP_NAME_EN} | ${APP_NAME_AR}`,
    description: DEFAULT_DESCRIPTION,
    keywords: [...LANDING_KEYWORDS],
    alternates: { canonical: "/" },
    openGraph: {
      title: `${APP_NAME_EN} | ${APP_NAME_AR}`,
      description: DEFAULT_DESCRIPTION,
      url: SITE_URL,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${APP_NAME_EN} | ${APP_NAME_AR}`,
      description: DEFAULT_DESCRIPTION,
    },
  };
}

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${APP_NAME_EN} | ${APP_NAME_AR}`,
    applicationCategory: "BusinessApplication",
    description: DEFAULT_DESCRIPTION,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <>
      <LandingView />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
