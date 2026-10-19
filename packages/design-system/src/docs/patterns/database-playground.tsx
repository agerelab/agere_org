import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { FolderInput, Home, ListChecks, MessageSquare, MoreHorizontal, Star, Trash2 } from "lucide-react";

import {
  AgereButton, Separator,
  // File explorer
  FileExplorer, FileExplorerSidebar, FileExplorerNavSection, FileExplorerNavItem, FileExplorerTree, FileExplorerMain,
  FileExplorerCommandBar, FileExplorerCanvas, FileExplorerGroup, FileExplorerStatusBar, FileExplorerDropOverlay, UploadManager, groupByRecency,
  // Kanban
  Kanban, KanbanHeader, KanbanSpaceContext, KanbanToolbar, KanbanBoard, KanbanColumn, KanbanCard,
  // Calendar
  Calendar, CalendarHeader, CalendarGrid,
  // Table
  DataTable, DataTableToolbar, DataTableContent, DataTableColumnHeader, EditableCell, createSelectColumn,
  // Drawer
  TaskDrawer, TaskDrawerContent, TaskDrawerHeader, TaskDrawerBody, TaskDrawerMain, TaskDrawerAside, TaskDrawerTitle,
  TaskDrawerSection, TaskDrawerRichText, TaskDrawerChecklist, TaskDrawerComments, TaskDrawerProperties, TaskDrawerProperty,
  StatusPicker, PriorityPicker, AssigneePicker, DueDatePicker, StatusIcon, PriorityIcon, AssigneeIcon, DueDateIcon,
  PropertyTag, PRIORITY_META, ViewSwitcher,
  type AgereDatabaseView, type KanbanColumnData, type KanbanMove, type CalendarItem, type UploadTask,
} from "@/components/agere-ds";
import { STATUSES, files as seedFiles, initialTasks, people, seedUploads, tree, type StatusValue, type Task } from "./data";

/**
 * Pattern: Database views — one task store rendered as Board, Calendar and Table,
 * plus the File Explorer. Migrated from the v3 playground.
 */
export function DatabasePlayground({ section = "database" }: { section?: "database" | "files" }) {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [view, setView] = React.useState<AgereDatabaseView>("board");
  const [openId, setOpenId] = React.useState<string | null>(null);

  const patch = React.useCallback((id: string, changes: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  }, []);

  const createTask = (status: StatusValue = "todo", date?: string) => {
    const id = `t${Date.now()}`;
    setTasks((prev) => [...prev, { id, title: "", description: "", status, priority: "medium", startDate: date ?? new Date().toISOString().slice(0, 10), tags: [], checklist: [], comments: [], attachments: 0 }]);
    setOpenId(id);
  };

  return (
    <div className="flex h-[720px] max-h-[calc(100dvh-8rem)] flex-col">
      {section === "database" && (
        <>
          {view === "board" && <BoardView tasks={tasks} setTasks={setTasks} onOpen={setOpenId} onCreate={createTask} view={view} onViewChange={setView} patch={patch} />}
          {view === "calendar" && <CalendarView tasks={tasks} onOpen={setOpenId} onCreate={createTask} view={view} onViewChange={setView} patch={patch} />}
          {view === "table" && <TableView tasks={tasks} onOpen={setOpenId} view={view} onViewChange={setView} patch={patch} setTasks={setTasks} />}
        </>
      )}
      {section === "files" && <FilesView />}
      <TaskDetail task={tasks.find((t) => t.id === openId)} onClose={() => setOpenId(null)} patch={patch} />
    </div>
  );
}

/* ================================================================== */
/* Board                                                               */
/* ================================================================== */

interface ViewProps {
  tasks: Task[];
  onOpen: (id: string) => void;
  view: AgereDatabaseView;
  onViewChange: (v: AgereDatabaseView) => void;
  patch: (id: string, changes: Partial<Task>) => void;
}

function toCard(t: Task) {
  const assignee = people.find((p) => p.id === t.assigneeId);
  return {
    id: t.id,
    title: t.title || "Untitled",
    tags: t.tags,
    priority: t.priority,
    dueDate: t.endDate ?? t.startDate,
    assignee,
    attachmentCount: t.attachments,
    checklistCount: t.checklist.length,
    checklistCompleted: t.checklist.filter((c) => c.done).length,
  };
}

