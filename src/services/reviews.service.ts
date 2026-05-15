import { MOCK_REVIEWS } from "@/mock/reviews";
import { withMockLatency } from "@/services/mock-delay";
import type { Review } from "@/types/review";

export const reviewsService = {
  list(): Promise<Review[]> {
    return withMockLatency([...MOCK_REVIEWS]);
  },
};
