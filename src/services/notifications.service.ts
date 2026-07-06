import { http } from "@/services/http";
import type { AppNotification } from "@/types/notification";

export const notificationsService = {
  async list(): Promise<AppNotification[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await http.get<{ data: any[] }>("/notifications");
    return (res.data?.data || []).map((note) => ({
      id: note.id,
      title: note.title,
      body: note.message || note.body,
      channel: note.type || "system",
      read: note.is_read || note.read || false,
      createdAt: note.created_at || note.createdAt,
    }));
  },
};
