import type {
  ActivityPoint,
  DashboardStat,
  LiveBusPoint,
  SchoolStudentStat,
  SubscriptionStatus,
  TodayTripsSummary,
} from "@/types/dashboard";

export const DEMO_STATS: DashboardStat[] = [
  {
    id: "students",
    label: "students",
    value: "2,458",
    change: "+12%",
    trend: "up",
    icon: "students",
    sparkline: [40, 55, 48, 62, 58, 70, 65],
  },
  {
    id: "requests",
    label: "requests",
    value: "23",
    change: "+5",
    trend: "up",
    icon: "requests",
    sparkline: [10, 14, 12, 18, 16, 20, 23],
  },
  {
    id: "schools",
    label: "schools",
    value: "15",
    change: "+2",
    trend: "up",
    icon: "schools",
    sparkline: [11, 12, 12, 13, 14, 14, 15],
  },
  {
    id: "buses",
    label: "buses",
    value: "68",
    change: "+4",
    trend: "up",
    icon: "buses",
    sparkline: [58, 60, 62, 64, 63, 66, 68],
  },
  {
    id: "drivers",
    label: "drivers",
    value: "42",
    change: "+1",
    trend: "up",
    icon: "drivers",
    sparkline: [38, 39, 40, 40, 41, 41, 42],
  },
  {
    id: "supervisors",
    label: "supervisors",
    value: "28",
    change: "0",
    trend: "flat",
    icon: "supervisors",
    sparkline: [26, 27, 27, 28, 28, 28, 28],
  },
];

export const DEMO_ACTIVITY: ActivityPoint[] = [
  { label: "Sat", trips: 42, alerts: 6 },
  { label: "Sun", trips: 128, alerts: 9 },
  { label: "Mon", trips: 118, alerts: 7 },
  { label: "Tue", trips: 124, alerts: 11 },
  { label: "Wed", trips: 130, alerts: 8 },
  { label: "Thu", trips: 122, alerts: 10 },
  { label: "Fri", trips: 95, alerts: 5 },
];

export const DEMO_LIVE_BUSES: LiveBusPoint[] = [
  {
    id: "1",
    busNumber: "07",
    plate: "Bus #07",
    schoolName: "مدرسة النور",
    speedKmh: 45,
    route: "المنطقة الشمالية",
    color: "#2563eb",
    mapX: 22,
    mapY: 38,
  },
  {
    id: "2",
    busNumber: "08",
    plate: "Bus #08",
    schoolName: "مدرسة الأمل",
    speedKmh: 32,
    route: "الكورنيش",
    color: "#16a34a",
    mapX: 48,
    mapY: 55,
  },
  {
    id: "3",
    busNumber: "12",
    plate: "Bus #12",
    schoolName: "مدرسة الفجر",
    speedKmh: 28,
    route: "حي السلام",
    color: "#f59e0b",
    mapX: 65,
    mapY: 42,
  },
  {
    id: "4",
    busNumber: "24",
    plate: "Bus #24",
    schoolName: "مدرسة الرواد",
    speedKmh: 51,
    route: "المنطقة الوسطى",
    color: "#8b5cf6",
    mapX: 38,
    mapY: 68,
  },
  {
    id: "5",
    busNumber: "33",
    plate: "Bus #33",
    schoolName: "مدرسة المستقبل",
    speedKmh: 39,
    route: "الواجهة البحرية",
    color: "#dc2626",
    mapX: 72,
    mapY: 30,
  },
];

export const DEMO_SCHOOL_STATS: SchoolStudentStat[] = [
  { school: "مدرسة النور", students: 420, color: "#2563eb" },
  { school: "مدرسة الأمل", students: 385, color: "#16a34a" },
  { school: "مدرسة الفجر", students: 310, color: "#f59e0b" },
  { school: "مدرسة الرواد", students: 498, color: "#8b5cf6" },
  { school: "مدرسة المستقبل", students: 445, color: "#dc2626" },
  { school: "أخرى", students: 400, color: "#64748b" },
];

export const DEMO_SUBSCRIPTIONS: SubscriptionStatus = {
  paid: 1850,
  dueSoon: 320,
  late: 288,
};

export const DEMO_TODAY_TRIPS: TodayTripsSummary = {
  started: 24,
  active: 12,
  ended: 92,
  going: 64,
  back: 64,
};
