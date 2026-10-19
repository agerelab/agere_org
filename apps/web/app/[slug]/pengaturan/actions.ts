"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "~/lib/session";

export async function endDemoSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/masuk");
}
