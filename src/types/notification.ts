import type { EntityId } from "@/types/common";

export interface AppNotification {
  id: EntityId;
  title: string;
  body: string;
  channel: "system" | "route" | "safety" | "billing";
  read: boolean;
  createdAt: string;
}
