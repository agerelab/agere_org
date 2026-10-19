import * as React from "react";
import {
  AppWindow, CalendarClock, ChartGantt, Command, FileText, Filter, Flag, KanbanSquare, ListTodo, MessagesSquare, PanelRight, Rows3, Store, Timer, Wallet,
  CheckCircle2,
} from "lucide-react";

import { TASK_PRIORITIES, TASK_STATUSES, type Density, type TaskStatus, type WorkspaceTask, type WorkspaceView } from "@/lib/workspace";
import { Button } from "@/components/ui/button";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CommandPalette, CommandTrigger } from "@/components/ui/command-palette";
import { toast } from "@/components/ui/toast";
import {
  AssigneeStack, EMPTY_FILTERS, FilterBar, GanttChart, PriorityFlag, StatusBadge, StatusIndicator, TaskList, TaskPriorityPicker, TaskStatusPicker,
  ViewSwitcherBar, ViewSwitcherPanel, applyTaskQuery, type GroupBy, type SortBy, type TaskFilters,
} from "@/components/agere-ds/workspace";
import { KanbanCardContent } from "@/components/agere-ds/kanban";
import { CalendarTimeGrid, TimeSlotPicker } from "@/components/agere-ds/calendar";
import { ChannelSidebar, ChatInputBar, MessageBubble, type ChatMessage } from "@/components/agere-ds/chat";
import { DocHeader, DocTree, RichTextContainer } from "@/components/agere-ds/docs";
import { FinancialMetricCard, TimeTrackerWidget, TransactionTable, type TimeEntry } from "@/components/agere-ds/finance";
import { CHANNELS, CUSTOM_FIELDS, DIRECTS, DOC_TREE, EVENTS, LINKABLE_TASKS, MEMBERS, MESSAGES, TASKS, TRANSACTIONS } from "@/patterns/data";
import { addDays, toDateKey } from "@/lib/date";
import type { ComponentDoc } from "./types";