function BoardView({ tasks, setTasks, onOpen, onCreate, view, onViewChange }: ViewProps & { setTasks: React.Dispatch<React.SetStateAction<Task[]>>; onCreate: (s?: StatusValue) => void }) {
  const [collapsed, setCollapsed] = React.useState<Set<string>>(new Set());
  const columns: KanbanColumnData[] = STATUSES.map((s) => ({
    id: s.value,
    title: s.label,
    status: s.tone,
    collapsed: collapsed.has(s.value),
    limit: s.value === "doing" ? 3 : undefined,
    cards: tasks.filter((t) => t.status === s.value).map(toCard),
  }));

  const handleMove = ({ cardId, toColumnId, toIndex }: KanbanMove) => {
    setTasks((prev) => {
      const moving = prev.find((t) => t.id === cardId)!;
      const rest = prev.filter((t) => t.id !== cardId);
      const updated = { ...moving, status: toColumnId as StatusValue };
      const inTarget = rest.filter((t) => t.status === toColumnId);
      const anchor = inTarget[toIndex];
      const at = anchor ? rest.indexOf(anchor) : rest.length;
      return [...rest.slice(0, at), updated, ...rest.slice(at)];
    });
  };

  return (
    <Kanban
      columns={columns}
      className="flex-1"
      onCardMove={handleMove}
      onCardClick={onOpen}
      onCardCreate={(col) => onCreate(col as StatusValue)}
      onColumnCollapse={(id, c) => setCollapsed((prev) => { const n = new Set(prev); c ? n.add(id) : n.delete(id); return n; })}
      onColumnRename={() => undefined}
    >
      <KanbanHeader>
        <KanbanSpaceContext
          icon="🏢"
          path={["agere", "agere org", "Operations board"]}
          description="Company-wide people and operations work across every Kulina branch."
          members={people}
          actions={<AgereButton variant="ghost" size="icon" aria-label="Space settings"><MoreHorizontal aria-hidden /></AgereButton>}
        />
        <KanbanToolbar view={view} onViewChange={onViewChange} onFilterClick={() => undefined} onSortClick={() => undefined} onNewCard={() => onCreate()} />
      </KanbanHeader>
      <KanbanBoard>
        {columns.map((c) => (
          <KanbanColumn key={c.id} columnId={c.id}>
            {(card) => <KanbanCard card={card} />}
          </KanbanColumn>
        ))}
      </KanbanBoard>
    </Kanban>
  );
}

/* ================================================================== */
/* Calendar                                                            */
/* ================================================================== */

function CalendarView({ tasks, onOpen, onCreate, view, onViewChange, patch }: ViewProps & { onCreate: (s?: StatusValue, date?: string) => void }) {
  const [query, setQuery] = React.useState("");
  const items: CalendarItem[] = tasks
    .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
    .map((t) => ({ id: t.id, title: t.title || "Untitled", startDate: t.startDate, endDate: t.endDate, tags: t.tags }));

  return (
    <Calendar
      items={items}
      className="flex-1"
      maxVisibleItems={2}
      onItemClick={onOpen}
      onQuickAdd={(date) => onCreate("todo", date)}
      onItemMove={({ itemId, startDate, endDate }) => patch(itemId, { startDate, endDate })}
    >
      <CalendarHeader
        title="agere org"
        view={view}
        onViewChange={onViewChange}
        searchValue={query}
        onSearchChange={setQuery}
        onFilterClick={() => undefined}
        onSortClick={() => undefined}
        onNewClick={() => onCreate()}
      />
      <CalendarGrid />
    </Calendar>
  );
}

/* ================================================================== */
/* Table                                                               */
/* ================================================================== */

