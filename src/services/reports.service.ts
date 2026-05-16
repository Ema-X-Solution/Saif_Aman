import { http } from "@/services/http";
import type { ReportDefinition } from "@/types/report";

export const reportsService = {
  async list(): Promise<ReportDefinition[]> {
    const res = await http.get<{ data: ReportDefinition[] }>("/reports");
    return res.data?.data ?? [];
  },
};
