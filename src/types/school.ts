import type { EntityId } from "@/types/common";

export interface Grade {
  id?: EntityId;
  name: string;
}

export interface School {
  id: EntityId;
  name: string;
  city: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  notes: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  studentCount: number;
  busCount: number;
  status: "active" | "inactive";
  updatedAt: string;
  grades: Grade[];
}
