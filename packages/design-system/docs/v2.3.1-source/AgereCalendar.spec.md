# Agere Design System v2.3 — Notion-Style Calendar View

## Component

`AgereCalendar`

### Composition

- `AgereCalendar`
- `AgereCalendarHeader`
- `AgereCalendarCell`
- `AgereCalendarCard`
- `AgereCalendarTag`

## Source alignment

This component extends the v2.3 canonical baseline rather than introducing a new visual language.

The audited baseline requires:
- preserve the canonical warm-neutral/editorial system
- preserve semantic Agere blue and intelligence indigo
- keep amber categorical rather than using it as a structural CTA
- preserve the existing shell, typography, radius, spacing, shadow, and slim-scrollbar language
- keep File Explorer as a Workspace pattern

For this requested Calendar surface, the File Explorer dark treatment is scoped to the component:
- Canvas: `#191919`
- Header/sidebar surface: `#202020`
- Divider/grid: `#2d2d2d`
- Deadline accent: `#f59e0b`

These values should be promoted into component/theme tokens only if the repository's canonical token layer explicitly adopts them. They are not intended to replace the universal semantic token vocabulary.

## Interaction contract

### Navigation
- Previous / next month
- Today
- Calendar / Table / Board view switcher
- Search
- Filter
- Sort
- New

### Calendar
- Monday–Sunday header
- Today uses a circular amber marker
- Hover exposes a quiet `+` quick-add action
- Current-month vs adjacent-month dates are visually differentiated
- Overflow becomes `+ X more` and opens an accessible local popover

### Database cards
- Title
- Optional status tags
- Multi-day items have a narrow amber span indicator
- Cards are keyboard focusable and draggable
- Focus uses the Agere blue focus treatment

### Drag and drop
- Drag source stores `application/agere-calendar-page`
- Drop target is the destination date
- `onDateChange(pageId, newDate)` is emitted after a drop
- Multi-day duration is preserved by the component

## API

```ts
interface AgereCalendarItem {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  tags?: AgerePropertyTag[];
  description?: string;
  metadata?: Record<string, string>;
}

interface AgerePropertyTag {
  id: string;
  label: string;
  status: "red" | "yellow" | "blue" | "green" | "purple";
}

interface AgereCalendarProps {
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
  onViewChange?: (view: "calendar" | "table" | "board") => void;
  onFilterClick?: () => void;
  onSortClick?: () => void;
  onSearchChange?: (query: string) => void;
  onNewClick?: () => void;
}
```

## Accessibility

- All icon-only actions have accessible labels.
- Focus-visible rings are explicit.
- Calendar cells expose a descriptive accessible label.
- Today uses `aria-current="date"`.
- View switcher uses `role="tablist"` / `role="tab"` and `aria-selected`.
- Overflow control exposes `aria-expanded`.
- Reduced-motion should be enforced globally by the consuming DS motion layer.

## Production notes

The component is intentionally presentational + interaction-driven. Persistence, filtering rules, sorting rules, authorization, and database mutation remain application responsibilities.

For production integration, connect `onDateChange` to an idempotent mutation layer and handle:
- permission denied
- stale item
- concurrent update
- validation failure
- technical failure
- optimistic update rollback

The v2.3 audit explicitly identifies loading, empty, error, permission, stale, conflict, and technical-failure states as production gates; this component therefore should be wrapped by the application's shared state/recovery pattern rather than silently inventing those states locally.
