import type { EntityId } from "@/types/common";

export interface Review {
  id: EntityId;
  schoolId: EntityId;
  schoolName: string;
  parentName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
