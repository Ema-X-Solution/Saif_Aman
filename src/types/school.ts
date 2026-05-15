import type { EntityId } from "@/types/common";

export interface School {
  id: EntityId;
  name: string;
  city: string;
  studentCount: number;
  busCount: number;
  status: "active" | "inactive";
  updatedAt: string;
}
