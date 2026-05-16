"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DriversView } from "@/features/drivers/components/drivers-view";
import { SupervisorsView } from "@/features/supervisors/components/supervisors-view";
import { getLocaleFromPathname, useT } from "@/i18n/use-t";

const TAB_VALUES = ["supervisors", "drivers"] as const;
type TabValue = (typeof TAB_VALUES)[number];

function isTabValue(v: string | null | undefined): v is TabValue {
  return !!v && TAB_VALUES.includes(v as TabValue);
}

export function UsersHubView() {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname ?? null);
  const tabsDir = locale === "ar" ? "rtl" : "ltr";
  const searchParams = useSearchParams();
  const panelRef = useRef<HTMLDivElement>(null);
  const tabsLabelId = useId();

  const tabParam = searchParams.get("tab");
  const activeTab: TabValue = isTabValue(tabParam) ? tabParam : "supervisors";

  useEffect(() => {
    if (!isTabValue(tabParam)) {
      router.replace(`${pathname}?tab=supervisors`, { scroll: false });
    }
  }, [tabParam, pathname, router]);

  const skipScrollRef = useRef(true);
  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [activeTab]);

  const setTab = useCallback(
    (value: string) => {
      const v = isTabValue(value) ? value : "supervisors";
      router.replace(`${pathname}?tab=${v}`, { scroll: false });
    },
    [pathname, router],
  );

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={setTab}
        className="space-y-6"
        aria-labelledby={tabsLabelId}
      >
        <p id={tabsLabelId} className="sr-only">
          {t("usersHub.tabsLabel")}
        </p>
        <TabsList
          dir={tabsDir}
          className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/60 p-1"
        >
          <TabsTrigger value="supervisors" className="shrink-0">
            {t("usersHub.supervisorsTab")}
          </TabsTrigger>
          <TabsTrigger value="drivers" className="shrink-0">
            {t("usersHub.driversTab")}
          </TabsTrigger>
        </TabsList>

        <div
          ref={panelRef}
          className="scroll-mt-24 outline-none"
          tabIndex={-1}
          aria-live="polite"
        >
          <TabsContent
            value="supervisors"
            className="mt-0 outline-none focus-visible:ring-0"
          >
            <SupervisorsView />
          </TabsContent>
          <TabsContent value="drivers" className="mt-0 outline-none focus-visible:ring-0">
            <DriversView />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
