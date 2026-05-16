import { usersAdminService } from "@/services/users-admin.service";
import type { ApiUserRow } from "@/types/api";
import type { Supervisor } from "@/types/supervisor";

function normalizeUserStatus(status: string): Supervisor["status"] {
  if (status === "approved" || status === "pending" || status === "rejected") {
    return status;
  }
  return "pending";
}

function mapSupervisor(row: ApiUserRow): Supervisor {
  return {
    id: String(row.id),
    fullName: row.name,
    schoolId: row.school ? String(row.school.id) : "",
    schoolName: row.school?.name ?? "—",
    phone: row.phone ?? "—",
    shift: "full",
    status: normalizeUserStatus(row.status),
    updatedAt: row.updated_at,
  };
}

export const supervisorsService = {
  async list(): Promise<Supervisor[]> {
    const res = await usersAdminService.list({ type: "supervisor" });
    const rows = res.data ?? [];
    return rows.map(mapSupervisor);
  },
};
