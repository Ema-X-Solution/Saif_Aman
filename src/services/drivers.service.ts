import { MOCK_DRIVERS } from "@/mock/drivers";
import { withMockLatency } from "@/services/mock-delay";
import type { Driver } from "@/types/driver";

export const driversService = {
  list(): Promise<Driver[]> {
    return withMockLatency([...MOCK_DRIVERS]);
  },
};
