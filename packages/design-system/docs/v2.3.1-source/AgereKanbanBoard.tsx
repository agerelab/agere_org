import * as React from "react";
import {
  AlertTriangle, ArrowUpDown, CalendarDays, CheckSquare, ChevronLeft,
  ChevronRight, ClipboardList, Clock3, Ellipsis, Filter, GripVertical,
  KanbanSquare, MoreHorizontal, Paperclip, Plus, Search, Table2, Trash2
} from "lucide-react";

export type AgereKanbanStatus = "red" | "yellow" | "blue" | "green" | "purple";
export type AgereKanbanPriority = "low" | "medium" | "high";
export type AgereKanbanView = "board" | "table" | "calendar";

export interface AgerePropertyTag {
  id: string;
  label: string;
  status: AgereKanbanStatus;
}

export interface AgereKanbanCard {
  id: string;
  title: string;
  description?: string;
  tags?: AgerePropertyTag[];
  priority?: AgereKanbanPriority;
  dueDate?: string; // YYYY-MM-DD
  assignee?: {
    id: string;
    name: string;
    avatarUrl?: string;
    initials?: string;
  };
  attachmentCount?: number;
  checklistCount?: number;
  checklistCompleted?: number;
  coverImageUrl?: string;
  metadata?: Record<string, string>;
}

export interface AgereKanbanColumn {
  id: string;
  title: string;
  status?: AgereKanbanStatus;
  cards: AgereKanbanCard[];
  collapsed?: boolean;
}

export interface AgereKanbanMove {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  fromIndex: number;
  toIndex: number;
}

export interface AgereKanbanProps {
  columns: AgereKanbanColumn[];
  initialView?: AgereKanbanView;
  className?: string;
  readOnly?: boolean;
  onCardClick?: (cardId: string) => void;
  onCardMove?: (move: AgereKanbanMove) => void;
  onColumnCreate?: () => void;
  onCardCreate?: (columnId?: string) => void;
  onColumnRename?: (columnId: string, title: string) => void;
  onColumnDelete?: (columnId: string) => void;
  onColumnCollapse?: (columnId: string, collapsed: boolean) => void;
  onViewChange?: (view: AgereKanbanView) => void;
  onSearchChange?: (query: string) => void;
  onFilterClick?: () => void;
  onSortClick?: () => void;
}

const STATUS_CLASS: Record<AgereKanbanStatus, string> = {
  red: "border-red-400/30 bg-red-500/10 text-red-300",
  yellow: "border-amber-400/30 bg-amber-500/10 text-amber-300",
  blue: "border-blue-400/30 bg-blue-500/10 text-blue-300",
  green: "border-green-400/30 bg-green-500/10 text-green-300",
  purple: "border-purple-400/30 bg-purple-500/10 text-purple-300",
};
const STATUS_DOT: Record<AgereKanbanStatus, string> = {
  red: "bg-red-400", yellow: "bg-amber-400", blue: "bg-blue-400",
  green: "bg-green-400", purple: "bg-purple-400",
};
const PRIORITY_CLASS: Record<AgereKanbanPriority, string> = {
  low: "text-white/40", medium: "text-amber-300", high: "text-[#f59e0b]",
};
const PRIORITY_LABEL: Record<AgereKanbanPriority, string> = {
  low: "Low", medium: "Medium", high: "High",
};
const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

