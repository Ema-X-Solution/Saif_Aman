import type { AdminUser } from "@/types/admin";

export const MOCK_ADMINS: AdminUser[] = [
  {
    id: "adm-1",
    fullName: "Ayman Al Saif",
    email: "ayman@saif-aman.example",
    role: "owner",
    lastLoginAt: "2026-05-08T07:55:00.000Z",
    status: "active",
  },
  {
    id: "adm-2",
    fullName: "Lina Halawani",
    email: "lina.ops@saif-aman.example",
    role: "ops",
    lastLoginAt: "2026-05-07T21:12:00.000Z",
    status: "active",
  },
];
