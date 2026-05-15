import type { Driver } from "@/types/driver";

export const MOCK_DRIVERS: Driver[] = [
  {
    id: "drv-1",
    fullName: "Khalid Al Harthi",
    licenseNumber: "SA-778812",
    schoolId: "sch-1",
    schoolName: "Al Noor International School",
    phone: "+966 50 000 1122",
    status: "active",
    updatedAt: "2026-05-06T06:10:00.000Z",
  },
  {
    id: "drv-2",
    fullName: "Youssef Khan",
    licenseNumber: "SA-901122",
    schoolId: "sch-1",
    schoolName: "Al Noor International School",
    phone: "+966 55 120 4411",
    status: "active",
    updatedAt: "2026-05-05T14:22:00.000Z",
  },
  {
    id: "drv-3",
    fullName: "Salma Al Otaibi",
    licenseNumber: "SA-445001",
    schoolId: "sch-2",
    schoolName: "Future Leaders Academy",
    phone: "+966 54 980 2200",
    status: "on_leave",
    updatedAt: "2026-04-30T09:00:00.000Z",
  },
];
