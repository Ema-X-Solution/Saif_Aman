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
  backup_driver_id?: number | null;
  backup_supervisor_id?: number | null;
}

function mapSchoolBus(row: ApiSchoolBusRow): Bus {
  return {
    id: String(row.id),
    plateNumber: row.plate_number,
    code: row.code,
    label: row.label,
    model: row.model,
    color: row.color,
    schoolId: row.school ? String(row.school.id) : "",
    schoolName: row.school?.name ?? "—",
    mainDriverId: row.driver ? String(row.driver.id) : "",
    mainDriverName: row.driver?.name ?? "—",
    backupDriverId: row.backup_driver ? String(row.backup_driver.id) : "",
    backupDriverName: row.backup_driver?.name ?? "—",
    mainSupervisorId: row.supervisor ? String(row.supervisor.id) : "",
    mainSupervisorName: row.supervisor?.name ?? "—",
    backupSupervisorId: row.backup_supervisor ? String(row.backup_supervisor.id) : "",
    backupSupervisorName: row.backup_supervisor?.name ?? "—",
    areaIds: [],
    areaLabels: [],
    gpsDeviceId: row.code || "",
    status: "active",
    updatedAt: row.updated_at,
    studentsCount: row.students_count ?? 0,
  };
}

export const busesService = {
  async list(): Promise<Bus[]> {
    const res = await http.get<LaravelPaginator<ApiSchoolBusRow>>("/school-buses");
    return (res.data?.data ?? []).map(mapSchoolBus);
  },

  async get(id: number | string): Promise<ApiSchoolBusRow> {
    const res = await http.get<{ data: ApiSchoolBusRow } | ApiSchoolBusRow>(`/school-buses/${id}`);
    const data = res.data;
    return "data" in data ? data.data : data;
  },

  async create(payload: SchoolBusWritePayload): Promise<unknown> {
    const res = await http.post("/school-buses", payload);
    return res.data;
  },

  async update(id: number | string, payload: SchoolBusWritePayload): Promise<unknown> {
    const res = await http.put(`/school-buses/${id}`, payload);
    return res.data;
  },

  async updateBackupCrew(
    id: number | string,
    payload: { backup_driver_id: number | null; backup_supervisor_id: number | null }
  ): Promise<unknown> {
    const bus = await this.get(id);
    if (!bus.school?.id || !bus.driver?.id || !bus.supervisor?.id) {
      throw new Error("Bus is missing required assignments");
    }
    return this.update(id, {
      label: bus.label,
      code: bus.code,
      plate_number: bus.plate_number,
      model: bus.model,
      color: bus.color,
      school_id: bus.school.id,
      driver_id: bus.driver.id,
      supervisor_id: bus.supervisor.id,
      backup_driver_id: payload.backup_driver_id,
      backup_supervisor_id: payload.backup_supervisor_id,
    });
  },

  async remove(id: number | string): Promise<unknown> {
    const res = await http.delete(`/school-buses/${id}`);
    return res.data;
  },
};