const Frame = ({ children, className = "h-[420px]" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex w-full flex-col overflow-hidden rounded-xl border border-subtle bg-default ${className}`}>{children}</div>
);

export const workspaceDocs: ComponentDoc[] = [
  /* ------------------------------------------------------------------ */
  {
    id: "task-fields",
    name: "Status, priority & assignees",
    category: "Workspace",
    level: "Atom",
    status: "new",
    icon: Flag,
    summary: "The workflow vocabulary: StatusIndicator (shape per status), StatusBadge, PriorityFlag and AssigneeStack with presence. Every value is carried by shape and text, not color alone.",
    demo: () => (
      <div className="grid gap-5">
        <div className="flex flex-wrap gap-2">{TASK_STATUSES.map((s) => <StatusBadge key={s} status={s} />)}</div>
        <div className="flex flex-wrap items-center gap-4 text-sm">{TASK_PRIORITIES.map((p) => <PriorityFlag key={p} priority={p} showLabel />)}<PriorityFlag showLabel /></div>
        <div className="flex flex-wrap items-center gap-4">
          {TASK_STATUSES.map((s) => <StatusIndicator key={s} status={s} size={18} labelled />)}
          <AssigneeStack members={MEMBERS} max={3} size="md" />
        </div>
      </div>
    ),
    states: () => {
      const [s, setS] = React.useState<TaskStatus>("in-progress");
      const [p, setP] = React.useState<WorkspaceTask["priority"]>("high");
      return <div className="flex items-center gap-4"><TaskStatusPicker value={s} onChange={setS} /><TaskPriorityPicker value={p} onChange={setP} showLabel /></div>;
    },
    code: `import { StatusBadge, PriorityFlag, AssigneeStack, TaskStatusPicker } from "@/components/agere-ds";

<StatusBadge status="in-progress" />
<PriorityFlag priority="urgent" showLabel />
<AssigneeStack members={task.assignees} max={3} />
<TaskStatusPicker value={task.status} onChange={(status) => update({ status })} />`,
    specs: [
      ["Statuses", "backlog · todo · in-progress · review · blocked · complete → task-status.{solid,bg,fg}"],
      ["Status shape", "dashed ring (backlog) · ring · ¼ pie · ¾ pie · crossed (blocked) · filled check (complete)"],
      ["Priorities", "urgent (error) · high (attention) · normal (info) · low (fg.muted, outline flag)"],
      ["Badge", "18/22px, radius.sm, 11px semibold caps"],
      ["Presence", "online success · away attention · busy error · offline hollow"],
    ],
    dos: ["Keep the six statuses; products rename labels, never add colors ad hoc.", "Show priority as a flag + text in pickers; flag-only is fine in dense rows (sr-only label is built in)."],
    donts: ["Don’t invent a 7th status color per space — map to the closest semantic status.", "Don’t use red for anything but Blocked / Urgent / errors."],
    a11y: { role: "Pickers: button → popover listbox", keyboard: [["Enter / Space", "Open picker"], ["↑ / ↓", "Move"], ["Enter", "Select"], ["Esc", "Close"]], notes: ["Picker triggers announce current value (“Status: In progress. Change status”).", "Status shapes differ so color-blind users can tell them apart (WCAG 1.4.1)."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "command-palette",
    name: "Command palette (⌘K) & Sheet",
    category: "Workspace",
    level: "Molecule",
    status: "new",
    icon: Command,
    summary: "⌘K / Ctrl+K search-and-jump across views, tasks and preferences. Sheet is the generic side panel used for Task details and App details.",
    demo: () => {
      const [open, setOpen] = React.useState(false);
      return (
        <div className="flex flex-wrap items-center gap-3">
          <CommandTrigger onClick={() => setOpen(true)} className="w-64" />
          <Sheet>
            <SheetTrigger asChild><Button variant="outline" leadingIcon={<PanelRight />}>Open sheet</Button></SheetTrigger>
            <SheetContent side="right" size="md">
              <SheetHeader><SheetTitle>Checkout flow QA</SheetTitle><SheetDescription>KUL-142 · Sprint 14</SheetDescription></SheetHeader>
              <SheetBody><p className="text-sm text-subtle">Sheets hold task details, app details and filters without losing the list behind them.</p></SheetBody>
              <SheetFooter><Button>Mark complete</Button></SheetFooter>
            </SheetContent>
          </Sheet>
          <CommandPalette
            open={open}
            onOpenChange={setOpen}
            hotkey={false}
            items={[
              { id: "l", group: "Views", label: "Go to List", icon: <ListTodo />, onSelect: () => toast("List") },
              { id: "b", group: "Views", label: "Go to Board", icon: <KanbanSquare />, onSelect: () => toast("Board") },
              ...TASKS.slice(0, 5).map((t) => ({ id: t.id, group: "Tasks", label: t.title, hint: t.key, icon: <CheckCircle2 />, onSelect: () => toast(`Open ${t.key}`) })),
              { id: "d", group: "Preferences", label: "Toggle compact density", icon: <Rows3 />, shortcut: "⇧D", onSelect: () => toast("Density toggled") },
            ]}
          />
        </div>
      );
    },
    code: `<CommandPalette items={commands} />            // binds ⌘K / Ctrl+K globally
<CommandTrigger onClick={() => setOpen(true)} /> // visible search button with ⌘K hint

<Sheet open={!!taskId} onOpenChange={(o) => !o && close()}>
  <SheetContent side="right" size="lg">
    <SheetHeader><SheetTitle>{task.title}</SheetTitle></SheetHeader>
    <SheetBody>…</SheetBody>
  </SheetContent>
</Sheet>`,
    specs: [["Palette", "Dialog, 640px max, radius.2xl, grouped listbox, 36px options"], ["Sheet sizes", "sm 400 · md 520 · lg 680 · xl 880; sides right / left / bottom (mobile)"]],
    dos: ["Every palette action must also exist in visible UI.", "Group results (Views, Tasks, People, Preferences); show the task key as a hint."],
    donts: ["Don’t bind single-letter shortcuts without modifiers (WCAG 2.1.4).", "Don’t nest a sheet inside a dialog."],
    a11y: { role: "dialog > combobox + listbox (aria-activedescendant) · Sheet = modal dialog", keyboard: [["⌘K / Ctrl+K", "Open palette"], ["↑ / ↓", "Move"], ["Enter", "Run"], ["Esc", "Close, focus returns"]], notes: ["Focus stays in the input while the active option is announced.", "Sheet traps focus and returns it to the row that opened it."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "view-switcher-bar",
    name: "ViewSwitcher bar",
    category: "Workspace",
    level: "Molecule",
    status: "new",
    icon: AppWindow,
    summary: "ClickUp view bar: List · Board · Calendar · Gantt · Doc · Chat + “View”. Owns the tab state and renders each view as a ViewSwitcherPanel.",
    demo: () => {
      const [v, setV] = React.useState<WorkspaceView>("board");
      return (
        <Frame className="h-48">
          <ViewSwitcherBar value={v} onValueChange={setV} badges={{ chat: 3 }} onAddView={() => toast("Add view")} actions={<Button size="xs">+ Task</Button>}>
            {(["list", "board", "calendar", "gantt", "doc", "chat"] as WorkspaceView[]).map((x) => (
              <ViewSwitcherPanel key={x} value={x} className="grid place-items-center text-sm text-subtle">{x[0].toUpperCase() + x.slice(1)} view content</ViewSwitcherPanel>
            ))}
          </ViewSwitcherBar>
        </Frame>
      );
    },
    code: `<ViewSwitcherBar value={view} onValueChange={setView} badges={{ chat: 3 }} onAddView={addView}
  actions={<Button size="xs">+ Task</Button>}>
  <ViewSwitcherPanel value="list"><TaskList … /></ViewSwitcherPanel>
  <ViewSwitcherPanel value="board"><Kanban … /></ViewSwitcherPanel>
</ViewSwitcherBar>`,
    specs: [["Height", "44px, border-bottom subtle"], ["Tab", "text-dense 500, icon dense-icon, active = fg.emphasis + 2px brand underline"], ["Badge", "error.solid pill, 10px"]],
    dos: ["Keep the order stable across spaces: List, Board, Calendar, Gantt, Doc, Chat.", "Persist the last view per list (URL segment in Next.js: /l/[listId]/[view])."],
    donts: ["Don’t hide the active view in an overflow menu on mobile — the bar scrolls horizontally instead."],
    a11y: { role: "tablist > tab / tabpanel", keyboard: [["← / →", "Next / previous view"], ["Home / End", "First / last view"]], notes: ["Unread counts are part of the tab name (“3 unread”)."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "filter-bar",
    name: "Filter & grouping bar",
    category: "Workspace",
    level: "Molecule",
    status: "new",
    icon: Filter,
    summary: "Search, Status / Assignee / Priority filters, Group by, Sort by and the Comfortable/Compact density toggle. Pair with applyTaskQuery() for client-side lists.",
    demo: () => {
      const [q, setQ] = React.useState("");
      const [f, setF] = React.useState<TaskFilters>(EMPTY_FILTERS);
      const [g, setG] = React.useState<GroupBy>("status");
      const [s, setS] = React.useState<SortBy>("manual");
      const [d, setD] = React.useState<Density>("comfortable");
      const n = applyTaskQuery(TASKS, q, f, s).length;
      return (
        <Frame className="h-auto">
          <FilterBar search={q} onSearchChange={setQ} filters={f} onFiltersChange={setF} members={MEMBERS} groupBy={g} onGroupByChange={setG} sortBy={s} onSortByChange={setS} density={d} onDensityChange={setD} resultLabel={`${n} tasks`} />
        </Frame>
      );
    },
    code: `const visible = applyTaskQuery(tasks, search, filters, sortBy);

<FilterBar search={search} onSearchChange={setSearch} filters={filters} onFiltersChange={setFilters}
  members={members} groupBy={groupBy} onGroupByChange={setGroupBy} sortBy={sortBy} onSortByChange={setSortBy}
  density={density} onDensityChange={setDensity} resultLabel={\`\${visible.length} tasks\`} />`,
    dos: ["Show active filters as filled chips with a count; offer “Clear”.", "Sync filters to the URL search params so views are shareable."],
    donts: ["Don’t apply filters silently on another view — the bar is per view."],
    a11y: { keyboard: [["Tab", "Search → filters → group → sort → density"], ["Enter / Space", "Open a filter"], ["Space", "Toggle option"]], notes: ["Result count is a polite live region.", "Filter chips announce selected count."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "task-list",
    name: "Task list (TaskRow)",
    category: "Workspace",
    level: "Organism",
    status: "new",
    icon: ListTodo,
    summary: "ClickUp List view: grouped, collapsible, data-dense rows where every cell is an inline editor — name, status, assignees, due date, priority, time and custom fields.",
    demo: () => {
      const [tasks, setTasks] = React.useState(TASKS);
      const [d, setD] = React.useState<Density>("compact");
      return (
        <div className="grid w-full gap-3">
          <div className="flex gap-2"><Button size="xs" variant={d === "compact" ? "primary" : "secondary"} onClick={() => setD("compact")}>Compact</Button><Button size="xs" variant={d === "comfortable" ? "primary" : "secondary"} onClick={() => setD("comfortable")}>Comfortable</Button></div>
          <div data-density={d}>
            <Frame className="h-[440px]">
              <TaskList tasks={tasks} members={MEMBERS} columns={{ assignee: true, due: true, priority: true, time: true, custom: CUSTOM_FIELDS.slice(0, 2) }}
                onTaskChange={(id, p) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, ...p } : t)))} onTaskOpen={(id) => toast(`Open ${id}`)} className="flex-1" />
            </Frame>
          </div>
        </div>
      );
    },
    code: `<div data-density="compact">
  <TaskList tasks={visible} members={members} groupBy="status"
    columns={{ assignee: true, due: true, priority: true, time: true, custom: customFields }}
    onTaskChange={(id, patch) => mutate(id, patch)}   // optimistic update, roll back on error
    onTaskOpen={openSheet} onAddTask={({ key }) => createIn(key)} />
</div>`,
    specs: [["Row", "h-row: 40px comfortable / 32px compact; px-cell-x 12 / 8"], ["Text", "text-dense 14/20 → 13/18"], ["Group header", "status badge + count + collapse, sticky"], ["Columns", "Name flex · Assignee 112 · Due 104 · Priority 96 · Time 96 · Custom 128"]],
    dos: ["Default to Compact for power users; remember the choice per user.", "Right-align numbers and currency; tabular figures."],
    donts: ["Don’t open the task on single click of an editable cell — use the name or the ↗ button."],
    a11y: { role: "table > rowgroup > row > cell (ARIA grid semantics without roving)", keyboard: [["Tab", "Move through cell editors"], ["F2 / Enter", "Rename task"], ["Esc", "Cancel rename"], ["Space", "Toggle row checkbox"]], notes: ["Every picker announces its current value.", "Group collapse buttons use aria-expanded."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "kanban-card-clickup",
    name: "Kanban card (workspace)",
    category: "Workspace",
    level: "Molecule",
    status: "new",
    icon: KanbanSquare,
    summary: "Board card with task key, list, status, priority flag, progress bar, subtask/attachment/comment counters and multiple assignees with presence. Drag-and-drop ready (dnd-kit).",
    demo: () => (
      <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TASKS.slice(0, 3).map((t) => (
          <div key={t.id} className="rounded-lg border border-subtle bg-default shadow-elevation-1">
            <KanbanCardContent card={{ id: t.id, title: t.title, taskKey: t.key, list: t.list, status: t.status, taskPriority: t.priority, assignees: t.assignees, dueDate: t.dueDate, subtasks: t.subtasks, attachmentCount: t.attachments, commentCount: t.comments }} />
          </div>
        ))}
      </div>
    ),
    code: `<KanbanCard card={{
  id, title, taskKey: "KUL-142", list: "Sprint 14", status: "in-progress", taskPriority: "high",
  assignees, dueDate: "2026-09-30", subtasks: { total: 5, done: 3 }, attachmentCount: 2, commentCount: 4,
}} />`,
    dos: ["Show at most 3 avatars + “+N”.", "Use progress only when subtasks or checklist exist."],
    donts: ["Don’t put inline editors on cards — open the Sheet."],
    a11y: { keyboard: [["Space", "Pick up / drop via grip"], ["← / →", "Move between columns"], ["Esc", "Cancel"]], notes: ["The whole card is one button (“Open …”); the grip is a separate draggable control.", "Counters have sr-only labels (“3 of 5 subtasks”)."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "gantt",
    name: "Gantt timeline",
    category: "Workspace",
    level: "Organism",
    status: "beta",
    icon: ChartGantt,
    summary: "Timeline view: sticky task column, day grid with weekend shading, today line, and status-colored bars showing subtask progress.",
    demo: () => <Frame className="h-[380px]"><GanttChart tasks={TASKS} from={toDateKey(addDays(new Date(), -10))} onTaskClick={(id) => toast(`Open ${id}`)} className="min-h-0 flex-1" /></Frame>,
    code: `<GanttChart tasks={tasks} days={42} onTaskClick={openSheet} />`,
    dos: ["Pair with the List view for editing; Gantt is for scheduling at a glance."],
    donts: ["Don’t rely on bar color alone — the bar label includes status and dates."],
    a11y: { role: "grid-like region; each bar is a button", notes: ["Bar names include “start – due, status”.", "Drag-to-reschedule is on the roadmap; until then dates change via the Sheet (keyboard-accessible)."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "calendar-week",
    name: "Calendar week/day & booking slots",
    category: "Domain modules",
    level: "Organism",
    status: "new",
    icon: CalendarClock,
    summary: "Week and Day time grids with overlapping-event layout, now line and click-to-create slots, plus the cal.com-style TimeSlotPicker for booking.",
    demo: () => <Frame className="h-[460px]"><CalendarTimeGrid view="week" date={toDateKey(new Date())} events={EVENTS} onSlotClick={(iso) => toast(`New event ${iso.slice(11, 16)}`)} onEventClick={(id) => toast(`Open ${id}`)} className="min-h-0 flex-1" /></Frame>,
    states: () => {
      const [v, setV] = React.useState<{ date: string; time?: string }>({ date: toDateKey(new Date()) });
      return (
        <div className="w-full max-w-2xl">
          <TimeSlotPicker month={toDateKey(new Date()).slice(0, 7)} value={v} onChange={setV} durationLabel="30 min" getSlots={(d) => (new Date(d).getDay() % 6 === 0 ? [] : ["09.00", "09.30", "10.00", "11.30", "13.00", "14.30", "16.00"])} />
        </div>
      );
    },
    code: `<CalendarTimeGrid view="week" date={today} events={events} onSlotClick={createAt} onEventClick={open} />
<Calendar …>            // month view (v3 module)
<TimeSlotPicker month="2026-09" getSlots={availableSlots} value={v} onChange={setV} durationLabel="30 min" />`,
    dos: ["Show the timezone next to every slot list (WIB / WITA / WIT).", "Tasks with due times render as task events with their status."],
    donts: ["Don’t show unavailable days as clickable."],
    a11y: { keyboard: [["Tab", "Events and slots in time order"], ["Enter", "Open event / pick slot"]], notes: ["Events are buttons named “title, 09.00–10.00”.", "Today and the selected date use aria-current / aria-pressed."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "chat",
    name: "Chat & messaging",
    category: "Domain modules",
    level: "Organism",
    status: "new",
    icon: MessagesSquare,
    summary: "MessageBubble (sent/received, timestamps, threads, reactions, linked tasks, failed/retry), ChatInputBar (@mentions, #task links, formatting toggle, attachments) and ChannelSidebar.",
    demo: () => {
      const [msgs, setMsgs] = React.useState<ChatMessage[]>(MESSAGES.slice(0, 4));
      return (
        <Frame className="h-[480px]">
          <div className="flex min-h-0 flex-1">
            <ChannelSidebar channels={CHANNELS} directs={DIRECTS} activeId={CHANNELS[0].id} onSelect={() => undefined} className="hidden w-52 shrink-0 md:flex" />
            <div className="flex min-w-0 flex-1 flex-col">
              <div role="log" aria-label="Messages" className="min-h-0 flex-1 overflow-y-auto py-2">
                {msgs.map((m, i) => <MessageBubble key={m.id} message={m} own={m.author.id === "u1"} continued={i > 0 && msgs[i - 1].author.id === m.author.id} onOpenThread={() => toast("Thread")} onReact={() => undefined} onOpenTask={(id) => toast(`Open ${id}`)} />)}
              </div>
              <ChatInputBar members={MEMBERS} tasks={LINKABLE_TASKS} channelName={CHANNELS[0].name} onSend={({ text }) => setMsgs((s) => [...s, { id: `m${Date.now()}`, author: MEMBERS[0], body: text, sentAt: new Date().toISOString(), status: "sent" }])} className="border-t border-subtle" />
            </div>
          </div>
        </Frame>
      );
    },
    code: `<ChannelSidebar channels={channels} directs={directs} activeId={id} onSelect={setId} />
<div role="log" aria-live="polite">{messages.map((m) => <MessageBubble key={m.id} message={m} own={m.author.id === me} />)}</div>
<ChatInputBar members={members} tasks={linkableTasks} onSend={({ text, files }) => send(text, files)} />`,
    dos: ["Type @ for people and # for tasks; linked tasks render as a status card inside the message.", "Group consecutive messages from the same author (continued)."],
    donts: ["Don’t auto-scroll when the user has scrolled up — show “New messages” instead."],
    a11y: { role: "log (messages) · multiline textbox with aria-activedescendant → listbox (mentions) · toolbar (formatting)", keyboard: [["Enter", "Send"], ["Shift+Enter", "New line"], ["@ / #", "Open suggestions"], ["↑ / ↓ · Enter / Tab", "Pick suggestion"], ["Esc", "Close suggestions"]], notes: ["Unread and mention counts are in channel names.", "Failed messages use role=alert with a Retry button."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "time-tracker",
    name: "Time tracker",
    category: "Domain modules",
    level: "Molecule",
    status: "new",
    icon: Timer,
    summary: "Start/stop timer, manual entry (“1h 30m”, “90m”, “1.5h”), estimate vs tracked bar and entry history. `variant=\"bar\"` for task headers.",
    demo: () => {
      const [entries, setEntries] = React.useState<TimeEntry[]>([{ id: "a", minutes: 75, at: new Date(Date.now() - 864e5).toISOString(), source: "timer", note: "QRIS sandbox" }]);
      const [running, setRunning] = React.useState<string | null>(null);
      const props = {
        taskTitle: "Checkout flow QA", estimate: 240, entries, runningSince: running,
        onStart: () => setRunning(new Date().toISOString()),
        onStop: (m: number) => { setRunning(null); setEntries((e) => [{ id: `${Date.now()}`, minutes: Math.max(1, m), at: new Date().toISOString(), source: "timer" as const }, ...e]); },
        onAddManual: ({ minutes, note }: { minutes: number; note?: string }) => setEntries((e) => [{ id: `${Date.now()}`, minutes, note, at: new Date().toISOString(), source: "manual" as const }, ...e]),
        onDeleteEntry: (id: string) => setEntries((e) => e.filter((x) => x.id !== id)),
      };
      return <div className="grid w-full max-w-md gap-4"><TimeTrackerWidget {...props} /><TimeTrackerWidget {...props} variant="bar" /></div>;
    },
    code: `<TimeTrackerWidget taskTitle={task.title} estimate={240} entries={entries} runningSince={timer.startedAt}
  onStart={timer.start} onStop={(minutes) => log(minutes)} onAddManual={log} onDeleteEntry={remove} />`,
    dos: ["Persist runningSince server-side so the timer survives reloads and devices.", "Warn at 100% of estimate (attention), not before."],
    donts: ["Don’t announce the clock every second."],
    a11y: { keyboard: [["Enter / Space", "Start / stop"], ["Enter", "Save manual entry"]], notes: ["Button toggles aria-pressed; start/stop is announced once.", "Invalid manual input shows an inline error tied with aria-describedby."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "finance",
    name: "Finance metrics & transactions",
    category: "Domain modules",
    level: "Organism",
    status: "new",
    icon: Wallet,
    summary: "FinancialMetricCard (balance / income / expense / invoices with delta and sparkline) and TransactionTable (status, category, multi-currency with base-currency conversion, pagination).",
    demo: () => (
      <div className="grid w-full gap-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <FinancialMetricCard label="Balance" kind="balance" amount={482_500_000} delta={6.2} trend={[3, 4, 3.6, 4.4, 4.2, 4.8, 5.1]} />
          <FinancialMetricCard label="Income" kind="income" amount={128_400_000} delta={12.1} trend={[2, 2.4, 2.2, 3, 3.3, 3.1, 3.8]} />
          <FinancialMetricCard label="Expenses" kind="expense" amount={96_250_000} delta={8.4} positiveIsGood={false} trend={[2, 2.1, 2.6, 2.4, 2.9, 3.2, 3.3]} />
          <FinancialMetricCard label="Open invoices" kind="invoice" amount={4_800} currency="USD" delta={-3.5} positiveIsGood={false} trend={[5, 4.6, 4.8, 4.2, 4.4, 4.1, 4]} />
        </div>
        <TransactionTable transactions={TRANSACTIONS} baseCurrency="IDR" pageSize={6} />
      </div>
    ),
    code: `<FinancialMetricCard label="Expenses" kind="expense" amount={96_250_000} delta={8.4} positiveIsGood={false} trend={series} />
<TransactionTable transactions={rows} baseCurrency="IDR" pageSize={8} onRowClick={open} />`,
    dos: ["Format with Intl (formatMoney) in the user’s locale; IDR has no decimals.", "Show the original currency and the base-currency equivalent side by side."],
    donts: ["Don’t sum mixed currencies without conversion.", "Don’t color amounts only by sign — income/expense are also labelled."],
    a11y: { role: "table with caption; sparkline is aria-hidden with a text delta", notes: ["Delta includes sr-only “up/down”.", "Status column uses badges with words."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "docs",
    name: "Docs workspace",
    category: "Domain modules",
    level: "Organism",
    status: "new",
    icon: FileText,
    summary: "Nested DocTree (tree view), DocHeader (editable title, breadcrumb, presence avatars, share & access controls) and RichTextContainer (typography + formatting toolbar; bring your own editor).",
    demo: () => {
      const [id, setId] = React.useState("d2");
      const [title, setTitle] = React.useState("MVP launch plan");
      return (
        <Frame className="h-[460px]">
          <div className="flex min-h-0 flex-1">
            <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-subtle bg-muted p-2 md:block"><DocTree nodes={DOC_TREE} activeId={id} onSelect={setId} defaultExpanded={["d1"]} onAddChild={() => toast("New page")} /></aside>
            <div className="min-w-0 flex-1 overflow-y-auto">
              <div className="mx-auto max-w-prose px-6 pt-5"><DocHeader title={title} onTitleChange={setTitle} breadcrumb={["Kulina", "Product specs"]} viewers={MEMBERS.slice(0, 3)} lastEdited={{ by: "Nadia Rahma", at: "5 min ago" }} /></div>
              <RichTextContainer className="mx-auto max-w-prose px-6 pb-8" onCommand={(c) => toast(c)}>
                <h2>Goal</h2><p>Ship the catering MVP to three pilot offices by Sprint 15.</p><ul><li>QRIS checkout</li><li>WhatsApp reminders</li></ul>
              </RichTextContainer>
            </div>
          </div>
        </Frame>
      );
    },
    code: `<DocTree nodes={tree} activeId={docId} onSelect={go} onAddChild={createPage} />
<DocHeader title={doc.title} onTitleChange={rename} viewers={presence} access={doc.access} onAccessChange={share} />
<RichTextContainer onCommand={(cmd) => editor.chain().focus()[cmd]().run()}>
  <EditorContent editor={editor} />   {/* Tiptap / Lexical — the DS stays editor-agnostic */}
</RichTextContainer>`,
    dos: ["Bring your own editor (Tiptap recommended); RichTextContainer supplies typography and the toolbar.", "Show who’s viewing (presence) and when the doc was last edited."],
    donts: ["Don’t make the title a static heading — it’s an inline editable input with a visible focus state."],
    a11y: { role: "tree > treeitem (aria-expanded) · toolbar", keyboard: [["↑ / ↓", "Move"], ["→ / ←", "Expand / collapse"], ["Enter", "Open page"]], notes: ["Share dialog: invite input is labelled; access radio group announces changes."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "marketplace",
    name: "App marketplace",
    category: "Domain modules",
    level: "Organism",
    status: "new",
    icon: Store,
    summary: "AppSearchHeader, CategorySidebar, AppCard and AppDetailSheet — the app-directory and ClickUp Integrations pattern. Full page under Workspace → Marketplace.",
    demo: () => <p className="text-sm text-subtle">See the full interactive page: <a className="font-medium text-emphasis underline underline-offset-2" href="#/workspace/marketplace">Workspace → App marketplace</a>.</p>,
    code: `<AppSearchHeader query={q} onQueryChange={setQ} resultCount={apps.length} />
<CategorySidebar categories={categories} value={cat} onValueChange={setCat} />
<AppCard … onClick={() => setOpenApp(app)} />
<AppDetailSheet app={openApp} open={!!openApp} onOpenChange={…} onInstall={install} />`,
    dos: ["Show permissions before install; keep Install as the single primary action.", "Mark verified publishers."],
    donts: ["Don’t install on card click — open details first."],
    a11y: { notes: ["Category list uses aria-current for the active category.", "Result count is announced politely."] },
  },
];

