import * as React from "react";
import { Bold, ChartArea, ChevronsDownUp, Italic, PanelLeft, ScrollText, Table2, ToggleLeft, Underline, UserSquare } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AppSidebar } from "@/blocks/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { ComponentDoc } from "./types";

const invoices = [
  { id: "INV001", status: "Paid", method: "Credit card", amount: 250 },
  { id: "INV002", status: "Pending", method: "PayPal", amount: 150 },
  { id: "INV003", status: "Unpaid", method: "Bank transfer", amount: 350 },
  { id: "INV004", status: "Paid", method: "Credit card", amount: 450 },
];
const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 }, { month: "Feb", desktop: 305, mobile: 200 }, { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 }, { month: "May", desktop: 209, mobile: 130 }, { month: "Jun", desktop: 214, mobile: 140 },
];
const chartConfig = { desktop: { label: "Desktop", color: "var(--chart-1)" }, mobile: { label: "Mobile", color: "var(--chart-2)" } } satisfies ChartConfig;

export const shadcnDocs: ComponentDoc[] = [
  {
    id: "table",
    name: "Table",
    category: "Data & Complex",
    level: "Molecule",
    status: "new",
    icon: Table2,
    summary: "shadcn table primitives for static and server-rendered tables. Scrolls horizontally inside its container; DataTable is built from the same classes.",
    demo: () => (
      <div className="w-full max-w-xl rounded-xl border border-border bg-card">
        <Table>
          <TableCaption className="pb-4">A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow><TableHead className="w-[100px] pl-4">Invoice</TableHead><TableHead>Status</TableHead><TableHead>Method</TableHead><TableHead className="pr-4 text-right">Amount</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="pl-4 font-medium">{i.id}</TableCell>
                <TableCell><Badge variant={i.status === "Paid" ? "success" : i.status === "Pending" ? "attention" : "error"}>{i.status}</Badge></TableCell>
                <TableCell>{i.method}</TableCell>
                <TableCell className="pr-4 text-right tabular-nums">${i.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter><TableRow><TableCell colSpan={3} className="pl-4">Total</TableCell><TableCell className="pr-4 text-right tabular-nums">$1,200.00</TableCell></TableRow></TableFooter>
        </Table>
      </div>
    ),
    code: `<Table>
  <TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>INV001</TableCell><TableCell className="text-right">$250.00</TableCell></TableRow></TableBody>
</Table>`,
    specs: [["Head", "h-10 · px-2 · font-medium · text-foreground"], ["Cell", "p-2 · align-middle"], ["Row", "border-b · hover:bg-muted/50 · selected bg-muted"], ["Footer", "bg-muted/50 · border-t · font-medium"]],
    dos: ["Right-align numbers and use tabular-nums.", "Give the table a caption or aria-label that says what it lists."],
    donts: ["Don't use a table for layout.", "Don't hand-roll sorting — use DataTable (it wires aria-sort)."],
    a11y: { role: "table", notes: ["TableHead renders th scope=\"col\" by default.", "The container scrolls horizontally so the page body never does (WCAG 1.4.10)."] },
  },
  {
    id: "chart",
    name: "Chart",
    category: "Data & Complex",
    level: "Organism",
    status: "new",
    icon: ChartArea,
    summary: "shadcn chart primitives on Recharts 3: ChartContainer (config → --color-* vars), ChartTooltip, ChartLegend. Colors follow chart-1…5 and flip with the theme.",
    demo: () => (
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-4">
        <ChartContainer config={chartConfig} className="h-[220px] w-full" title="Bar chart of desktop and mobile visitors, January to June">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    ),
    code: `const config = {
  desktop: { label: "Desktop", color: "var(--chart-1)" }, // shadcn v4 syntax works as-is
  mobile:  { label: "Mobile",  color: "var(--chart-2)" },
} satisfies ChartConfig;

<ChartContainer config={config} className="h-[220px] w-full" title="Visitors by device">
  <BarChart data={data}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
  </BarChart>
</ChartContainer>`,
    specs: [["Palette", "chart-1…5 (light: orange · teal · deep cyan · amber · orange-amber; dark: blue · emerald · amber · purple · rose)"], ["Tooltip", "rounded-lg · border-border/50 · shadow-xl · text-xs"], ["Colors", "var(--chart-n) is normalised to hsl(var(--chart-n)) — Tailwind 3 channel tokens"]],
    dos: ["Always pass `title` — it becomes the figure's accessible name.", "Pair the chart with the key number in text (CardDescription / footer)."],
    donts: ["Don't encode meaning in color alone — label series in the legend or tooltip.", "Don't use more than 5 series; group the rest as \"Other\"."],
    a11y: { role: "figure", notes: ["The SVG is decorative to screen readers; the title + surrounding text carry the insight.", "For exact values, offer a table view (see Blocks → Datatable)."] },
  },
  {
    id: "accordion",
    name: "Accordion",
    category: "Display",
    level: "Molecule",
    status: "new",
    icon: ChevronsDownUp,
    summary: "Vertically stacked disclosure sections. single or multiple, collapsible, animated height.",
    demo: () => (
      <Accordion type="single" collapsible defaultValue="a" className="w-full max-w-md">
        <AccordionItem value="a"><AccordionTrigger>Is it accessible?</AccordionTrigger><AccordionContent>Yes. It follows the WAI-ARIA accordion pattern.</AccordionContent></AccordionItem>
        <AccordionItem value="b"><AccordionTrigger>Is it styled?</AccordionTrigger><AccordionContent>It uses the shadcn/ui anatomy with agere tokens.</AccordionContent></AccordionItem>
        <AccordionItem value="c"><AccordionTrigger>Is it animated?</AccordionTrigger><AccordionContent>Yes — and it respects prefers-reduced-motion.</AccordionContent></AccordionItem>
      </Accordion>
    ),
    code: `<Accordion type="single" collapsible>
  <AccordionItem value="a">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes.</AccordionContent>
  </AccordionItem>
</Accordion>`,
    dos: ["Use for FAQs and optional detail.", "Write triggers as the question or the section name."],
    donts: ["Don't hide required form fields in an accordion.", "Don't nest accordions."],
    a11y: { keyboard: [["Enter / Space", "Toggle section"], ["↑ / ↓", "Move between triggers"], ["Home / End", "First / last trigger"]], notes: ["Triggers are buttons inside h3 headings with aria-expanded / aria-controls."] },
  },
  {
    id: "toggle",
    name: "Toggle & ToggleGroup",
    category: "Actions & Inputs",
    level: "Atom",
    status: "new",
    icon: ToggleLeft,
    summary: "Two-state buttons (aria-pressed) and attached groups — formatting toolbars, chart range pickers.",
    demo: () => (
      <div className="flex flex-wrap items-center gap-4">
        <Toggle aria-label="Toggle bold"><Bold aria-hidden /></Toggle>
        <Toggle variant="outline" aria-label="Toggle italic" defaultPressed><Italic aria-hidden /></Toggle>
        <ToggleGroup type="multiple" variant="outline" aria-label="Text formatting">
          <ToggleGroupItem value="bold" aria-label="Bold"><Bold aria-hidden /></ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic"><Italic aria-hidden /></ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline"><Underline aria-hidden /></ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" defaultValue="30d" variant="outline" aria-label="Range">
          <ToggleGroupItem value="7d" className="px-3">7d</ToggleGroupItem>
          <ToggleGroupItem value="30d" className="px-3">30d</ToggleGroupItem>
          <ToggleGroupItem value="90d" className="px-3">90d</ToggleGroupItem>
        </ToggleGroup>
      </div>
    ),
    code: `<Toggle aria-label="Toggle bold"><Bold /></Toggle>
<ToggleGroup type="single" variant="outline" defaultValue="30d" aria-label="Range">
  <ToggleGroupItem value="7d">7d</ToggleGroupItem>
  <ToggleGroupItem value="30d">30d</ToggleGroupItem>
</ToggleGroup>`,
    specs: [["Size", "sm 32 · default 36 · lg 40"], ["On state", "bg-accent · text-accent-foreground"], ["Outline", "border-input · shadow-xs"]],
    dos: ["Icon-only toggles need aria-label.", "For choosing one view that changes content, SegmentedControl reads more clearly."],
    donts: ["Don't use a Toggle to submit or navigate — that's a Button or Link."],
    a11y: { keyboard: [["Space / Enter", "Toggle"], ["← / →", "Move within a group (roving focus)"]], notes: ["Toggle exposes aria-pressed; single ToggleGroup exposes radio semantics."] },
  },
  {
    id: "hover-card",
    name: "Hover card",
    category: "Feedback & Overlay",
    level: "Molecule",
    status: "new",
    icon: UserSquare,
    summary: "Preview content on hover or keyboard focus — people, links, entities. Supplementary only.",
    demo: () => (
      <HoverCard openDelay={150}>
        <HoverCardTrigger asChild><a href="#/components/hover-card" className="rounded-sm text-sm font-medium underline underline-offset-4 outline-none focus-ring">@nadia</a></HoverCardTrigger>
        <HoverCardContent className="w-72">
          <div className="flex gap-3">
            <Avatar name="Nadia Putri" size="lg" />
            <div className="grid gap-1">
              <p className="text-sm font-semibold">Nadia Putri</p>
              <p className="text-sm text-muted-foreground">Product lead · Mimo recruiter dashboard.</p>
              <p className="text-xs text-muted-foreground">Joined December 2024</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    ),
    code: `<HoverCard>
  <HoverCardTrigger asChild><a href="/u/nadia">@nadia</a></HoverCardTrigger>
  <HoverCardContent>…</HoverCardContent>
</HoverCard>`,
    dos: ["Keep the trigger useful on its own (a link to the full profile)."],
    donts: ["Don't put actions users need inside — touch users never see it.", "Don't use for long content; use a Popover or page."],
    a11y: { notes: ["Opens on hover and focus, closes on Esc and pointer leave (WCAG 1.4.13).", "Content is not in the tab order — it is a preview."] },
  },
  {
    id: "scroll-area",
    name: "Scroll area",
    category: "Display",
    level: "Atom",
    status: "new",
    icon: ScrollText,
    summary: "Native scrolling with a slim, themed scrollbar. Wheel, touch, keyboard all behave natively.",
    demo: () => (
      <ScrollArea className="h-56 w-56 rounded-md border border-border" viewportLabel="Release tags">
        <div className="p-4">
          <p className="mb-4 text-sm font-medium leading-none">Tags</p>
          {Array.from({ length: 30 }, (_, i) => `v6.0.0-beta.${30 - i}`).map((t) => (
            <React.Fragment key={t}><div className="text-sm">{t}</div><Separator className="my-2" /></React.Fragment>
          ))}
        </div>
      </ScrollArea>
    ),
    code: `<ScrollArea className="h-72 w-48 rounded-md border" viewportLabel="Tags">…</ScrollArea>`,
    dos: ["Pass viewportLabel when the region is keyboard-scrollable on its own (makes it a focusable, named region)."],
    donts: ["Don't wrap the whole page — the document already scrolls."],
    a11y: { notes: ["With viewportLabel the viewport is tabIndex=0 + role=region so keyboard users can scroll it (axe scrollable-region-focusable)."] },
  },
  {
    id: "sidebar-shadcn",
    name: "Sidebar (shadcn)",
    category: "Navigation",
    level: "Organism",
    status: "new",
    icon: PanelLeft,
    summary: "The composable shadcn sidebar: SidebarProvider · Sidebar (collapsible icon / offcanvas / none; variant sidebar / floating / inset) · groups · menus · sub-menus · rail · ⌘B.",
    demo: () => (
      <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-border [transform:translateZ(0)]">
        <SidebarProvider className="h-full min-h-0">
          <AppSidebar className="!h-full" />
          <SidebarInset className="min-h-0">
            <header className="flex h-12 items-center gap-2 border-b border-border px-3"><SidebarTrigger /><span className="text-sm font-medium">Try ⌘B or the rail</span></header>
            <div className="grid flex-1 grid-cols-3 gap-3 p-4">{[0, 1, 2].map((i) => <div key={i} className="aspect-video rounded-lg bg-muted/60" />)}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    ),
    code: `<SidebarProvider>
  <Sidebar collapsible="icon" variant="inset" label="Main">
    <SidebarHeader>…</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive tooltip="Dashboard">
              <a href="/"><LayoutDashboard /><span>Dashboard</span></a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter><NavUser user={user} /></SidebarFooter>
    <SidebarRail />
  </Sidebar>
  <SidebarInset><header><SidebarTrigger /></header>…</SidebarInset>
</SidebarProvider>`,
    specs: [["Width", "--sidebar-width 16rem · icon 3rem · mobile 18rem"], ["Menu button", "h-8 · p-2 · rounded-md · sm h-7 · lg h-12"], ["Tokens", "sidebar · sidebar-foreground · sidebar-primary · sidebar-accent · sidebar-border · sidebar-ring"], ["Persistence", "cookie sidebar_state (7 days)"]],
    dos: ["Pass `label` so the sidebar is a named navigation landmark.", "Give every SidebarMenuButton a `tooltip` when collapsible=\"icon\"."],
    donts: ["Don't put more than two levels of nesting in the menu.", "Don't hide the only route to a page inside a collapsed group."],
    a11y: { keyboard: [["⌘B / Ctrl+B", "Collapse / expand"], ["Esc", "Close the mobile sheet"]], notes: ["Below 768px the sidebar renders as a modal sheet with a focus trap.", "Active links set aria-current=\"page\"; SidebarMenuBadge needs aria-label context."] },
  },
];
