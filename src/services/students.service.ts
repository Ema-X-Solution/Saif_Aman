import { http } from "@/services/http";
import type { ApiStudentRow, LaravelPaginator } from "@/types/api";
import type { Student } from "@/types/student";

export interface StudentWritePayload {
  name: string;
  grade: string;
  age?: number | null;
  notes?: string | null;
  parent_id: number;
  school_id: number;
  school_bus_id: number | null;
}

function mapStudent(row: ApiStudentRow): Student {
  return {
    id: String(row.id),
    name: row.name,
    grade: row.grade?.name ?? "—",
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

  async list(options?: {
    page?: number;
    per_page?: number;
    search?: string;
    school_id?: number;
  }): Promise<{ data: Student[]; meta?: LaravelPaginator<ApiStudentRow>["meta"] }> {
    const res = await http.get<LaravelPaginator<ApiStudentRow>>("/students", {
      params: {
        page: options?.page ?? 1,
        per_page: options?.per_page,
        search: options?.search || undefined,
        school_id: options?.school_id,
      },
    });
    return {
      data: (res.data?.data ?? []).map(mapStudent),
      meta: res.data?.meta,
    };
  },

  async listAll(options?: {
    search?: string;
    school_id?: number;
  }): Promise<Student[]> {
    const pageSize = 100;
    const first = await studentsService.list({
      page: 1,
      per_page: pageSize,
      search: options?.search,
      school_id: options?.school_id,
    });
    const lastPage = first.meta?.last_page ?? 1;
    const rows = [...first.data];
    for (let page = 2; page <= lastPage; page += 1) {
      const next = await studentsService.list({
        page,
        per_page: pageSize,
        search: options?.search,
        school_id: options?.school_id,
      });
      rows.push(...next.data);
    }
    return rows;
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
