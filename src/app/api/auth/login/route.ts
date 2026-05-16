import axios from "axios";
import { NextResponse } from "next/server";

import { createUpstreamClient } from "@/server/upstream-client";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Invalid body." }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const identity =
    typeof record.identity === "string"
      ? record.identity
      : typeof record.email === "string"
        ? record.email
        : "";
  const password = typeof record.password === "string" ? record.password : "";

  if (!identity.trim() || !password) {
    return NextResponse.json(
      { message: "identity (or email) and password are required." },
      { status: 400 },
    );
  }

  const upstreamBody = {
    identity: identity.trim(),
    password,
    token:
      typeof record.token === "string" && record.token.length > 0
        ? record.token
        : "",
    device:
      typeof record.device === "string" && record.device.length > 0
        ? record.device
        : "web_admin",
  };

  try {
    const client = createUpstreamClient();
    const upstream = await client.post("auth/login", upstreamBody);
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
