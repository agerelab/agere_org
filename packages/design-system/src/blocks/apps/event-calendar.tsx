"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { addDays, toDateKey } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Calendar as DateGrid } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldControl, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { toast } from "@/components/ui/toast";
import { Calendar as MonthCalendar, CalendarGrid, CalendarTimeGrid } from "@/components/agere-ds/calendar";
import { CALENDARS, EVENTS, TODAY, toCalendarItems, type EventCalendarKind } from "./workspace-data";

const TIMES = Array.from({ length: 24 }, (_, i) => `${String(8 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`);
type View = "month" | "week";

/**
 * Block · Event calendar (shadcnstudio "Event Calendar"). Sidebar: mini date grid (shadcn Calendar) + calendar
 * filters (FieldSet of checkboxes). Main: Month (DS Calendar) or Week (DS CalendarTimeGrid). "New event" dialog uses
 * Field + DatePicker + time Selects and validates end > start; clicking an empty week slot pre-fills it.
 */
export function EventCalendar({ className }: { className?: string }) {
  const [events, setEvents] = React.useState(EVENTS);
  const [view, setView] = React.useState<View>("week");
  const [date, setDate] = React.useState(TODAY);
  const [shown, setShown] = React.useState<Record<EventCalendarKind, boolean>>({ meeting: true, task: true, focus: true });
  const [draft, setDraft] = React.useState<{ title: string; day?: Date; start: string; end: string; kind: EventCalendarKind } | null>(null);
  const [error, setError] = React.useState<{ field: "title" | "date" | "time"; message: string }>();

  const visible = events.filter((e) => shown[e.kind]);
  const step = (dir: -1 | 1) => setDate((d) => (view === "week" ? addDays(d, 7 * dir) : new Date(d.getFullYear(), d.getMonth() + dir, 1)));
  const heading = view === "week"
    ? `Week of ${addDays(date, -((date.getDay() + 6) % 7)).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
    : date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const openNew = (iso?: string) => {
    setError(undefined);
    const day = iso ? new Date(iso.slice(0, 10) + "T00:00") : date;
    const start = iso ? iso.slice(11, 16) : "09:00";
    const end = TIMES[Math.min(TIMES.indexOf(start) + 2, TIMES.length - 1)] ?? "10:00";
    setDraft({ title: "", day, start: TIMES.includes(start) ? start : "09:00", end, kind: "meeting" });
  };
  const save = () => {
    if (!draft) return;
    if (!draft.title.trim()) return setError({ field: "title", message: "Give the event a title." });
    if (!draft.day) return setError({ field: "date", message: "Pick a date." });
    if (draft.end <= draft.start) return setError({ field: "time", message: "End time must be after the start time." });
    const key = toDateKey(draft.day);
    setEvents((l) => [...l, { id: `e${Date.now()}`, title: draft.title.trim(), start: `${key}T${draft.start}`, end: `${key}T${draft.end}`, kind: draft.kind, tone: draft.kind === "meeting" ? "info" : draft.kind === "task" ? "error" : "attention" }]);
    toast.success(`“${draft.title.trim()}” added`);
    setDraft(null);
  };

  return (
    <div className={cn("flex h-[760px] overflow-hidden rounded-xl border border-border bg-background", className)}>
      <aside aria-label="Calendar sidebar" className="hidden w-[272px] shrink-0 flex-col gap-4 border-r border-border p-4 lg:flex">
        <Button leadingIcon={<Plus />} onClick={() => openNew()}>New event</Button>
        <DateGrid mode="single" weekStartsOn={1} selected={date} month={date} onMonthChange={setDate} onSelect={(d) => d && setDate(d)} className="-mx-1 p-0" />
        <FieldSet>
          <FieldLegend variant="label">My calendars</FieldLegend>
          <FieldGroup className="gap-3">
            {CALENDARS.map((c) => (
              <Field key={c.id} orientation="horizontal">
                <FieldControl><Checkbox checked={shown[c.id]} onCheckedChange={(v) => setShown((s) => ({ ...s, [c.id]: v === true }))} /></FieldControl>
                <FieldLabel className="font-normal"><span aria-hidden className={cn("size-2.5 rounded-sm", c.tone)} />{c.label}</FieldLabel>
              </Field>
            ))}
          </FieldGroup>
        </FieldSet>
      </aside>

      <section aria-labelledby="cal-heading" className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          <Button variant="outline" size="sm" onClick={() => setDate(TODAY)}>Today</Button>
          <div className="flex">
            <Button variant="ghost" size="icon" className="size-8" onClick={() => step(-1)} aria-label={view === "week" ? "Previous week" : "Previous month"}><ChevronLeft aria-hidden /></Button>
            <Button variant="ghost" size="icon" className="size-8" onClick={() => step(1)} aria-label={view === "week" ? "Next week" : "Next month"}><ChevronRight aria-hidden /></Button>
          </div>
          <h2 id="cal-heading" className="text-base font-semibold" aria-live="polite">{heading}</h2>
          <div className="ml-auto flex items-center gap-2">
            <SegmentedControl aria-label="Calendar view" value={view} onValueChange={setView} options={[{ value: "month", label: "Month" }, { value: "week", label: "Week" }]} />
            <Button size="sm" className="lg:hidden" leadingIcon={<Plus />} onClick={() => openNew()}>New</Button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          {view === "week" ? (
            <CalendarTimeGrid view="week" date={toDateKey(date)} events={visible} now={new Date(2026, 8, 25, 11, 15)} startHour={7} endHour={20}
              weekStartsOn={1} locale="en-US" onSlotClick={openNew} onEventClick={(id) => toast(visible.find((e) => e.id === id)?.title ?? "Event")} className="h-full rounded-none border-0" />
          ) : (
            <MonthCalendar items={toCalendarItems(visible)} month={date} onMonthChange={setDate} weekStartsOn={1} locale="en-US" maxVisibleItems={3} readOnly
              onItemClick={(id) => toast(visible.find((e) => e.id === id)?.title ?? "Event")} className="h-full rounded-none border-0">
              <CalendarGrid />
            </MonthCalendar>
          )}
        </div>
      </section>

      <Dialog open={!!draft} onOpenChange={(o) => !o && setDraft(null)}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>New event</DialogTitle>
            <DialogDescription>It's added to your calendar only; invite people after saving.</DialogDescription>
          </DialogHeader>
          {draft && (
            <form id="new-event" noValidate onSubmit={(e) => { e.preventDefault(); save(); }}>
              <FieldGroup className="gap-5">
                <Field invalid={error?.field === "title"}>
                  <FieldLabel>Title</FieldLabel>
                  <FieldControl><Input autoFocus value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Pilot call — Kulina HR" /></FieldControl>
                  {error?.field === "title" && <FieldError>{error.message}</FieldError>}
                </Field>
                <Field invalid={error?.field === "date"}>
                  <FieldLabel>Date</FieldLabel>
                  <FieldControl><DatePicker value={draft.day} onValueChange={(d) => setDraft({ ...draft, day: d })} /></FieldControl>
                  {error?.field === "date" && <FieldError>{error.message}</FieldError>}
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field invalid={error?.field === "time"}>
                    <FieldLabel>Starts</FieldLabel>
                    <Select value={draft.start} onValueChange={(v) => setDraft({ ...draft, start: v })}>
                      <FieldControl><SelectTrigger><SelectValue /></SelectTrigger></FieldControl>
                      <SelectContent>{TIMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                  </Field>
                  <Field invalid={error?.field === "time"}>
                    <FieldLabel>Ends</FieldLabel>
                    <Select value={draft.end} onValueChange={(v) => setDraft({ ...draft, end: v })}>
                      <FieldControl><SelectTrigger><SelectValue /></SelectTrigger></FieldControl>
                      <SelectContent>{TIMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                    {error?.field === "time" && <FieldError>{error.message}</FieldError>}
                  </Field>
                </div>
                <Field>
                  <FieldLabel>Calendar</FieldLabel>
                  <Select value={draft.kind} onValueChange={(v) => setDraft({ ...draft, kind: v as EventCalendarKind })}>
                    <FieldControl><SelectTrigger><SelectValue /></SelectTrigger></FieldControl>
                    <SelectContent>{CALENDARS.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </form>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
            <Button type="submit" form="new-event">Save event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
