import { http } from "@/services/http";
import type { Review } from "@/types/review";

export const reviewsService = {
  async list(): Promise<Review[]> {
    const res = await http.get<{ data: Review[] }>("/reviews");
    return res.data?.data ?? [];
  },
};
