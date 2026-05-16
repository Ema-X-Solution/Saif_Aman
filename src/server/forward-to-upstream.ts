import axios from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createUpstreamClient } from "@/server/upstream-client";

async function parseJsonBody(req: NextRequest): Promise<unknown | NextResponse> {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "DELETE") {
    return undefined;
  }

  const ct = req.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) {
    const buf = await req.arrayBuffer();
    if (buf.byteLength === 0) return undefined;
    return NextResponse.json(
      { message: "Only application/json bodies are supported." },
      { status: 415 },
    );
  }

  const text = await req.text();
  if (!text.trim()) return undefined;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }
}

export async function forwardRequest(
  req: NextRequest,
  pathSegments: string[],
): Promise<NextResponse> {
  const pathname = pathSegments.join("/");
  const upstreamUrl = `${pathname}${req.nextUrl.search}`;

  const parsed = await parseJsonBody(req);
  if (parsed instanceof NextResponse) return parsed;

  const headers: Record<string, string> = {};
  const auth = req.headers.get("authorization");
  if (auth) headers.Authorization = auth;

  const contentType = req.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const client = createUpstreamClient();
    const upstream = await client.request({
      method: req.method,
      url: upstreamUrl,
      data: parsed,
      headers,
      validateStatus: () => true,
    });

    return NextResponse.json(upstream.data ?? null, {
      status: upstream.status,
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 502;
      const data = err.response?.data ?? { message: err.message };
      return NextResponse.json(data, { status });
    }
    throw err;
  }
}
