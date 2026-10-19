"use client";

import * as React from "react";
import { BarChart3, CreditCard, LayoutDashboard, Plus, Settings2, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CommandPalette, type CommandItem } from "@/components/ui/command-palette";
import { toast } from "@/components/ui/toast";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";
import { SectionCards } from "./section-cards";
import { ChartAreaInteractive, ChartBarStacked, ChartDonut } from "./charts";
import { ActivityFeed, RecentTransactions } from "./widgets";
import { OrdersTable } from "./orders-table";

export interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
  /** Sidebar look: "inset" (raised canvas, shadcnstudio default), "sidebar" (flush), "floating". */
  variant?: "inset" | "sidebar" | "floating";
  /**
   * Render inside a bounded frame instead of the viewport (docs gallery, Storybook, screenshots).
   * The frame gets `transform`, so the sidebar's `position: fixed` resolves against it.
   */
  contained?: boolean;
  className?: string;
}

/**
 * Block · Dashboard shell (shadcnstudio "Dashboard Shell" / shadcn sidebar-07 + dashboard-01).
 * SidebarProvider → AppSidebar (collapsible="icon", ⌘B) → SidebarInset → SiteHeader + page.
 * ⌘K opens the command palette from anywhere in the shell.
 */
export function DashboardShell({ children, title = "Dashboard", variant = "inset", contained = false, className }: DashboardShellProps) {
  const [cmd, setCmd] = React.useState(false);
  const items: CommandItem[] = [
    { id: "dash", label: "Dashboard", group: "Navigate", icon: <LayoutDashboard />, onSelect: () => toast("Dashboard") },
    { id: "analytics", label: "Analytics", group: "Navigate", icon: <BarChart3 />, onSelect: () => toast("Analytics") },
    { id: "customers", label: "Customers", group: "Navigate", icon: <Users />, onSelect: () => toast("Customers") },
    { id: "billing", label: "Billing", group: "Navigate", icon: <CreditCard />, onSelect: () => toast("Billing") },
    { id: "new", label: "New project", group: "Actions", icon: <Plus />, shortcut: "N", onSelect: () => toast.success("Project created") },
    { id: "settings", label: "Settings", group: "Actions", icon: <Settings2 />, onSelect: () => toast("Settings") },
  ];
  return (
    <div className={cn(contained && "relative h-[760px] overflow-hidden rounded-xl border border-border [transform:translateZ(0)]", className)}>
      <SidebarProvider className={cn(contained && "h-full min-h-0")}>
        <AppSidebar variant={variant} className={cn(contained && "!h-full")} />
        <SidebarInset {...(contained ? { id: "dashboard-main" } : {})} className={cn(contained && "min-h-0 overflow-y-auto")}>
          <SiteHeader title={title} onSearch={() => setCmd(true)} />
          <div className="flex flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <CommandPalette items={items} open={cmd} onOpenChange={setCmd} hotkey={contained ? false : "k"} />
    </div>
  );
}

/** The dashboard page body (stat cards → charts → widgets → table), 24px rhythm like shadcn dashboard-01.
 *  Every row sizes from its container (auto-fit / flex-basis), so it also works in the contained preview. */
export function DashboardOverview() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* v7: keeps the outline h1 → h2 → h3 for the card titles below (axe heading-order). */}
      <h2 className="sr-only">Overview</h2>
      <div className="px-4 lg:px-6"><SectionCards /></div>
      <div className="flex flex-wrap gap-4 px-4 md:gap-6 lg:px-6">
        <div className="min-w-0 flex-[2_1_30rem]"><ChartAreaInteractive /></div>
        <div className="min-w-0 flex-[1_1_18rem] [&>*]:h-full"><ChartDonut /></div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-4 px-4 md:gap-6 lg:px-6">
        <ChartBarStacked />
        <RecentTransactions />
        <ActivityFeed />
      </div>
      <div className="px-4 lg:px-6"><OrdersTable /></div>
    </div>
  );
}

/** Full page: shell + overview. Drop into app/(dashboard)/page.tsx. */
export function DashboardPage(props: Omit<DashboardShellProps, "children">) {
  return (
    <DashboardShell {...props}>
      <DashboardOverview />
    </DashboardShell>
  );
}
