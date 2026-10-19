import * as React from "react";
import {
  BarChart3, Bot, Calendar, CreditCard, FileSpreadsheet, GitBranch, Hash, Mail, MessageCircle, MessagesSquare, PenTool, Video, Webhook, Zap, Workflow, Receipt,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { contrastRatio } from "@/lib/theme";
import { lightTokens, darkTokens } from "@/tokens";
import { TASK_PRIORITIES, TASK_PRIORITY_META, TASK_STATUSES, TASK_STATUS_META } from "@/lib/workspace";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { AppCard } from "@/components/agere-ds/cards";
import { AppDetailSheet, AppSearchHeader, CategorySidebar, type MarketplaceApp } from "@/components/agere-ds/marketplace";
import { PriorityFlag, StatusBadge, StatusIndicator } from "@/components/agere-ds/workspace";
import { WorkspaceApp } from "../patterns/workspace-app";
import { Callout, CodeBlock, PageHeader, Prose, Section, SpecTable, Token, href } from "../kit";

/* ================================================================== */
/* WORKSPACE APP                                                       */
/* ================================================================== */
export function WorkspacePage() {
  return (
    <div className="grid gap-2">
      <PageHeader
        eyebrow="Workspace · ClickUp-class"
        title="Workspace app"
        description="A productivity workspace assembled only from agere DS: spaces and lists, a six-view switcher, filter and grouping bar, inline-editable task list, board, week calendar, Gantt, docs and chat, a task Sheet with time tracking, and a ⌘K palette."
      />
      <Section title="Live reference" description="Try it: switch views, edit a status or priority inline, change density in the filter bar, open a task, start the timer, type @ or # in chat, or press ⌘K / Ctrl+K.">
        <WorkspaceApp />
      </Section>
      <Section title="Module map" description="Every part is a documented component — open any of them for specs, do's & don'ts and keyboard behavior.">
        <SpecTable
          head={["Area", "Components", "Docs"]}
          rows={[
            ["Shell", "AppShell / space rail · Breadcrumb · CommandPalette (⌘K) · Sheet", <a className="underline" href={href("/components/command-palette")}>Command palette & Sheet</a>],
            ["Views", "ViewSwitcherBar + ViewSwitcherPanel (List · Board · Calendar · Gantt · Doc · Chat)", <a className="underline" href={href("/components/view-switcher-bar")}>ViewSwitcher bar</a>],
            ["Query", "FilterBar · applyTaskQuery · density toggle", <a className="underline" href={href("/components/filter-bar")}>Filter bar</a>],
            ["List", "TaskList · TaskRow · Task*Picker · StatusBadge · PriorityFlag · AssigneeStack", <a className="underline" href={href("/components/task-list")}>Task list</a>],
            ["Board", "Kanban · KanbanCard (workspace fields)", <a className="underline" href={href("/components/kanban-card-clickup")}>Kanban card</a>],
            ["Time", "CalendarTimeGrid · GanttChart · TimeTrackerWidget", <a className="underline" href={href("/components/gantt")}>Gantt</a>],
            ["Docs & chat", "DocTree · DocHeader · RichTextContainer · ChannelSidebar · MessageBubble · ChatInputBar", <a className="underline" href={href("/components/chat")}>Chat</a>],
          ]}
        />
      </Section>
      <Section title="State strategy" description="Five states every workspace view must handle.">
        <SpecTable
          head={["State", "List", "Board", "Calendar / Gantt", "Chat"]}
          rows={[
            ["Ideal", "Grouped rows", "Columns with cards", "Events / bars", "Messages + composer"],
            ["Empty", "EmptyState + “Add task” in group", "“+ Add card” per column", "Grid with click-to-create", "“Say hi 👋” prompt"],
            ["Loading", "SkeletonRegion rows (h-row)", "3 skeleton cards per column", "Skeleton bars", "Skeleton bubbles"],
            ["Error", "Alert above list + Retry; keep stale data", "Card snaps back + toast.error", "Alert + Retry", "Failed bubble with Retry (role=alert)"],
            ["Partial / edge", "Filters hide all → “No results” + Clear filters", "WIP limit exceeded → attention count", "Tasks without dates listed as “Unscheduled”", "Offline → messages queue as “Sending…”"],
          ]}
        />
      </Section>
    </div>
  );
}

/* ================================================================== */
/* WORKSPACE TOKENS                                                    */
/* ================================================================== */
const get = (t: any, path: string) => path.split(".").reduce((o, k) => o?.[k], t) as string;

export function WorkspaceTokensPage() {
  const dens = (lightTokens as any).density;
  return (
    <div className="grid gap-2">
      <PageHeader eyebrow="Workspace · Foundations" title="Workspace tokens" description="The data-dense layer on top of the v4 foundations: workflow status, priority, the Comfortable/Compact density switch, and a stricter z-index ladder for stacked overlays." />
      <Section title="Workflow status" description="Six statuses, each with a solid (indicator), bg (badge) and fg (badge text). Each also has a distinct shape so status never depends on color alone.">
        <SpecTable
          head={["Status", "Preview", "Token", "Badge contrast (light / dark)"]}
          rows={TASK_STATUSES.map((s) => [
            TASK_STATUS_META[s].label,
            <span className="flex items-center gap-3"><StatusIndicator status={s} size={16} /><StatusBadge status={s} /></span>,
            <Token>task-status.{s}.*</Token>,
            <span className="tabular-nums">{contrastRatio(get(lightTokens, `task-status.${s}.fg`), get(lightTokens, `task-status.${s}.bg`)).toFixed(1)} / {contrastRatio(get(darkTokens, `task-status.${s}.fg`), get(darkTokens, `task-status.${s}.bg`)).toFixed(1)}</span>,
          ])}
        />
      </Section>
      <Section title="Priority">
        <SpecTable
          head={["Priority", "Preview", "Token", "Maps to", "vs canvas (light / dark)"]}
          rows={TASK_PRIORITIES.map((p) => [
            TASK_PRIORITY_META[p].label,
            <PriorityFlag priority={p} showLabel />,
            <Token>priority.{p}</Token>,
            { urgent: "error", high: "attention", normal: "info", low: "fg.muted (outline flag)" }[p],
            <span className="tabular-nums">{contrastRatio(get(lightTokens, `priority.${p}`), get(lightTokens, "bg.default")).toFixed(1)} / {contrastRatio(get(darkTokens, `priority.${p}`), get(darkTokens, "bg.default")).toFixed(1)}</span>,
          ])}
        />
      </Section>
      <Section title="Density" description="Set data-density on any container. Components read --ag-row-height and friends through Tailwind utilities (h-row, px-cell-x, text-dense, size-dense-icon, gap-dense, p-card).">
        <SpecTable
          head={["Token", "Comfortable", "Compact", "Utility"]}
          rows={[
            ["Row height", dens.comfortable["row-height"], dens.compact["row-height"], <Token>h-row</Token>],
            ["Control height", dens.comfortable["control-height"], dens.compact["control-height"], <Token>h-control</Token>],
            ["Cell padding x / y", `${dens.comfortable["cell-padding-x"]} / ${dens.comfortable["cell-padding-y"]}`, `${dens.compact["cell-padding-x"]} / ${dens.compact["cell-padding-y"]}`, <Token>px-cell-x py-cell-y</Token>],
            ["Text", `${dens.comfortable["font-size"]} / ${dens.comfortable["line-height"]}`, `${dens.compact["font-size"]} / ${dens.compact["line-height"]}`, <Token>text-dense</Token>],
            ["Gap", dens.comfortable.gap, dens.compact.gap, <Token>gap-dense</Token>],
            ["Card padding", dens.comfortable["card-padding"], dens.compact["card-padding"], <Token>p-card</Token>],
            ["Icon", dens.comfortable["icon-size"], dens.compact["icon-size"], <Token>size-dense-icon</Token>],
          ]}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {(["comfortable", "compact"] as const).map((d) => (
            <div key={d} data-density={d} className="overflow-hidden rounded-xl border border-subtle bg-default">
              <p className="border-b border-subtle bg-muted px-cell-x py-2 text-xs font-medium capitalize text-subtle">{d}</p>
              {["Checkout flow QA", "QRIS sandbox keys", "Kitchen dashboard v1"].map((t, i) => (
                <div key={t} className="flex h-row items-center gap-dense border-b border-subtle px-cell-x text-dense last:border-0">
                  <StatusIndicator status={(["in-progress", "todo", "review"] as const)[i]} />
                  <span className="flex-1 truncate text-emphasis">{t}</span>
                  <PriorityFlag priority={(["high", "normal", "urgent"] as const)[i]} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <CodeBlock code={`<body data-density={user.prefs.density}>      // global
<section data-density="compact">…</section>       // or per view
import { setDensity } from "@/components/agere-ds"; setDensity("compact");`} />
      </Section>
      <Section title="Borders, elevation & z-index" description="Workspace surfaces are border-driven: panes are separated by border.subtle, not shadows. Shadows are reserved for things that float.">
        <SpecTable
          head={["Layer", "z-index token", "Value", "Used by"]}
          rows={[
            ["Sticky headers", "z.sticky", "20", "Table headers, group headers, filter bar"],
            ["App header", "z.header", "30", "Top bar, mobile header"],
            ["Drawer / Sheet", "z.drawer", "40", "Task detail, app detail"],
            ["Overlay & modal", "z.overlay / z.modal", "50", "Dialog, ⌘K palette, scrim"],
            ["Popover & menus", "z.popover", "60", "Pickers inside sheets and dialogs"],
            ["Toast", "z.toast", "70", "Notifications"],
            ["Tooltip", "z.tooltip", "80", "Always on top"],
          ]}
        />
        <Callout tone="neutral" title="Radius in dense UI">Rows and cells are square; controls keep radius.control (6 px) at comfortable and radius.lg (8px) for pickers and chips; badges radius.sm (4px); cards radius.lg (8px) on boards.</Callout>
      </Section>
    </div>
  );
}

/* ================================================================== */
/* MARKETPLACE                                                         */
/* ================================================================== */
const logo = (I: React.ElementType, bg: string) => <span className={cn("grid size-full place-items-center text-white", bg)}><I className="size-5" /></span>;
const APPS: MarketplaceApp[] = [
  { id: "gcal", name: "Google Calendar", publisher: "Google", category: "calendar", description: "Two-way sync of tasks with due times and your meetings.", logo: logo(Calendar, "bg-viz-3"), installs: 18200, rating: 4.8, price: "Free", verified: true, installed: true, permissions: ["Read and write calendar events", "See your email address"] },
  { id: "meet", name: "agere Video", publisher: "agere", category: "conferencing", description: "HD meetings with recording and transcripts, linked to tasks.", logo: logo(Video, "bg-viz-2"), installs: 12400, rating: 4.7, price: "Free", verified: true },
  { id: "slack", name: "Slack", publisher: "Slack", category: "messaging", description: "Unfurl task links and create tasks from messages.", logo: logo(MessagesSquare, "bg-viz-1"), installs: 9800, rating: 4.6, price: "Free", verified: true, permissions: ["Post messages to channels you choose"] },
  { id: "wa", name: "WhatsApp Business", publisher: "agere", category: "messaging", description: "Send reminders and status updates to customers on WhatsApp.", logo: logo(MessageCircle, "bg-viz-4"), installs: 6100, rating: 4.5, price: "Paid", verified: true },
  { id: "midtrans", name: "Midtrans", publisher: "Midtrans", category: "payment", description: "QRIS, virtual account and card payments in IDR for paid bookings.", logo: logo(CreditCard, "bg-viz-3"), installs: 4100, rating: 4.4, price: "Paid", verified: true },
  { id: "xendit", name: "Xendit Invoices", publisher: "Xendit", category: "payment", description: "Create and track invoices from tasks; sync payment status back.", logo: logo(Receipt, "bg-viz-5"), installs: 2900, rating: 4.3, price: "Paid" },
  { id: "gh", name: "GitHub", publisher: "GitHub", category: "developer", description: "Link PRs and commits to tasks; auto-move on merge.", logo: logo(GitBranch, "bg-inverted"), installs: 8700, rating: 4.8, price: "Free", verified: true },
  { id: "figma", name: "Figma", publisher: "Figma", category: "developer", description: "Embed live frames in docs and tasks.", logo: logo(PenTool, "bg-viz-7"), installs: 5300, rating: 4.6, price: "Free", verified: true },
  { id: "zap", name: "Zapier", publisher: "Zapier", category: "automation", description: "Connect 6,000+ apps with no-code automations.", logo: logo(Zap, "bg-viz-6"), installs: 7600, rating: 4.5, price: "Free" },
  { id: "hook", name: "Webhooks", publisher: "agere", category: "automation", description: "Send signed events to your own endpoints.", logo: logo(Webhook, "bg-viz-2"), installs: 3200, rating: 4.2, price: "Free", verified: true },
  { id: "sheets", name: "Google Sheets", publisher: "Google", category: "analytics", description: "Export lists and time entries on a schedule.", logo: logo(FileSpreadsheet, "bg-viz-4"), installs: 4400, rating: 4.4, price: "Free", verified: true },
  { id: "ai", name: "agere AI", publisher: "agere", category: "automation", description: "Summarize threads, draft docs and triage tasks.", logo: logo(Bot, "bg-brand"), installs: 1500, rating: 4.1, price: "Beta", verified: true },
  { id: "mail", name: "Gmail", publisher: "Google", category: "messaging", description: "Turn emails into tasks with attachments.", logo: logo(Mail, "bg-viz-7"), installs: 5100, rating: 4.3, price: "Free", verified: true },
  { id: "metabase", name: "Metabase", publisher: "Metabase", category: "analytics", description: "Dashboards on top of workspace data.", logo: logo(BarChart3, "bg-viz-3"), installs: 900, rating: 4.0, price: "Free" },
];
const CATS = [
  { id: "all", label: "All apps", icon: <Workflow /> },
  { id: "calendar", label: "Calendar", icon: <Calendar /> },
  { id: "conferencing", label: "Conferencing", icon: <Video /> },
  { id: "messaging", label: "Messaging", icon: <Hash /> },
  { id: "payment", label: "Payment", icon: <CreditCard /> },
  { id: "automation", label: "Automation", icon: <Zap /> },
  { id: "developer", label: "Developer", icon: <GitBranch /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 /> },
];

export function MarketplacePage() {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("all");
  const [apps, setApps] = React.useState(APPS);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [installing, setInstalling] = React.useState(false);
  const list = apps.filter((a) => (cat === "all" || a.category === cat) && `${a.name} ${a.description} ${a.publisher}`.toLowerCase().includes(q.toLowerCase()));
  const categories = CATS.map((c) => ({ ...c, count: c.id === "all" ? apps.length : apps.filter((a) => a.category === c.id).length }));
  const install = (id: string) => {
    setInstalling(true);
    setTimeout(() => { setApps((s) => s.map((a) => (a.id === id ? { ...a, installed: true } : a))); setInstalling(false); toast.success(`${apps.find((a) => a.id === id)?.name} installed`); }, 900);
  };
  return (
    <div className="grid gap-2">
      <PageHeader eyebrow="Workspace · Marketplace" title="App marketplace" description="The integrations catalog pattern from cal.com/apps and ClickUp: search header, category sidebar, app tiles, and a detail sheet with permissions before install. Sample catalog: app names, install counts and ratings are illustrative placeholders." />
      <div className="mt-6 overflow-hidden rounded-xl border border-subtle bg-default">
        <div className="border-b border-subtle p-5 sm:p-6"><AppSearchHeader query={q} onQueryChange={setQ} resultCount={list.length} actions={<Badge variant="gray">{apps.filter((a) => a.installed).length} installed</Badge>} /></div>
        <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[200px_1fr]">
          <CategorySidebar categories={categories} value={cat} onValueChange={setCat} />
          <ul className="grid content-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((a) => (
              <li key={a.id}>
                <AppCard
                  name={a.name}
                  category={`${a.publisher}${a.verified ? " · Verified" : ""}`}
                  logo={a.logo}
                  description={a.description}
                  badges={[...(a.installed ? [{ label: "Installed", variant: "success" as const }] : []), { label: a.price ?? "Free", variant: a.price === "Beta" ? ("special" as const) : ("gray" as const) }]}
                  meta={a.installs ? `${a.installs.toLocaleString("id-ID")} installs` : undefined}
                  action={<button type="button" onClick={() => setOpenId(a.id)} className="inline-flex h-7 items-center rounded-control border border-default bg-default px-2.5 text-sm font-medium text-emphasis shadow-xs hover:bg-muted focus-ring">Details</button>}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <AppDetailSheet app={apps.find((a) => a.id === openId)} open={!!openId} onOpenChange={(o) => !o && setOpenId(null)} onInstall={install} onUninstall={(id) => { setApps((s) => s.map((a) => (a.id === id ? { ...a, installed: false } : a))); toast("Uninstalled"); }} installing={installing} />
    </div>
  );
}

/* ================================================================== */
/* NEXT.JS APP ROUTER                                                  */
/* ================================================================== */
export function NextjsPage() {
  return (
    <div className="grid gap-2">
      <PageHeader eyebrow="Engineering" title="Next.js App Router" description={'agere DS components are client components (they carry "use client"), so they drop into Server Component pages without wrappers. Tokens and Tailwind are framework-agnostic. A working example lives in examples/next-app.'} />
      <Section title="Recommended structure (monorepo)">
        <CodeBlock lang="text" code={`apps/
  web/                         Next.js 15 App Router (a venture)
    app/
      layout.tsx               <html data-density> · fonts · <Providers>
      providers.tsx            "use client" — TooltipProvider · Toaster · CommandPalette
      (workspace)/[space]/[list]/[view]/page.tsx   ← view in the URL (list|board|calendar|gantt|doc|chat)
      apps/page.tsx            marketplace
packages/
  ui/                          = this repo (@agere/design-system)
    src/components/ui          primitives
    src/components/agere-ds    workspace + domain modules
    tailwind.preset.ts
    tokens/                    DTCG source`} />
      </Section>
      <Section title="Setup">
        <CodeBlock code={`// apps/web/tailwind.config.ts
import agere from "@agere/design-system/tailwind.preset";
export default { presets: [agere], content: ["./app/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"] };

// apps/web/next.config.ts
export default { transpilePackages: ["@agere/design-system"] };

// apps/web/app/layout.tsx  (Server Component)
import "@agere/design-system/src/styles/globals.css";
import { Providers } from "./providers";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-density="compact" suppressHydrationWarning>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}

// apps/web/app/providers.tsx
"use client";
import { TooltipProvider, Toaster } from "@agere/design-system";
export function Providers({ children }: { children: React.ReactNode }) {
  return <TooltipProvider delayDuration={300}>{children}<Toaster /></TooltipProvider>;
}`} />
      </Section>
      <Section title="Rules">
        <Prose>
          <ul>
            <li><strong>Server-first data, client-side interaction.</strong> Fetch tasks in the page (Server Component), pass plain JSON to a client view that renders <code>TaskList</code> / <code>Kanban</code>. Mutations go through Server Actions with optimistic updates (<code>useOptimistic</code>).</li>
            <li><strong>View state in the URL:</strong> <code>/[space]/[list]/[view]?q=&status=&group=</code> so views are shareable and the back button works.</li>
            <li><strong>Theme without flash:</strong> set <code>class="dark"</code> and <code>data-density</code> on <code>&lt;html&gt;</code> from a cookie in the root layout.</li>
            <li><strong>Dynamic theming per tenant:</strong> read the venture’s brand color on the server and render <code>style={"{"}{"{"} "--ag-brand-default": hsl {"}"}{"}"}</code> on <code>&lt;html&gt;</code>, or call <code>applyBrandColor()</code> client-side.</li>
            <li><strong>Heavy views are lazy:</strong> <code>next/dynamic</code> for Gantt, Calendar and Docs editors.</li>
          </ul>
        </Prose>
        <Callout tone="attention" title="About “Antigravity Stack”">The brief mentions an “Antigravity Stack”. Nothing in agere DS depends on it; if it refers to a specific internal toolchain or Google’s Antigravity IDE, tell the DS team so we can add setup notes here.</Callout>
      </Section>
    </div>
  );
}
