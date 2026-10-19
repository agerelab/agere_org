import "server-only";

import { MEMBERS, TASKS } from "@/patterns/data";

/** Stand-ins for your data layer (Prisma/Drizzle/Supabase). Runs only on the server. */
export async function getListTasks(_listSlug: string) {
  return TASKS;
}
export async function getMembers() {
  return MEMBERS;
}
