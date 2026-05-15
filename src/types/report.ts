import type { EntityId } from "@/types/common";

export interface ReportDefinition {
  id: EntityId;
  name: string;
  category: "operations" | "safety" | "finance";
  lastGeneratedAt: string;
  format: "pdf" | "csv";
}
