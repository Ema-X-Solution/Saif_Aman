import type { EntityId } from "@/types/common";

export interface AdminUser {
  id: EntityId;
  fullName: string;
  email: string;
  role: "owner" | "ops" | "support";
  lastLoginAt: string;
  status: "active" | "invited" | "disabled";
}
