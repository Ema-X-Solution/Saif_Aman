import { http } from "@/services/http";
import type { ApiUserRow, LaravelPaginator } from "@/types/api";

export interface UserWritePayload {
  school_id?: number | null;
  name: string;
  type: "admin" | "driver" | "supervisor" | "parent";
  email?: string | null;
  phone: string;
  password?: string;
  status: "pending" | "approved" | "rejected";
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export const usersAdminService = {
  async list(options?: { page?: number; type?: string }): Promise<LaravelPaginator<ApiUserRow>> {
    const res = await http.get<LaravelPaginator<ApiUserRow>>("/users", {
      params: { page: options?.page ?? 1, type: options?.type },
    });
    return res.data;
  },

  async create(payload: UserWritePayload): Promise<unknown> {
    const res = await http.post("/users", payload);
    return res.data;
  },

  async get(id: number | string): Promise<ApiUserRow> {
    const res = await http.get<ApiUserRow>(`/users/${id}`);
    return res.data;
  },

  async update(id: number | string, payload: UserWritePayload): Promise<unknown> {
    const res = await http.put(`/users/${id}`, payload);
    return res.data;
  },

  /** Backend exposes deletes under `/vendor/users/{id}`. */
  async removeVendor(id: string): Promise<unknown> {
    const res = await http.delete(`/vendor/users/${encodeURIComponent(id)}`);
    return res.data;
  },
};
