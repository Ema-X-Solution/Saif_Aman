"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT } from "@/i18n/use-t";
import type { SubscriptionStatus } from "@/types/dashboard";

interface SubscriptionStatusCardProps {
  data: SubscriptionStatus;
}

export function SubscriptionStatusCard({ data }: SubscriptionStatusCardProps) {
  const t = useT();
  const total = data.paid + data.dueSoon + data.late;

  const items = [
    {
      key: "paid",
      label: t("dashboard.home.subscriptionPaid"),
      value: data.paid,
      color: "bg-emerald-500",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      key: "dueSoon",
      label: t("dashboard.home.subscriptionDueSoon"),
      value: data.dueSoon,
      color: "bg-amber-500",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      key: "late",
      label: t("dashboard.home.subscriptionLate"),
      value: data.late,
      color: "bg-rose-500",
      textColor: "text-rose-600 dark:text-rose-400",
    },
  ] as const;

  return (
    <Card className="h-full border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          {t("dashboard.home.subscriptionStatus")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {items.map((item) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={item.key}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className={`font-bold ${item.textColor}`}>
                  {item.value.toLocaleString()}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${item.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
