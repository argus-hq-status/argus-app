import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

async function handle(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathname = "/api/" + path.join("/");
  const search = req.nextUrl.search;
  const url = `${API_URL}${pathname}${search}`;

  const body = req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined;

  const headers: Record<string, string> = {
    "Content-Type": req.headers.get("content-type") ?? "application/json",
  };
  const cookie = req.headers.get("cookie");
  if (cookie) headers["cookie"] = cookie;

  try {
    const backendRes = await fetch(url, {
      method: req.method,
      headers,
      body,
    });

    const resBody = backendRes.headers.get("content-type")?.includes("application/json")
      ? await backendRes.json()
      : await backendRes.text();

    return NextResponse.json(resBody, { status: backendRes.status });
  } catch (err) {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 502 });
  }
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const DELETE = handle;
export const HEAD = handle;
