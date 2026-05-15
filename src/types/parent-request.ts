import type { EntityId } from "@/types/common";

export interface ParentRequest {
  id: EntityId;
  parentName: string;
  studentName: string;
  schoolId: EntityId;
  schoolName: string;
  routeNote: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}
