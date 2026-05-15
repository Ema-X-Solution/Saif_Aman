import type { EntityId } from "@/types/common";

export interface Area {
  id: EntityId;
  name: string;
  schoolId: EntityId;
  schoolName: string;
  district: string;
  stops: number;
  createdByAdminId: EntityId;
  updatedAt: string;
}
