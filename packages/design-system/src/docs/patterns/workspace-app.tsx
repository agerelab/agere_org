import * as React from "react";
import {
  Bell, CalendarDays, CheckCircle2, ChevronsUpDown, Clock, FileText, FolderKanban, Hash, Home, Inbox, KanbanSquare, List as ListIcon,
  Moon, Plus, Rows3, Share2, Star, Sun, Timer,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { setTheme } from "@/lib/theme";
import { TASK_STATUSES, TASK_STATUS_META, type Density, type TaskStatus, type WorkspaceTask, type WorkspaceView } from "@/lib/workspace";
import { Button, IconButton } from "@/components/ui/button";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CommandPalette, CommandTrigger, type CommandItem } from "@/components/ui/command-palette";
import { toast } from "@/components/ui/toast";
import { Logo } from "@/brand/logo";
import {
  AssigneeStack, EMPTY_FILTERS, FilterBar, GanttChart, TaskAssigneePicker, TaskDatePicker, TaskList, TaskPriorityPicker, TaskStatusPicker,
  ViewSwitcherBar, ViewSwitcherPanel, applyTaskQuery, type GroupBy, type SortBy, type TaskFilters,
} from "@/components/agere-ds/workspace";
import { Kanban, KanbanBoard, KanbanCard, KanbanColumn, type KanbanColumnData, type KanbanMove } from "@/components/agere-ds/kanban";
import { CalendarTimeGrid } from "@/components/agere-ds/calendar";
import { ChannelSidebar, ChatInputBar, MessageBubble, MessageDivider, type ChatMessage } from "@/components/agere-ds/chat";
import { DocHeader, DocTree, RichTextContainer } from "@/components/agere-ds/docs";
import { TimeTrackerWidget, type TimeEntry } from "@/components/agere-ds/finance";
import { CHANNELS, CUSTOM_FIELDS, DIRECTS, DOC_TREE, EVENTS, LINKABLE_TASKS, MEMBERS, MESSAGES, TASKS } from "@/patterns/data";
import { addDays, toDateKey } from "@/lib/date";

const TONE: Record<TaskStatus, KanbanColumnData["status"]> = {
  backlog: "purple", todo: "blue", "in-progress": "yellow", review: "purple", blocked: "red", complete: "green",
};

