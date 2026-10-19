"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Layers3, Settings2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Alert } from "@/components/ui/alert";
import { Logo } from "@/brand/logo";
import type { Organization, Space } from "@agere/contracts";
import { t } from "~/lib/i18n";

export function OrgShell({
  organization,
  spaces,
  children,
}: {
  organization: Organization;
  spaces: Space[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const base = `/${organization.slug}`;
  const items = [
    { href: `${base}/desk`, label: t("nav.desk"), icon: Inbox, active: pathname.startsWith(`${base}/desk`) },
    { href: `${base}/space`, label: t("nav.space"), icon: Layers3, active: pathname.startsWith(`${base}/space`) },
    { href: `${base}/pengaturan`, label: t("nav.settings"), icon: Settings2, active: pathname.startsWith(`${base}/pengaturan`) },
  ];

  return (
    <SidebarProvider defaultOpen={false} className="h-svh overflow-hidden">
      <Sidebar collapsible="icon" label={t("shell.rail")}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild tooltip={organization.name}>
                <Link href={`${base}/desk`}>
                  <Logo variant="mark" height={16} tone="mono" title="" />
                  <span className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{t("app.name")}</span>
                    <span className="truncate text-xs text-muted-foreground">{organization.name}</span>
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={item.active} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="hidden h-full md:flex">
      <Sidebar collapsible="none" label={t("shell.spaces")}>
        <SidebarHeader>
          <SidebarGroupLabel>{t("shell.spaces")}</SidebarGroupLabel>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {spaces.map((space) => (
                <SidebarMenuItem key={space.id}>
                  <SidebarMenuButton asChild isActive={pathname === `${base}/space/${space.id}`}>
                    <Link href={`${base}/space/${space.id}`}>
                      <span>{space.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      </div>
      <SidebarInset className="min-h-0 overflow-y-auto">
        <div className="sticky top-0 z-sticky flex items-center gap-2 border-b border-border bg-background px-3 py-2 md:hidden">
          <SidebarTrigger />
          <span className="truncate text-sm font-medium">{organization.name}</span>
        </div>
        <div className="border-b border-border px-4 py-3 md:hidden">
          <p className="mb-2 text-xs text-muted-foreground">{t("shell.spaces")}</p>
          <div className="flex gap-2 overflow-x-auto">
            {spaces.map((space) => (
              <Link key={space.id} href={`${base}/space/${space.id}`} className="shrink-0 rounded-md border border-border px-3 py-2 text-sm">
                {space.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="p-6">
          <Alert variant="attention" live="off" title={t("shell.fakeTitle")} className="mb-6">
            {t("shell.fakeBody")}
          </Alert>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
