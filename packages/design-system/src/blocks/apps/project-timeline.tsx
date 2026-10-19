"use client";

import * as React from "react";
import { Flag } from "lucide-react";

import { cn } from "@/lib/utils";
import { addDays, parseDateKey, toDateKey } from "@/lib/date";
import { TASK_STATUS_META } from "@/lib/workspace";
import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { toast } from "@/components/ui/toast";
import { GanttChart } from "@/components/agere-ds/workspace";
import { MILESTONES, PROJECT_TASKS, TODAY, TODAY_KEY } from "./workspace-data";

/* Full class names so Tailwind's scanner sees them (template strings like `bg-task-status-${s}` are not generated). */
const LEGEND = {
  todo: "bg-task-status-todo", "in-progress": "bg-task-status-in-progress", review: "bg-task-status-review",
  blocked: "bg-task-status-blocked", complete: "bg-task-status-complete",
} as const;

/**
 * Block · Project timeline (shadcnstudio "Gantt Chart"). The DS GanttChart (bars are buttons: Tab to a task, Enter to
 * open) with day/week zoom, a milestone list and a status legend. Everything on the chart is also in the list/table
 * views, so the timeline is never the only place a date lives.
 */
export function ProjectTimeline({ className }: { className?: string }) {
  const [zoom, setZoom] = React.useState<"day" | "week">("day");
  const from = toDateKey(addDays(TODAY, -8));
  const late = PROJECT_TASKS.filter((t) => t.dueDate && t.dueDate < TODAY_KEY && !TASK_STATUS_META[t.status].done);
  return (
    <div className={cn("grid h-[640px] overflow-hidden rounded-xl border border-border bg-background lg:grid-cols-[1fr_280px]", className)}>
      <section aria-labelledby="tl-title" className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <div className="grid gap-0.5">
            <h2 id="tl-title" className="text-base font-semibold">Mimo Q4 timeline</h2>
            <p className="text-sm text-muted-foreground">{PROJECT_TASKS.length} tasks · {late.length ? `${late.length} late` : "nothing late"}</p>
          </div>
          <SegmentedControl className="ml-auto" aria-label="Zoom" value={zoom} onValueChange={setZoom} options={[{ value: "day", label: "Days" }, { value: "week", label: "Weeks" }]} />
        </div>
        <GanttChart tasks={PROJECT_TASKS} from={from} days={zoom === "day" ? 35 : 84} zoom={zoom} today={TODAY_KEY} label="Mimo Q4 tasks"
          onTaskClick={(id) => toast(PROJECT_TASKS.find((t) => t.id === id)?.title ?? "Task")} className="min-h-0 flex-1 rounded-none border-0" />
      </section>
      <aside aria-label="Milestones and legend" className="grid content-start gap-6 border-t border-border p-4 lg:border-l lg:border-t-0">
        <section aria-labelledby="ms-h" className="grid gap-2">
          <h3 id="ms-h" className="text-sm font-semibold">Milestones</h3>
          <ItemGroup aria-label="Milestones">
            {MILESTONES.map((m) => {
              const days = Math.round((parseDateKey(m.date).getTime() - TODAY.getTime()) / 86_400_000);
              return (
                <Item key={m.id} size="sm" className="px-0">
                  <ItemMedia variant="icon"><Flag aria-hidden /></ItemMedia>
                  <ItemContent>
                    <ItemTitle>{m.title}</ItemTitle>
                    <ItemDescription>{parseDateKey(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · in {days} day{days === 1 ? "" : "s"}</ItemDescription>
                  </ItemContent>
                </Item>
              );
            })}
          </ItemGroup>
        </section>
        <section aria-labelledby="lg-h" className="grid gap-2">
          <h3 id="lg-h" className="text-sm font-semibold">Status</h3>
          <ul className="grid gap-1.5 text-sm">
            {(["todo", "in-progress", "review", "blocked", "complete"] as const).map((s) => (
              <li key={s} className="flex items-center gap-2"><span aria-hidden className={cn("h-2.5 w-5 rounded-sm", LEGEND[s])} />{TASK_STATUS_META[s].label}</li>
            ))}
          </ul>
        </section>
        {late.length > 0 && <Badge variant="error" className="w-fit">{late.length} overdue</Badge>}
      </aside>
    </div>
  );
}
