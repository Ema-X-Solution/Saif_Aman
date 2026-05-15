import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
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

export interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const key = status as SemanticStatus;
  const variant = STATUS_TO_VARIANT[key] ?? "outline";
  return (
    <Badge
      variant={variant}
      className={cn("capitalize", className)}
      title={label ?? status}
    >
      {label ?? status.replaceAll("_", " ")}
    </Badge>
  );
}
