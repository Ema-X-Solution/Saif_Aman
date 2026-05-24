import { http } from "@/services/http";
import type { LaravelPaginator } from "@/types/api";
import type { SettingPage } from "@/types/settings";

export type SettingPageWritePayload = Omit<SettingPage, "id">;

export const settingPagesService = {
  async list(): Promise<SettingPage[]> {
    const res = await http.get<LaravelPaginator<SettingPage>>("/setting-pages");
    return res.data?.data ?? [];
  },

  async getByKey(key: string): Promise<SettingPage> {
    const res = await http.get<{ data: SettingPage }>(`/settings/pages/${key}`);
    return res.data.data;
  },

  async create(payload: SettingPageWritePayload): Promise<SettingPage> {
    const res = await http.post("/setting-pages", payload);
    return res.data;
  },

  async update(id: number | string, payload: SettingPageWritePayload): Promise<SettingPage> {
    const res = await http.put(`/setting-pages/${id}`, payload);
    return res.data;
  },

  async remove(id: number | string): Promise<void> {
    await http.delete(`/setting-pages/${id}`);
  },
};
