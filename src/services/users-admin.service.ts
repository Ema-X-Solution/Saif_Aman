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
  latitude?: number | string | null;
  longitude?: number | string | null;
}

function serializeCoordinate(value: number | string | null | undefined): string | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  return String(value);
}

const DEFAULT_ADDRESS = "test";

function serializeAddress(value: string | null | undefined): string {
  if (value === null || value === undefined || String(value).trim() === "") {
    return DEFAULT_ADDRESS;
  }
  return value;
}

function serializeUserPayload(payload: UserWritePayload): Record<string, unknown> {
  const { latitude, longitude, address, ...rest } = payload;
  const body: Record<string, unknown> = { ...rest };

  body.address = serializeAddress(address);

  if (latitude !== undefined) {
    body.latitude = serializeCoordinate(latitude);
  }
  if (longitude !== undefined) {
    body.longitude = serializeCoordinate(longitude);
  }

  return body;
}

export const usersAdminService = {
  async list(options?: { page?: number; type?: string }): Promise<LaravelPaginator<ApiUserRow>> {
    const res = await http.get<LaravelPaginator<ApiUserRow>>("/users", {
      params: { page: options?.page ?? 1, type: options?.type },
    });
    return res.data;
  },

  async create(payload: UserWritePayload): Promise<unknown> {
    const res = await http.post("/users", serializeUserPayload(payload));
    return res.data;
  },

  async get(id: number | string): Promise<ApiUserRow> {
    const res = await http.get<{ data: ApiUserRow } | ApiUserRow>(`/users/${id}`);
    const data = res.data;
    return "data" in data ? data.data : data;
  },

  async update(id: number | string, payload: UserWritePayload): Promise<unknown> {
    const res = await http.put(`/users/${id}`, serializeUserPayload(payload));
    return res.data;
  },

  /** Backend exposes deletes under `/users/{id}`. */
  async removeVendor(id: string): Promise<unknown> {
    const res = await http.delete(`/users/${encodeURIComponent(id)}`);
    return res.data;
  },
};
