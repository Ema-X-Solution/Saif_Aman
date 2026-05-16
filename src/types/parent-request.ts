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

  // Extra fields from `/users?type=parent` payload (optional for backward compatibility)
  email?: string | null;
  phone?: string | null;
  type?: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  studentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
