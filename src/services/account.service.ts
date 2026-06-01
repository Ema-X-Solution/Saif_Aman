import axios from "axios";

import { http } from "@/services/http";

export const accountService = {
  async userLogin(identity: string, password: string): Promise<string> {
    try {
      const res = await http.post<unknown>("/auth/login", {
        identity,
        password,
        token: "web",
        device: "web",
      });
      
      const data = res.data as Record<string, unknown>;
      const token = (data?.token as string) || ((data?.data as Record<string, unknown>)?.token as string);
      if (!token) {
        throw new Error("No token returned from login.");
      }
      return token;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || "Login failed.";
        throw new Error(msg);
      }
      throw err;
    }
  },

  async deleteMyAccount(token: string): Promise<void> {
    try {
      await http.delete("/delete/my-account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || "Failed to delete account.";
        throw new Error(msg);
      }
      throw err;
    }
  },
};
