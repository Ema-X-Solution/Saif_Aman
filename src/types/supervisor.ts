import type { EntityId } from "@/types/common";

export interface Supervisor {
  id: EntityId;
  fullName: string;
  schoolId: EntityId;
  schoolName: string;
  phone: string;
  shift: "morning" | "afternoon" | "full";
  status: "active" | "inactive";
  updatedAt: string;
}
