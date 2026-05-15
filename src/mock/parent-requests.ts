import type { ParentRequest } from "@/types/parent-request";

export const MOCK_PARENT_REQUESTS: ParentRequest[] = [
  {
    id: "pr-1",
    parentName: "Fahad Al Mutairi",
    studentName: "Layan Fahad",
    schoolId: "sch-1",
    schoolName: "Al Noor International School",
    routeNote: "Request PM pickup 15 min later on Thursdays.",
    status: "pending",
    submittedAt: "2026-05-08T06:12:00.000Z",
  },
  {
    id: "pr-2",
    parentName: "Reem Alsubaie",
    studentName: "Saad Reem",
    schoolId: "sch-2",
    schoolName: "Future Leaders Academy",
    routeNote: "Temporary change of drop-off to grandmother address.",
    status: "approved",
    submittedAt: "2026-05-06T09:48:00.000Z",
  },
];
