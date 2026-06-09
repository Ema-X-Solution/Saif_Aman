import { http } from "@/services/http";
import type { ApiStudentRow, LaravelPaginator } from "@/types/api";
import type { Student } from "@/types/student";

export interface StudentWritePayload {
  name: string;
  grade: string;
  notes?: string | null;
  parent_id: number;
  school_id: number;
  school_bus_id: number;
}

function mapStudent(row: ApiStudentRow): Student {
  return {
    id: String(row.id),
    name: row.name,
    grade: row.grade,
    age: row.age,
    notes: row.notes,
    image: row.image?.trim() || null,
    parentId: row.parent ? String(row.parent.id) : "",
    parentName: row.parent?.name ?? "—",
    schoolId: row.school ? String(row.school.id) : "",
    schoolName: row.school?.name ?? "—",
    schoolBusId: row.school_bus ? String(row.school_bus.id) : "",
    schoolBusLabel: row.school_bus?.label ?? "—",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const studentsService = {
  async get(id: number | string): Promise<Student> {
    const res = await http.get<{ data: ApiStudentRow }>(`/students/${id}`);
    return mapStudent(res.data.data);
  },

  async list(): Promise<Student[]> {
    const res = await http.get<LaravelPaginator<ApiStudentRow>>("/students");
    return (res.data?.data ?? []).map(mapStudent);
  },

  async create(payload: StudentWritePayload): Promise<unknown> {
    const res = await http.post("/students", payload);
    return res.data;
  },

  async update(id: number | string, payload: StudentWritePayload): Promise<unknown> {
    const res = await http.put(`/students/${id}`, payload);
    return res.data;
  },

  async remove(id: number | string): Promise<unknown> {
    const res = await http.delete(`/students/${id}`);
    return res.data;
  },
};
