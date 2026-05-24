"use client";

import { use, useEffect, useState } from "react";

import { PublicSettingPageView } from "@/features/public-pages/components/public-setting-page-view";
import { settingPagesService } from "@/services/index";
import type { SettingPage } from "@/types/settings";

export default function PublicPage({
  params,
}: {
  params: Promise<{ locale: string; key: string }>;
}) {
  const resolvedParams = use(params);
  const [page, setPage] = useState<SettingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await settingPagesService.getByKey(resolvedParams.key);
        if (!cancelled) setPage(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [resolvedParams.key]);

  return <PublicSettingPageView page={page} loading={loading} error={error} />;
}
