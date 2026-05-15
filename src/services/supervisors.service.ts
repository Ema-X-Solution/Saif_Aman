import { MOCK_SUPERVISORS } from "@/mock/supervisors";
import { withMockLatency } from "@/services/mock-delay";
import type { Supervisor } from "@/types/supervisor";

export const supervisorsService = {
  list(): Promise<Supervisor[]> {
    return withMockLatency([...MOCK_SUPERVISORS]);
  },
};
