import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/login",
    "/dashboard",
    "/schools",
    "/buses",
    "/users",
    "/areas",
    "/parent-requests",
    "/reviews",
    "/notifications",
    "/reports",
    "/admins",
    "/settings",
    "/profile",
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
