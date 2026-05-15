import { MOCK_AREAS } from "@/mock/areas";
import { withMockLatency } from "@/services/mock-delay";
import type { Area } from "@/types/area";

export const areasService = {
  list(): Promise<Area[]> {
    return withMockLatency([...MOCK_AREAS]);
  },
};
