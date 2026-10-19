import { notFound } from "next/navigation";

import type { WorkspaceView } from "@/lib/workspace";
import { getListTasks, getMembers } from "~/lib/data";
import { WorkspaceClient } from "./workspace-client";

const VIEWS: WorkspaceView[] = ["list", "board", "calendar", "gantt", "doc", "chat"];

/**
 * Server Component: data is fetched on the server, the view lives in the URL
 * (/w/[list]/[view]?q=…), and only the interactive surface is a client component.
 */
export default async function ListViewPage({ params, searchParams }: { params: Promise<{ list: string; view: string }>; searchParams: Promise<{ q?: string }> }) {
  const [{ list, view }, { q }] = await Promise.all([params, searchParams]);
  if (!VIEWS.includes(view as WorkspaceView)) notFound();
  const [tasks, members] = await Promise.all([getListTasks(list), getMembers()]);
  return <WorkspaceClient listSlug={list} view={view as WorkspaceView} initialTasks={tasks} members={members} initialQuery={q ?? ""} />;
}
