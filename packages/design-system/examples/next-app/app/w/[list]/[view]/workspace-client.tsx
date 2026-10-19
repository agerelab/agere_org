"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  EMPTY_FILTERS, FilterBar, GanttChart, Kanban, KanbanBoard, KanbanCard, KanbanColumn, TaskList, ViewSwitcherBar, ViewSwitcherPanel,
  applyTaskQuery, toast, TASK_STATUSES, TASK_STATUS_META,
  type GroupBy, type KanbanColumnData, type SortBy, type TaskFilters, type WorkspaceMember, type WorkspaceTask, type WorkspaceView,
} from "@/components/agere-ds";
import { updateTask } from "./actions";

export function WorkspaceClient({
  listSlug, view, initialTasks, members, initialQuery,
}: { listSlug: string; view: WorkspaceView; initialTasks: WorkspaceTask[]; members: WorkspaceMember[]; initialQuery: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [tasks, setTasks] = React.useState(initialTasks);
  const [optimistic, applyOptimistic] = React.useOptimistic(tasks, (state, p: { id: string; patch: Partial<WorkspaceTask> }) =>
    state.map((t) => (t.id === p.id ? { ...t, ...p.patch } : t))
  );
  const [, startTransition] = React.useTransition();
  const [search, setSearch] = React.useState(initialQuery);
  const [filters, setFilters] = React.useState<TaskFilters>(EMPTY_FILTERS);
  const [groupBy, setGroupBy] = React.useState<GroupBy>("status");
  const [sortBy, setSortBy] = React.useState<SortBy>("manual");

  // keep ?q= in the URL so views are shareable
  React.useEffect(() => {
    const next = new URLSearchParams(params.toString());
    if (search) next.set("q", search); else next.delete("q");
    const qs = next.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const patch = (id: string, p: Partial<WorkspaceTask>) =>
    startTransition(async () => {
      applyOptimistic({ id, patch: p });
      try {
        await updateTask(id, p);
        setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...p } : t)));
      } catch {
        toast.error("Couldn’t save the change", { description: "It was rolled back. Try again." });
      }
    });

  const visible = applyTaskQuery(optimistic, search, filters, sortBy);
  const columns: KanbanColumnData[] = TASK_STATUSES.map((s) => ({
    id: s, title: TASK_STATUS_META[s].label,
    cards: visible.filter((t) => t.status === s).map((t) => ({ id: t.id, title: t.title, taskKey: t.key, status: t.status, taskPriority: t.priority, assignees: t.assignees, dueDate: t.dueDate, subtasks: t.subtasks })),
  }));

  return (
    <main id="main-content" className="flex h-dvh flex-col bg-default">
      <ViewSwitcherBar
        value={view}
        onValueChange={(v) => router.push(`/w/${listSlug}/${v}${search ? `?q=${encodeURIComponent(search)}` : ""}`)}
        leading={<span className="text-sm font-semibold text-emphasis">Sprint 14</span>}
      >
        <FilterBar search={search} onSearchChange={setSearch} filters={filters} onFiltersChange={setFilters} members={members}
          groupBy={groupBy} onGroupByChange={setGroupBy} sortBy={sortBy} onSortByChange={setSortBy} resultLabel={`${visible.length} tasks`}
          density="compact" onDensityChange={(d) => { document.cookie = `density=${d}; path=/; max-age=31536000`; document.documentElement.dataset.density = d; }} />
        <ViewSwitcherPanel value="list" className="flex flex-col">
          <TaskList tasks={visible} members={members} groupBy={groupBy} onTaskChange={patch} className="flex-1" />
        </ViewSwitcherPanel>
        <ViewSwitcherPanel value="board" className="flex min-h-0 flex-col bg-muted">
          <Kanban columns={columns} onCardMove={({ cardId, toColumnId }) => patch(cardId, { status: toColumnId as WorkspaceTask["status"] })} className="min-h-0 flex-1 border-0 bg-transparent">
            <KanbanBoard>{columns.map((c) => <KanbanColumn key={c.id} columnId={c.id}>{(card) => <KanbanCard card={card} />}</KanbanColumn>)}</KanbanBoard>
          </Kanban>
        </ViewSwitcherPanel>
        <ViewSwitcherPanel value="gantt" className="flex min-h-0 flex-col"><GanttChart tasks={visible} className="min-h-0 flex-1" /></ViewSwitcherPanel>
        {(["calendar", "doc", "chat"] as const).map((v) => (
          <ViewSwitcherPanel key={v} value={v} className="grid place-items-center p-10 text-sm text-subtle">
            See the docs portal (Workspace app) for the {v} view wiring.
          </ViewSwitcherPanel>
        ))}
      </ViewSwitcherBar>
    </main>
  );
}
