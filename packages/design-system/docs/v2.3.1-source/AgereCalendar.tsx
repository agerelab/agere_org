import * as React from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  ArrowUpDown,
  LayoutGrid,
  Table2,
  KanbanSquare,
} from "lucide-react";

/**
 * Agere Design System v2.3
 * Notion-Style Calendar View
 *
 * Dependencies:
 *   react
 *   lucide-react
 *   tailwindcss
 *
 * The component intentionally uses semantic Tailwind utilities where possible.
 * File Explorer-specific dark values are scoped to this component surface:
 *   canvas:  #191919
 *   surface: #202020
 *   border:  #2d2d2d
 *   amber:   #f59e0b
 *
 * Amber is categorical (deadline/folder-like metadata), not a structural CTA.
 */

export type AgereCalendarStatus =
  | "red"
  | "yellow"
  | "blue"
  | "green"
  | "purple";

export type AgereCalendarView = "calendar" | "table" | "board";

export interface AgerePropertyTag {
  id: string;
  label: string;
  status: AgereCalendarStatus;
}

export interface AgereCalendarItem {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD, inclusive
  tags?: AgerePropertyTag[];
  description?: string;
  metadata?: Record<string, string>;
}

export interface AgereCalendarProps {
  items: AgereCalendarItem[];
  value?: Date;
  initialDate?: Date;
  weekStartsOn?: 1 | 0;
  maxVisibleItems?: number;

  className?: string;
  readOnly?: boolean;

  onPageClick?: (pageId: string) => void;
  onDateChange?: (pageId: string, newDate: string) => void;
  onQuickAdd?: (date: string) => void;

  onViewChange?: (view: AgereCalendarView) => void;
  onFilterClick?: () => void;
  onSortClick?: () => void;
  onSearchChange?: (query: string) => void;
  onNewClick?: () => void;
}

const STATUS_CLASSES: Record<AgereCalendarStatus, string> = {
  red: "border-red-400/30 bg-red-500/10 text-red-300",
  yellow: "border-amber-400/30 bg-amber-500/10 text-amber-300",
  blue: "border-blue-400/30 bg-blue-500/10 text-blue-300",
  green: "border-green-400/30 bg-green-500/10 text-green-300",
  purple: "border-purple-400/30 bg-purple-500/10 text-purple-300",
};

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function startOfCalendarGrid(month: Date): Date {
  const first = startOfMonth(month);
  // JS: Sunday=0. Convert to Monday=0.
  const mondayIndex = (first.getDay() + 6) % 7;
  return addDays(first, -mondayIndex);
}

function endOfCalendarGrid(month: Date): Date {
  return addDays(startOfCalendarGrid(month), 41);
}

function parseDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isDateInRange(date: Date, start: string, end?: string): boolean {
  const current = dateKey(date);
  return current >= start && current <= (end ?? start);
}

