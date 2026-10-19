# Agere Design System v2.3.1 — Canonical Aligned Package

This package uses the selected **Agere Design System v2.2 — Canonical Unified Design System** as the visual baseline and extends it with the audited File Explorer Workspace pattern.

## Included

- Canonical Unified Design System + File Explorer audited HTML
- UI/UX audit
- Production hardening notes
- Canonical baseline preserved
- File Explorer integrated as a Workspace pattern

## Design direction

- Warm neutral canvas
- Semantic Agere blue
- Intelligence indigo
- Inter/system typography
- 4px base / 8px rhythm
- 4/8/12/16px radius hierarchy
- Light / Dark themes
- WCAG 2.2 AA baseline
- Semantic-first interaction language

## Audit focus

- Navigation reliability
- Keyboard and focus behavior
- Selection feedback
- Grid/List interaction
- Collapsible groups
- Drag/drop feedback
- Responsive behavior
- Reduced motion
- State coverage
- Token consistency

## Canonical decision

Future components should extend this baseline instead of introducing a separate playground aesthetic.


## Alignment status

This package is aligned to the uploaded v2.3 audited package as the source of truth. The alignment pass is intentionally additive/minimal: it removes environment-specific saved-page metadata and preserves the established canonical visual and UX language.


## Added component — Notion-Style Calendar View

Canonical component added to the v2.3.1 package:
- `AgereCalendar.tsx` — React + TypeScript + Tailwind + Lucide implementation
- `AgereCalendar.spec.md` — component specification, API contract, interaction and accessibility contract

The Calendar View is registered as a Workspace/Database pattern extension and follows the existing v2.3 canonical visual baseline. It does not introduce a new design language.


## Database Pattern: Interactive Kanban Board

Added `AgereKanbanBoard.tsx` and `AgereKanbanBoard.spec.md` as the canonical database/Workspace Kanban pattern.

- Canvas: `#191919`
- Column/header: `#202020`
- Card: `#252525`; hover `#2a2a2a`
- Amber `#f59e0b` reserved for priority/important categorical indication
- Agere Blue remains the structural action/focus color
- Soft semantic status badges: red/yellow/blue/green/purple
- Board/Table/Calendar view contract
- Native HTML5 drag/drop with cross-column move and reorder callbacks
- Card click contract for shared Detail Drawer / Modal
- Production state handling remains at the shared/application state layer
