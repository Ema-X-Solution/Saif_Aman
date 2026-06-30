import type { ReactNode } from "react";
import { GraduationCap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border/80 bg-gradient-to-br from-card to-card/80 shadow-sm hover:shadow-md transition-all duration-300", className)}>
      <CardHeader className="space-y-1 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15">
            <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </div>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
