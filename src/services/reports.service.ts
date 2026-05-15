import { MOCK_REPORTS } from "@/mock/reports";
import { withMockLatency } from "@/services/mock-delay";
import type { ReportDefinition } from "@/types/report";

export const reportsService = {
  list(): Promise<ReportDefinition[]> {
    return withMockLatency([...MOCK_REPORTS]);
  },
};
