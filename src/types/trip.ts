export interface TripStudent {
  trip_student_id: number;
  trip_id: number;
  student_id: number;
  parent_status: string;
  attendance_status: string;
  absence_reason: string | null;
  picked_up_at: string | null;
  student: {
    id: number;
    name: string;
    grade: string;
    age: number | null;
    image: string;
    latitude: number;
    longitude: number;
    parent: {
      id: number;
      name: string;
      phone: string;
    };
  };
}

export interface TripBus {
  id: number;
  label: string;
  code: string;
  plate_number: string;
}

export interface TripSchool {
  id: number;
  name: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
}

export interface TripDriver {
  id: number;
  name: string;
  phone: string;
}

export interface TripSupervisor {
  id: number;
  name: string;
  phone: string;
}

export interface ApiTrip {
  id: number;
  type: "going" | "back";
  started_at: string;
  ended_at: string | null;
  bus: TripBus;
  school: TripSchool;
  driver: TripDriver;
  supervisor: TripSupervisor;
  students: TripStudent[];
}

export interface Trip {
  id: string;
  type: "going" | "back";
  startedAt: string;
  endedAt: string | null;
  bus: TripBus;
  school: TripSchool;
  driver: TripDriver;
  supervisor: TripSupervisor;
  students: TripStudent[];
}
