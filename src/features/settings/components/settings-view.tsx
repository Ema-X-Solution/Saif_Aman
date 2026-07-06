"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useT } from "@/i18n/use-t";
import { SettingPagesTab } from "./setting-pages-tab";

export function SettingsView() {
  const t = useT();

  return (
    <div className="space-y-6">
      <PageHeader title={t("settings.title")} description={t("settings.description")} />
      
      <Card className="border-border/80 shadow-sm">
        <CardContent className="p-6">
          <SettingPagesTab />
        </CardContent>
      </Card>
    </div>
  );
}

