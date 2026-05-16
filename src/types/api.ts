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
  students_count: number;
  created_at: string;
  updated_at: string;
}
