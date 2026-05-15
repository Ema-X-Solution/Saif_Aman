import Link from "next/link";
import { ArrowRight, Bus, ClipboardList, School } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

const ACTIONS = [
  {
    title: "Register school",
    href: ROUTES.schools,
    icon: School,
    hint: "Onboard campuses and fleet policies.",
  },
  {
    title: "Review requests",
    href: ROUTES.parentRequests,
    icon: ClipboardList,
    hint: "Approve transport changes from parents.",
  },
  {
    title: "Fleet roster",
    href: ROUTES.buses,
    icon: Bus,
    hint: "Audit drivers, supervisors, and areas.",
  },
];

export function QuickActionsCard() {
  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.href}
              className="flex flex-col gap-2 rounded-lg border border-border/70 bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium leading-none">{action.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{action.hint}</p>
                </div>
              </div>
              <Button asChild size="sm" variant="secondary" className="shrink-0">
                <Link href={action.href}>
                  Open
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
