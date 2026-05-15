import { MOCK_PARENT_REQUESTS } from "@/mock/parent-requests";
import { withMockLatency } from "@/services/mock-delay";
import type { ParentRequest } from "@/types/parent-request";

export const parentRequestsService = {
  list(): Promise<ParentRequest[]> {
    return withMockLatency([...MOCK_PARENT_REQUESTS]);
  },
};
