import * as React from "react";
import {
  BadgeCheck, CalendarDays, CircleUser, CreditCard, Gauge, LayoutGrid, Loader2, Shapes, Tag, Video, Zap, Keyboard as KeyboardIcon, Users, Clock,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Spinner, Loader } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AppCard, StatCard } from "@/components/agere-ds/cards";
import { Icon, AGERE_ICONS } from "@/icons";
import type { ComponentDoc } from "./types";

const people = [
  { id: "1", name: "Bubus Pratama" }, { id: "2", name: "Nadia Rahma" }, { id: "3", name: "Galih Santoso" },
  { id: "4", name: "Sekar Ayu" }, { id: "5", name: "Rizky Hakim" }, { id: "6", name: "Dewi Lestari" },
];

export const displayDocs: ComponentDoc[] = [
  {
    id: "badge",
    name: "Badge",
    category: "Display",
    level: "Atom",
    status: "stable",
    icon: Tag,
    summary: "Short status or metadata label. shadcn anatomy (rounded-md, px-2, text-xs) with shadcn variants plus agere's AA-tested status tones.",
    demo: () => (
      <>
        <Badge variant="success" dot>Accepted</Badge>
        <Badge variant="attention" dot>Pending</Badge>
        <Badge variant="error" dot>Cancelled</Badge>
        <Badge variant="info">Recurring</Badge>
        <Badge variant="special">Beta</Badge>
        <Badge variant="gray">30m</Badge>
        <Badge variant="brand">New</Badge>
        <Badge variant="outline" startIcon={<Video />}>agere Video</Badge>
      </>
    ),
    states: () => (
      <div className="flex flex-wrap items-center gap-3">
        <Badge size="sm">Small 18</Badge><Badge size="md">Medium 22</Badge><Badge size="lg">Large 24</Badge><Badge rounded variant="info">Rounded</Badge>
      </div>
    ),
    code: `<Badge variant="success" dot>Accepted</Badge>
<Badge variant="attention">Pending</Badge>
<Badge variant="outline" startIcon={<Video />}>agere Video</Badge>`,
    specs: [["Radius", "radius.md (8px); rounded → full"], ["Padding", "md: px-2 py-0.5, text-xs"], ["shadcn", "default · secondary · destructive · outline"], ["Status tones", "gray · brand · info · success · attention · error · special"], ["Contrast", "every tone ≥ 6.3:1 (fg on bg), both themes"]],
    dos: ["Use the status word itself (“Pending”), so meaning never depends on color.", "Keep to 1–2 words; use sentence case."],
    donts: ["Don’t make badges clickable — use a Button or filter chip.", "Don’t invent tones per product; map statuses to the five semantic tones."],
    a11y: { notes: ["Plain text — no role needed.", "Dots and icons are aria-hidden.", "For counts in nav (‘3’), include context in the parent’s accessible name."] },
  },
  {
    id: "avatar",
    name: "Avatar",
    category: "Display",
    level: "Atom",
    status: "stable",
    icon: CircleUser,
    summary: "Person or team image with initials fallback, presence dot and overlapping group.",
    demo: () => (
      <div className="flex flex-wrap items-center gap-6">
        <Avatar name="Bubus Pratama" size="xl" status="online" />
        <Avatar name="Nadia Rahma" size="lg" />
        <Avatar name="Galih Santoso" size="md" status="away" />
        <Avatar name="agere" shape="square" size="lg" />
        <AvatarGroup people={people} max={4} size="md" />
      </div>
    ),
    code: `<Avatar name="Bubus Pratama" src={url} size="lg" status="online" />
<AvatarGroup people={members} max={4} />`,
    specs: [["Sizes", "xs 20 · sm 24 · md 32 · lg 40 · xl 56"], ["Shape", "circle (people) · square radius.md (teams, apps)"], ["Fallback", "bg.emphasis + initials fg.emphasis"]],
    dos: ["Use square avatars for teams/organizations, circles for people.", "Always pass `name` — it’s the accessible name and the fallback."],
    donts: ["Don’t rely on the presence dot alone; status is in the accessible name.", "Don’t show more than 4–5 faces in a group."],
    a11y: { role: "img with aria-label (name + status)", notes: ["AvatarGroup exposes one summary label (“6 people: …”)."] },
  },
  {
    id: "spinner",
    name: "Spinner & Loader",
    category: "Display",
    level: "Atom",
    status: "stable",
    icon: Loader2,
    summary: "Indeterminate progress for short waits (< 3s). For longer loads prefer Skeleton; for known progress use Progress.",
    demo: () => {
      const [v, setV] = React.useState(35);
      React.useEffect(() => { const t = setInterval(() => setV((x) => (x >= 100 ? 10 : x + 15)), 900); return () => clearInterval(t); }, []);
      return (
        <div className="grid w-full max-w-sm gap-6">
          <div className="flex items-center gap-4 text-subtle"><Spinner size="xs" /><Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" /><Spinner size="xl" className="text-emphasis" /></div>
          <div className="grid gap-2"><p className="text-sm text-emphasis" id="up">Uploading avatar.png</p><Progress value={v} aria-labelledby="up" /></div>
          <div className="grid gap-2"><p className="text-sm text-emphasis" id="sync">Syncing calendar…</p><Progress indeterminate aria-labelledby="sync" /></div>
          <Loader label="Loading availability…" className="rounded-xl border border-subtle bg-default" />
        </div>
      );
    },
    code: `<Spinner />                       // role=status "Loading…"
<Button loading>Save</Button>     // spinner inside, aria-busy
<Progress value={60} aria-label="Uploading avatar.png" />
<Progress indeterminate aria-label="Syncing calendar" />`,
    dos: ["Show a spinner only after ~300ms to avoid flashes on fast responses.", "Say what is loading (“Loading availability…”)."],
    donts: ["Don’t block the whole page with a spinner when only one region is loading.", "Don’t stack multiple spinners — one per region."],
    a11y: { role: "status (spinner) · progressbar", notes: ["Spinner defaults to an sr-only ‘Loading…’; pass label={null} inside already-announced containers.", "Reduced motion: animation collapses to a static ring (global rule)."] },
  },
  {
    id: "icon",
    name: "Iconography",
    category: "Display",
    level: "Atom",
    status: "stable",
    icon: Shapes,
    summary: "Lucide (24 grid, 2px stroke, round joins) + custom agere venture glyphs on the same grid.",
    demo: () => (
      <div className="grid w-full gap-6">
        <div className="flex flex-wrap items-end gap-5 text-emphasis">
          {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
            <div key={s} className="grid justify-items-center gap-2"><Icon icon={CalendarDays} size={s} /><span className="text-2xs text-subtle">{s}</span></div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Object.entries(AGERE_ICONS).map(([name, G]) => (
            <div key={name} className="grid justify-items-center gap-2 rounded-lg border border-subtle bg-default p-3 text-emphasis">
              <G width={24} height={24} aria-hidden />
              <span className="text-2xs text-subtle">{name.replace("Icon", "")}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    code: `import { Icon, LaunchIcon } from "@/components/agere-ds";
import { CalendarDays } from "lucide-react";

<Icon icon={CalendarDays} size="md" />               // decorative (aria-hidden)
<Icon icon={LaunchIcon} size="lg" label="Launched" /> // meaningful (role=img)`,
    specs: [["Sizes", "xs 12 · sm 14 · md 16 (UI default) · lg 20 · xl 24"], ["Stroke", "2px ≤ 20px; 1.75px at 24px+"], ["Color", "currentColor — inherits text token"]],
    dos: ["Pair icons with text; icon-only controls need a label.", "Use the same icon for the same concept everywhere (see the icon index in Brand → Iconography)."],
    donts: ["Don’t mix icon families (no Heroicons next to Lucide).", "Don’t recolor icons with raw hex — use text tokens."],
    a11y: { notes: ["Decorative by default (aria-hidden, focusable=false).", "Meaningful icons get role=img + aria-label via the `label` prop.", "Non-text contrast ≥ 3:1 for icons that convey state (WCAG 1.4.11)."] },
  },
  {
    id: "kbd",
    name: "Kbd",
    category: "Display",
    level: "Atom",
    status: "stable",
    icon: KeyboardIcon,
    summary: "Keyboard shortcut hint.",
    demo: () => <p className="text-sm text-default">Open the command menu with <Kbd>⌘</Kbd> <Kbd>K</Kbd> or search with <Kbd>/</Kbd></p>,
    code: `Press <Kbd>⌘</Kbd><Kbd>K</Kbd>`,
    dos: ["Show platform-appropriate modifiers (⌘ on macOS, Ctrl elsewhere)."],
    donts: ["Don’t introduce single-key shortcuts without a way to turn them off (WCAG 2.1.4)."],
    a11y: { notes: ["Native <kbd>; glyphs are read by screen readers — prefer words in aria-keyshortcuts for the control itself."] },
  },
  {
    id: "card",
    name: "Card",
    category: "Display",
    level: "Molecule",
    status: "stable",
    icon: LayoutGrid,
    summary: "Container for one subject. Variants: default, interactive (lift on hover), muted, outline (dashed).",
    demo: () => (
      <div className="grid w-full gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>30 min meeting</CardTitle><CardDescription>/bubus/30min · agere Video</CardDescription></CardHeader>
          <CardContent><div className="flex gap-1.5"><Badge startIcon={<Clock />}>30m</Badge><Badge variant="info">Recurring</Badge></div></CardContent>
          <CardFooter><Button size="sm" variant="outline">Copy link</Button><Button size="sm" className="ml-auto">Preview</Button></CardFooter>
        </Card>
        <Card variant="muted" className="p-5"><CardTitle>Muted card</CardTitle><CardDescription className="mt-1">For secondary groupings inside a page — no shadow.</CardDescription></Card>
      </div>
    ),
    code: `<Card variant="interactive">
  <CardHeader>
    <CardTitle as="h3"><CardLink href="/event-types/30min">30 min meeting</CardLink></CardTitle>
    <CardDescription>/bubus/30min</CardDescription>
  </CardHeader>
  <CardFooter>…</CardFooter>
</Card>`,
    specs: [["Radius", "radius.xl 12px"], ["Padding", "20px (component.card.padding)"], ["Border / shadow", "border.subtle + elevation-1 → elevation-2 on hover (interactive)"], ["Footer", "bg.muted strip, border-top subtle"]],
    dos: ["Make the whole card clickable with CardLink (one tab stop, stretched ::after).", "Keep one primary action per card."],
    donts: ["Don’t nest cards inside cards.", "Don’t put multiple competing links in an interactive card."],
    a11y: { notes: ["CardTitle `as` keeps heading levels correct per page.", "Interactive cards show the focus outline on the card when the inner link is focused."] },
  },
  {
    id: "app-card",
    name: "App card & Stat card",
    category: "Data & Complex",
    level: "Organism",
    status: "new",
    icon: Gauge,
    summary: "The app-store tile (logo, category, description, badges, action) and a KPI tile for analytics dashboards.",
    demo: () => (
      <div className="grid w-full gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AppCard name="agere Video" category="Conferencing" logo={<Video className="text-emphasis" />} description="Built-in HD video meetings with recording and transcripts. No downloads for guests." badges={[{ label: "Installed", variant: "success" }]} href="#/components/app-card" meta="12k installs" />
          <AppCard name="Midtrans" category="Payment" logo={<CreditCard className="text-emphasis" />} description="Collect payments in IDR for paid bookings — QRIS, VA, e-wallets and cards." badges={[{ label: "Paid", variant: "gray" }]} action={<Button size="sm" variant="outline">Install</Button>} meta="4.1k installs" />
          <AppCard name="Workflows" category="Automation" logo={<Zap className="text-emphasis" />} description="Send WhatsApp and email reminders before and after events." badges={[{ label: "Beta", variant: "special" }]} action={<Button size="sm" variant="outline">Install</Button>} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Bookings" value="1,284" delta={12.4} icon={<CalendarDays />} />
          <StatCard label="No-show rate" value="3.1%" delta={0.8} positiveIsGood={false} icon={<Users />} />
          <StatCard label="Avg. lead time" value="2.4 days" delta={-4.2} icon={<BadgeCheck />} />
        </div>
      </div>
    ),
    code: `<AppCard name="agere Video" category="Conferencing" logo={<img src={logo} alt="" width={40} height={40} />}
  description="Built-in HD video…" badges={[{ label: "Installed", variant: "success" }]}
  href="/apps/agere-video" />

<StatCard label="No-show rate" value="3.1%" delta={0.8} positiveIsGood={false} />`,
    dos: ["Keep descriptions to ≤ 3 lines (clamped); lead with the user outcome.", "StatCard: state the comparison window (“vs last 30 days”)."],
    donts: ["Don’t color the delta by sign alone — use positiveIsGood so ‘churn up’ is red.", "Don’t put two buttons in an AppCard."],
    a11y: { notes: ["AppCard with href uses the stretched-link pattern; action button sits above it (z-10) and stays independently focusable.", "StatCard delta includes sr-only “Up/Down”."] },
  },
];
