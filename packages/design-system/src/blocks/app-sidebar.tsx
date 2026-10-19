"use client";

import * as React from "react";
import {
  BarChart3, ChevronRight, CreditCard, FolderKanban, Inbox, LayoutDashboard, LifeBuoy, MoreHorizontal, Plus, Send, Settings2, Users,
} from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton,
  SidebarMenuSubItem, SidebarRail, type SidebarProps,
} from "@/components/ui/sidebar";
import { Logo } from "@/brand/logo";
import { NavUser } from "./nav-user";
import { currentUser } from "./data";

type NavItem = { title: string; icon: React.ComponentType<{ className?: string }>; active?: boolean; badge?: string; items?: { title: string; active?: boolean }[] };

const MAIN: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, active: true },
  { title: "Analytics", icon: BarChart3, items: [{ title: "Overview" }, { title: "Traffic" }, { title: "Retention" }] },
  { title: "Inbox", icon: Inbox, badge: "12" },
  { title: "Customers", icon: Users },
  { title: "Billing", icon: CreditCard, items: [{ title: "Invoices" }, { title: "Plans" }, { title: "Payouts" }] },
];
const PROJECTS = ["Mimo Recruiter", "Careflow Portal", "Neralink Engine"];
const SECONDARY = [
  { title: "Support", icon: LifeBuoy },
  { title: "Feedback", icon: Send },
];

/**
 * Block · Dashboard sidebar (shadcnstudio "Dashboard Sidebar" / shadcn sidebar-07).
 * collapsible="icon": ⌘B collapses to a 48px rail with tooltips; below md it becomes an off-canvas sheet.
 */
export function AppSidebar(props: SidebarProps) {
  return (
    <Sidebar collapsible="icon" label="Main" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#/blocks">
                <span className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Logo variant="mark" height={16} tone="mono" title="" />
                </span>
                <span className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">agere</span>
                  <span className="truncate text-xs text-muted-foreground">Enterprise</span>
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {MAIN.map((item) =>
              item.items ? (
                <Collapsible key={item.title} asChild defaultOpen={item.title === "Analytics"} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" aria-hidden />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((sub) => (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton href="#/blocks" isActive={sub.active}>
                              <span>{sub.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.active} tooltip={item.title}>
                    <a href="#/blocks" aria-current={item.active ? "page" : undefined}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.badge && <SidebarMenuBadge aria-label={`${item.badge} unread`}>{item.badge}</SidebarMenuBadge>}
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupAction aria-label="Add project" title="Add project">
            <Plus aria-hidden />
          </SidebarGroupAction>
          <SidebarMenu>
            {PROJECTS.map((p) => (
              <SidebarMenuItem key={p}>
                <SidebarMenuButton asChild>
                  <a href="#/blocks">
                    <FolderKanban />
                    <span>{p}</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuAction showOnHover aria-label={`More actions for ${p}`}>
                  <MoreHorizontal aria-hidden />
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {SECONDARY.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="sm" tooltip={item.title}>
                    <a href="#/blocks">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild size="sm" tooltip="Settings">
                  <a href="#/blocks"><Settings2 /><span>Settings</span></a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
