"use client";

import * as React from "react";
import { CalendarDays, MessageSquare, Plus, Search, UserPlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { TASK_STATUS_META, type TaskPriority, type TaskStatus, type WorkspaceTask } from "@/lib/workspace";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "@/components/ui/toast";
import { Kanban, KanbanBoard, KanbanCard, KanbanColumn, type KanbanColumnData, type KanbanMove } from "@/components/agere-ds/kanban";
import { AssigneeStack, PriorityFlag, StatusBadge } from "@/components/agere-ds/workspace";
import { PROJECT_TASKS, STATUS_ORDER, TEAM } from "./workspace-data";

const TONE: Record<TaskStatus, KanbanColumnData["status"]> = { backlog: undefined, todo: undefined, "in-progress": "blue", review: "purple", blocked: "red", complete: "green" };

/**
 * Block · Kanban app (shadcnstudio "Kanban App"). Project header, search (InputGroup), priority filter, team,
 * the DS Kanban board (pointer drag AND keyboard: Space to lift, arrows to move, Space to drop — announced),
 * and a card-details Sheet where status can also be changed without dragging (WCAG 2.5.7 dragging alternative).
 */
export function KanbanApp({ className }: { className?: string }) {
  const [tasks, setTasks] = React.useState<WorkspaceTask[]>(PROJECT_TASKS);
  const [q, setQ] = React.useState("");
  const [priority, setPriority] = React.useState<"all" | TaskPriority>("all");
  const [openId, setOpenId] = React.useState<string | null>(null);
  const patch = (id: string, p: Partial<WorkspaceTask>) => setTasks((l) => l.map((t) => (t.id === id ? { ...t, ...p } : t)));

  const visible = tasks.filter((t) => (priority === "all" || t.priority === priority) && `${t.key} ${t.title} ${t.list}`.toLowerCase().includes(q.toLowerCase()));
  const columns: KanbanColumnData[] = STATUS_ORDER.map((s) => ({
    id: s, title: TASK_STATUS_META[s].label, status: TONE[s], limit: s === "in-progress" ? 3 : undefined,
    cards: visible.filter((t) => t.status === s).map((t) => ({
      id: t.id, title: t.title, taskKey: t.key, list: t.list, status: t.status, taskPriority: t.priority, assignees: t.assignees,
      dueDate: t.dueDate, subtasks: t.subtasks, commentCount: t.comments,
    })),
  }));
  const done = tasks.filter((t) => t.status === "complete").length;

  const move = ({ cardId, toColumnId }: KanbanMove) => {
    patch(cardId, { status: toColumnId as TaskStatus });
    toast(`Moved to ${TASK_STATUS_META[toColumnId as TaskStatus].label}`);
  };
  const create = (status: string) => {
    const id = `k${Date.now()}`;
    setTasks((l) => [...l, { id, key: `MIMO-${230 + l.length}`, title: "Untitled task", status: status as TaskStatus, priority: "normal", assignees: [], list: "Mimo" }]);
    setOpenId(id);
  };
  const current = tasks.find((t) => t.id === openId);

  return (
    <div className={cn("flex h-[720px] flex-col overflow-hidden rounded-xl border border-border bg-background", className)}>
      <header className="grid gap-4 border-b border-border p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="grid gap-1">
            <p className="text-sm text-muted-foreground">Projects / Mimo</p>
            <h2 className="text-xl font-semibold tracking-tight">Interview platform — Q4</h2>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="tabular-nums">{done} of {tasks.length} done</span>
              <Progress value={(done / tasks.length) * 100} size="sm" className="w-32" aria-label="Project progress" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AssigneeStack members={TEAM} max={4} />
            <Button variant="outline" size="sm" leadingIcon={<UserPlus />}>Invite</Button>
            <Button size="sm" leadingIcon={<Plus />} onClick={() => create("todo")}>New task</Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <InputGroup className="h-8 w-full sm:w-72">
            <InputGroupAddon><Search aria-hidden /></InputGroupAddon>
            <InputGroupInput size="md" className="h-full" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks or keys…" aria-label="Search tasks" />
            {q && <InputGroupAddon align="inline-end"><InputGroupText aria-live="polite">{visible.length} found</InputGroupText></InputGroupAddon>}
          </InputGroup>
          <Select value={priority} onValueChange={(v) => setPriority(v as "all" | TaskPriority)}>
            <SelectTrigger className="h-8 w-40" aria-label="Filter by priority"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {(["urgent", "high", "normal", "low"] as TaskPriority[]).map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </header>

      <Kanban columns={columns} onCardMove={move} onCardClick={setOpenId} onCardCreate={create} className="min-h-0 flex-1 rounded-none border-0 bg-muted/30">
        <KanbanBoard>
          {columns.map((c) => <KanbanColumn key={c.id} columnId={c.id}>{(card) => <KanbanCard card={card} />}</KanbanColumn>)}
        </KanbanBoard>
      </Kanban>

      <Sheet open={!!current} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent size="md">
          {current && (
            <>
              <SheetHeader>
                <p className="font-mono text-xs text-muted-foreground">{current.key} · {current.list}</p>
                <SheetTitle>{current.title}</SheetTitle>
                <SheetDescription className="flex flex-wrap items-center gap-2"><StatusBadge status={current.status} /><PriorityFlag priority={current.priority} showLabel /></SheetDescription>
              </SheetHeader>
              <SheetBody className="grid content-start gap-6">
                <div className="grid gap-2">
                  <label htmlFor="task-status" className="text-sm font-medium">Status</label>
                  <Select value={current.status} onValueChange={(v) => { patch(current.id, { status: v as TaskStatus }); toast(`Moved to ${TASK_STATUS_META[v as TaskStatus].label}`); }}>
                    <SelectTrigger id="task-status"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUS_ORDER.map((s) => <SelectItem key={s} value={s}>{TASK_STATUS_META[s].label}</SelectItem>)}</SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Same as dragging the card to another column.</p>
                </div>
                <dl className="grid grid-cols-[8rem_1fr] gap-y-3 text-sm">
                  <dt className="text-muted-foreground">Due</dt>
                  <dd className="flex items-center gap-2"><CalendarDays className="size-4 text-muted-foreground" aria-hidden />{current.dueDate ? new Date(current.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No date"}</dd>
                  <dt className="text-muted-foreground">Subtasks</dt>
                  <dd>{current.subtasks ? `${current.subtasks.done} of ${current.subtasks.total} done` : "None"}</dd>
                  <dt className="text-muted-foreground">Comments</dt>
                  <dd className="flex items-center gap-2"><MessageSquare className="size-4 text-muted-foreground" aria-hidden />{current.comments ?? 0}</dd>
                </dl>
                <Separator />
                <section aria-labelledby="assignees-h" className="grid gap-2">
                  <h3 id="assignees-h" className="text-sm font-medium">Assignees</h3>
                  {current.assignees.length ? (
                    <ItemGroup aria-label="Assignees">
                      {current.assignees.map((m) => (
                        <Item key={m.id} size="sm" className="px-0">
                          <ItemMedia><Avatar name={m.name} size="md" aria-hidden /></ItemMedia>
                          <ItemContent><ItemTitle>{m.name}</ItemTitle><ItemDescription>{m.email}</ItemDescription></ItemContent>
                        </Item>
                      ))}
                    </ItemGroup>
                  ) : <p className="text-sm text-muted-foreground">Nobody yet.</p>}
                </section>
              </SheetBody>
              <SheetFooter>
                <Button variant="outline" onClick={() => setOpenId(null)}>Close</Button>
                <Button onClick={() => { toast.success("Task saved"); setOpenId(null); }}>Save</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
