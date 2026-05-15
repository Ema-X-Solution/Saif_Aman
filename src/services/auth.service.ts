import { withMockLatency } from "@/services/mock-delay";
import type { AuthSession } from "@/types/auth";

const MOCK_TOKEN = "mock-jwt-token";

export interface LoginPayload {
  email: string;
  password: string;
  remember: boolean;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    await withMockLatency(null, 500);
    if (!payload.email || !payload.password) {
      throw new Error("Invalid credentials.");
    }
    return {
      email: payload.email,
      name: "Admin User",
      role: "admin",
      token: MOCK_TOKEN,
      remember: payload.remember,
    };
  },
};