function formatMonth(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function AgereCalendarTag({ tag }: { tag: AgerePropertyTag }) {
  return (
    <span
      className={cx(
        "inline-flex max-w-full items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium leading-none",
        STATUS_CLASSES[tag.status]
      )}
    >
      <span className="truncate">{tag.label}</span>
    </span>
  );
}

interface AgereCalendarCardProps {
  item: AgereCalendarItem;
  compact?: boolean;
  onClick?: () => void;
  onDragStart?: (event: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnd?: () => void;
}

export function AgereCalendarCard({
  item,
  compact = false,
  onClick,
  onDragStart,
  onDragEnd,
}: AgereCalendarCardProps) {
  return (
    <button
      type="button"
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      aria-label={`Open ${item.title}`}
      className={cx(
        "group/card relative block w-full overflow-hidden rounded-md border border-[#2d2d2d]",
        "bg-[#202020] text-left transition-colors duration-[120ms]",
        "hover:border-[#454545] hover:bg-[#242424]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]",
        compact ? "px-2 py-1.5" : "px-2.5 py-2"
      )}
    >
      {item.endDate && item.endDate !== item.startDate ? (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-0.5 bg-[#f59e0b]"
        />
      ) : null}

      <div className="min-w-0 pl-0.5">
        <div className="truncate text-xs font-medium text-white">
          {item.title}
        </div>

        {item.tags?.length ? (
          <div className="mt-1 flex min-w-0 flex-wrap gap-1">
            {item.tags.slice(0, compact ? 1 : 2).map((tag) => (
              <AgereCalendarTag key={tag.id} tag={tag} />
            ))}
          </div>
        ) : null}
      </div>
    </button>
  );
}

interface AgereCalendarCellProps {
  date: Date;
  currentMonth: Date;
  items: AgereCalendarItem[];
  today: Date;
  maxVisibleItems: number;
  readOnly?: boolean;
  onPageClick: (pageId: string) => void;
  onQuickAdd: (date: string) => void;
  onDropItem: (pageId: string, date: string) => void;
}

export function AgereCalendarCell({
  date,
  currentMonth,
  items,
  today,
  maxVisibleItems,
  readOnly,
  onPageClick,
  onQuickAdd,
  onDropItem,
}: AgereCalendarCellProps) {
  const [dragOver, setDragOver] = React.useState(false);
  const [overflowOpen, setOverflowOpen] = React.useState(false);
  const key = dateKey(date);
  const isToday = dateKey(today) === key;
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const visibleItems = items.slice(0, maxVisibleItems);
  const overflowItems = items.slice(maxVisibleItems);

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        if (!readOnly) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragOver(false);
        if (readOnly) return;
        const pageId = event.dataTransfer.getData("application/agere-calendar-page");
        if (pageId) onDropItem(pageId, key);
      }}
      className={cx(
        "group relative min-h-[148px] border-b border-r border-[#2d2d2d] p-2",
        "bg-[#191919] transition-colors duration-[120ms]",
        "hover:bg-[#1d1d1d]",
        !isCurrentMonth && "bg-[#171717] text-white/40",
        dragOver && "bg-[#172536] ring-1 ring-inset ring-[#62AEF0]"
      )}
      aria-label={`${key}, ${items.length} calendar item${items.length === 1 ? "" : "s"}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className={cx(
            "inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-medium",
            isToday
              ? "bg-[#f59e0b] text-black"
              : isCurrentMonth
                ? "text-white/80"
                : "text-white/30"
          )}
          aria-current={isToday ? "date" : undefined}
        >
          {date.getDate()}
        </span>

        {!readOnly ? (
          <button
            type="button"
            onClick={() => onQuickAdd(key)}
            aria-label={`Add item on ${key}`}
            className={cx(
              "inline-flex h-6 w-6 items-center justify-center rounded-md",
              "text-white/35 opacity-0 transition-opacity duration-[120ms]",
              "hover:bg-white/10 hover:text-white",
              "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]",
              "group-hover:opacity-100"
            )}
          >
            <Plus size={14} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="space-y-1.5">
        {visibleItems.map((item) => (
          <AgereCalendarCard
            key={item.id}
            item={item}
            compact
            onClick={() => onPageClick(item.id)}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData(
                "application/agere-calendar-page",
                item.id
              );
            }}
          />
        ))}

        {overflowItems.length > 0 ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setOverflowOpen((value) => !value)}
              aria-expanded={overflowOpen}
              className="flex w-full items-center justify-start rounded-md px-2 py-1 text-[11px] font-medium text-white/50 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]"
            >
              + {overflowItems.length} more
            </button>

            {overflowOpen ? (
              <div
                role="dialog"
                aria-label={`More items for ${key}`}
                className="absolute left-0 top-full z-50 mt-1 w-[260px] rounded-lg border border-[#2d2d2d] bg-[#202020] p-2 shadow-2xl"
              >
                <div className="mb-1 flex items-center justify-between px-1">
                  <span className="text-[11px] font-medium text-white/50">
                    {key}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOverflowOpen(false)}
                    className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white"
                    aria-label="Close overflow list"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </div>
                <div className="space-y-1">
                  {overflowItems.map((item) => (
                    <AgereCalendarCard
                      key={item.id}
                      item={item}
                      onClick={() => onPageClick(item.id)}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface AgereCalendarHeaderProps {
  month: Date;
  view: AgereCalendarView;
  searchQuery: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: AgereCalendarView) => void;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  onSortClick: () => void;
  onNewClick: () => void;
}

export function AgereCalendarHeader({
  month,
  view,
  searchQuery,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onSearchChange,
  onFilterClick,
  onSortClick,
  onNewClick,
}: AgereCalendarHeaderProps) {
  const views: Array<[AgereCalendarView, string, React.ReactNode]> = [
    ["calendar", "Calendar", <CalendarDays size={14} key="calendar" />],
    ["table", "Table", <Table2 size={14} key="table" />],
    ["board", "Board", <KanbanSquare size={14} key="board" />],
  ];

  return (
    <header className="border-b border-[#2d2d2d] bg-[#202020]">
      <div className="flex min-h-14 flex-wrap items-center gap-2 px-4 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            onClick={onToday}
            className="hidden h-8 rounded-md border border-[#2d2d2d] px-3 text-xs font-medium text-white/75 hover:bg-white/5 hover:text-white sm:inline-flex sm:items-center"
          >
            Today
          </button>
        </div>

        <div className="min-w-[150px] flex-1">
          <h2 className="text-sm font-semibold text-white">
            {formatMonth(month)}
          </h2>
        </div>

        <div
          role="tablist"
          aria-label="Database views"
          className="order-3 flex w-full items-center gap-1 overflow-x-auto sm:order-none sm:w-auto"
        >
          {views.map(([id, label, icon]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={view === id}
              onClick={() => onViewChange(id)}
              className={cx(
                "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]",
                view === id
                  ? "bg-white/10 text-white"
                  : "text-white/45 hover:bg-white/5 hover:text-white/80"
              )}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <label className="relative hidden md:block">
            <Search
              size={14}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-white/35"
            />
            <input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search"
              aria-label="Search calendar"
              className="h-8 w-36 rounded-md border border-[#2d2d2d] bg-[#191919] pl-8 pr-2 text-xs text-white placeholder:text-white/30 focus:border-[#62AEF0] focus:outline-none focus:ring-1 focus:ring-[#62AEF0]"
            />
          </label>

          <button
            type="button"
            onClick={onFilterClick}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#2d2d2d] px-2.5 text-xs text-white/65 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]"
          >
            <Filter size={14} />
            <span className="hidden lg:inline">Filter</span>
          </button>

          <button
            type="button"
            onClick={onSortClick}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#2d2d2d] px-2.5 text-xs text-white/65 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0]"
          >
            <ArrowUpDown size={14} />
            <span className="hidden lg:inline">Sort</span>
          </button>

          <button
            type="button"
            onClick={onNewClick}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#0075DE] px-3 text-xs font-semibold text-white hover:bg-[#0064BF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62AEF0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#202020]"
          >
            <Plus size={14} />
            New
          </button>
        </div>
      </div>
    </header>
  );
}

export function AgereCalendar({
  items,
  value,
  initialDate = new Date(),
  weekStartsOn = 1,
  maxVisibleItems = 3,
  className,
  readOnly = false,
  onPageClick = () => undefined,
  onDateChange = () => undefined,
  onQuickAdd = () => undefined,
  onViewChange = () => undefined,
  onFilterClick = () => undefined,
  onSortClick = () => undefined,
  onSearchChange = () => undefined,
  onNewClick = () => undefined,
}: AgereCalendarProps) {
  const [month, setMonth] = React.useState<Date>(
    startOfMonth(value ?? initialDate)
  );
  const [view, setView] = React.useState<AgereCalendarView>("calendar");
  const [searchQuery, setSearchQuery] = React.useState("");
  const today = new Date();

  const filteredItems = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
      [item.title, item.description, ...(item.tags?.map((tag) => tag.label) ?? [])]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query))
    );
  }, [items, searchQuery]);

  const visibleStart = startOfCalendarGrid(month);
  const visibleEnd = endOfCalendarGrid(month);

  const calendarDates = React.useMemo(() => {
    const result: Date[] = [];
    let current = visibleStart;
    while (current <= visibleEnd) {
      result.push(current);
      current = addDays(current, 1);
    }
    return result;
  }, [visibleStart, visibleEnd]);

  const itemsForDate = React.useCallback(
    (date: Date) =>
      filteredItems.filter((item) =>
        isDateInRange(date, item.startDate, item.endDate)
      ),
    [filteredItems]
  );

  const moveMonth = (delta: number) => {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  const handleDropItem = (pageId: string, newDate: string) => {
    const item = items.find((candidate) => candidate.id === pageId);
    if (!item || readOnly) return;

    const oldStart = parseDate(item.startDate);
    const oldEnd = parseDate(item.endDate ?? item.startDate);
    const duration =
      Math.max(
        0,
        Math.round(
          (oldEnd.getTime() - oldStart.getTime()) / (24 * 60 * 60 * 1000)
        )
      );

    const nextStart = parseDate(newDate);
    const nextEnd = addDays(nextStart, duration);

    onDateChange(pageId, dateKey(nextEnd) === dateKey(nextStart)
      ? dateKey(nextStart)
      : dateKey(nextStart));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearchChange(query);
  };

  const handleViewChange = (nextView: AgereCalendarView) => {
    setView(nextView);
    onViewChange(nextView);
  };

  return (
    <section
      className={cx(
        "flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#2d2d2d] bg-[#191919] text-white",
        className
      )}
      data-agere-component="calendar"
    >
      <AgereCalendarHeader
        month={month}
        view={view}
        searchQuery={searchQuery}
        onPrevious={() => moveMonth(-1)}
        onNext={() => moveMonth(1)}
        onToday={() => setMonth(startOfMonth(today))}
        onViewChange={handleViewChange}
        onSearchChange={handleSearch}
        onFilterClick={onFilterClick}
        onSortClick={onSortClick}
        onNewClick={onNewClick}
      />

      {view === "calendar" ? (
        <div className="min-w-0 overflow-auto">
          <div className="grid min-w-[760px] grid-cols-7 border-l border-t border-[#2d2d2d]">
            {DAY_NAMES.map((day) => (
              <div
                key={day}
                className="border-b border-r border-[#2d2d2d] bg-[#202020] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white/40"
              >
                {day}
              </div>
            ))}

            {calendarDates.map((date) => (
              <AgereCalendarCell
                key={dateKey(date)}
                date={date}
                currentMonth={month}
                today={today}
                items={itemsForDate(date)}
                maxVisibleItems={maxVisibleItems}
                readOnly={readOnly}
                onPageClick={onPageClick}
                onQuickAdd={onQuickAdd}
                onDropItem={handleDropItem}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[420px] flex-1 items-center justify-center border-t border-[#2d2d2d] bg-[#191919]">
          <div className="max-w-sm px-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[#2d2d2d] bg-[#202020]">
              {view === "table" ? (
                <Table2 size={18} className="text-white/60" />
              ) : (
                <KanbanSquare size={18} className="text-white/60" />
              )}
            </div>
            <h3 className="text-sm font-semibold text-white">
              {view === "table" ? "Table View" : "Board View"}
            </h3>
            <p className="mt-1 text-xs leading-5 text-white/40">
              The view switcher is part of the calendar navigation contract.
              Render the corresponding Agere database pattern here.
            </p>
          </div>
        </div>
      )}

      <footer className="flex h-9 items-center justify-between border-t border-[#2d2d2d] bg-[#202020] px-3 text-[11px] text-white/35">
        <span>
          {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
        </span>
        <span>Agere DS v2.3 · Calendar View</span>
      </footer>
    </section>
  );
}

/**
 * Example:
 *
 * <AgereCalendar
 *   items={[
 *     {
 *       id: "ds-v23",
 *       title: "Agere_Unified_DS_v2.3_Implementation",
 *       startDate: "2026-09-24",
 *       endDate: "2026-09-26",
 *       tags: [{ id: "progress", label: "In Progress", status: "blue" }],
 *     },
 *   ]}
 *   onPageClick={(pageId) => openPage(pageId)}
 *   onDateChange={(pageId, newDate) => updateDatabaseDate(pageId, newDate)}
 *   onQuickAdd={(date) => createPage({ date })}
 * />
 */
