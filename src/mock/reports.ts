import type { ReportDefinition } from "@/types/report";

export const MOCK_REPORTS: ReportDefinition[] = [
  {
    id: "rep-1",
    name: "On-time performance (30d)",
    category: "operations",
    lastGeneratedAt: "2026-05-07T23:00:00.000Z",
    format: "pdf",
  },
  {
    id: "rep-2",
    name: "Incident & speed violations",
    category: "safety",
    lastGeneratedAt: "2026-05-06T19:30:00.000Z",
    format: "csv",
  },
];
