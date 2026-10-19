"use server";

import type { WorkspaceTask } from "@/lib/workspace";

/** Server Action — replace with your database call. Throw to trigger the client rollback. */
export async function updateTask(id: string, patch: Partial<WorkspaceTask>) {
  await new Promise((r) => setTimeout(r, 150));
  return { id, ...patch, updatedAt: new Date().toISOString() };
}
