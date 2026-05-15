import type { School } from "@/types/school";

export const MOCK_SCHOOLS: School[] = [
  {
    id: "sch-1",
    name: "Al Noor International School",
    city: "Riyadh",
    studentCount: 1280,
    busCount: 14,
    status: "active",
    updatedAt: "2026-05-01T08:00:00.000Z",
  },
  {
    id: "sch-2",
    name: "Future Leaders Academy",
    city: "Jeddah",
    studentCount: 840,
    busCount: 9,
    status: "active",
    updatedAt: "2026-04-28T11:20:00.000Z",
  },
  {
    id: "sch-3",
    name: "Green Valley School",
    city: "Dammam",
    studentCount: 640,
    busCount: 6,
    status: "inactive",
    updatedAt: "2026-03-15T09:45:00.000Z",
  },
];
