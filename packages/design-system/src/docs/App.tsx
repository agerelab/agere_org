import * as React from "react";
import {
  BookOpen, Blocks, Component, MousePointerClick, LayoutTemplate, LayoutDashboard, Rows3, Server, Store, FileCode2, GitBranch, Home, Image, Layers, Moon, Palette, PenLine, Ruler, ShieldCheck, Sparkles, Stamp, Sun, Type, Users, Workflow, ListChecks,
} from "lucide-react";

import { AppShell, Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarItem, SidebarSection } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/brand/logo";
import { setTheme } from "@/lib/theme";
import { href, useRoute } from "./kit";
import { OverviewPage } from "./pages/overview";
import { ColorPage, EffectsPage, SpacingPage, TypographyPage } from "./pages/foundations";
import { ComponentPage, ComponentsCatalog } from "./pages/components";
import { PatternsPage } from "./pages/patterns";
import { AccessibilityPage, ContentPage } from "./pages/guidelines";
import { ActionsPage } from "./pages/actions";
import { InterfaceRulesPage } from "./pages/interface-rules";
import { LogoPage, MediaPage } from "./pages/brand";
import { ArchitecturePage, TestingPage, TokensPage } from "./pages/engineering";
import { ContributionPage, VersioningPage } from "./pages/governance";
import { MarketplacePage, NextjsPage, WorkspacePage, WorkspaceTokensPage } from "./pages/workspace";
import { AuthFullPage, BlocksPage, CalendarFullPage, DashboardFullPage, InboxFullPage, KanbanFullPage, LandingFullPage, MapFullPage, TimelineFullPage, WorkflowFullPage } from "./pages/blocks";

const NAV: { label?: string; items: { to: string; label: string; icon: React.ReactNode }[] }[] = [
  { items: [{ to: "/", label: "Overview", icon: <Home /> }] },
  {
    label: "Foundations",
    items: [
      { to: "/foundations/color", label: "Color", icon: <Palette /> },
      { to: "/foundations/typography", label: "Typography", icon: <Type /> },
      { to: "/foundations/spacing", label: "Spacing & layout", icon: <Ruler /> },
      { to: "/foundations/effects", label: "Effects & motion", icon: <Layers /> },
    ],
  },
  {
    label: "Library",
    items: [
      { to: "/components", label: "Components", icon: <Component /> },
      { to: "/blocks", label: "Blocks", icon: <LayoutTemplate /> },
      { to: "/patterns", label: "Patterns", icon: <Blocks /> },
    ],
  },
  {
    label: "Workspace",
    items: [
      { to: "/workspace", label: "Workspace app", icon: <LayoutDashboard /> },
      { to: "/workspace/tokens", label: "Workspace tokens", icon: <Rows3 /> },
      { to: "/workspace/marketplace", label: "App marketplace", icon: <Store /> },
    ],
  },
  {
    label: "Guidelines",
    items: [
      { to: "/guidelines/accessibility", label: "Accessibility", icon: <ShieldCheck /> },
      { to: "/guidelines/content", label: "Content & UX writing", icon: <PenLine /> },
      { to: "/guidelines/actions", label: "Actions & CTA", icon: <MousePointerClick /> },
      { to: "/guidelines/interface-rules", label: "Interface rules", icon: <ListChecks /> },
    ],
  },
  {
    label: "Brand",
    items: [
      { to: "/brand/logo", label: "Logo & identity", icon: <Stamp /> },
      { to: "/brand/media", label: "Media assets", icon: <Image /> },
    ],
  },
  {
    label: "Engineering",
    items: [
      { to: "/engineering/architecture", label: "Architecture", icon: <FileCode2 /> },
      { to: "/engineering/tokens", label: "Token pipeline", icon: <Workflow /> },
      { to: "/engineering/nextjs", label: "Next.js App Router", icon: <Server /> },
      { to: "/engineering/testing", label: "Testing & QA", icon: <Sparkles /> },
    ],
  },
  {
    label: "Governance",
    items: [
      { to: "/governance/versioning", label: "Versioning & releases", icon: <GitBranch /> },
      { to: "/governance/contribution", label: "Contribution", icon: <Users /> },
    ],
  },
];

