import { MOCK_NOTIFICATIONS } from "@/mock/notifications";
import { withMockLatency } from "@/services/mock-delay";
import type { AppNotification } from "@/types/notification";

export const notificationsService = {
  list(): Promise<AppNotification[]> {
    return withMockLatency([...MOCK_NOTIFICATIONS]);
  },
};
