"use client";

import { useState, useEffect } from "react";
import { useT } from "@/i18n/use-t";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Users,
  Bell,
  Search,
} from "lucide-react";
import { http } from "@/services";

interface User {
  id: string | number;
  name: string;
}

export function SendNotificationView() {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userType, setUserType] = useState<string>("all");
  const [title, setTitle] = useState("Test from Backend");
  const [message, setMessage] = useState("The bus has started moving.");

  useEffect(() => {
    setLoadingUsers(true);
    setSelectedUsers([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = { page: 1, limit: 100 };
    if (userType !== "all") {
      params.type = userType;
    }

    http.get("/users", { params })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        const data = res.data;
        const usersList = Array.isArray(data) ? data : data.data || data.results || [];
        setAvailableUsers(usersList);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      })
      .finally(() => {
        setLoadingUsers(false);
      });
  }, [userType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUsers.length === 0) {
      setError(t("notifications.errorNoUser"));
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await http.post("/notifications/send", {
        users: selectedUsers.map((id) => parseInt(id, 10)),
        title,
        message,
      });

      setSuccess(true);
      setSelectedUsers([]);
      setTitle("");
      setMessage("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("notifications.errorGeneric"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredUsers = availableUsers.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toString().includes(searchQuery)
  );

  return (
    <div className="  space-y-6">
      {/* Page intro */}
      <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{t("notifications.sendTitle")}</p>
          <p className="text-xs text-muted-foreground">{t("notifications.sendDesc")}</p>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-400 p-4 text-green-800 dark:bg-green-950/30 dark:border-green-700 dark:text-green-400">
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">{t("notifications.successMsg")}</p>
          </div>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-destructive/10 border border-destructive/30 p-4 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* User select section */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <Label className="text-sm font-semibold">{t("notifications.selectUsers")}</Label>
            {selectedUsers.length > 0 && (
              <span className="ms-auto inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {selectedUsers.length} selected
              </span>
            )}
          </div>

          {/* Search + type filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder={`${t("common.search")}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9"
              />
            </div>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">{t("common.all")}</option>
              <option value="parent">{t("common.parent")}</option>
              <option value="supervisor">{t("common.supervisor")}</option>
              <option value="driver">{t("common.driver")}</option>
            </select>
          </div>

          {/* User list — plain div avoids Radix ScrollArea infinite-loop bug */}
          <div className="h-52 overflow-y-auto rounded-lg border bg-background">
            <div className="p-3 flex flex-col gap-1">
              {loadingUsers ? (
                // Skeleton rows — matches the RTL flex-row-reverse layout
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center flex-row-reverse gap-3 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-10 rounded" />
                      <Skeleton className="h-4 w-4 rounded" />
                    </div>
                    <Skeleton className="h-3.5 flex-1 rounded" />
                  </div>
                ))
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                  <Users className="h-8 w-8 opacity-30" />
                  <p className="text-sm">{t("table.noRecords")}</p>
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const idStr = u.id.toString();
                  const isSelected = selectedUsers.includes(idStr);
                  return (
                    <div
                      key={idStr}
                      className={`flex items-center flex-row-reverse gap-3 cursor-pointer rounded-lg px-3 py-2.5 transition-colors ${
                        isSelected
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted/60"
                      }`}
                      onClick={() => handleUserSelect(idStr)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono">
                          #{u.id}
                        </span>
                        <input
                          type="checkbox"
                          id={`user-${idStr}`}
                          checked={isSelected}
                          onChange={() => handleUserSelect(idStr)}
                          className="h-4 w-4 rounded border-gray-300 accent-primary cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <label
                        htmlFor={`user-${idStr}`}
                        className="text-sm font-medium cursor-pointer flex-1 select-none"
                        onClick={(e) => e.preventDefault()}
                      >
                        {u.name || `${t("notifications.userFallback")} ${u.id}`}
                      </label>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Notification content */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Notification Content</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notif-title">{t("notifications.titleLabel")}</Label>
            <Input
              id="notif-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("notifications.titlePlaceholder")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notif-message">{t("notifications.messageLabel")}</Label>
            <Textarea
              id="notif-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[110px] resize-none"
              placeholder={t("notifications.messagePlaceholder")}
              required
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {selectedUsers.length > 0
              ? `${selectedUsers.length} ${t("notifications.userFallback")}(s) selected`
              : t("notifications.holdCtrl")}
          </p>
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("notifications.sendingBtn")}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t("notifications.sendBtn")}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