function page(route: string) {
  if (route.startsWith("/components/")) return <ComponentPage id={route.split("/")[2]} />;
  switch (route) {
    case "/components": return <ComponentsCatalog />;
    case "/foundations/color": return <ColorPage />;
    case "/foundations/typography": return <TypographyPage />;
    case "/foundations/spacing": return <SpacingPage />;
    case "/foundations/effects": return <EffectsPage />;
    case "/patterns": return <PatternsPage />;
    case "/blocks": return <BlocksPage />;
    case "/workspace": return <WorkspacePage />;
    case "/workspace/tokens": return <WorkspaceTokensPage />;
    case "/workspace/marketplace": return <MarketplacePage />;
    case "/engineering/nextjs": return <NextjsPage />;
    case "/guidelines/accessibility": return <AccessibilityPage />;
    case "/guidelines/content": return <ContentPage />;
    case "/guidelines/actions": return <ActionsPage />;
    case "/guidelines/interface-rules": return <InterfaceRulesPage />;
    case "/brand/logo": return <LogoPage />;
    case "/brand/media": return <MediaPage />;
    case "/engineering/architecture": return <ArchitecturePage />;
    case "/engineering/tokens": return <TokensPage />;
    case "/engineering/testing": return <TestingPage />;
    case "/governance/versioning": return <VersioningPage />;
    case "/governance/contribution": return <ContributionPage />;
    default: return <OverviewPage />;
  }
}

type Brand = "default" | "agere-amber" | "indigo" | "emerald";

export default function DocsApp() {
  const route = useRoute();
  const [mode, setMode] = React.useState<"light" | "dark">(() => {
    const host = document.documentElement.dataset.theme; // embedding host (e.g. artifact viewer) may stamp a theme
    if (host === "dark" || host === "light") return host;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [brand, setBrand] = React.useState<Brand>("default");

  React.useEffect(() => {
    setTheme(mode);
    document.documentElement.dataset.theme = mode; // keep [data-theme] and .dark in agreement
  }, [mode]);
  React.useEffect(() => {
    const el = document.documentElement;
    if (brand === "default") delete el.dataset.brand; else el.dataset.brand = brand;
  }, [brand]);

  const isActive = (to: string) => (to === "/" ? route === "/" : route === to || (to === "/components" && route.startsWith("/components/")) || (to === "/blocks" && route.startsWith("/blocks")));

  const controls = (
    <div className="grid gap-2">
      <SegmentedControl
        aria-label="Color mode"
        size="sm"
        value={mode}
        onValueChange={setMode}
        className="w-full [&>*]:flex-1"
        options={[{ value: "light", label: "Light", icon: <Sun /> }, { value: "dark", label: "Dark", icon: <Moon /> }]}
      />
      <Select value={brand} onValueChange={(v) => setBrand(v as Brand)}>
        <SelectTrigger size="md" aria-label="White-label brand preview"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Brand: agere Ink</SelectItem>
          <SelectItem value="agere-amber">Brand: agere Amber</SelectItem>
          <SelectItem value="indigo">Brand: Indigo (venture)</SelectItem>
          <SelectItem value="emerald">Brand: Emerald (venture)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const sidebar = (
    <Sidebar label="Documentation">
      <SidebarHeader className="h-14 flex-row items-center justify-between px-4">
        <a href={href("/")} className="rounded-md focus-ring"><Logo height={22} title="agere DS home" /></a>
        <span className="rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium text-muted-foreground">v7.0</span>
      </SidebarHeader>
      <SidebarContent>
        {NAV.map((g, i) => (
          <SidebarSection key={i} label={g.label}>
            {g.items.map((it) => (
              <SidebarItem key={it.to} href={href(it.to)} icon={it.icon} active={isActive(it.to)}>{it.label}</SidebarItem>
            ))}
          </SidebarSection>
        ))}
      </SidebarContent>
      <SidebarFooter>{controls}</SidebarFooter>
    </Sidebar>
  );

  const full = { "/blocks/dashboard/full": DashboardFullPage, "/blocks/landing/full": LandingFullPage, "/blocks/auth/full": AuthFullPage, "/blocks/inbox/full": InboxFullPage, "/blocks/workflow/full": WorkflowFullPage, "/blocks/kanban/full": KanbanFullPage, "/blocks/calendar/full": CalendarFullPage, "/blocks/timeline/full": TimelineFullPage, "/blocks/map/full": MapFullPage }[route];
  if (full) {
    const Full = full;
    return (
      <TooltipProvider delayDuration={300}>
        <Full />
        <Toaster />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <AppShell sidebar={sidebar} mobileBrand={<a href={href("/")} className="rounded-md focus-ring"><Logo height={20} /></a>} mobileActions={<BookOpen aria-hidden className="size-4 text-subtle" />}>
        <div key={route} className="mx-auto w-full max-w-[1120px] animate-in fade-in-0 px-4 py-8 duration-200 sm:px-8 lg:py-12">{page(route)}</div>
      </AppShell>
      <Toaster />
    </TooltipProvider>
  );
}
