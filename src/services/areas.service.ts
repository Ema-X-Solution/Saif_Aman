import { http } from "@/services/http";
import type { Area } from "@/types/area";

export const areasService = {
  async list(): Promise<Area[]> {
    const res = await http.get<{ data: Area[] }>("/areas");
    return res.data?.data ?? [];
  },
};
