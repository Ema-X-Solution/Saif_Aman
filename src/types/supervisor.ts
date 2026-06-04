import type { EntityId } from "@/types/common";

export interface Supervisor {
  id: EntityId;
  fullName: string;
  schoolId: EntityId;
  schoolName: string;
  phone: string;
  email: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  homeImage: string | null;
  shift: "morning" | "afternoon" | "full";
  status: "approved" | "pending" | "rejected";
  updatedAt: string;
}
