# Agere DS — Workspace Blueprint (ClickUp-class)

**Version:** 4.1.0 · **Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS 3.4 (Agere preset) · Radix UI
**Benchmark:** ClickUp (data-dense, multi-view workspace) + cal.com/apps (integrations catalog)
**Live docs:** docs portal → *Workspace* (`npm run dev`, then `#/workspace`)

> Scope note: the brief mentions an "Antigravity Stack". Nothing in Agere DS depends on it. If it names an
> internal toolchain or Google's Antigravity IDE, add its setup notes to the Next.js page in the portal.

---

## 1. Foundational design tokens (ClickUp density)

Source of truth: `tokens/**/*.json` (W3C DTCG) → Style Dictionary v5 → CSS variables, TS, JSON, Swift, Android, Compose.

### 1.1 Color

| Group | Tokens | Tailwind |
|---|---|---|
| Neutral (cool gray light / true neutral dark) | `bg.{default,muted,subtle,emphasis,inverted}` · `fg.{emphasis,default,subtle,muted,disabled}` · `border.{subtle,default,emphasis,control}` | `bg-muted`, `text-subtle`, `border-subtle` … |
| Workflow status | `task-status.{backlog,todo,in-progress,review,blocked,complete}.{solid,bg,fg}` | `bg-task-status-blocked-bg`, `text-task-status-blocked-fg` |
| Priority | `priority.{urgent,high,normal,low}` | `text-priority-urgent` |
| Semantic | `{info,success,attention,error,special}.{bg,fg,border,solid,on-solid,icon}` | `bg-error-bg text-error-fg` |
| Brand (dynamic) | `brand.{default,emphasis,subtle,fg,accent}` | `bg-brand text-brand-fg` |

**Multi-tenant / white-label:** `data-brand="…"` presets, or `applyBrandColor(el, "#0EA5E9")` at runtime
(auto text color + AA report). In Next.js, render the tenant's `--ag-brand-default` on `<html>` from the server.

**Status never depends on color alone:** each status has its own indicator shape
(dashed ring · ring · ¼ pie · ¾ pie · crossed · filled check) and a text label.
All status badges and priority flags pass WCAG AA in light and dark (see `tests/workspace.test.tsx`).

### 1.2 Typography & density

| Token | Comfortable | Compact | Utility |
|---|---|---|---|
| Row height | 40px | 32px | `h-row` |
| Control height | 32px | 28px | `h-control` |
| Cell padding x / y | 12 / 8px | 8 / 4px | `px-cell-x py-cell-y` |
| Dense text | 14/20 | 13/18 | `text-dense` |
| Gap | 8px | 4px | `gap-dense` |
| Icon | 16px | 14px | `size-dense-icon` |

Switch with `data-density="compact"` on any container (or `setDensity("compact")`). Fonts (v7): Geist Sans Variable (UI, text and display), Geist Mono Variable (IDs, keys, code).

### 1.3 Spacing, elevation, borders, z-index

- **Border-driven panes:** views, sidebars and rows are separated by `border.subtle`; shadows only on floating layers.
- **Radius (v7):** rows square · badges `sm` 4px · controls `control` 6px · chips/pickers and cards `lg` 8px · menus and dialogs `xl` 12px.
- **Z-index ladder:** sticky 20 · header 30 · drawer/sheet 40 · overlay/modal 50 · popover 60 · toast 70 · tooltip 80.

## 2. Architecture (Next.js App Router)

```
apps/web/                              Next.js 16 (a venture)
  app/layout.tsx                       <html data-density class=dark?> from cookies, globals.css
  app/providers.tsx                    "use client" — TooltipProvider, Toaster, CommandPalette
  app/w/[list]/[view]/page.tsx         Server Component: fetch tasks, view in the URL
  app/w/[list]/[view]/workspace-client.tsx   "use client" — ViewSwitcherBar, FilterBar, TaskList, Kanban…
  app/w/[list]/[view]/actions.ts       "use server" — mutations (useOptimistic on the client)
  app/w/[list]/[view]/loading.tsx      SkeletonRegion
  app/w/[list]/[view]/error.tsx        Alert + Retry
packages/ui/ (this repo)
  src/components/ui                    primitives (Button, Input, Sheet, CommandPalette …)
  src/components/agere-ds/workspace    ViewSwitcherBar, FilterBar, TaskRow/TaskList, GanttChart, task fields
  src/components/agere-ds/{kanban,calendar,chat,finance,docs,marketplace}
  src/lib/workspace.ts                 status / priority / view / presence vocabulary
  tailwind.preset.ts · tokens/
```

A working example ships in `examples/next-app` and is verified with `npx next build examples/next-app`.
Components carry `"use client"`; pages stay Server Components.

**Iconography & status indicators:** Lucide (24 grid, 2px stroke) + custom Agere glyphs; `StatusIndicator`
draws status shapes as SVG so they scale with density (`size-dense-icon`).

## 3. Component library

### A. Core atoms & molecules (data-dense)
| Need | Component |
|---|---|
| Button (primary/secondary/ghost→minimal/loading/icon-only/compact) | `Button` (`size="xs"` compact), `IconButton` |
| Input, Search (⌘K), Select/Picker, Checkbox, Radio, Switch | `Input`, `SearchInput`, `CommandPalette` + `CommandTrigger`, `Select`, `Checkbox`, `RadioGroup`, `Switch` |
| Status badge, priority tag, assignee avatars with presence | `StatusBadge`, `StatusIndicator`, `PriorityFlag`, `AssigneeStack`, `MemberAvatar` |
| Tooltip, Popover, Dropdown, Modal, Drawer/Sheet | `Tooltip`, `Popover`, `DropdownMenu`, `Dialog`, `Sheet` |

