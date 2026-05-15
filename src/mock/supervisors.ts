import type { Supervisor } from "@/types/supervisor";

export const MOCK_SUPERVISORS: Supervisor[] = [
  {
    id: "sup-1",
    fullName: "Nora Al Qahtani",
    schoolId: "sch-1",
    schoolName: "Al Noor International School",
    phone: "+966 50 221 8833",
    shift: "morning",
    status: "active",
    updatedAt: "2026-05-04T05:45:00.000Z",
  },
  {
    id: "sup-2",
    fullName: "Omar Haddad",
    schoolId: "sch-2",
    schoolName: "Future Leaders Academy",
    phone: "+966 56 300 7788",
    shift: "afternoon",
    status: "active",
    updatedAt: "2026-05-03T17:12:00.000Z",
  },
];
