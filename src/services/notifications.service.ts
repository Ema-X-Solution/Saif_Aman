import { http } from "@/services/http";
import type { AppNotification } from "@/types/notification";

export const notificationsService = {
  async list(): Promise<AppNotification[]> {
    const res = await http.get<{ data: AppNotification[] }>("/notifications");
    return res.data?.data ?? [];
  },
};
