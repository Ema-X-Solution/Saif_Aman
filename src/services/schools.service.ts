import { MOCK_SCHOOLS } from "@/mock/schools";
import { withMockLatency } from "@/services/mock-delay";
import type { School } from "@/types/school";

export const schoolsService = {
  list(): Promise<School[]> {
    return withMockLatency([...MOCK_SCHOOLS]);
  },
};
