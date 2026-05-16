import { usersAdminService } from "@/services/users-admin.service";
import type { ParentRequest } from "@/types/parent-request";
import type { ApiUserRow } from "@/types/api";

function mapUserToParentRequest(u: ApiUserRow): ParentRequest {
  return {
    id: String(u.id),
    parentName: u.name,
    studentName: u.students_count ? String(u.students_count) : "—",
    schoolId: u.school ? String(u.school.id) : "",
    schoolName: u.school?.name ?? "—",
    routeNote: u.address ?? "",
    status: (u.status === "approved" || u.status === "rejected") ? u.status : "pending",
    submittedAt: u.created_at,

    email: u.email,
    phone: u.phone,
    type: u.type,
    address: u.address,
    latitude: u.latitude,
    longitude: u.longitude,
    studentsCount: u.students_count,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
  };
}

export const parentRequestsService = {
  async list(): Promise<ParentRequest[]> {
    const res = await usersAdminService.list({ type: "parent" });
    const rows = res.data ?? [];
    return rows.map(mapUserToParentRequest);
  },

  async updateStatus(id: string, status: "approved" | "rejected" | "pending") {
    // Update the underlying user status for parent.
    // Fetch the full user by id then send an update.
    const user = await usersAdminService.get(id);
    if (!user) throw new Error("User not found");

    return usersAdminService.update(user.id, {
      name: user.name,
      type: "parent",
      phone: user.phone ?? "",
      status,
      email: user.email ?? null,
      school_id: user.school ? user.school.id : null,
      address: user.address ?? null,
      latitude: user.latitude ?? null,
      longitude: user.longitude ?? null,
    });
  },
};
