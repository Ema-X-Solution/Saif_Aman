import { usersAdminService } from "@/services/users-admin.service";
import type { ApiUserRow } from "@/types/api";
import type { Driver } from "@/types/driver";

function normalizeUserStatus(status: string): Driver["status"] {
  if (status === "approved" || status === "pending" || status === "rejected") {
    return status;
  }
  return "pending";
}

function mapDriver(row: ApiUserRow): Driver {
  return {
    id: String(row.id),
    fullName: row.name,
    licenseNumber: "—",
    schoolId: row.school ? String(row.school.id) : "",
    schoolName: row.school?.name ?? "—",
    phone: row.phone ?? "—",
    status: normalizeUserStatus(row.status),
    updatedAt: row.updated_at,
  };
}

export const driversService = {
  async list(opts?: { page?: number; per_page?: number; q?: string }): Promise<Driver[]> {
    const res = await usersAdminService.list({ type: "driver", ...opts });
    const rows = res.data ?? [];
    return rows.map(mapDriver);
  },
};
