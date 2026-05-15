import type { EntityId } from "@/types/common";

export interface Bus {
  id: EntityId;
  plateNumber: string;
  schoolId: EntityId;
  schoolName: string;
  mainDriverId: EntityId;
  mainDriverName: string;
  backupDriverId: EntityId;
  backupDriverName: string;
  mainSupervisorId: EntityId;
  mainSupervisorName: string;
  backupSupervisorId: EntityId;
  backupSupervisorName: string;
  areaIds: EntityId[];
  areaLabels: string[];
  gpsDeviceId: string;
  status: "active" | "maintenance" | "offline";
  updatedAt: string;
}