### B. Workspace core modules
1. **ViewSwitcherBar** — List · Board · Calendar · Gantt · Doc · Chat (+ View), unread badges.
2. **FilterBar** — search, Status/Assignee/Priority filters, Group by, Sort by, density toggle; `applyTaskQuery()`.
3. **TaskList / TaskRow** — grouped, collapsible, inline editing of name (F2), status, assignees, due date, priority, time, custom fields.
4. **KanbanCard** — task key, list, status, priority, progress, subtask/attachment/comment counters, assignee stack; dnd-kit (pointer + keyboard).

### C. Domain modules
1. **Chat:** `MessageBubble` (sent/received, timestamps, threads, reactions, linked tasks, failed + retry), `ChatInputBar` (@user, #task, formatting toggle, attachments), `ChannelSidebar` (unread, mentions, presence).
2. **Ledger, finance & time:** `TimeTrackerWidget` (timer, manual entry, estimate), `FinancialMetricCard` (balance/income/expense/invoice + sparkline), `TransactionTable` (status, category, multi-currency → base currency).
3. **Calendar & scheduling:** `Calendar` (month), `CalendarTimeGrid` (week/day, overlap layout, now line), `EventCard`, `TimeSlotPicker` (cal.com booker).
4. **Docs & files:** `DocTree` (tree view), `DocHeader` (title edit, presence, share/access), `RichTextContainer` (bring-your-own editor), `FileExplorer`.

### D. Marketplace
`AppSearchHeader`, `CategorySidebar`, `AppCard`, `AppDetailSheet` (permissions before install).

## 4. Executable code (in this repo)

| Brief | File | Notes |
|---|---|---|
| `TaskRow.tsx` | `src/components/agere-ds/workspace/task-row.tsx` | `TaskRow` + `TaskList`; every cell is an inline editor |
| `ViewSwitcherBar.tsx` | `src/components/agere-ds/workspace/view-switcher-bar.tsx` | Radix Tabs, roving focus, badges |
| `KanbanCard.tsx` | `src/components/agere-ds/kanban/kanban-card.tsx` | workspace fields on `KanbanCardData` |
| `TimeTrackerWidget.tsx` | `src/components/agere-ds/finance/time-tracker-widget.tsx` | `card` and `bar` variants |

### Usage

```tsx
// app/w/[list]/[view]/workspace-client.tsx
"use client";
import {
  ViewSwitcherBar, ViewSwitcherPanel, FilterBar, TaskList, Kanban, KanbanBoard, KanbanColumn, KanbanCard,
  TimeTrackerWidget, applyTaskQuery, EMPTY_FILTERS,
} from "@agere/design-system";

<ViewSwitcherBar value={view} onValueChange={(v) => router.push(`/w/${list}/${v}`)} badges={{ chat: unread }}>
  <FilterBar search={q} onSearchChange={setQ} filters={f} onFiltersChange={setF} members={members}
    groupBy={groupBy} onGroupByChange={setGroupBy} density={density} onDensityChange={setDensity} />

  <ViewSwitcherPanel value="list">
    <TaskList tasks={applyTaskQuery(tasks, q, f)} members={members} groupBy={groupBy}
      onTaskChange={(id, patch) => mutate(id, patch)} onTaskOpen={openSheet} />
  </ViewSwitcherPanel>

  <ViewSwitcherPanel value="board">
    <Kanban columns={columns} onCardMove={({ cardId, toColumnId }) => mutate(cardId, { status: toColumnId })}>
      <KanbanBoard>{columns.map((c) => <KanbanColumn key={c.id} columnId={c.id}>{(card) => <KanbanCard card={card} />}</KanbanColumn>)}</KanbanBoard>
    </Kanban>
  </ViewSwitcherPanel>
</ViewSwitcherBar>

<TimeTrackerWidget taskTitle={task.title} estimate={240} entries={entries} runningSince={timer.startedAt}
  onStart={timer.start} onStop={(minutes) => logTime(minutes)} onAddManual={logTime} />
```

## 5. State strategy (every view)

| State | List | Board | Calendar / Gantt | Chat |
|---|---|---|---|---|
| Ideal | grouped rows | columns | events / bars | messages |
| Empty | EmptyState + Add task | + Add card | click-to-create grid | prompt |
| Loading | `SkeletonRegion` rows at `h-row` | skeleton cards | skeleton bars | skeleton bubbles |
| Error | Alert + Retry, keep stale data | card snaps back + `toast.error` | Alert + Retry | failed bubble + Retry |
| Edge | filters hide all → “Clear filters” | WIP limit → attention count | undated tasks → “Unscheduled” | offline → “Sending…” queue |

## 6. Accessibility contract
- Views: `tablist`/`tab`/`tabpanel`, ←/→ between views. Lists: table semantics, F2 rename, Esc cancel.
- Pickers announce current value; statuses use shape + text; presence is in avatar names.
- ⌘K palette: combobox + listbox with `aria-activedescendant`; chat composer: multiline textbox + listbox via `aria-activedescendant`.
- Drag-and-drop always has a keyboard path (Space to pick up, arrows to move, Esc to cancel).
- Verified by `tests/workspace.test.tsx` (46 tests incl. axe-core and token contrast).
