import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const hopByHop = new Set(["host", "connection", "content-length", "transfer-encoding"]);

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const api = process.env.API_URL ?? "http://127.0.0.1:3001";
  const { path } = await context.params;
  const target = new URL(`${api.replace(/\/$/, "")}/api/${path.join("/")}`);
  target.search = request.nextUrl.search;
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!hopByHop.has(key.toLowerCase())) headers.set(key, value);
  });
  const init: RequestInit = { method: request.method, headers, redirect: "manual" };
  if (request.method !== "GET" && request.method !== "HEAD") init.body = await request.arrayBuffer();
  const response = await fetch(target, init);
  return new Response(response.body, { status: response.status, headers: response.headers });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
