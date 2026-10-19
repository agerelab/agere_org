# Agere DS v2.3 — Interactive Kanban Board

## Canonical placement

`Workspace / Database Patterns / Kanban Board`

The component extends the existing Agere v2.3 baseline. It does not introduce a new token vocabulary.

### Scoped File-Explorer-aligned dark surface
- Canvas: `#191919`
- Column/header surface: `#202020`
- Divider/grid: `#2d2d2d`
- Card surface: `#252525`
- Card hover: `#2a2a2a`
- Priority/deadline accent: `#f59e0b`

Amber is categorical for priority/important states, not the structural primary CTA. Structural actions use Agere Blue.

## Component architecture

- `AgereKanbanBoard`
- `AgereKanbanToolbar`
- `AgereKanbanColumn`
- `AgereKanbanCard`
- `AgereTag`
- `AgereAvatar`

## Interfaces

`AgereKanbanCard`
- id
- title
- description
- tags
- priority
- dueDate
- assignee
- attachmentCount
- checklistCount
- checklistCompleted
- coverImageUrl
- metadata

`AgereKanbanColumn`
- id
- title
- status
- cards
- collapsed

`AgereKanbanProps`
- columns
- initialView
- className
- readOnly
- onCardClick
- onCardMove
- onColumnCreate
- onCardCreate
- onColumnRename
- onColumnDelete
- onColumnCollapse
- onViewChange
- onSearchChange
- onFilterClick
- onSortClick

## Interaction contract

### Toolbar
Search, Filter, Sort, Board/Table/Calendar switcher, New Column, New Card.

### Column
Status indicator, title, count, quick add, menu with Rename/Delete/Collapse.

### Card
Title, semantic tags, priority, due date/overdue state, assignee, attachments, checklist progress, optional cover image.

### Drag and drop
Uses native HTML5 DnD to avoid adding a runtime dependency. The emitted `AgereKanbanMove` contains source/target column and indices, allowing the application layer to persist both status and ordering.

Visual feedback:
- translucent browser drag preview
- dashed drop target
- highlighted destination column
- empty drop zone

### Card click
`onCardClick(cardId)` is intended to open the shared Agere detail drawer/modal pattern.

## Accessibility

- Icon-only controls receive accessible labels.
- Focus-visible uses Agere Blue.
- View switcher uses tab semantics.
- Buttons remain keyboard reachable.
- Status is not communicated by color alone: labels/titles remain present.
- Overdue uses text/icon treatment in addition to red.
- Drag-and-drop should be supplemented by an application-level keyboard reorder/move action for full WCAG 2.2 AA parity; native HTML5 DnD alone does not provide a complete keyboard drag model.

## Production states

Per the v2.3 audit, the consuming pattern should explicitly provide loading, empty, error, permission-restricted, stale, concurrent-update/conflict, technical-failure, retry/recovery, and readonly states. Persistence should be idempotent and support rollback when optimistic movement is used.
