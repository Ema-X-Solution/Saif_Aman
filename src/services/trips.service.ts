import { http } from "@/services/http";
import type { LaravelPaginator } from "@/types/api";
import type { ApiTrip, Trip } from "@/types/trip";

function mapTrip(row: ApiTrip): Trip {
  return {
    id: String(row.id),
    type: row.type,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    bus: row.bus,
    school: row.school,
    driver: row.driver,
    supervisor: row.supervisor,
    students: row.students,
  };
}

export const tripsService = {
  async list(): Promise<Trip[]> {
    const res = await http.get<LaravelPaginator<ApiTrip>>("/trips");
    return (res.data?.data ?? []).map(mapTrip);
  },
};
