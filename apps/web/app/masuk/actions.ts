"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { safeReturnPath } from "@agere/contracts";
import { DEMO_SESSION, SESSION_COOKIE } from "~/lib/session";

export async function startDemoSession(formData: FormData) {
  const next = safeReturnPath(String(formData.get("next") ?? ""));
  const jar = await cookies();
  jar.set(SESSION_COOKIE, DEMO_SESSION, { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" });
  redirect(next);
}
