import { MOCK_ADMINS } from "@/mock/admins";
import { withMockLatency } from "@/services/mock-delay";
import type { AdminUser } from "@/types/admin";

export const adminsService = {
  list(): Promise<AdminUser[]> {
    return withMockLatency([...MOCK_ADMINS]);
  },
};
