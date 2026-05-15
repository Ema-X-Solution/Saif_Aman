import type { Review } from "@/types/review";

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rv-1",
    schoolId: "sch-1",
    schoolName: "Al Noor International School",
    parentName: "Noura S.",
    rating: 5,
    comment: "Live map and notifications make morning drop-offs stress-free.",
    createdAt: "2026-05-05T08:00:00.000Z",
  },
  {
    id: "rv-2",
    schoolId: "sch-2",
    schoolName: "Future Leaders Academy",
    parentName: "Mohammed A.",
    rating: 4,
    comment: "Bus arrived within the promised window—great transparency.",
    createdAt: "2026-05-03T18:22:00.000Z",
  },
];
