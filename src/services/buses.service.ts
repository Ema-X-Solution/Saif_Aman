import { http } from "@/services/http";
import type { ApiSchoolBusRow, LaravelPaginator } from "@/types/api";
import type { Bus } from "@/types/bus";

export interface SchoolBusWritePayload {
  label: string;
  code: string;
  plate_number: string;
  model: string;
  color: string;
  school_id: number;
  driver_id: number;
  supervisor_id: number;
}

function mapSchoolBus(row: ApiSchoolBusRow): Bus {
  return {
    id: String(row.id),
    plateNumber: row.plate_number,
    schoolId: row.school ? String(row.school.id) : "",
    schoolName: row.school?.name ?? "—",
    mainDriverId: row.driver ? String(row.driver.id) : "",
    mainDriverName: row.driver?.name ?? "—",
    backupDriverId: "",
    backupDriverName: "—",
    mainSupervisorId: row.supervisor ? String(row.supervisor.id) : "",
    mainSupervisorName: row.supervisor?.name ?? "—",
    backupSupervisorId: "",
    backupSupervisorName: "—",
    areaIds: [],
    areaLabels: [],
    gpsDeviceId: row.code || "",
    status: "active",
    updatedAt: row.updated_at,
  };
}

export const busesService = {
  async list(): Promise<Bus[]> {
    const res = await http.get<LaravelPaginator<ApiSchoolBusRow>>("/school-buses");
    return (res.data?.data ?? []).map(mapSchoolBus);
  },

  async create(payload: SchoolBusWritePayload): Promise<unknown> {
    const res = await http.post("/school-buses", payload);
    return res.data;
  },

  async update(id: number | string, payload: SchoolBusWritePayload): Promise<unknown> {
    const res = await http.put(`/school-buses/${id}`, payload);
    return res.data;
  },

  async remove(id: number | string): Promise<unknown> {
    const res = await http.delete(`/school-buses/${id}`);
    return res.data;
  },
};