/* ------------------------------------------------------------------ */
/* Left rail — spaces & lists (ClickUp hierarchy: Space › Folder › List) */
/* ------------------------------------------------------------------ */
function SpaceRail({ onNavigate }: { onNavigate: (v: WorkspaceView) => void }) {
  const item = "flex h-8 w-full items-center gap-2 rounded-md px-2 text-dense font-medium text-default hover:bg-subtle hover:text-emphasis focus-ring-inset [&_svg]:size-dense-icon [&_svg]:text-subtle";
  return (
    <nav aria-label="Workspace" className="hidden w-56 shrink-0 flex-col border-r border-subtle bg-muted lg:flex">
      <div className="flex h-12 items-center gap-2 border-b border-subtle px-3">
        <Logo variant="app-icon" height={24} title="" />
        <span className="flex-1 truncate text-sm font-semibold text-emphasis">agere</span>
        <ChevronsUpDown aria-hidden className="size-4 text-subtle" />
      </div>
      <div className="grid gap-0.5 p-2">
        <button type="button" className={item}><Home aria-hidden />Home</button>
        <button type="button" className={item}><Inbox aria-hidden />Inbox<span className="ml-auto rounded-full bg-error-solid px-1.5 text-2xs font-semibold text-error-on-solid">4</span></button>
        <button type="button" className={item} onClick={() => onNavigate("chat")}><Hash aria-hidden />Chat</button>
        <button type="button" className={item}><Clock aria-hidden />Timesheets</button>
      </div>
      <p className="text-xs font-medium text-muted-foreground px-4 pb-1 pt-3 text-muted">Spaces</p>
      <ul className="grid gap-0.5 px-2" role="list">
        {[
          ["Kulina", "bg-viz-6", true],
          ["agere Pay", "bg-viz-3", false],
          ["Ops & People", "bg-viz-4", false],
        ].map(([name, color, open]) => (
          <li key={name as string}>
            <span className="flex h-8 items-center gap-2 rounded-md px-2 text-dense font-medium text-emphasis">
              <span aria-hidden className={cn("grid size-5 place-items-center rounded-md text-2xs font-bold text-white", color as string)}>{(name as string)[0]}</span>
              {name as string}
            </span>
            {open && (
              <ul className="ml-4 grid gap-0.5 border-l border-subtle pl-2" role="list">
                <li><span className="flex h-7 items-center gap-2 rounded-md px-2 text-dense text-subtle"><FolderKanban aria-hidden className="size-3.5" />MVP launch</span></li>
                <li><span aria-current="page" className="flex h-7 items-center gap-2 rounded-md bg-emphasis px-2 text-dense font-medium text-emphasis"><ListIcon aria-hidden className="size-3.5" />Sprint 14</span></li>
                <li><span className="flex h-7 items-center gap-2 rounded-md px-2 text-dense text-subtle"><ListIcon aria-hidden className="size-3.5" />Backlog</span></li>
                <li><span className="flex h-7 items-center gap-2 rounded-md px-2 text-dense text-subtle"><FileText aria-hidden className="size-3.5" />Product specs</span></li>
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-auto border-t border-subtle p-3"><AssigneeStack members={MEMBERS} max={4} /></div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* The app                                                             */
/* ------------------------------------------------------------------ */
export function WorkspaceApp() {
  const [tasks, setTasks] = React.useState<WorkspaceTask[]>(TASKS);
  const [view, setView] = React.useState<WorkspaceView>("list");
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<TaskFilters>(EMPTY_FILTERS);
  const [groupBy, setGroupBy] = React.useState<GroupBy>("status");
  const [sortBy, setSortBy] = React.useState<SortBy>("manual");
  const [density, setDensity] = React.useState<Density>("compact");
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>(MESSAGES);
  const [channel, setChannel] = React.useState(CHANNELS[0].id);
  const [docId, setDocId] = React.useState("d2");
  const [docTitle, setDocTitle] = React.useState("MVP launch plan");
  const [entries, setEntries] = React.useState<TimeEntry[]>([
    { id: "e1", minutes: 95, at: new Date(Date.now() - 864e5).toISOString(), source: "timer", note: "Checkout flow" },
    { id: "e2", minutes: 30, at: new Date(Date.now() - 3600e3).toISOString(), source: "manual", note: "Review with Nadia" },
  ]);
  const [runningSince, setRunningSince] = React.useState<string | null>(null);

  const visible = applyTaskQuery(tasks, search, filters, sortBy);
  const patch = React.useCallback((id: string, p: Partial<WorkspaceTask>) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...p } : t))), []);
  const open = tasks.find((t) => t.id === openId);

  const columns: KanbanColumnData[] = TASK_STATUSES.map((s) => ({
    id: s,
    title: TASK_STATUS_META[s].label,
    status: TONE[s],
    limit: s === "in-progress" ? 3 : undefined,
    cards: visible.filter((t) => t.status === s).map((t) => ({
      id: t.id, title: t.title, taskKey: t.key, list: t.list, status: t.status, taskPriority: t.priority, assignees: t.assignees,
      dueDate: t.dueDate, subtasks: t.subtasks, attachmentCount: t.attachments, commentCount: t.comments,
      tags: t.tags?.map((g) => ({ id: g.id, label: g.label, status: "blue" as const })),
    })),
  }));
  const move = ({ cardId, toColumnId }: KanbanMove) => {
    patch(cardId, { status: toColumnId as TaskStatus });
    toast(`Moved to ${TASK_STATUS_META[toColumnId as TaskStatus].label}`);
  };

  const commands: CommandItem[] = [
    ...(["list", "board", "calendar", "gantt", "doc", "chat"] as WorkspaceView[]).map((v) => ({
      id: `view-${v}`, group: "Views", label: `Go to ${v[0].toUpperCase()}${v.slice(1)} view`, icon: v === "board" ? <KanbanSquare /> : v === "calendar" ? <CalendarDays /> : v === "chat" ? <Hash /> : v === "doc" ? <FileText /> : <ListIcon />,
      onSelect: () => setView(v),
    })),
    ...tasks.map((t) => ({ id: t.id, group: "Tasks", label: t.title, hint: t.key, keywords: `${t.key} ${t.list}`, icon: <CheckCircle2 />, onSelect: () => setOpenId(t.id) })),
    { id: "density", group: "Preferences", label: density === "compact" ? "Switch to comfortable density" : "Switch to compact density", icon: <Rows3 />, onSelect: () => setDensity(density === "compact" ? "comfortable" : "compact") },
    { id: "dark", group: "Preferences", label: "Dark mode", icon: <Moon />, onSelect: () => { setTheme("dark"); document.documentElement.dataset.theme = "dark"; } },
    { id: "light", group: "Preferences", label: "Light mode", icon: <Sun />, onSelect: () => { setTheme("light"); document.documentElement.dataset.theme = "light"; } },
  ];

  const trackedMinutes = entries.reduce((a, e) => a + e.minutes, 0);

  return (
    <div data-density={density} className="flex h-[780px] max-h-[calc(100dvh-6rem)] min-h-[560px] overflow-hidden rounded-xl border border-subtle bg-default text-default">
      <SpaceRail onNavigate={setView} />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <div className="flex h-12 shrink-0 items-center gap-3 border-b border-subtle px-3 sm:px-4">
          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <ol className="flex items-center gap-1.5 text-dense text-subtle">
              <li className="hidden sm:block">Kulina</li><li aria-hidden className="hidden sm:block">/</li>
              <li className="hidden sm:block">MVP launch</li><li aria-hidden className="hidden sm:block">/</li>
              <li aria-current="page" className="flex items-center gap-1.5 truncate font-semibold text-emphasis">Sprint 14 <Star aria-hidden className="size-3.5 text-subtle" /></li>
            </ol>
          </nav>
          <CommandTrigger onClick={() => setCmdOpen(true)} label="Search" className="hidden w-56 md:flex" />
          <IconButton label="Notifications" icon={<Bell />} size="sm" />
          <Button size="sm" variant="outline" leadingIcon={<Share2 />} className="hidden sm:inline-flex" onClick={() => toast.success("Link copied")}>Share</Button>
        </div>

        <ViewSwitcherBar
          value={view}
          onValueChange={setView}
          badges={{ chat: 3 }}
          onAddView={() => toast("Add view: Table, Timeline, Workload, Form…")}
          actions={<Button size="xs" leadingIcon={<Plus />} onClick={() => { const id = `t${Date.now()}`; setTasks((ts) => [{ id, key: `KUL-${140 + ts.length}`, title: "New task", status: "todo", assignees: [], list: "Sprint 14" }, ...ts]); setOpenId(id); }}>Task</Button>}
        >
          {(view === "list" || view === "board" || view === "gantt") && (
            <FilterBar
              search={search} onSearchChange={setSearch} filters={filters} onFiltersChange={setFilters} members={MEMBERS}
              groupBy={groupBy} onGroupByChange={setGroupBy} sortBy={sortBy} onSortByChange={setSortBy}
              density={density} onDensityChange={setDensity} resultLabel={`${visible.length} tasks`}
            />
          )}

          <ViewSwitcherPanel value="list" className="flex flex-col">
            <TaskList
              tasks={visible} members={MEMBERS} groupBy={groupBy} onTaskChange={patch} onTaskOpen={setOpenId}
              columns={{ assignee: true, due: true, priority: true, time: true, custom: CUSTOM_FIELDS }}
              onAddTask={({ key }) => { const id = `t${Date.now()}`; setTasks((ts) => [...ts, { id, key: `KUL-${140 + ts.length}`, title: "New task", status: (groupBy === "status" ? key : "todo") as TaskStatus, assignees: [] }]); setOpenId(id); }}
              className="flex-1"
            />
          </ViewSwitcherPanel>

          <ViewSwitcherPanel value="board" className="flex min-h-0 flex-col bg-muted">
            <Kanban columns={columns} onCardMove={move} onCardClick={setOpenId} className="min-h-0 flex-1 rounded-none border-0 bg-transparent">
              <KanbanBoard>
                {columns.map((c) => <KanbanColumn key={c.id} columnId={c.id}>{(card) => <KanbanCard card={card} />}</KanbanColumn>)}
              </KanbanBoard>
            </Kanban>
          </ViewSwitcherPanel>

          <ViewSwitcherPanel value="calendar" className="flex min-h-0 flex-col">
            <CalendarTimeGrid view="week" date={toDateKey(new Date())} events={EVENTS} onEventClick={(id) => toast(`Open event ${id}`)} onSlotClick={(iso) => toast(`New event at ${iso.slice(11, 16)}`)} className="min-h-0 flex-1" />
          </ViewSwitcherPanel>

          <ViewSwitcherPanel value="gantt" className="flex min-h-0 flex-col">
            <GanttChart tasks={visible} from={toDateKey(addDays(new Date(), -10))} onTaskClick={setOpenId} className="min-h-0 flex-1" />
          </ViewSwitcherPanel>

          <ViewSwitcherPanel value="doc" className="flex min-h-0">
            <aside className="hidden w-60 shrink-0 overflow-y-auto border-r border-subtle bg-muted p-2 md:block">
              <DocTree nodes={DOC_TREE} activeId={docId} onSelect={setDocId} onAddChild={() => toast("New page")} defaultExpanded={["d1"]} />
            </aside>
            <div className="min-w-0 flex-1 overflow-y-auto">
              <div className="mx-auto max-w-prose px-6 pt-5"><DocHeader title={docTitle} onTitleChange={setDocTitle} breadcrumb={["Kulina", "Product specs"]} viewers={MEMBERS.slice(0, 3)} lastEdited={{ by: "Nadia Rahma", at: "5 min ago" }} /></div>
              <RichTextContainer onCommand={(c) => toast(`Format: ${c}`)} className="mx-auto max-w-prose px-6 pb-10">
                <h2>Goal</h2>
                <p>Ship the Kulina catering MVP to 3 pilot offices in Jakarta Selatan by the end of Sprint 15, with QRIS checkout and WhatsApp reminders.</p>
                <h2>Scope</h2>
                <ul><li>Weekly menu + order cut-off at 16.00 WIB</li><li>QRIS and virtual-account payment</li><li>Ops dashboard for the kitchen</li></ul>
                <blockquote>Success = 60% of pilot employees order twice in week one.</blockquote>
              </RichTextContainer>
            </div>
          </ViewSwitcherPanel>

          <ViewSwitcherPanel value="chat" className="flex min-h-0">
            <ChannelSidebar channels={CHANNELS} directs={DIRECTS} activeId={channel} onSelect={setChannel} className="hidden w-56 shrink-0 border-r border-subtle md:flex" />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3" role="log" aria-label={`Messages in #${CHANNELS.find((c) => c.id === channel)?.name}`} aria-live="polite">
                <MessageDivider label="Today" />
                {messages.map((m, i) => (
                  <MessageBubble key={m.id} message={m} own={m.author.id === "u1"} continued={i > 0 && messages[i - 1].author.id === m.author.id} onOpenTask={setOpenId} onOpenThread={() => toast("Thread opened")} onReact={() => undefined} />
                ))}
              </div>
              <ChatInputBar
                members={MEMBERS} tasks={LINKABLE_TASKS} channelName={CHANNELS.find((c) => c.id === channel)?.name}
                onSend={({ text }) => setMessages((ms) => [...ms, { id: `m${Date.now()}`, author: MEMBERS[0], body: text, sentAt: new Date().toISOString(), status: "sent" }])}
                className="border-t border-subtle"
              />
            </div>
          </ViewSwitcherPanel>
        </ViewSwitcherBar>
      </div>

      {/* Task detail sheet */}
      <Sheet open={!!open} onOpenChange={(o) => !o && setOpenId(null)}>
        <SheetContent side="right" size="lg">
          {open && (
            <>
              <SheetHeader>
                <p className="font-mono text-xs text-subtle">{open.key} · {open.list ?? "Sprint 14"}</p>
                <SheetTitle>{open.title}</SheetTitle>
                <SheetDescription>Task details, fields and time tracking.</SheetDescription>
              </SheetHeader>
              <SheetBody className="grid content-start gap-6">
                <dl className="grid grid-cols-[120px_1fr] items-center gap-x-4 gap-y-2 text-sm">
                  <dt className="text-subtle">Status</dt><dd><TaskStatusPicker value={open.status} onChange={(s) => patch(open.id, { status: s })} /></dd>
                  <dt className="text-subtle">Assignees</dt><dd><TaskAssigneePicker value={open.assignees} members={MEMBERS} onChange={(a) => patch(open.id, { assignees: a })} /></dd>
                  <dt className="text-subtle">Priority</dt><dd><TaskPriorityPicker value={open.priority} onChange={(p) => patch(open.id, { priority: p })} showLabel /></dd>
                  <dt className="text-subtle">Due date</dt><dd><TaskDatePicker value={open.dueDate} onChange={(d) => patch(open.id, { dueDate: d })} done={open.status === "complete"} /></dd>
                </dl>
                <TimeTrackerWidget
                  taskTitle={open.title}
                  estimate={open.timeEstimate ?? 240}
                  entries={entries}
                  runningSince={runningSince}
                  onStart={() => setRunningSince(new Date().toISOString())}
                  onStop={(minutes) => { setRunningSince(null); setEntries((es) => [{ id: `e${Date.now()}`, minutes: Math.max(1, minutes), at: new Date().toISOString(), source: "timer" }, ...es]); toast.success(`Logged ${Math.max(1, minutes)}m`); }}
                  onAddManual={({ minutes, note }) => setEntries((es) => [{ id: `e${Date.now()}`, minutes, note, at: new Date().toISOString(), source: "manual" }, ...es])}
                  onDeleteEntry={(id) => setEntries((es) => es.filter((e) => e.id !== id))}
                />
                <p className="flex items-center gap-2 text-xs text-subtle"><Timer aria-hidden className="size-3.5" />{trackedMinutes} min tracked across {entries.length} entries</p>
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CommandPalette items={commands} open={cmdOpen} onOpenChange={setCmdOpen} />
    </div>
  );
}
