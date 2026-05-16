import axios from "axios";

import { http } from "@/services/http";
import type { AuthSession } from "@/types/auth";

export interface LoginPayload {
  email: string;
  password: string;
  remember: boolean;
}

function pickString(
  obj: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return undefined;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function extractErrorMessage(data: unknown): string | undefined {
  const root = asRecord(data);
  if (!root) return undefined;
  const msg = pickString(root, ["message", "error", "detail"]);
  if (msg) return msg;
  const errors = root.errors;
  if (errors && typeof errors === "object") {
    const first = Object.values(errors as Record<string, unknown>)[0];
    if (Array.isArray(first) && typeof first[0] === "string") return first[0];
    if (typeof first === "string") return first;
  }
  return undefined;
}

function mapLoginResponse(data: unknown, payload: LoginPayload): AuthSession {
  const root = asRecord(data);
  if (!root) {
    throw new Error("Unexpected login response.");
  }

  const payloadLayer = asRecord(root.data) ?? root;

  const token =
    pickString(payloadLayer, [
      "token",
      "access_token",
      "accessToken",
      "auth_token",
    ]) ??
    pickString(root, [
      "token",
      "access_token",
      "accessToken",
      "auth_token",
    ]);

  if (!token) {
    throw new Error("Login succeeded but no token was returned.");
  }

  const user =
    asRecord(payloadLayer.user) ??
    asRecord(payloadLayer.admin) ??
    asRecord(payloadLayer.profile) ??
    payloadLayer;

  const email =
    pickString(user, ["email", "identity"]) ?? payload.email;
  const name =
    pickString(user, ["name", "full_name", "fullName", "username"]) ??
    email.split("@")[0] ??
    "Admin";

  return {
    email,
    name,
    role: "admin",
    token,
    remember: payload.remember,
  };
}

export const authService = {
  /** Clears session server-side when supported; ignores failures. */
  async logoutRemote(): Promise<void> {
    try {
      await http.post("/auth/logout", {});
    } catch {
      /* optional upstream */
    }
  },

  async login(payload: LoginPayload): Promise<AuthSession> {
    try {
      const res = await http.post<unknown>("/auth/login", {
        email: payload.email,
        password: payload.password,
        remember: payload.remember,
      });
      return mapLoginResponse(res.data, payload);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          extractErrorMessage(err.response?.data) ??
          (typeof err.response?.status === "number"
            ? `Sign in failed (${err.response.status}).`
            : err.message);
        throw new Error(msg);
      }
      throw err;
    }
  },
};
