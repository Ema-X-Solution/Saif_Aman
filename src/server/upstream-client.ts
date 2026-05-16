import axios from "axios";

const DEFAULT_UPSTREAM_BASE_URL =
  "https://lightseagreen-worm-964887.hostingersite.com/api";

export function getUpstreamBaseURL(): string {
  const raw =
    process.env.SAIF_AMAN_API_BASE_URL?.trim() || DEFAULT_UPSTREAM_BASE_URL;
  return raw.replace(/\/$/, "");
}

export function createUpstreamClient() {
  return axios.create({
    baseURL: getUpstreamBaseURL(),
    timeout: 30_000,
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true,
  });
}