function TableView({ tasks, onOpen, view, onViewChange, setTasks }: ViewProps & { setTasks: React.Dispatch<React.SetStateAction<Task[]>> }) {
  const columns = React.useMemo<ColumnDef<Task, any>[]>(
    () => [
      createSelectColumn<Task>(),
      { accessorKey: "title", size: 300, meta: { editor: "text", label: "Title" }, header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />, cell: EditableCell },
      {
        accessorKey: "status", size: 150, meta: { editor: "select", label: "Status", options: STATUSES.map((s) => ({ value: s.value, label: s.label })) },
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />, cell: EditableCell,
      },
      {
        accessorKey: "priority", size: 120, meta: { label: "Priority" },
        sortingFn: (a, b) => PRIORITY_META[a.original.priority].rank - PRIORITY_META[b.original.priority].rank,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
        cell: ({ getValue }) => <span className={PRIORITY_META[getValue() as Task["priority"]].className}>{PRIORITY_META[getValue() as Task["priority"]].label}</span>,
      },
      {
        id: "assignee", size: 170, meta: { label: "Assignee" }, accessorFn: (t) => people.find((p) => p.id === t.assigneeId)?.name ?? "",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Assignee" />,
      },
      { accessorKey: "startDate", size: 140, meta: { editor: "date", label: "Date" }, header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />, cell: EditableCell },
      {
        id: "tags", size: 200, enableSorting: false, meta: { label: "Tags" }, header: "Tags",
        cell: ({ row }) => <div className="flex gap-1">{row.original.tags.map((t) => <PropertyTag key={t.id} tag={t} />)}</div>,
      },
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={tasks}
      getRowId={(t) => t.id}
      className="flex-1"
      onCellEdit={(rowId, columnId, value) => setTasks((prev) => prev.map((t) => (t.id === rowId ? { ...t, [columnId]: value } : t)))}
    >
      <DataTableToolbar
        selectionActions={(ids) => (
          <AgereButton variant="destructive-outline" size="sm" onClick={() => setTasks((prev) => prev.filter((t) => !ids.includes(t.id)))}>
            <Trash2 aria-hidden /> Delete {ids.length}
          </AgereButton>
        )}
      >
        <span className="text-sm font-semibold">agere org</span>
        <div className="flex-1" />
        {/* same switcher as Board & Calendar */}
        <ViewSwitcherInline view={view} onViewChange={onViewChange} />
      </DataTableToolbar>
      <DataTableContent caption="agere org tasks" onRowClick={(row) => onOpen(row.id)} />
    </DataTable>
  );
}

function ViewSwitcherInline({ view, onViewChange }: { view: AgereDatabaseView; onViewChange: (v: AgereDatabaseView) => void }) {
  return <ViewSwitcher value={view} onValueChange={onViewChange} label="Table views" />;
}

/* ================================================================== */
/* Task drawer                                                         */
/* ================================================================== */

function TaskDetail({ task, onClose, patch }: { task?: Task; onClose: () => void; patch: (id: string, c: Partial<Task>) => void }) {
  // keep last task during exit animation
  const last = React.useRef<Task | undefined>(task);
  if (task) last.current = task;
  const t = task ?? last.current;

  return (
    <TaskDrawer open={!!task} onOpenChange={(o) => !o && onClose()}>
      {t && (
        <TaskDrawerContent>
          <TaskDrawerHeader context="agere org / Operations board" />
          <TaskDrawerBody>
            <TaskDrawerMain>
              <TaskDrawerTitle value={t.title} onValueChange={(title) => patch(t.id, { title })} autoFocus={!t.title} />
              <TaskDrawerRichText value={t.description} onValueChange={(description) => patch(t.id, { description })} />
              <TaskDrawerSection title="Checklist" icon={<ListChecks aria-hidden />}>
                <TaskDrawerChecklist
                  items={t.checklist}
                  onToggle={(id, done) => patch(t.id, { checklist: t.checklist.map((c) => (c.id === id ? { ...c, done } : c)) })}
                  onAdd={(label) => patch(t.id, { checklist: [...t.checklist, { id: `c${Date.now()}`, label, done: false }] })}
                  onRemove={(id) => patch(t.id, { checklist: t.checklist.filter((c) => c.id !== id) })}
                />
              </TaskDrawerSection>
              <Separator />
              <TaskDrawerSection title="Comments" icon={<MessageSquare aria-hidden />} meta={t.comments.length || undefined}>
                <TaskDrawerComments
                  currentUser={people[0]}
                  comments={t.comments.map((c) => ({ ...c, author: people.find((p) => p.id === c.authorId)! }))}
                  onSubmit={(body) => patch(t.id, { comments: [...t.comments, { id: `m${Date.now()}`, authorId: "u1", body, createdAt: new Date().toISOString() }] })}
                />
              </TaskDrawerSection>
            </TaskDrawerMain>
            <TaskDrawerAside>
              <TaskDrawerProperties>
                <TaskDrawerProperty label="Status" icon={<StatusIcon aria-hidden />}>
                  <StatusPicker value={t.status} options={[...STATUSES]} onValueChange={(v) => patch(t.id, { status: v as StatusValue })} />
                </TaskDrawerProperty>
                <TaskDrawerProperty label="Assignee" icon={<AssigneeIcon aria-hidden />}>
                  <AssigneePicker value={t.assigneeId} people={people} onValueChange={(assigneeId) => patch(t.id, { assigneeId })} />
                </TaskDrawerProperty>
                <TaskDrawerProperty label="Priority" icon={<PriorityIcon aria-hidden />}>
                  <PriorityPicker value={t.priority} onValueChange={(priority) => patch(t.id, { priority })} />
                </TaskDrawerProperty>
                <TaskDrawerProperty label="Due date" icon={<DueDateIcon aria-hidden />}>
                  <DueDatePicker value={t.endDate ?? t.startDate} onValueChange={(v) => v && patch(t.id, t.endDate ? { endDate: v } : { startDate: v })} />
                </TaskDrawerProperty>
              </TaskDrawerProperties>
              {t.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1">{t.tags.map((g) => <PropertyTag key={g.id} tag={g} size="md" />)}</div>
              )}
            </TaskDrawerAside>
          </TaskDrawerBody>
        </TaskDrawerContent>
      )}
    </TaskDrawer>
  );
}

