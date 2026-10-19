import * as React from "react";
import {
  CalendarDays, ChevronsLeftRight, Clock, Columns3, Footprints, Grid2x2, Home, KanbanSquare, Link2, ListOrdered, Menu, MoreHorizontal,
  PanelLeft, Pencil, Copy, Trash2, Table2, Users, Zap, Navigation as NavIcon, SquareMenu, BarChart3, Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Pagination } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stepper } from "@/components/ui/stepper";
import { Navbar } from "@/components/ui/navbar";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarItem, SidebarSection } from "@/components/ui/sidebar";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { Logo } from "@/brand/logo";
import type { ComponentDoc } from "./types";

const steps = [
  { id: "a", label: "Account", description: "Name & username" },
  { id: "b", label: "Calendar", description: "Connect Google" },
  { id: "c", label: "Availability", description: "Working hours" },
  { id: "d", label: "Profile", description: "Photo & bio" },
];

export const navigationDocs: ComponentDoc[] = [
  {
    id: "navbar",
    name: "Header / Navbar",
    category: "Navigation",
    level: "Molecule",
    status: "new",
    icon: NavIcon,
    summary: "Sticky translucent top bar for marketing sites and sidebar-less products. Links collapse into a disclosure below md.",
    demo: () => (
      <div className="w-full overflow-hidden rounded-xl border border-subtle bg-default">
        <Navbar
          className="static"
          brand={<a href="#/" className="rounded-md focus-ring"><Logo height={22} /></a>}
          links={[{ label: "Product", href: "#/components/navbar", active: true }, { label: "Apps", href: "#/components" }, { label: "Pricing", href: "#/" }, { label: "Docs", href: "#/foundations/color" }]}
          actions={<><Button variant="ghost" size="sm" className="hidden sm:inline-flex">Sign in</Button><Button size="sm">Get started</Button></>}
        />
        <div className="h-24 bg-muted" />
      </div>
    ),
    code: `<Navbar
  brand={<Link to="/"><Logo height={22} /></Link>}
  links={[{ label: "Apps", href: "/apps", active: true }]}
  actions={<Button size="sm">Get started</Button>}
  renderLink={(l, cls) => <NavLink to={l.href} className={cls} aria-current={l.active ? "page" : undefined}>{l.label}</NavLink>}
/>`,
    specs: [["Height", "56px (size.header)"], ["Surface", "bg.default / 85% + backdrop blur.glass (24px), border-bottom subtle"], ["Active link", "fg.emphasis + 2px brand underline"]],
    dos: ["Keep ≤ 5 top-level links.", "Mark the current section with aria-current=\"page\"."],
    donts: ["Don’t hide the primary CTA inside the mobile menu."],
    a11y: { role: "banner > navigation", keyboard: [["Tab", "Links in order"], ["Enter / Space", "Toggle mobile menu (aria-expanded)"]], notes: ["Mobile menu button has aria-controls pointing at the link list."] },
  },
  {
    id: "sidebar",
    name: "Sidebar & App shell",
    category: "Navigation",
    level: "Organism",
    status: "new",
    icon: PanelLeft,
    summary: "v5 compatibility shell (AppShell) drawn with sidebar-* tokens. New layouts: SidebarProvider + Sidebar + SidebarInset (see Blocks). Muted left sidebar (256px) with grouped nav; on mobile a top bar + slide-in drawer. Includes a skip link.",
    demo: () => {
      const [active, setActive] = React.useState("event-types");
      const item = (id: string, label: string, icon: React.ReactNode, badge?: number) => (
        <SidebarItem href={`#/components/sidebar`} active={active === id} icon={icon} badge={badge} onClick={(e) => { e.preventDefault(); setActive(id); }}>{label}</SidebarItem>
      );
      return (
        <div className="flex h-[420px] w-full overflow-hidden rounded-xl border border-subtle bg-default">
          <div className="w-60 shrink-0">
            <Sidebar>
              <SidebarHeader><Logo height={22} /></SidebarHeader>
              <SidebarContent>
                <SidebarSection>
                  {item("event-types", "Event types", <Link2 />)}
                  {item("bookings", "Bookings", <CalendarDays />, 3)}
                  {item("availability", "Availability", <Clock />)}
                  {item("teams", "Teams", <Users />)}
                </SidebarSection>
                <SidebarSection label="Build">
                  {item("apps", "Apps", <Grid2x2 />)}
                  {item("workflows", "Workflows", <Zap />)}
                  {item("insights", "Insights", <BarChart3 />)}
                </SidebarSection>
              </SidebarContent>
              <SidebarFooter>
                {item("settings", "Settings", <Settings />)}
                <div className="flex items-center gap-2 px-2 pt-1"><Avatar name="Bubus Pratama" size="sm" /><span className="truncate text-sm font-medium text-emphasis">Bubus Pratama</span></div>
              </SidebarFooter>
            </Sidebar>
          </div>
          <div className="flex-1 p-6"><p className="type-heading-xl">Event types</p><p className="mt-1 text-sm text-subtle">Create events to share for people to book on your calendar.</p></div>
        </div>
      );
    },
    code: `<AppShell
  sidebar={
    <Sidebar>
      <SidebarHeader><Logo height={22} /></SidebarHeader>
      <SidebarContent>
        <SidebarSection>
          <SidebarItem href="/event-types" icon={<Link2 />} active>Event types</SidebarItem>
          <SidebarItem href="/bookings" icon={<CalendarDays />} badge={3}>Bookings</SidebarItem>
        </SidebarSection>
      </SidebarContent>
      <SidebarFooter>…</SidebarFooter>
    </Sidebar>
  }
  mobileBrand={<Logo height={20} />}
>
  {page}
</AppShell>`,
    specs: [["Width", "256px (size.sidebar); mobile drawer min(288px, 85vw)"], ["Surface", "bg.muted, border-right subtle"], ["Item", "h-36, radius.md, label-md; active bg.emphasis + fg.emphasis"], ["Section label", "type overline, fg.muted"]],
    dos: ["Group by user intent (Schedule / Build / Admin), max ~7 items per group.", "Put account + settings in SidebarFooter."],
    donts: ["Don’t nest more than one level in the sidebar — use in-page tabs for depth.", "Don’t use color alone for the active item (bg + aria-current)."],
    a11y: { role: "complementary > navigation (aria-label ‘Primary’)", keyboard: [["Tab", "Skip link → nav items → content"], ["Esc", "Close mobile drawer (focus returns to menu button)"]], notes: ["“Skip to content” is the first focusable element and targets <main id=\"main-content\">.", "Mobile drawer is a modal dialog (focus trapped)."] },
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    category: "Navigation",
    level: "Molecule",
    status: "new",
    icon: Footprints,
    summary: "Shows location in a hierarchy; collapses middle levels into “…”.",
    demo: () => (
      <div className="grid gap-4">
        <Breadcrumb items={[{ label: "agere", href: "#/", icon: <Home /> }, { label: "Teams", href: "#/" }, { label: "Growth squad", href: "#/" }, { label: "Event types", href: "#/" }, { label: "Discovery call" }]} />
        <Breadcrumb items={[{ label: "Settings", href: "#/" }, { label: "Billing" }]} />
      </div>
    ),
    code: `<Breadcrumb items={[{ label: "Teams", href: "/teams" }, { label: "Growth squad" }]} maxItems={4}
  renderLink={(item, className) => <Link to={item.href!} className={className}>{item.label}</Link>} />`,
    dos: ["Use for hierarchies ≥ 3 levels deep.", "Last item = current page, not a link."],
    donts: ["Don’t use breadcrumbs as the primary navigation.", "Don’t include the current page twice (title + crumb link)."],
    a11y: { role: "navigation “Breadcrumb” > ol", notes: ["Current item has aria-current=\"page\".", "Separators are aria-hidden.", "The ‘…’ is a button that expands the trail."] },
  },
  {
    id: "pagination",
    name: "Pagination",
    category: "Navigation",
    level: "Molecule",
    status: "new",
    icon: ChevronsLeftRight,
    summary: "Numbered or simple paging with ellipsis logic, plus a rows-per-page summary for tables.",
    demo: () => {
      const [p, setP] = React.useState(6);
      return (
        <div className="grid justify-items-center gap-5">
          <Pagination page={p} pageCount={20} onPageChange={setP} />
          <Pagination page={p} pageCount={20} onPageChange={setP} variant="simple" />
        </div>
      );
    },
    code: `<Pagination page={page} pageCount={20} onPageChange={setPage} />
<PaginationSummary page={page} pageSize={10} total={97} onPageSizeChange={setSize} />`,
    dos: ["Keep the control in the same place across pages.", "Reset to page 1 when filters change (DataTable does this)."],
    donts: ["Don’t paginate lists < 25 items.", "Don’t use infinite scroll where users need to reach the footer."],
    a11y: { role: "navigation “Pagination”", keyboard: [["Tab", "Previous → pages → next"], ["Enter / Space", "Go to page"]], notes: ["Current page: aria-current=\"page\".", "Buttons are labelled “Page 7”, “Next page”.", "Summary text is aria-live=polite."] },
  },
  {
    id: "tabs",
    name: "Tabs",
    category: "Navigation",
    level: "Molecule",
    status: "stable",
    icon: Columns3,
    summary: "Switch between panels of related content. Looks: underline (page sections), segmented (toolbars), pills (filters).",
    demo: () => (
      <div className="grid w-full max-w-xl gap-8">
        <Tabs defaultValue="upcoming" variant="underline">
          <TabsList aria-label="Bookings">
            <TabsTrigger value="upcoming" count={12}>Upcoming</TabsTrigger>
            <TabsTrigger value="unconfirmed" count={3}>Unconfirmed</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="pt-4 text-sm text-subtle">12 upcoming bookings.</TabsContent>
          <TabsContent value="unconfirmed" className="pt-4 text-sm text-subtle">3 bookings need your confirmation.</TabsContent>
          <TabsContent value="past" className="pt-4 text-sm text-subtle">Past bookings.</TabsContent>
          <TabsContent value="cancelled" className="pt-4 text-sm text-subtle">Cancelled bookings.</TabsContent>
        </Tabs>
        <Tabs defaultValue="week" variant="segmented">
          <TabsList aria-label="Range"><TabsTrigger value="day">Day</TabsTrigger><TabsTrigger value="week">Week</TabsTrigger><TabsTrigger value="month">Month</TabsTrigger></TabsList>
        </Tabs>
      </div>
    ),
    code: `<Tabs defaultValue="upcoming" variant="underline">
  <TabsList aria-label="Bookings">
    <TabsTrigger value="upcoming" count={12}>Upcoming</TabsTrigger>
  </TabsList>
  <TabsContent value="upcoming">…</TabsContent>
</Tabs>`,
    dos: ["Use short nouns (1–2 words).", "Keep tab order stable; don’t reorder by usage."],
    donts: ["Don’t use tabs for sequential steps — use Stepper.", "Don’t use tabs to switch the same content’s view — use SegmentedControl."],
    a11y: { role: "tablist > tab / tabpanel", keyboard: [["← / →", "Move between tabs (activates)"], ["Home / End", "First / last tab"], ["Tab", "Into the active panel"]], notes: ["Roving tabindex: one tab stop for the list.", "Counts are part of the tab’s accessible name."] },
  },
  {
    id: "segmented-control",
    name: "Segmented control",
    category: "Navigation",
    level: "Molecule",
    status: "new",
    icon: SquareMenu,
    summary: "Single-select toggle group for switching modes of the same content (Board / Calendar / Table).",
    demo: () => {
      const [v, setV] = React.useState<"board" | "calendar" | "table">("board");
      const [d, setD] = React.useState<"light" | "dark">("light");
      return (
        <div className="flex flex-wrap items-center gap-4">
          <SegmentedControl aria-label="View" value={v} onValueChange={setV} options={[{ value: "board", label: "Board", icon: <KanbanSquare /> }, { value: "calendar", label: "Calendar", icon: <CalendarDays /> }, { value: "table", label: "Table", icon: <Table2 /> }]} />
          <SegmentedControl aria-label="Density" size="sm" value={d} onValueChange={setD} options={[{ value: "light", label: "Comfortable" }, { value: "dark", label: "Compact" }]} />
        </div>
      );
    },
    code: `<SegmentedControl aria-label="View" value={view} onValueChange={setView}
  options={[{ value: "board", label: "Board", icon: <KanbanSquare /> }, …]} />`,
    dos: ["2–4 options, all short.", "Use iconOnly only when icons are universally understood; the label becomes tooltip + aria-label."],
    donts: ["Don’t use for filters with multiple selections."],
    a11y: { role: "group of toggle buttons (aria-pressed)", keyboard: [["← / →", "Move focus"], ["Space / Enter", "Select"]], notes: ["Group requires aria-label."] },
  },
  {
    id: "stepper",
    name: "Stepper",
    category: "Navigation",
    level: "Molecule",
    status: "new",
    icon: ListOrdered,
    summary: "Progress through a multi-step flow. `numbered` for wizards/checkout, `bars` for onboarding.",
    demo: () => {
      const [c, setC] = React.useState(1);
      return (
        <div className="grid w-full max-w-2xl gap-8">
          <Stepper steps={steps} current={c} onStepClick={setC} />
          <Stepper steps={steps} current={c} variant="bars" className="max-w-sm" />
          <div className="flex gap-2"><Button variant="outline" size="sm" disabled={c === 0} onClick={() => setC(c - 1)}>Back</Button><Button size="sm" disabled={c === steps.length - 1} onClick={() => setC(c + 1)}>Continue</Button></div>
        </div>
      );
    },
    states: () => <Stepper steps={steps} current={2} orientation="vertical" />,
    code: `<Stepper steps={steps} current={1} onStepClick={goTo} />
<Stepper steps={steps} current={1} variant="bars" />
<Stepper steps={steps} current={2} orientation="vertical" />`,
    dos: ["3–5 steps; name steps by outcome (“Availability”), not action.", "Let users go back to completed steps without losing data."],
    donts: ["Don’t allow skipping ahead past required steps.", "Don’t use for non-linear content (use Tabs)."],
    a11y: { role: "list; current step aria-current=\"step\"", notes: ["Each step’s state (completed / current / not started) is in sr-only text.", "Move focus to the new step’s heading after ‘Continue’."] },
  },
  {
    id: "dropdown-menu",
    name: "Dropdown menu",
    category: "Navigation",
    level: "Molecule",
    status: "stable",
    icon: MoreHorizontal,
    summary: "A list of actions or options anchored to a trigger. Supports icons, shortcuts, checkbox/radio items, submenus and destructive items.",
    demo: () => {
      const [hidden, setHidden] = React.useState(false);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="outline" trailingIcon={<Menu />}>Options</Button></DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Event type</DropdownMenuLabel>
            <DropdownMenuItem startIcon={<Pencil />} shortcut="E">Edit</DropdownMenuItem>
            <DropdownMenuItem startIcon={<Copy />} shortcut="⌘D">Duplicate</DropdownMenuItem>
            <DropdownMenuCheckboxItem checked={hidden} onCheckedChange={setHidden}>Hidden from profile</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive startIcon={<Trash2 />}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    code: `<DropdownMenu>
  <DropdownMenuTrigger asChild><IconButton label="Options" icon={<MoreHorizontal />} /></DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem startIcon={<Pencil />} onSelect={edit}>Edit</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem destructive onSelect={confirmDelete}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    specs: [["Surface", "bg.default, border.subtle, radius.xl, elevation-3"], ["Item", "h-32, radius.lg, body-md; focus bg.subtle"], ["Destructive", "error.fg, focus error.bg; always last, after a separator"]],
    dos: ["Put destructive items last, separated, and confirm them.", "Keep menus ≤ 7 items; group with labels/separators."],
    donts: ["Don’t hide the only way to do a primary task in a menu.", "Don’t use a menu for navigation links across the app."],
    a11y: { role: "menu > menuitem / menuitemcheckbox", keyboard: [["Enter / Space / ↓", "Open (focus first item)"], ["↑ / ↓", "Move"], ["→ / ←", "Open / close submenu"], ["A–Z", "Typeahead"], ["Esc", "Close, return focus"]], notes: ["Portaled, collision-aware positioning."] },
  },
];
