import * as React from "react";
import { ExternalLink, Maximize2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AccountSettings, ActivityFeed, ChartAreaInteractive, ChartBarStacked, ChartDonut, ChartRadialGoal, DashboardOverview, DashboardShell,
  EmptyProjects, InviteMembersDialog, MultiStepForm, OrdersTable, RecentTransactions, SectionCards, TeamMembers, UsageWidget, DashboardPage,
  ProductList, ProductOverview, ShoppingCart, ProductReviews, CheckoutPage,
  MarketingNavbar, HeroSection, LogoCloud, FeaturesSection, PricingSection, TestimonialsSection, FaqSection, CtaSection, MarketingFooter, LandingPage,
  LoginForm, RegisterForm, ForgotPasswordForm, TwoFactorForm, AuthFlow,
  InboxApp, WorkflowBuilder, BentoGrid, KanbanApp, EventCalendar, ProjectTimeline, StoreLocator,
} from "@/blocks";
import kanbanSrc from "@/blocks/apps/kanban-app.tsx?raw";
import eventCalSrc from "@/blocks/apps/event-calendar.tsx?raw";
import timelineSrc from "@/blocks/apps/project-timeline.tsx?raw";
import locatorSrc from "@/blocks/apps/store-locator.tsx?raw";
import inboxSrc from "@/blocks/apps/inbox.tsx?raw";
import workflowSrc from "@/blocks/apps/workflow-builder.tsx?raw";
import bentoSrc from "@/blocks/apps/bento-grid.tsx?raw";
import productListSrc from "@/blocks/ecommerce/product-list.tsx?raw";
import productOverviewSrc from "@/blocks/ecommerce/product-overview.tsx?raw";
import cartSrc from "@/blocks/ecommerce/cart-checkout.tsx?raw";
import artSrc from "@/blocks/ecommerce/product-art.tsx?raw";
import marketingSrc from "@/blocks/marketing/marketing.tsx?raw";
import authSrc from "@/blocks/auth/auth.tsx?raw";
import dashboardSrc from "@/blocks/dashboard.tsx?raw";
import sidebarSrc from "@/blocks/app-sidebar.tsx?raw";
import headerSrc from "@/blocks/site-header.tsx?raw";
import statsSrc from "@/blocks/section-cards.tsx?raw";
import chartsSrc from "@/blocks/charts.tsx?raw";
import widgetsSrc from "@/blocks/widgets.tsx?raw";
import tableSrc from "@/blocks/orders-table.tsx?raw";
import settingsSrc from "@/blocks/account-settings.tsx?raw";
import stepsSrc from "@/blocks/multi-step-form.tsx?raw";
import appSrc from "@/blocks/app-blocks.tsx?raw";
import { CodeBlock, PageHeader, Prose, Section, href } from "../kit";

type Block = { id: string; title: string; description: string; source: string; file: string; render: () => React.ReactNode; frame?: "none" | "canvas" | "page"; full?: string };