/* ================================================================== */
/* Files                                                               */
/* ================================================================== */

function FilesView() {
  const [active, setActive] = React.useState("home");
  const [uploads, setUploads] = React.useState<UploadTask[]>(seedUploads);
  const groups = groupByRecency(seedFiles);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // simulate progress for the demo
  React.useEffect(() => {
    const id = setInterval(() => {
      setUploads((prev) => prev.map((u) => (u.status === "uploading" ? (u.progress >= 100 ? { ...u, status: "success", progress: 100 } : { ...u, progress: Math.min(100, u.progress + 9) }) : u)));
    }, 500);
    return () => clearInterval(id);
  }, []);

  const addFiles = (list: File[]) =>
    setUploads((prev) => [...prev, ...list.map((f, i) => ({ id: `${Date.now()}-${i}`, name: f.name, size: f.size, progress: 0, status: "uploading" as const }))]);

  return (
    <FileExplorer className="flex-1" onFilesDrop={addFiles} onMoveItems={(ids, target) => console.info("move", ids, "→", target)}>
      <FileExplorerSidebar>
        <FileExplorerNavSection label="Navigation">
          <FileExplorerNavItem icon={<Home aria-hidden />} active={active === "home"} onClick={() => setActive("home")}>Home</FileExplorerNavItem>
          <FileExplorerNavItem icon={<Star aria-hidden />} active={active === "quick"} onClick={() => setActive("quick")}>Quick access</FileExplorerNavItem>
        </FileExplorerNavSection>
        <FileExplorerNavSection label="Projects">
          <FileExplorerTree nodes={tree} activeId={active} onSelect={setActive} defaultExpanded={["p-org"]} label="Projects" />
        </FileExplorerNavSection>
      </FileExplorerSidebar>

      <FileExplorerMain>
        <FileExplorerCommandBar
          onUploadClick={() => inputRef.current?.click()}
          selectionActions={
            <>
              <AgereButton variant="ghost" size="sm"><FolderInput aria-hidden /> Move</AgereButton>
              <AgereButton variant="ghost" size="sm" className="text-destructive"><Trash2 aria-hidden /> Delete</AgereButton>
            </>
          }
        />
        <input ref={inputRef} type="file" multiple hidden onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))} />
        <FileExplorerCanvas>
          {groups.map((g) => <FileExplorerGroup key={g.id} title={g.title} items={g.items} />)}
        </FileExplorerCanvas>
        <FileExplorerStatusBar>
          <span>{seedFiles.length} items</span>
          <span>Drag files onto a project to move them</span>
        </FileExplorerStatusBar>
      </FileExplorerMain>

      <FileExplorerDropOverlay />
      <UploadManager
        uploads={uploads}
        onRetry={(id) => setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, status: "uploading", error: undefined } : u)))}
        onCancel={(id) => setUploads((prev) => prev.filter((u) => u.id !== id))}
        onDismiss={() => setUploads([])}
      />
    </FileExplorer>
  );
}
