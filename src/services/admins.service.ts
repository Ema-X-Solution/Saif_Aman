import { http } from "@/services/http";
import type { AdminUser } from "@/types/admin";

export const adminsService = {
  async list(): Promise<AdminUser[]> {
    const res = await http.get<{ data: AdminUser[] }>("/admins");
    return res.data?.data ?? [];
  },
};
