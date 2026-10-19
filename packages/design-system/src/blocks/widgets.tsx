"use client";

import * as React from "react";
import { AlertTriangle, ArrowUpRight, CheckCircle2, FileText, MoreHorizontal, Sparkles, UserPlus } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { activity, orders, team, usd, type OrderStatus } from "./data";

export const STATUS_BADGE: Record<OrderStatus, { label: string; variant: "success" | "attention" | "gray" | "error" }> = {
  paid: { label: "Paid", variant: "success" },
  pending: { label: "Pending", variant: "attention" },
  refunded: { label: "Refunded", variant: "gray" },
  failed: { label: "Failed", variant: "error" },
};

/** Block · Recent transactions widget (list, not a table — 5 rows, no sorting). */
export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent sales</CardTitle>
        <CardDescription>You made 265 sales this month.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm" asChild>
            <a href="#/blocks/datatable">View all <ArrowUpRight aria-hidden /></a>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-5">
          {orders.slice(0, 5).map((o) => (
            <li key={o.id} className="flex items-center gap-3">
              <Avatar name={o.customer} size="lg" aria-hidden />
              <div className="grid min-w-0 flex-1 gap-0.5">
                <p className="truncate text-sm font-medium leading-none">{o.customer}</p>
                <p className="truncate text-sm text-muted-foreground">{o.email}</p>
              </div>
              <Badge variant={STATUS_BADGE[o.status].variant} className="hidden sm:inline-flex">{STATUS_BADGE[o.status].label}</Badge>
              <p className="w-20 text-right text-sm font-medium tabular-nums">{o.status === "refunded" ? "−" : "+"}{usd(o.amount, 2)}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

const KIND_ICON = { upgrade: Sparkles, invite: UserPlus, alert: AlertTriangle, doc: FileText, done: CheckCircle2 } as const;

/** Block · Activity feed widget (timeline). */
export function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>What changed across your workspace.</CardDescription>
        <CardAction>
          <Select defaultValue="today">
            <SelectTrigger size="md" className="h-8 w-28" aria-label="Activity period"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ol className="relative grid gap-5 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-px before:bg-border">
          {activity.map((a) => {
            const Icon = KIND_ICON[a.kind];
            return (
              <li key={a.id} className="relative flex gap-3">
                <span aria-hidden className={a.kind === "alert" ? "z-[1] grid size-8 shrink-0 place-items-center rounded-full border border-border bg-background text-destructive" : "z-[1] grid size-8 shrink-0 place-items-center rounded-full border border-border bg-background text-muted-foreground"}>
                  <Icon className="size-4" />
                </span>
                <div className="grid gap-0.5 pt-1">
                  <p className="text-sm"><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span> <span className="font-medium">{a.target}</span></p>
                  <p className="text-xs text-muted-foreground"><time>{a.when}</time></p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}

/** Block · Team members widget with role picker (shadcn "cards" example). */
export function TeamMembers() {
  const [roles, setRoles] = React.useState<Record<string, string>>(() => Object.fromEntries(team.map((m) => [m.id, m.role])));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team members</CardTitle>
        <CardDescription>Invite your team to collaborate.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        {team.map((m) => (
          <div key={m.id} className="flex items-center gap-3">
            <Avatar name={m.name} size="lg" aria-hidden />
            <div className="grid min-w-0 flex-1 gap-0.5">
              <p className="truncate text-sm font-medium leading-none">{m.name}</p>
              <p className="truncate text-sm text-muted-foreground">{m.email}</p>
            </div>
            <Select value={roles[m.id]} onValueChange={(v) => setRoles((r) => ({ ...r, [m.id]: v }))} disabled={m.role === "Owner"}>
              <SelectTrigger size="md" className="h-8 w-28" aria-label={`Role for ${m.name}`}><SelectValue /></SelectTrigger>
              <SelectContent align="end">
                {["Owner", "Admin", "Member", "Viewer"].map((r) => <SelectItem key={r} value={r} disabled={r === "Owner"}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/** Block · Usage / plan widget with progress meters. */
export function UsageWidget() {
  const meters = [
    { label: "Seats", used: 18, total: 25 },
    { label: "Storage", used: 64, total: 100, unit: "GB" },
    { label: "API calls", used: 912_000, total: 1_000_000 },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan usage</CardTitle>
        <CardDescription>Pro plan · renews 1 October</CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8" aria-label="Plan actions"><MoreHorizontal aria-hidden /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Change plan</DropdownMenuItem>
              <DropdownMenuItem>Billing history</DropdownMenuItem>
              <DropdownMenuItem destructive>Cancel subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-5">
        {meters.map((m) => {
          const pct = Math.round((m.used / m.total) * 100);
          const fmt = (n: number) => (n >= 1000 ? `${Math.round(n / 1000).toLocaleString()}k` : n.toString());
          return (
            <div key={m.label} className="grid gap-2">
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium">{m.label}</span>
                <span className="text-muted-foreground tabular-nums">{fmt(m.used)} / {fmt(m.total)}{m.unit ? ` ${m.unit}` : ""}</span>
              </div>
              <Progress value={pct} size="md" tone={pct >= 90 ? "attention" : "default"} aria-label={`${m.label}: ${pct}% used`} />
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline">Upgrade plan</Button>
      </CardFooter>
    </Card>
  );
}
