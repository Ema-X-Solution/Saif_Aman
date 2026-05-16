"use client";

import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import { useT } from "@/i18n/use-t";
import { cn } from "@/lib/utils";

export type SemanticStatus =
  | "active"
  | "inactive"
  | "pending"
  | "approved"
  | "rejected"
  | "maintenance"
  | "offline"
  | "on_leave"
  | "suspended"
  | "invited"
  | "disabled"
  | "success"
  | "warning"
  | "info"
  | "neutral";

const STATUS_TO_VARIANT: Record<SemanticStatus, BadgeProps["variant"]> = {
  active: "success",
  approved: "success",
  inactive: "secondary",
  pending: "warning",
  rejected: "destructive",
  maintenance: "warning",
  offline: "destructive",
  on_leave: "info",
  suspended: "destructive",
  invited: "info",
  disabled: "secondary",
  success: "success",
  warning: "warning",
  info: "info",
  neutral: "outline",
};

/** Maps API / semantic status values to message keys under `common.*`. */
const STATUS_TO_MESSAGE_KEY: Partial<Record<SemanticStatus, string>> = {
  active: "common.active",
  approved: "common.approved",
  inactive: "common.inactive",
  pending: "common.pending",
  rejected: "common.rejected",
  maintenance: "common.maintenance",
  offline: "common.offline",
  on_leave: "common.onLeave",
  suspended: "common.suspended",
  invited: "common.invited",
  disabled: "common.disabled",
  success: "common.success",
  warning: "common.warning",
  info: "common.info",
  neutral: "common.neutral",
};

export interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const t = useT();
  const key = status as SemanticStatus;
  const variant = STATUS_TO_VARIANT[key] ?? "outline";

  const fromKey = STATUS_TO_MESSAGE_KEY[key];
  const resolved =
    label ?? (fromKey ? t(fromKey) : status.replaceAll("_", " "));
  const useCapitalize = !label && !fromKey;

  return (
    <Badge
      variant={variant}
      className={cn(useCapitalize && "capitalize", className)}
      title={resolved}
    >
      {resolved}
    </Badge>
  );
}
