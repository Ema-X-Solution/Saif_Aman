import { http } from "@/services/http";
import type { ApiSchoolRow, LaravelPaginator } from "@/types/api";
import type { School } from "@/types/school";

export interface SchoolWritePayload {
  name: string;
  phone: string;
  email: string;
  website: string;
  notes?: string | null;
  address: string;
  latitude: number;
  longitude: number;
}

function mapSchool(row: ApiSchoolRow): School {
  const city = row.address?.trim() || "—";
  return {
    id: String(row.id),
    name: row.name,
    city,
    phone: row.phone,
    email: row.email,
    website: row.website,
    notes: row.notes,
    address: row.address,
    latitude: row.latitude ? Number(row.latitude) : null,
    longitude: row.longitude ? Number(row.longitude) : null,
    studentCount: row.students_count,
    busCount: row.school_buses_count,
    status: "active",
    updatedAt: row.updated_at,
  };
}

export const schoolsService = {
  async list(): Promise<School[]> {
    const res = await http.get<LaravelPaginator<ApiSchoolRow>>("/schools");
    return (res.data?.data ?? []).map(mapSchool);
  },

  async create(payload: SchoolWritePayload): Promise<unknown> {
    const res = await http.post("/schools", payload);
    return res.data;
  },

  async update(id: number | string, payload: SchoolWritePayload): Promise<unknown> {
    const res = await http.put(`/schools/${id}`, payload);
    return res.data;
  },

  async remove(id: number | string): Promise<unknown> {
    const res = await http.delete(`/schools/${id}`);
    return res.data;
  },
};
