import * as React from "react";
import {
  AppWindow, BellRing, CalendarPlus, Info, MessageSquareWarning, MessageCircle, ScanLine, Trash2, UploadCloud,
  Inbox, Table2, KanbanSquare, FolderTree,
} from "lucide-react";

import { Button, IconButton } from "@/components/ui/button";
import { Alert, Banner } from "@/components/ui/alert";
import { toast } from "@/components/ui/toast";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton, SkeletonRegion, SkeletonText } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { FileUploader, type UploaderFile } from "@/components/ui/file-uploader";
import { Input } from "@/components/ui/input";
import { FormControl, FormField } from "@/components/ui/form";
import { IllustrationEmpty, IllustrationNoResults } from "@/brand/illustrations";
import { DatabasePlayground } from "../patterns/database-playground";
import { TableDemo } from "../patterns/table-demo";
import type { ComponentDoc } from "./types";

export const feedbackDocs: ComponentDoc[] = [
  {
    id: "alert",
    name: "Alert & Banner",
    category: "Feedback & Overlay",
    level: "Molecule",
    status: "stable",
    icon: MessageSquareWarning,
    summary: "Alert: inline, contextual, persistent. Banner: full-width, page-level announcements.",
    demo: () => (
      <div className="grid w-full max-w-xl gap-3">
        <Alert variant="info" title="Google Calendar connected">New bookings will be added to “Work”.</Alert>
        <Alert variant="attention" title="Your trial ends in 3 days" actions={<Button size="sm" variant="outline">Choose a plan</Button>}>Team features will be turned off afterwards.</Alert>
        <Alert variant="error" title="We couldn’t sync your calendar">The token expired. <a href="#/components/alert">Reconnect Google</a> to keep availability accurate.</Alert>
        <Alert variant="success" onDismiss={() => undefined}>Webhook delivered in 212 ms.</Alert>
      </div>
    ),
    states: () => (
      <div className="grid w-full gap-3 overflow-hidden rounded-xl border border-subtle">
        <Banner variant="neutral" action={<Button size="xs" variant="outline">Upgrade</Button>} onDismiss={() => undefined}>You’re on the Free plan.</Banner>
        <Banner variant="attention">Scheduled maintenance Sunday 02:00–03:00 WIB.</Banner>
      </div>
    ),
    code: `<Alert variant="error" title="We couldn’t sync your calendar" actions={<Button size="sm">Reconnect</Button>}>
  The token expired.
</Alert>
<Banner variant="attention" onDismiss={hide}>Scheduled maintenance Sunday 02:00 WIB.</Banner>`,
    specs: [["Radius / padding", "radius.lg · 12px"], ["Tones", "neutral · info · success · attention · error (bg / border / fg tokens)"], ["Icon", "16px, auto per tone"]],
    dos: ["Title = what happened; body = why/what next; one action max.", "Place the alert next to what it’s about."],
    donts: ["Don’t use Alert for transient confirmations — use Toast.", "Don’t stack more than 2 banners."],
    a11y: { role: "alert (error) · status (others)", notes: ["Error alerts inserted dynamically are announced assertively via role=alert; others politely.", "Use live=\"off\" for alerts present on first render (avoids noise)."] },
  },
  {
    id: "toast",
    name: "Toast",
    category: "Feedback & Overlay",
    level: "Molecule",
    status: "new",
    icon: BellRing,
    summary: "Brief, non-blocking confirmation (shadcn Sonner look: popover surface, border, shadow-lg); optional undo action.",
    demo: () => (
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => toast.success("Event type created")}>Success</Button>
        <Button variant="outline" onClick={() => toast.error("Couldn’t save changes", { description: "Check your connection and try again." })}>Error</Button>
        <Button variant="outline" onClick={() => toast({ title: "Booking cancelled", action: { label: "Undo", onClick: () => toast.info("Booking restored") } })}>With undo</Button>
        <Button variant="outline" onClick={() => toast.warning("Calendar is out of sync")}>Warning</Button>
      </div>
    ),
    code: `// once, near the root
<Toaster />
// pages with a sticky SaveBar or right-aligned footers (6.4)
<Toaster position="bottom-left" offset={64} />

toast.success("Event type created");
toast.error("Couldn’t save changes", { description: "Check your connection and try again." });
toast({ title: "Booking cancelled", action: { label: "Undo", onClick: restore } });`,
    specs: [["Position", "bottom-center by default, max-width 420px, max 3 visible; `position` bottom-left / bottom-right and `offset` (px) since 6.4"], ["Duration", "5s default · 8s errors · min 4s · ∞ allowed"], ["Surface", "bg-popover, border, radius lg, shadow-lg (the shadcn Sonner look)"]],
    dos: ["Confirm the result in past tense (“Link copied”).", "Offer Undo instead of a confirm dialog for reversible actions."],
    donts: ["Don’t put critical errors that need action only in a toast — use Alert.", "Don’t use toasts for form validation.", "Don’t let toasts cover a SaveBar or dialog footer: use `<Toaster position=\"bottom-left\" />` or pass `offset`."],
    a11y: { role: "status (background) · alert-like foreground for errors", keyboard: [["F8", "Jump to the notification region"], ["Esc", "Dismiss focused toast"], ["Swipe down", "Dismiss (touch)"]], notes: ["Timers pause on hover/focus and when the window loses focus (WCAG 2.2.1).", "Action buttons need altText describing the effect."] },
  },
  {
    id: "dialog",
    name: "Modal / Dialog",
    category: "Feedback & Overlay",
    level: "Molecule",
    status: "stable",
    icon: AppWindow,
    summary: "Focused task that blocks the page. shadcn layout: p-6, gap-4, text-lg title, right-aligned footer actions. ConfirmDialog for destructive actions.",
    demo: () => {
      const [open, setOpen] = React.useState(false);
      return (
        <div className="flex flex-wrap gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button leadingIcon={<CalendarPlus />}>New event type</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add a new event type</DialogTitle><DialogDescription>Create a new event type for people to book times with.</DialogDescription></DialogHeader>
              <DialogBody className="grid gap-4">
                <FormField label="Title"><FormControl><Input placeholder="Quick chat" autoFocus /></FormControl></FormField>
                <FormField label="URL"><FormControl><Input addonStart="agere.id/bubus/" placeholder="quick-chat" /></FormControl></FormField>
              </DialogBody>
              <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Close</Button><Button onClick={() => { setOpen(false); toast.success("Event type created"); }}>Continue</Button></DialogFooter>
            </DialogContent>
          </Dialog>
          <ConfirmDialog
            trigger={<Button variant="destructive-outline" leadingIcon={<Trash2 />}>Delete event type</Button>}
            title="Delete event type?"
            description="Anyone with the link won’t be able to book it. Existing bookings stay on your calendar."
            confirmLabel="Delete event type"
            onConfirm={() => toast("Event type deleted")}
          />
        </div>
      );
    },
    code: `<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild><Button>New event type</Button></DialogTrigger>
  <DialogContent size="md">
    <DialogHeader>
      <DialogTitle>Add a new event type</DialogTitle>
      <DialogDescription>Create a new event type…</DialogDescription>
    </DialogHeader>
    <DialogBody>…</DialogBody>
    <DialogFooter>
      <Button variant="outline">Close</Button>
      <Button>Continue</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<ConfirmDialog title="Delete event type?" description="…" confirmLabel="Delete event type" onConfirm={remove} />`,
    specs: [["Width", "sm 400 · md 512 · lg 640 · xl 860 (max 100vw − 32px)"], ["Radius / shadow", "radius.2xl 16px · elevation-4"], ["Overlay", "bg.overlay @ 50% + blur.overlay 4px"], ["Motion", "fade + 97% zoom + 8px rise, 200ms ease-emphasized"]],
    dos: ["Title states the task (“Add a new event type”); confirm button repeats the verb (“Delete event type”).", "Keep dialogs to one decision; use a page for multi-step work."],
    donts: ["Don’t open a dialog from a dialog.", "Don’t use “OK/Yes” — say what happens."],
    a11y: { role: "dialog (aria-modal) · alertdialog for ConfirmDialog", keyboard: [["Esc", "Close (ConfirmDialog: Cancel)"], ["Tab / Shift+Tab", "Cycle within dialog (trapped)"]], notes: ["Initial focus: first field, or Cancel in ConfirmDialog (the safe option).", "Focus returns to the trigger on close; background is inert and scroll-locked.", "Always render DialogTitle (use sr-only if visually redundant)."] },
    interaction: ["Enter: 200ms, ease-emphasized; exit 150ms ease-exit.", "Overlay clicks close Dialog but not ConfirmDialog."],
  },
  {
    id: "tooltip-popover",
    name: "Tooltip & Popover",
    category: "Feedback & Overlay",
    level: "Molecule",
    status: "stable",
    icon: MessageCircle,
    summary: "Tooltip: a short inverted label on hover/focus. Popover: interactive floating panel on click.",
    demo: () => (
      <div className="flex flex-wrap items-center gap-3">
        <SimpleTooltip content="Copy public link"><Button variant="outline">Hover or focus me</Button></SimpleTooltip>
        <IconButton label="What is a buffer?" icon={<Info />} />
        <Popover>
          <PopoverTrigger asChild><Button variant="outline">Open popover</Button></PopoverTrigger>
          <PopoverContent className="grid gap-3">
            <p className="type-heading-sm">Buffer time</p>
            <p className="text-sm text-subtle">Add padding before and after events so meetings don’t run back-to-back.</p>
            <Button size="sm" className="justify-self-start">Set buffer</Button>
          </PopoverContent>
        </Popover>
      </div>
    ),
    code: `<SimpleTooltip content="Copy public link"><IconButton label="Copy" icon={<Copy />} tooltip={false} /></SimpleTooltip>
<Popover>
  <PopoverTrigger asChild><Button variant="outline">Filters</Button></PopoverTrigger>
  <PopoverContent>…</PopoverContent>
</Popover>`,
    dos: ["Tooltip: ≤ 1 short sentence, no links or buttons inside.", "Popover: for small interactive panels (filters, quick settings)."],
    donts: ["Don’t hide essential info in tooltips (touch users can’t hover).", "Don’t put a tooltip on a disabled button — explain inline instead."],
    a11y: { role: "tooltip (aria-describedby) · dialog (popover, non-modal)", keyboard: [["Focus", "Shows tooltip"], ["Esc", "Dismisses tooltip / closes popover"], ["Enter / Space", "Toggle popover"]], notes: ["Tooltips are hoverable and persistent until dismissed (WCAG 1.4.13)."] },
  },
  {
    id: "skeleton",
    name: "Skeleton screen",
    category: "Feedback & Overlay",
    level: "Atom",
    status: "new",
    icon: ScanLine,
    summary: "Content-shaped placeholders for loads > 300ms. Shimmer respects reduced motion.",
    demo: () => (
      <SkeletonRegion label="Loading bookings…" className="grid w-full max-w-lg gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-subtle bg-default p-4">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1"><SkeletonText lines={2} /></div>
            <Skeleton className="h-8 w-20 rounded-control" />
          </div>
        ))}
      </SkeletonRegion>
    ),
    code: `<SkeletonRegion label="Loading bookings…">
  <Skeleton className="size-10 rounded-full" />
  <SkeletonText lines={2} />
</SkeletonRegion>`,
    dos: ["Mirror the real layout so nothing jumps when content arrives.", "Show real data progressively as it arrives."],
    donts: ["Don’t use skeletons for < 300ms loads.", "Don’t animate more than one shimmer rhythm per page."],
    a11y: { notes: ["Placeholders are aria-hidden; SkeletonRegion sets aria-busy and announces one status message."] },
  },
  {
    id: "empty-state",
    name: "Empty state",
    category: "Data & Complex",
    level: "Organism",
    status: "stable",
    icon: Inbox,
    summary: "What to show when there’s nothing yet (first use), nothing matches (no results), or everything is done.",
    demo: () => (
      <div className="grid w-full gap-4 lg:grid-cols-2">
        <EmptyState illustration={<IllustrationEmpty size={140} />} title="No upcoming bookings" description="As soon as someone books a time with you it will show up here." actions={<><Button leadingIcon={<CalendarPlus />}>Share booking link</Button></>} />
        <EmptyState illustration={<IllustrationNoResults size={140} />} title="No results for “design review”" description="Try a different keyword or clear the filters." actions={<Button variant="outline">Clear filters</Button>} />
      </div>
    ),
    code: `<EmptyState
  illustration={<IllustrationEmpty />}
  title="No upcoming bookings"
  description="As soon as someone books a time with you it will show up here."
  actions={<Button>Share booking link</Button>}
/>`,
    dos: ["First use: explain value + one clear action.", "No results: echo the query and offer a way out."],
    donts: ["Don’t show an empty table header with no explanation.", "Don’t blame the user (“You have no…” → “No … yet”)."],
    a11y: { notes: ["Heading level configurable via headingLevel.", "Illustration is decorative."] },
    content: ["Title: “No [things] yet” (first use) / “No results for ‘q’” (search).", "Description: 1 sentence on what will appear and how."],
  },
  {
    id: "file-uploader",
    name: "File uploader",
    category: "Data & Complex",
    level: "Organism",
    status: "new",
    icon: UploadCloud,
    summary: "Dropzone (a real button) + validated file list with progress, retry and remove.",
    demo: () => {
      const [files, setFiles] = React.useState<UploaderFile[]>([
        { id: "1", name: "pitch-deck-v4.pdf", size: 2_400_000, status: "success" },
        { id: "2", name: "user-interviews.csv", size: 820_000, status: "error", error: "Network error — upload interrupted" },
      ]);
      const add = (list: File[]) => {
        const next = list.map((f, i) => ({ id: `${Date.now()}-${i}`, name: f.name, size: f.size, status: "uploading" as const, progress: 5 }));
        setFiles((s) => [...s, ...next]);
        next.forEach((n) => {
          let p = 5;
          const t = setInterval(() => {
            p += 20;
            setFiles((s) => s.map((x) => (x.id === n.id ? { ...x, progress: Math.min(p, 100), status: p >= 100 ? "success" : "uploading" } : x)));
            if (p >= 100) clearInterval(t);
          }, 400);
        });
      };
      return (
        <div className="w-full max-w-lg">
          <FileUploader
            files={files}
            onFilesAdded={add}
            onReject={(r) => toast.error(r[0].reason)}
            onRemove={(id) => setFiles((s) => s.filter((f) => f.id !== id))}
            onRetry={(id) => setFiles((s) => s.map((f) => (f.id === id ? { ...f, status: "success" } : f)))}
            accept=".pdf,.csv,image/*"
            maxSize={10_000_000}
          />
        </div>
      );
    },
    code: `<FileUploader files={files} onFilesAdded={upload} onReject={(r) => toast.error(r[0].reason)}
  onRemove={remove} onRetry={retry} accept=".pdf,image/*" maxSize={10_000_000} />`,
    dos: ["State accepted types and size limits up front.", "Validate on the client, re-validate on the server."],
    donts: ["Don’t make drag-and-drop the only path.", "Don’t clear the list on a single failure."],
    a11y: { role: "button (dropzone) + list", keyboard: [["Enter / Space", "Open file picker"], ["Tab", "Retry / remove per file"]], notes: ["Added/rejected counts are announced via a status region.", "Progress bars are labelled with the file name."] },
  },
  {
    id: "data-table",
    name: "Data table",
    category: "Data & Complex",
    level: "Organism",
    status: "stable",
    icon: Table2,
    summary: "TanStack-powered table: sorting, global search, faceted filters, pagination, row selection, resizing and inline editing.",
    demo: TableDemo,
    code: `<DataTable columns={columns} data={rows} getRowId={(r) => r.id} pagination={{ pageSize: 5 }}>
  <DataTableToolbar selectionActions={(ids) => <Button variant="destructive-outline" size="sm">Delete {ids.length}</Button>}>
    <DataTableSearch placeholder="Search bookings…" />
    <DataTableFacetedFilter columnId="status" title="Status" options={STATUS_OPTIONS} />
  </DataTableToolbar>
  <DataTableContent caption="Bookings" />
  <DataTablePagination />
</DataTable>

// filterable column
{ accessorKey: "status", filterFn: "arrIncludesSome", header: ({ column }) => <DataTableColumnHeader column={column} title="Status" /> }`,
    specs: [["Row height", "44px (36 compact)"], ["Header", "40px, bg.muted, label-sm (12px/500), fg.subtle"], ["Container", "radius.xl, border.subtle, elevation-1"], ["Selected row", "brand @ 5%"]],
    dos: ["Right-align numbers (meta.align = \"right\") and use tabular figures.", "Keep the search + filters in the toolbar; bulk actions replace them when rows are selected."],
    donts: ["Don’t put more than one primary action per row — use a row menu.", "Don’t exceed ~1,000 client rows without virtualization or server paging."],
    a11y: { role: "table with <caption>; <th scope=col aria-sort>", keyboard: [["Tab", "Sortable headers, checkboxes, editable cells"], ["Enter / F2", "Edit cell"], ["Esc", "Cancel edit"], ["← / →", "Resize focused column handle (Shift = 32px)"]], notes: ["Selection count is announced (aria-live).", "Empty/no-results state is rendered inside the table body."] },
  },
  {
    id: "database-views",
    name: "Kanban · Calendar · Task drawer",
    category: "Data & Complex",
    level: "Organism",
    status: "stable",
    icon: KanbanSquare,
    summary: "The v3 feature modules, restyled: one task store rendered as Board, Calendar and Table, with the slide-over Task drawer.",
    demo: () => <div className="w-full"><DatabasePlayground section="database" /></div>,
    code: `<Kanban columns={columns} onCardMove={persist} onCardClick={openDrawer}>
  <KanbanHeader>…</KanbanHeader>
  <KanbanBoard>{columns.map((c) => <KanbanColumn key={c.id} columnId={c.id}>{(card) => <KanbanCard card={card} />}</KanbanColumn>)}</KanbanBoard>
</Kanban>`,
    dos: ["Persist in onCardMove and roll back on failure (the board previews optimistically).", "Keep WIP limits visible (column `limit`)."],
    donts: ["Don’t enable drag while search is active (indices would be wrong — the board pauses it for you)."],
    a11y: { keyboard: [["Space", "Pick up / drop card (grip)"], ["↑ / ↓", "Reorder"], ["← / →", "Move column / day"], ["Esc", "Cancel move"]], notes: ["Every move step is announced.", "Calendar ‘today’ has aria-current=\"date\"."] },
  },
  {
    id: "file-explorer",
    name: "File explorer",
    category: "Data & Complex",
    level: "Organism",
    status: "stable",
    icon: FolderTree,
    summary: "Tree + grouped listbox with range selection, drop overlay and upload manager.",
    demo: () => <div className="w-full"><DatabasePlayground section="files" /></div>,
    code: `<FileExplorer onFilesDrop={upload} onMoveItems={move}>…</FileExplorer>`,
    dos: ["Offer a ‘Move to…’ action as the keyboard alternative to drag."],
    donts: ["Don’t auto-open files on single click."],
    a11y: { role: "tree + listbox (aria-multiselectable)", keyboard: [["↑ ↓ ← →", "Tree navigation"], ["Shift+Click / Space", "Range / toggle selection"], ["Enter", "Open"], ["Esc", "Clear selection"]], notes: ["Selection count is announced."] },
  },
];