function isOverdue(dueDate?: string) {
  if (!dueDate) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(`${dueDate}T00:00:00`) < today;
}
function formatDueDate(value?: string) {
  return value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`)) : null;
}

function AgereTag({ tag }: { tag: AgerePropertyTag }) {
  return <span className={cx("inline-flex max-w-[130px] items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium leading-none", STATUS_CLASS[tag.status])}>
    <span className="truncate">{tag.label}</span>
  </span>;
}

function AgereAvatar({ assignee }: { assignee: NonNullable<AgereKanbanCard["assignee"]> }) {
  if (assignee.avatarUrl) return <img src={assignee.avatarUrl} alt={assignee.name} className="h-5 w-5 rounded-full object-cover ring-1 ring-white/10" />;
  const initials = assignee.initials ?? assignee.name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
  return <span title={assignee.name} aria-label={assignee.name} className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[9px] font-semibold text-white/70 ring-1 ring-white/10">{initials}</span>;
}

export interface AgereKanbanCardProps {
  card: AgereKanbanCard;
  onClick?: () => void;
  onDragStart?: (event: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnd?: () => void;
}

export function AgereKanbanCard({ card, onClick, onDragStart, onDragEnd }: AgereKanbanCardProps) {
  const overdue = isOverdue(card.dueDate);
  return <button type="button" draggable onClick={onClick} onDragStart={onDragStart} onDragEnd={onDragEnd}
    aria-label={`Open ${card.title}`}
    className="group/card relative w-full overflow-hidden rounded-lg border border-[#2d2d2d] bg-[#252525] text-left shadow-sm transition-[background,border,transform,opacity] duration-[120ms] hover:border-[#454545] hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0] active:cursor-grabbing">
    {card.coverImageUrl && <div className="relative h-24 overflow-hidden border-b border-[#2d2d2d]"><img src={card.coverImageUrl} alt="" className="h-full w-full object-cover opacity-90" /><div className="absolute inset-0 bg-gradient-to-t from-[#252525]/70 to-transparent" /></div>}
    <div className="p-3">
      <div className="flex items-start gap-2">
        <GripVertical size={14} aria-hidden className="mt-0.5 shrink-0 text-white/20 opacity-0 transition-opacity group-hover/card:opacity-100" />
        <h3 className="min-w-0 flex-1 truncate text-sm font-medium leading-5 text-white">{card.title}</h3>
        {card.priority === "high" && <AlertTriangle size={14} aria-label="High priority" className="text-[#f59e0b]" />}
      </div>
      {card.tags?.length ? <div className="mt-2 flex flex-wrap gap-1">{card.tags.slice(0, 3).map(tag => <AgereTag key={tag.id} tag={tag} />)}</div> : null}
      <div className="mt-3 flex min-h-5 items-center gap-2 text-[10px] text-white/40">
        {card.priority && <span className={cx("inline-flex items-center gap-1", PRIORITY_CLASS[card.priority])}><span className="h-1.5 w-1.5 rounded-full bg-current" />{PRIORITY_LABEL[card.priority]}</span>}
        {card.dueDate && <span className={cx("inline-flex items-center gap-1", overdue ? "text-red-300" : "text-white/45")}><Clock3 size={12} />{formatDueDate(card.dueDate)}</span>}
        <span className="ml-auto flex items-center gap-2">
          {card.attachmentCount ? <span className="inline-flex items-center gap-1"><Paperclip size={12} />{card.attachmentCount}</span> : null}
          {card.checklistCount ? <span className="inline-flex items-center gap-1"><CheckSquare size={12} />{card.checklistCompleted ?? 0}/{card.checklistCount}</span> : null}
          {card.assignee && <AgereAvatar assignee={card.assignee} />}
        </span>
      </div>
    </div>
  </button>;
}

export interface AgereKanbanColumnProps {
  column: AgereKanbanColumn;
  filteredCards: AgereKanbanCard[];
  readOnly?: boolean;
  isDropTarget?: boolean;
  onCardClick: (cardId: string) => void;
  onCardDragStart: (event: React.DragEvent<HTMLButtonElement>, cardId: string, columnId: string) => void;
  onCardDragEnd: () => void;
  onDropCard: (columnId: string, beforeCardId?: string) => void;
  onQuickAdd: (columnId: string) => void;
  onRename: (columnId: string) => void;
  onDelete: (columnId: string) => void;
  onCollapse: (columnId: string) => void;
}

export function AgereKanbanColumn({ column, filteredCards, readOnly, isDropTarget, onCardClick, onCardDragStart, onCardDragEnd, onDropCard, onQuickAdd, onRename, onDelete, onCollapse }: AgereKanbanColumnProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const activeDrop = isDropTarget || dragOver;

  if (column.collapsed) return <div className={cx("flex w-12 shrink-0 flex-col rounded-xl border border-[#2d2d2d] bg-[#202020]", activeDrop && "border-dashed border-[#62AEF0] bg-[#172536]")}>
    <button type="button" onClick={() => onCollapse(column.id)} aria-label={`Expand ${column.title}`} className="flex min-h-[180px] flex-col items-center gap-3 rounded-xl px-2 py-4 text-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]">
      <ChevronRight size={16} /><span className="text-xs font-medium [writing-mode:vertical-rl]">{column.title}</span><span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px]">{filteredCards.length}</span>
    </button>
  </div>;

  return <section aria-label={`${column.title} column`} className={cx("flex w-[300px] shrink-0 flex-col rounded-xl border border-[#2d2d2d] bg-[#202020] transition-[border,background] duration-[120ms]", activeDrop && "border-dashed border-[#62AEF0] bg-[#1b2530]")}
    onDragOver={e => { e.preventDefault(); if (!readOnly) setDragOver(true); }}
    onDragLeave={() => setDragOver(false)}
    onDrop={e => { e.preventDefault(); setDragOver(false); if (readOnly) return; const id = e.dataTransfer.getData("application/agere-kanban-card"); if (id) onDropCard(column.id); }}>
    <header className="flex h-11 items-center gap-2 border-b border-[#2d2d2d] px-3">
      <span aria-hidden className={cx("h-2 w-2 shrink-0 rounded-full", STATUS_DOT[column.status ?? "blue"])} />
      <h2 className="min-w-0 flex-1 truncate text-xs font-semibold text-white/80">{column.title}</h2>
      <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/45">{filteredCards.length}</span>
      {!readOnly && <>
        <button type="button" onClick={() => onQuickAdd(column.id)} aria-label={`Add card to ${column.title}`} className="inline-flex h-6 w-6 items-center justify-center rounded-md text-white/35 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]"><Plus size={14} /></button>
        <div className="relative">
          <button type="button" onClick={() => setMenuOpen(v => !v)} aria-label={`${column.title} column menu`} aria-expanded={menuOpen} className="inline-flex h-6 w-6 items-center justify-center rounded-md text-white/35 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]"><MoreHorizontal size={14} /></button>
          {menuOpen && <div className="absolute right-0 top-8 z-50 w-44 rounded-lg border border-[#2d2d2d] bg-[#202020] p-1 shadow-2xl">
            <button type="button" onClick={() => { setMenuOpen(false); onRename(column.id); }} className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-xs text-white/70 hover:bg-white/10 hover:text-white"><Ellipsis size={14} /> Rename</button>
            <button type="button" onClick={() => { setMenuOpen(false); onCollapse(column.id); }} className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-xs text-white/70 hover:bg-white/10 hover:text-white"><ChevronLeft size={14} /> Collapse Column</button>
            <button type="button" onClick={() => { setMenuOpen(false); onDelete(column.id); }} className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-xs text-red-300 hover:bg-red-500/10"><Trash2 size={14} /> Delete</button>
          </div>}
        </div>
      </>}
    </header>
    <div className={cx("min-h-[180px] flex-1 space-y-2 overflow-y-auto p-2", activeDrop && "rounded-b-xl ring-1 ring-inset ring-[#62AEF0]/40")}>
      {filteredCards.map(card => <div key={card.id} onDragOver={e => { e.preventDefault(); e.stopPropagation(); }} onDrop={e => { e.preventDefault(); e.stopPropagation(); const id = e.dataTransfer.getData("application/agere-kanban-card"); if (id && id !== card.id && !readOnly) onDropCard(column.id, card.id); }}>
        <AgereKanbanCard card={card} onClick={() => onCardClick(card.id)} onDragStart={e => onCardDragStart(e, card.id, column.id)} onDragEnd={onCardDragEnd} />
      </div>)}
      {!filteredCards.length && <div className={cx("flex min-h-24 items-center justify-center rounded-lg border border-dashed border-[#2d2d2d]", activeDrop && "border-[#62AEF0] bg-[#62AEF0]/5")}><span className="text-[11px] text-white/25">{activeDrop ? "Drop card here" : "No cards"}</span></div>}
    </div>
    {!readOnly && <button type="button" onClick={() => onQuickAdd(column.id)} className="m-2 inline-flex h-8 items-center justify-center gap-1.5 rounded-md text-xs text-white/35 hover:bg-white/5 hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]"><Plus size={14} /> Add card</button>}
  </section>;
}

export interface AgereKanbanToolbarProps {
  view: AgereKanbanView;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  onSortClick: () => void;
  onViewChange: (view: AgereKanbanView) => void;
  onNewColumn: () => void;
  onNewCard: () => void;
}

export function AgereKanbanToolbar({ view, searchQuery, onSearchChange, onFilterClick, onSortClick, onViewChange, onNewColumn, onNewCard }: AgereKanbanToolbarProps) {
  const views: Array<[AgereKanbanView, string, React.ReactNode]> = [
    ["board", "Board", <KanbanSquare size={14} key="board" />],
    ["table", "Table", <Table2 size={14} key="table" />],
    ["calendar", "Calendar", <CalendarDays size={14} key="calendar" />],
  ];
  return <header className="border-b border-[#2d2d2d] bg-[#202020]">
    <div className="flex min-h-14 flex-wrap items-center gap-2 px-4 py-2">
      <div className="flex min-w-[150px] flex-1 items-center gap-2"><ClipboardList size={16} className="text-white/45" /><h1 className="text-sm font-semibold text-white">Board</h1></div>
      <label className="relative hidden sm:block"><Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-white/35" /><input value={searchQuery} onChange={e => onSearchChange(e.target.value)} placeholder="Search" aria-label="Search board" className="h-8 w-44 rounded-md border border-[#2d2d2d] bg-[#191919] pl-8 pr-2 text-xs text-white placeholder:text-white/30 focus:border-[#62AEF0] focus:outline-none focus:ring-1 focus:ring-[#62AEF0]" /></label>
      <button type="button" onClick={onFilterClick} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#2d2d2d] px-2.5 text-xs text-white/65 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]"><Filter size={14} /><span className="hidden md:inline">Filter</span></button>
      <button type="button" onClick={onSortClick} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#2d2d2d] px-2.5 text-xs text-white/65 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]"><ArrowUpDown size={14} /><span className="hidden md:inline">Sort</span></button>
      <div role="tablist" aria-label="Board views" className="flex items-center gap-1">
        {views.map(([id, label, icon]) => <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => onViewChange(id)} className={cx("inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]", view === id ? "bg-white/10 text-white" : "text-white/45 hover:bg-white/5 hover:text-white/80")}>{icon}<span className="hidden lg:inline">{label}</span></button>)}
      </div>
      <button type="button" onClick={onNewColumn} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#2d2d2d] px-2.5 text-xs font-medium text-white/70 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]"><Plus size={14} /><span className="hidden xl:inline">New Column</span></button>
      <button type="button" onClick={onNewCard} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#0075DE] px-3 text-xs font-semibold text-white hover:bg-[#0064BF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#202020]"><Plus size={14} /> New Card</button>
    </div>
  </header>;
}

export function AgereKanbanBoard({
  columns, initialView = "board", className, readOnly = false,
  onCardClick = () => undefined, onCardMove = () => undefined,
  onColumnCreate = () => undefined, onCardCreate = () => undefined,
  onColumnRename = () => undefined, onColumnDelete = () => undefined,
  onColumnCollapse = () => undefined, onViewChange = () => undefined,
  onSearchChange = () => undefined, onFilterClick = () => undefined,
  onSortClick = () => undefined,
}: AgereKanbanProps) {
  const [view, setView] = React.useState<AgereKanbanView>(initialView);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dragged, setDragged] = React.useState<{ cardId: string; columnId: string } | null>(null);
  const [dropTarget, setDropTarget] = React.useState<string | null>(null);

  const filteredColumns = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return columns;
    return columns.map(column => ({
      ...column,
      cards: column.cards.filter(card =>
        [card.title, card.description, ...(card.tags?.map(tag => tag.label) ?? [])]
          .filter(Boolean).some(value => value!.toLowerCase().includes(q))
      ),
    }));
  }, [columns, searchQuery]);

  const move = (toColumnId: string, beforeCardId?: string) => {
    if (!dragged || readOnly) return;
    const source = columns.find(c => c.id === dragged.columnId);
    const target = columns.find(c => c.id === toColumnId);
    if (!source || !target) return;
    const fromIndex = source.cards.findIndex(c => c.id === dragged.cardId);
    if (fromIndex < 0) return;
    let toIndex = target.cards.length;
    if (beforeCardId) {
      const found = target.cards.findIndex(c => c.id === beforeCardId);
      if (found >= 0) toIndex = found;
    }
    onCardMove({ cardId: dragged.cardId, fromColumnId: dragged.columnId, toColumnId, fromIndex, toIndex });
    setDragged(null); setDropTarget(null);
  };

  return <section data-agere-component="kanban-board" className={cx("flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#2d2d2d] bg-[#191919] text-white", className)}>
    <AgereKanbanToolbar view={view} searchQuery={searchQuery}
      onSearchChange={q => { setSearchQuery(q); onSearchChange(q); }}
      onFilterClick={onFilterClick} onSortClick={onSortClick}
      onViewChange={v => { setView(v); onViewChange(v); }}
      onNewColumn={onColumnCreate} onNewCard={() => onCardCreate()} />
    {view === "board" ? <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden p-4">
      <div className="flex min-h-[520px] items-start gap-3">
        {filteredColumns.map(column => <AgereKanbanColumn key={column.id} column={column} filteredCards={column.cards}
          readOnly={readOnly} isDropTarget={dropTarget === column.id} onCardClick={onCardClick}
          onCardDragStart={(event, cardId, columnId) => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("application/agere-kanban-card", cardId); setDragged({ cardId, columnId }); setDropTarget(columnId); }}
          onCardDragEnd={() => { setDragged(null); setDropTarget(null); }}
          onDropCard={move} onQuickAdd={onCardCreate} onRename={onColumnRename}
          onDelete={onColumnDelete} onCollapse={onColumnCollapse} />)}
        {!readOnly && <button type="button" onClick={onColumnCreate} className="flex h-12 w-[300px] shrink-0 items-center justify-center gap-2 rounded-xl border border-dashed border-[#2d2d2d] text-xs text-white/35 hover:border-[#454545] hover:bg-white/[0.02] hover:text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]"><Plus size={15} /> New column</button>}
      </div>
    </div> : <div className="flex min-h-[520px] items-center justify-center border-t border-[#2d2d2d]">
      <div className="text-center">{view === "table" ? <Table2 size={20} className="mx-auto mb-2 text-white/40" /> : <CalendarDays size={20} className="mx-auto mb-2 text-white/40" />}
        <p className="text-sm font-medium text-white/70">{view === "table" ? "Table View" : "Calendar View"}</p>
        <p className="mt-1 text-xs text-white/35">Connect the corresponding Agere database pattern here.</p>
      </div>
    </div>}
    <footer className="flex h-9 items-center justify-between border-t border-[#2d2d2d] bg-[#202020] px-3 text-[11px] text-white/35">
      <span>{filteredColumns.reduce((sum, column) => sum + column.cards.length, 0)} cards</span><span>Agere DS v2.3 · Kanban Board</span>
    </footer>
  </section>;
}

/**
 * Production integration note:
 * This component owns presentation + drag interaction.
 * Persisting status/order, permissions, stale data, conflicts, rollback,
 * loading/error/recovery states remain application/shared-state concerns.
 */
