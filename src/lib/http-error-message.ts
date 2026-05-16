import axios from "axios";

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

/** Parses Laravel / generic JSON error payloads from Axios responses. */
export function getAxiosErrorMessage(err: unknown): string {
  if (!axios.isAxiosError(err)) {
    return err instanceof Error ? err.message : "Something went wrong.";
  }
  const data = err.response?.data;
  const root = asRecord(data);
  if (!root) {
    return typeof err.response?.status === "number"
      ? `Request failed (${err.response.status}).`
      : err.message;
  }
  const msg = pickString(root, ["message", "error", "detail"]);
  if (msg) return msg;
  const errors = root.errors;
  if (errors && typeof errors === "object") {
    const first = Object.values(errors as Record<string, unknown>)[0];
    if (Array.isArray(first) && typeof first[0] === "string") return first[0];
    if (typeof first === "string") return first;
  }
  return typeof err.response?.status === "number"
    ? `Request failed (${err.response.status}).`
    : err.message;
}
