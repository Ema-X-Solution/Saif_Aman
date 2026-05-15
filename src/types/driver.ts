import type { EntityId } from "@/types/common";

export interface Driver {
  id: EntityId;
  fullName: string;
  licenseNumber: string;
  schoolId: EntityId;
  schoolName: string;
  phone: string;
  status: "active" | "on_leave" | "suspended";
  updatedAt: string;
}
