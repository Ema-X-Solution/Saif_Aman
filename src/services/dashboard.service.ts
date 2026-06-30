import { http } from "@/services/http";
import type { ApiDashboardResponse, ApiSchoolRow, ApiSchoolBusRow, LaravelPaginator } from "@/types/api";
import type { ApiTrip } from "@/types/trip";
import type {
  DashboardStat,
  LiveBusPoint,
  SchoolStudentStat,
  TodayTripsSummary,
} from "@/types/dashboard";
import type { School } from "@/types/school";
import type { Bus } from "@/types/bus";

// Map school from API row - adjust coordinates to be in Oman for better visualization
function mapSchool(row: ApiSchoolRow): School {
  // Generate coordinates within Oman if not provided
  let lat = row.latitude ? Number(row.latitude) : null;
  let lng = row.longitude ? Number(row.longitude) : null;
  
  // If coordinates are outside Oman or not provided, place them in Oman
  const omanBounds = {
    minLat: 16.5,
    maxLat: 26.5,
    minLng: 51.5,
    maxLng: 59.8
  };
  
  if (!lat || !lng || lat < omanBounds.minLat || lat > omanBounds.maxLat || lng < omanBounds.minLng || lng > omanBounds.maxLng) {
    // Assign random coordinates within Oman based on school ID for consistency
    const id = Number(row.id);
    const cities = [
      { name: "Muscat", lat: 23.5880, lng: 58.3920 },
      { name: "Salalah", lat: 17.0192, lng: 54.0924 },
      { name: "Sohar", lat: 24.3447, lng: 56.7114 },
      { name: "Nizwa", lat: 22.9333, lng: 57.5333 },
      { name: "Sur", lat: 22.5667, lng: 59.5278 }
    ];
    const cityIndex = id % cities.length;
    lat = cities[cityIndex].lat + (Math.random() - 0.5) * 0.1;
    lng = cities[cityIndex].lng + (Math.random() - 0.5) * 0.1;
  }
  
  return {
    id: String(row.id),
    name: row.name,
    city: row.address?.trim() || "—",
    phone: row.phone,
    email: row.email,
    website: row.website,
    notes: row.notes,
    address: row.address,
    latitude: lat,
    longitude: lng,
    studentCount: row.students_count,
    busCount: row.school_buses_count,
    status: "active",
    updatedAt: row.updated_at,
    grades: row.grades?.map(g => ({
      id: g.id ? String(g.id) : undefined,
      name: g.name,
    })) || [],
  };
}

// Map bus from API row
function mapBus(row: ApiSchoolBusRow): Bus {
  return {
    id: String(row.id),
    plateNumber: row.plate_number,
    code: row.code,
    label: row.label,
    model: row.model,
    color: row.color,
    schoolId: row.school ? String(row.school.id) : "",
    schoolName: row.school?.name || "—",
    mainDriverId: row.driver ? String(row.driver.id) : "",
    mainDriverName: row.driver?.name || "—",
    backupDriverId: row.backup_driver ? String(row.backup_driver.id) : "",
    backupDriverName: row.backup_driver?.name || "—",
    mainSupervisorId: row.supervisor ? String(row.supervisor.id) : "",
    mainSupervisorName: row.supervisor?.name || "—",
    backupSupervisorId: row.backup_supervisor ? String(row.backup_supervisor.id) : "",
    backupSupervisorName: row.backup_supervisor?.name || "—",
    areaIds: [],
    areaLabels: [],
    gpsDeviceId: row.code || "",
    status: "active",
    updatedAt: row.updated_at,
    studentsCount: row.students_count || 0,
  };
}

export interface DashboardData {
  stats: DashboardStat[];
  schoolStats: SchoolStudentStat[];
  todayTrips: TodayTripsSummary;
  liveBuses: LiveBusPoint[];
  schools: School[];
  buses: Bus[];
  trips: ApiTrip[];
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const [dashboardRes, schoolsRes, busesRes, tripsRes] = await Promise.all([
      http.get<{ data: ApiDashboardResponse }>("/dashboard"),
      http.get<LaravelPaginator<ApiSchoolRow>>("/schools"),
      http.get<LaravelPaginator<ApiSchoolBusRow>>("/school-buses"),
      http.get<LaravelPaginator<ApiTrip>>("/trips"),
    ]);

    const data = dashboardRes.data.data;

    // Build the stats array based on data.statistics
    const stats: DashboardStat[] = [
      {
        id: "students",
        label: "students",
        value: String(data.statistics.students),
        icon: "students",
      },
      {
        id: "parents",
        label: "requests", // corresponds to dashboard.stats.requests
        value: String(data.statistics.users.parents.total),
        icon: "requests",
      },
      {
        id: "schools",
        label: "schools",
        value: String(data.statistics.schools),
        icon: "schools",
      },
      {
        id: "buses",
        label: "buses",
        value: String(data.statistics.buses),
        icon: "buses",
      },
      {
        id: "drivers",
        label: "drivers",
        value: String(data.statistics.users.drivers.total),
        icon: "drivers",
      },
      {
        id: "supervisors",
        label: "supervisors",
        value: String(data.statistics.users.supervisors.total),
        icon: "supervisors",
      },
    ];

    // Build school stats array
    const schoolStats: SchoolStudentStat[] = data.statistics.top_schools.map((school) => ({
      school: school.name,
      students: school.students_count,
      color: "hsl(var(--chart-1))", // You can use a dynamic color map if desired
    }));

    // Today's trips
    const todayTrips: TodayTripsSummary = {
      started: data.today.trips.started,
      active: data.today.trips.active,
      ended: data.today.trips.ended,
      going: data.today.trips.going,
      back: data.today.trips.back,
    };

    const liveBuses: LiveBusPoint[] = (data.active_trips as Record<string, unknown>[]).map((trip) => ({
      id: String(trip.id || Math.random()),
      plate: String(trip.plate || "N/A"),
      schoolName: String(trip.schoolName || "N/A"),
      speedKmh: Number(trip.speed || 0),
      route: String(trip.route || "N/A"),
      busNumber: String(trip.busNumber || "N/A"),
      color: "#000",
      mapX: Number(trip.mapX || 0),
      mapY: Number(trip.mapY || 0),
    }));

    // Map schools and buses
    const schools = (schoolsRes.data?.data ?? []).map(mapSchool);
    const buses = (busesRes.data?.data ?? []).map(mapBus);
    const trips = (tripsRes.data?.data ?? []);

    return {
      stats,
      schoolStats,
      todayTrips,
      liveBuses,
      schools,
      buses,
      trips,
    };
  },
};
