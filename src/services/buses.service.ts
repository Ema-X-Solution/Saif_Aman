import { MOCK_BUSES } from "@/mock/buses";
import { withMockLatency } from "@/services/mock-delay";
import type { Bus } from "@/types/bus";

export const busesService = {
  list(): Promise<Bus[]> {
    return withMockLatency([...MOCK_BUSES]);
  },
};