const GROUPS: { id: string; title: string; description: string; blocks: Block[] }[] = [
  {
    id: "shell",
    title: "Dashboard shell",
    description: "SidebarProvider + collapsible icon sidebar + inset canvas + sticky header. Press ⌘B inside the frame to collapse, or open it full-screen.",
    blocks: [
      {
        id: "dashboard-01", title: "Dashboard 01 — analytics", file: "blocks/dashboard.tsx + app-sidebar.tsx + site-header.tsx",
        description: "Stat cards, interactive area chart, donut, stacked bar, recent sales, activity and an orders table.",
        source: `${dashboardSrc}\n\n// ─── blocks/app-sidebar.tsx ───\n${sidebarSrc}\n\n// ─── blocks/site-header.tsx ───\n${headerSrc}`,
        render: () => <DashboardShell contained><DashboardOverview /></DashboardShell>, frame: "none",
      },
    ],
  },
  {
    id: "statistics",
    title: "Statistics",
    description: "KPI tiles with CardAction trend badges. Trend is spelled out in text, never color alone.",
    blocks: [{ id: "stats-01", title: "Section cards", file: "blocks/section-cards.tsx", description: "4-up responsive KPI grid.", source: statsSrc, render: () => <SectionCards /> }],
  },
  {
    id: "charts",
    title: "Charts",
    description: "Recharts 3 inside <ChartContainer>. Colors come from chart-1…5 tokens and switch with the theme.",
    blocks: [
      { id: "chart-area", title: "Area — interactive range", file: "blocks/charts.tsx", description: "ToggleGroup on desktop, Select on mobile.", source: chartsSrc, render: () => <div className="w-full"><ChartAreaInteractive /></div> },
      { id: "chart-grid", title: "Bar · Donut · Radial", file: "blocks/charts.tsx", description: "Stacked bar with legend, donut with centre total, radial goal.", source: chartsSrc,
        render: () => <div className="grid w-full gap-4 lg:grid-cols-3"><ChartBarStacked /><ChartDonut /><ChartRadialGoal /></div> },
    ],
  },
  {
    id: "widgets",
    title: "Widgets",
    description: "Small, single-purpose cards for dashboard grids.",
    blocks: [
      { id: "widgets-01", title: "Sales · Activity", file: "blocks/widgets.tsx", description: "List widget with status badges; timeline feed with period select.", source: widgetsSrc,
        render: () => <div className="grid w-full gap-4 lg:grid-cols-2"><RecentTransactions /><ActivityFeed /></div> },
      { id: "widgets-02", title: "Team · Usage", file: "blocks/widgets.tsx", description: "Role pickers per member; plan meters that warn at 90%.", source: widgetsSrc,
        render: () => <div className="grid w-full gap-4 lg:grid-cols-2"><TeamMembers /><UsageWidget /></div> },
    ],
  },
  {
    id: "datatable",
    title: "Datatable",
    description: "Table primitives + TanStack: search, status filter, column visibility, sorting (aria-sort), selection, pagination.",
    blocks: [{ id: "datatable-01", title: "Orders", file: "blocks/orders-table.tsx", description: "24 rows, 8 per page.", source: tableSrc, render: () => <div className="w-full"><OrdersTable /></div> }],
  },
  {
    id: "application",
    title: "Application",
    description: "Settings, onboarding, dialogs and empty states.",
    blocks: [
      { id: "account-settings", title: "Account settings", file: "blocks/account-settings.tsx", description: "Tabs · validated profile form · notification switches · danger zone.", source: settingsSrc, render: () => <AccountSettings /> },
      { id: "multi-step", title: "Multi-step form", file: "blocks/multi-step-form.tsx", description: "Per-step validation; heading receives focus on each step.", source: stepsSrc, render: () => <MultiStepForm /> },
      { id: "dialog-invite", title: "Invite dialog", file: "blocks/app-blocks.tsx", description: "Chip input with validation, role select, access list.", source: appSrc, render: () => <InviteMembersDialog /> },
      { id: "empty", title: "Empty state", file: "blocks/app-blocks.tsx", description: "Stacked icon tiles, one primary + one secondary action.", source: appSrc, render: () => <EmptyProjects /> },
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Landing-page sections. NavigationMenu mega-menu on desktop, Drawer on mobile; one h1 per page; prices in Rupiah.",
    blocks: [
      { id: "landing", title: "Landing page", file: "blocks/marketing/marketing.tsx", description: "Navbar · hero · logo cloud · features · pricing · testimonials · FAQ · CTA · footer.", source: marketingSrc,
        render: () => <div className="h-[760px] overflow-y-auto rounded-xl border border-border [transform:translateZ(0)]"><LandingPage /></div>, frame: "page", full: "/blocks/landing/full" },
      { id: "navbar", title: "Navbar", file: "blocks/marketing/marketing.tsx", description: "Mega-menu with icon tiles; resize below 768px for the Drawer.", source: marketingSrc,
        render: () => <div className="w-full overflow-visible rounded-xl border border-border pb-72"><MarketingNavbar /></div>, frame: "page" },
      { id: "hero", title: "Hero", file: "blocks/marketing/marketing.tsx", description: "Announcement pill, balanced headline, two CTAs, product preview.", source: marketingSrc, render: () => <div className="w-full overflow-hidden rounded-xl border border-border"><HeroSection /></div>, frame: "page" },
      { id: "features", title: "Features + logo cloud", file: "blocks/marketing/marketing.tsx", description: "Hairline grid of six features.", source: marketingSrc, render: () => <div className="w-full rounded-xl border border-border"><LogoCloud /><FeaturesSection /></div>, frame: "page" },
      { id: "pricing", title: "Pricing", file: "blocks/marketing/marketing.tsx", description: "Monthly / yearly switch (−20%), featured tier.", source: marketingSrc, render: () => <div className="w-full rounded-xl border border-border"><PricingSection /></div>, frame: "page" },
      { id: "social", title: "Testimonials · FAQ · CTA · footer", file: "blocks/marketing/marketing.tsx", description: "blockquote/figcaption quotes, accordion FAQ, validated newsletter form.", source: marketingSrc,
        render: () => <div className="w-full overflow-hidden rounded-xl border border-border"><TestimonialsSection /><FaqSection /><CtaSection /><MarketingFooter /></div>, frame: "page" },
    ],
  },
  {
    id: "ecommerce",
    title: "eCommerce",
    description: "Catalogue to checkout for an Indonesian merchant: IDR, QRIS / virtual account / COD, local couriers. Product art is token-colored SVG — swap for your photos.",
    blocks: [
      { id: "product-list", title: "Product list + filters", file: "blocks/ecommerce/product-list.tsx", description: "Category checkboxes, price slider, in-stock toggle, sort; count announced.", source: `${productListSrc}\n\n// ─── blocks/ecommerce/product-art.tsx ───\n${artSrc}`, render: () => <ProductList /> },
      { id: "product-overview", title: "Product overview", file: "blocks/ecommerce/product-overview.tsx", description: "Gallery, color & size radio groups, quantity, wishlist toggle, details accordion.", source: productOverviewSrc, render: () => <ProductOverview /> },
      { id: "cart", title: "Shopping cart", file: "blocks/ecommerce/cart-checkout.tsx", description: "Side sheet with quantity steppers and a free-delivery meter.", source: cartSrc, render: () => <ShoppingCart /> },
      { id: "reviews", title: "Product reviews", file: "blocks/ecommerce/cart-checkout.tsx", description: "Rating breakdown and verified reviews.", source: cartSrc, render: () => <ProductReviews /> },
      { id: "checkout", title: "Checkout", file: "blocks/ecommerce/cart-checkout.tsx", description: "City Combobox, delivery DatePicker (no Sundays), shipping & payment RadioCards, sticky summary.", source: cartSrc, render: () => <CheckoutPage /> },
    ],
  },
  {
    id: "auth",
    title: "Authentication",
    description: "Sign in, sign up, reset and 2-step verification. Errors link to fields and move focus; reset never reveals whether an account exists.",
    blocks: [
      { id: "auth-flow", title: "Auth flow (split layout)", file: "blocks/auth/auth.tsx", description: "Interactive: sign in → verification code (use 246810), or forgot / create account.", source: authSrc,
        render: () => <AuthFlow />, frame: "page", full: "/blocks/auth/full" },
      { id: "login", title: "Login", file: "blocks/auth/auth.tsx", description: "Social + email, remember me, forgot link.", source: authSrc, render: () => <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6"><LoginForm /></div> },
      { id: "register", title: "Register", file: "blocks/auth/auth.tsx", description: "Live password checklist instead of a vague strength bar.", source: authSrc, render: () => <div className="w-full max-w-md"><RegisterForm /></div> },
      { id: "forgot", title: "Forgot password", file: "blocks/auth/auth.tsx", description: "Neutral confirmation copy (no account enumeration).", source: authSrc, render: () => <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6"><ForgotPasswordForm /></div> },
      { id: "two-factor", title: "Two-factor / verify", file: "blocks/auth/auth.tsx", description: "InputOTP with paste + SMS autofill, auto-submit, resend countdown. Code: 246810.", source: authSrc, render: () => <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6"><TwoFactorForm /></div> },
    ],
  },
  {
    id: "apps",
    title: "Apps",
    description: "Full application screens built on Resizable, ContextMenu and Menubar. Every right-click action is mirrored in a visible menu; nothing is drag-only.",
    blocks: [
      { id: "inbox", title: "Inbox app", file: "blocks/apps/inbox.tsx", description: "Folders · list · reader in resizable panes; filter, search, right-click and ⋯ actions, reply. Single pane with Back on phones.", source: inboxSrc,
        render: () => <div className="w-full"><InboxApp /></div>, frame: "page", full: "/blocks/inbox/full" },
      { id: "workflow", title: "Workflow builder", file: "blocks/apps/workflow-builder.tsx", description: "Menubar, ordered step flow with + inserts (Command search), inspector, validation and an announced test run.", source: workflowSrc,
        render: () => <div className="w-full"><WorkflowBuilder /></div>, frame: "page", full: "/blocks/workflow/full" },
      { id: "kanban-app", title: "Kanban app", file: "blocks/apps/kanban-app.tsx", description: "Project header, search, priority filter, DS Kanban (drag or keyboard), card sheet with a non-drag status change.", source: kanbanSrc,
        render: () => <div className="w-full"><KanbanApp /></div>, frame: "page", full: "/blocks/kanban/full" },
      { id: "event-calendar", title: "Event calendar", file: "blocks/apps/event-calendar.tsx", description: "Mini date grid, calendar filters, month/week views, validated New-event dialog (click an empty slot to pre-fill).", source: eventCalSrc,
        render: () => <div className="w-full"><EventCalendar /></div>, frame: "page", full: "/blocks/calendar/full" },
      { id: "timeline", title: "Project timeline (Gantt)", file: "blocks/apps/project-timeline.tsx", description: "DS GanttChart with day/week zoom, milestones and a status legend.", source: timelineSrc,
        render: () => <div className="w-full"><ProjectTimeline /></div>, frame: "page", full: "/blocks/timeline/full" },
    ],
  },
  {
    id: "map",
    title: "Map",
    description: "Store locator: accessible list + a schematic map with pins from real coordinates. Swap the SVG for MapLibre / Leaflet / Google Maps and keep the list.",
    blocks: [
      { id: "store-locator", title: "Store locator", file: "blocks/apps/store-locator.tsx", description: "Search, Open-now toggle, distance sort (haversine), shared list/pin selection, directions link.", source: locatorSrc,
        render: () => <div className="w-full"><StoreLocator /></div>, frame: "page", full: "/blocks/map/full" },
    ],
  },
  {
    id: "bento",
    title: "Bento grid",
    description: "Feature tiles on a 6-column grid with mixed spans; live DS components inside (Chart, Carousel, state illustrations).",
    blocks: [
      { id: "bento-01", title: "Bento grid", file: "blocks/apps/bento-grid.tsx", description: "Spans 4·2 / 2·2 / 3·3 / 4·2, one column on phones.", source: bentoSrc, render: () => <BentoGrid />, frame: "page" },
    ],
  },
];

function BlockView({ block }: { block: Block }) {
  return (
    <article id={block.id} aria-labelledby={`${block.id}-t`} className="grid scroll-mt-20 gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 id={`${block.id}-t`} className="text-base font-semibold tracking-tight">{block.title}</h3>
        <Badge variant="secondary" className="font-mono font-normal">{block.file}</Badge>
      </div>
      <p className="-mt-1 text-sm text-muted-foreground">{block.description}</p>
      <Tabs defaultValue="preview">
        <div className="flex items-center justify-between gap-2">
          <TabsList aria-label={`${block.title} view`}>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          {(block.frame === "none" || block.full) && (
            <Button variant="outline" size="sm" asChild>
              <a href={href(block.full ?? "/blocks/dashboard/full")}><Maximize2 aria-hidden /> Full screen</a>
            </Button>
          )}
        </div>
        <TabsContent value="preview" className="mt-3">
          {block.frame === "none" || block.frame === "page" ? (
            block.render()
          ) : (
            <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-border bg-muted/40 p-4 sm:p-8">{block.render()}</div>
          )}
        </TabsContent>
        <TabsContent value="code" className="mt-3">
          <div className="max-h-[560px] overflow-auto rounded-xl"><CodeBlock code={block.source} /></div>
        </TabsContent>
      </Tabs>
    </article>
  );
}

export function BlocksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Library · v6"
        title="Blocks"
        description="Dashboard, application, marketing, eCommerce, authentication, apps, bento and map blocks in the shadcn/ui language — the categories of shadcnstudio.com, built only from agere DS components and tokens. Copy a file from src/blocks, swap the sample data for your API, ship."
        badges={<Badge variant="outline">{GROUPS.reduce((a, g) => a + g.blocks.length, 0)} blocks</Badge>}
        actions={
          <>
            <Button asChild><a href={href("/blocks/dashboard/full")}><Maximize2 aria-hidden /> Open dashboard</a></Button>
            <Button variant="outline" asChild><a href="https://shadcnstudio.com/blocks#dashboard-and-application" target="_blank" rel="noreferrer">Reference <ExternalLink aria-hidden /></a></Button>
          </>
        }
      />
      <nav aria-label="Block categories" className="sticky top-0 z-sticky -mx-4 flex gap-1 overflow-x-auto border-b border-border bg-background/90 px-4 py-2 backdrop-blur-glass sm:-mx-8 sm:px-8">
        {GROUPS.map((g) => (
          <a key={g.id} href={`#/blocks`} onClick={(e) => { e.preventDefault(); document.getElementById(`grp-${g.id}`)?.scrollIntoView({ behavior: "smooth" }); }} className="inline-flex h-8 shrink-0 items-center rounded-md px-3 text-sm font-medium text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-ring">
            {g.title}
          </a>
        ))}
      </nav>
      {GROUPS.map((g) => (
        <Section key={g.id} id={`grp-${g.id}`} title={g.title} description={g.description}>
          <div className="grid gap-10">{g.blocks.map((b) => <BlockView key={b.id} block={b} />)}</div>
        </Section>
      ))}
      <Section id="usage" title="Using a block">
        <Prose>
          <p>Blocks are source, not a package: copy the file into your app. They import only from <code>@/components/ui</code>, <code>@/lib</code> and their sibling <code>./data</code>.</p>
          <ul>
            <li><strong>Colors</strong> — chart configs may use <code>var(--chart-1)</code> exactly like shadcn v4; <code>ChartContainer</code> converts it to <code>hsl(var(--chart-1))</code> for this Tailwind 3 token format.</li>
            <li><strong>Shell</strong> — <code>DashboardShell</code> wraps <code>SidebarProvider</code>. Pass <code>variant="sidebar"</code> for a flush sidebar, or <code>contained</code> to render inside a bounded frame.</li>
            <li><strong>Pasting from shadcnstudio</strong> — class names and component APIs match. Raw Tailwind palette classes (<code>text-green-600</code>) are intentionally unavailable: map them to <code>text-success-on-surface</code> (text on a page or card), <code>text-success-fg</code> (text on <code>bg-success-bg</code>), <code>bg-chart-2</code> etc.</li>
          </ul>
        </Prose>
      </Section>
    </>
  );
}

export function InboxFullPage() {
  React.useEffect(() => { document.title = "Inbox · agere blocks"; }, []);
  return <div className="min-h-dvh bg-muted/40 p-0 sm:p-6"><InboxApp className="h-[calc(100dvh-3rem)] max-sm:h-dvh max-sm:rounded-none" /></div>;
}
export function WorkflowFullPage() {
  React.useEffect(() => { document.title = "Workflow builder · agere blocks"; }, []);
  return <div className="min-h-dvh bg-muted/40 p-0 sm:p-6"><WorkflowBuilder className="h-[calc(100dvh-3rem)] max-sm:h-dvh max-sm:rounded-none" /></div>;
}

const fullFrame = (el: React.ReactElement, title: string) => {
  const Comp = () => {
    React.useEffect(() => { document.title = `${title} · agere blocks`; }, []);
    // v7: full-screen routes are pages of their own — one <main> landmark and an <h1> (axe landmark-one-main, page-has-heading-one).
    return <main className="min-h-dvh bg-muted/40 p-0 sm:p-6"><h1 className="sr-only">{title}</h1>{React.cloneElement(el as React.ReactElement<{ className?: string }>, { className: "h-[calc(100dvh-3rem)] max-sm:h-dvh max-sm:rounded-none" })}</main>;
  };
  return Comp;
};
export const KanbanFullPage = fullFrame(<KanbanApp />, "Kanban");
export const CalendarFullPage = fullFrame(<EventCalendar />, "Calendar");
export const TimelineFullPage = fullFrame(<ProjectTimeline />, "Timeline");
export const MapFullPage = fullFrame(<StoreLocator />, "Store locator");

/** Full-viewport landing page and auth flow, rendered outside the docs chrome. */
export function LandingFullPage() {
  React.useEffect(() => { document.title = "Landing · agere DS blocks"; }, []);
  return <LandingPage />;
}
export function AuthFullPage() {
  React.useEffect(() => { document.title = "Sign in · agere DS blocks"; }, []);
  return <main className="grid min-h-dvh place-items-stretch bg-background p-0 sm:p-6"><AuthFlow /></main>;
}

/** Full-viewport dashboard, rendered outside the docs chrome. */
export function DashboardFullPage() {
  React.useEffect(() => { document.title = "Dashboard · agere DS blocks"; }, []);
  return <DashboardPage />;
}
