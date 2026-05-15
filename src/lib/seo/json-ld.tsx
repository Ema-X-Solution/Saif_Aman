import { APP_NAME_EN } from "@/constants/app";
import { DEFAULT_DESCRIPTION, SITE_URL } from "@/constants/seo";

export function OrganizationJsonLd() {
  const payload = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_NAME_EN,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export function WebSiteJsonLd() {
  const payload = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${APP_NAME_EN} | سيف أمان`,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
