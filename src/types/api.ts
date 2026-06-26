export interface LaravelPaginator<T> {
  data: T[];
  links?: Record<string, unknown>;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiUserSchoolRef {
  id: number;
  name: string;
}

export interface ApiUserRow {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  type: string;
  status: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  home_image: string | null;
  created_at: string;
  updated_at: string;
  school: ApiUserSchoolRef | null;
  students_count: number;
  driver_school_bus?: { id: number; label: string } | null;
  supervisor_school_bus?: { id: number; label: string } | null;
  students?: { id: number; name: string }[] | null;
}

export interface ApiGradeRow {
  id?: number;
  name: string;
}

export interface ApiSchoolRow {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  notes: string | null;
  address: string | null;
  latitude: string | null;
  longitude: string | null;
  students_count: number;
  school_buses_count: number;
  created_at: string;
  updated_at: string;
  grades?: ApiGradeRow[];
}

export interface ApiSchoolBusSchoolRef {
  id: number;
  name: string;
}

export interface ApiSchoolBusPersonRef {
  id: number;
  name: string;
}

export interface ApiSchoolBusRow {
  id: number;
  label: string;
  code: string;
  plate_number: string;
  model: string;
  color: string;
  school: ApiSchoolBusSchoolRef | null;
  driver: ApiSchoolBusPersonRef | null;
  supervisor: ApiSchoolBusPersonRef | null;
  backup_driver?: ApiSchoolBusPersonRef | null;
  backup_supervisor?: ApiSchoolBusPersonRef | null;
  students?: ApiStudentRef[];
  students_count: number;
  created_at: string;
  updated_at: string;
}

export interface ApiStudentRef {
  id: number;
  name: string;
}

export interface ApiStudentBusRef {
  id: number;
  label: string;
}

export interface ApiStudentRow {
  id: number;
  name: string;
  grade: string;
  age: number | null;
  notes: string | null;
  image: string | null;
  parent: ApiStudentRef | null;
  school: ApiStudentRef | null;
  school_bus: ApiStudentBusRef | null;
  created_at: string;
  updated_at: string;
}

export interface ApiDashboardResponse {
  statistics: {
    users: {
      parents: { total: number; approved: number; pending: number; rejected: number };
      drivers: { total: number };
      supervisors: { total: number };
      admins: number;
    };
    students: number;
    schools: number;
    buses: number;
    top_schools: { id: number; name: string; students_count: number }[];
    top_buses: { id: number; label: string; code: string; students_count: number }[];
    assignments: {
      students_with_bus: string | number;
      students_without_bus: string | number;
      students_with_school: string | number;
      students_without_school: string | number;
    };
    bus_staffing: {
      with_driver: string | number;
      without_driver: string | number;
      with_supervisor: string | number;
      without_supervisor: string | number;
      with_backup_driver: string | number;
      with_backup_supervisor: string | number;
    };
    backup_assignments: unknown[];
  };
  today: {
    trips: {
      started: number;
      active: number;
      ended: number;
      going: number;
      back: number;
    };
    attendance: {
      attend: number | null;
      absent: number | null;
      skipped: number | null;
      pending: number | null;
    };
    parent_confirmations: {
      confirmed: number | null;
      declined: number | null;
      pending: number | null;
    };
  };
  active_trips: unknown[];
  recent_trips: unknown[];
}
