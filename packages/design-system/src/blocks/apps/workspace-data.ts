/** Sample data for the Kanban / Calendar / Timeline / Map blocks — fixed to 25 Sep 2026 so screenshots and tests are stable. */
import type { WorkspaceMember, WorkspaceTask, TaskStatus } from "@/lib/workspace";
import type { CalendarItem } from "@/components/agere-ds/calendar/types";
import type { TimedEvent } from "@/components/agere-ds/calendar/time-grid";
import { addDays, toDateKey } from "@/lib/date";

export const TODAY = new Date(2026, 8, 25);
export const TODAY_KEY = toDateKey(TODAY);
const d = (n: number) => toDateKey(addDays(TODAY, n));
const at = (n: number, hm: string) => `${d(n)}T${hm}`;

export const TEAM: WorkspaceMember[] = [
  { id: "u1", name: "Bubus", presence: "online", email: "bubus@agere.id" },
  { id: "u2", name: "Nadia Putri", presence: "online", email: "nadia@agere.id" },
  { id: "u3", name: "Raka Pratama", presence: "away", email: "raka@agere.id" },
  { id: "u4", name: "Sekar Ayu", presence: "busy", email: "sekar@agere.id" },
  { id: "u5", name: "Dimas Wibowo", presence: "offline", email: "dimas@agere.id" },
];
const M = (...ids: string[]) => TEAM.filter((m) => ids.includes(m.id));

export const PROJECT_TASKS: WorkspaceTask[] = [
  { id: "k1", key: "MIMO-201", title: "Voice interview: noise suppression v2", status: "in-progress", priority: "urgent", assignees: M("u1", "u3"), startDate: d(-6), dueDate: d(2), subtasks: { total: 6, done: 4 }, comments: 9, list: "Mimo · Interview" },
  { id: "k2", key: "MIMO-204", title: "Recruiter dashboard: session filters", status: "review", priority: "high", assignees: M("u2"), startDate: d(-4), dueDate: d(1), subtasks: { total: 3, done: 3 }, comments: 4, list: "Mimo · Recruiter" },
  { id: "k3", key: "MIMO-207", title: "Audio fallback when bandwidth < 150 kbps", status: "blocked", priority: "high", assignees: M("u3"), startDate: d(-2), dueDate: d(5), subtasks: { total: 5, done: 1 }, comments: 6, list: "Mimo · Network" },
  { id: "k4", key: "MIMO-210", title: "Candidate consent copy (ID / EN)", status: "todo", priority: "normal", assignees: M("u4"), startDate: d(1), dueDate: d(6), subtasks: { total: 2, done: 0 }, comments: 1, list: "Mimo · Legal" },
  { id: "k5", key: "MIMO-212", title: "Credits usage report for admins", status: "todo", priority: "normal", assignees: M("u2", "u5"), startDate: d(3), dueDate: d(11), subtasks: { total: 4, done: 0 }, list: "Mimo · Admin" },
  { id: "k6", key: "MIMO-215", title: "Accessibility pass on interview room", status: "todo", priority: "low", assignees: M("u4"), startDate: d(6), dueDate: d(12), list: "Mimo · QA" },
  { id: "k7", key: "MIMO-198", title: "Company registration flow", status: "complete", priority: "high", assignees: M("u1"), startDate: d(-16), dueDate: d(-7), subtasks: { total: 7, done: 7 }, comments: 12, list: "Mimo · Admin" },
  { id: "k8", key: "MIMO-220", title: "Explore multi-language scoring", status: "backlog", assignees: [], dueDate: d(21), list: "Mimo · Research" },
];

export const STATUS_ORDER: TaskStatus[] = ["backlog", "todo", "in-progress", "review", "blocked", "complete"];

export const MILESTONES = [
  { id: "ms1", title: "Beta to 5 pilot companies", date: d(2) },
  { id: "ms2", title: "Pricing & credits live", date: d(12) },
  { id: "ms3", title: "Public launch", date: d(24) },
];

export type EventCalendarKind = "meeting" | "task" | "focus";
export const CALENDARS: { id: EventCalendarKind; label: string; tone: string }[] = [
  { id: "meeting", label: "Meetings", tone: "bg-info-solid" },
  { id: "task", label: "Deadlines", tone: "bg-error-solid" },
  { id: "focus", label: "Focus time", tone: "bg-attention-solid" },
];

export const EVENTS: (TimedEvent & { kind: EventCalendarKind })[] = [
  { id: "e1", title: "Mimo stand-up", start: at(0, "09:00"), end: at(0, "09:30"), kind: "meeting", tone: "info", attendees: M("u1", "u2", "u3") },
  { id: "e2", title: "Pilot call — Kulina HR", start: at(0, "13:00"), end: at(0, "14:00"), kind: "meeting", tone: "info", location: "Google Meet", attendees: M("u1", "u2") },
  { id: "e3", title: "Deep work: scoring rubric", start: at(1, "09:30"), end: at(1, "12:00"), kind: "focus", tone: "attention" },
  { id: "e4", title: "Design review (new wordmark)", start: at(3, "10:00"), end: at(3, "11:00"), kind: "meeting", tone: "info", attendees: M("u1", "u5") },
  { id: "e5", title: "MIMO-204 due", start: at(1, "16:00"), end: at(1, "16:30"), kind: "task", tone: "error", status: "review" },
  { id: "e6", title: "Sprint planning", start: at(-1, "14:00"), end: at(-1, "15:30"), kind: "meeting", tone: "info", attendees: M("u1", "u2", "u3", "u4") },
  { id: "e7", title: "Careflow clinic visit", start: at(2, "08:00"), end: at(2, "10:00"), kind: "meeting", tone: "info", location: "Klinik Sehat, Ngawi" },
  { id: "e8", title: "Deep work: audio fallback", start: at(-2, "13:00"), end: at(-2, "16:00"), kind: "focus", tone: "attention" },
];

export function toCalendarItems(events: typeof EVENTS): CalendarItem[] {
  return events.map((e) => ({
    id: e.id, title: `${e.start.slice(11, 16)} ${e.title}`, startDate: e.start.slice(0, 10),
    tags: [{ id: e.kind, label: e.kind, status: e.kind === "meeting" ? "blue" : e.kind === "task" ? "red" : "yellow" }],
  }));
}

/** Branches for the store-locator (real coordinates, East Java). */
export interface Branch { id: string; name: string; city: string; address: string; lat: number; lng: number; hours: string; open: boolean; services: string[]; phone: string }
export const BRANCHES: Branch[] = [
  { id: "b1", name: "agere Hub Surabaya", city: "Surabaya", address: "Jl. Raya Darmo 88", lat: -7.2905, lng: 112.7398, hours: "08:00–20:00", open: true, services: ["Pickup", "Returns", "Workshop"], phone: "+62 31 555 0101" },
  { id: "b2", name: "agere Point Sidoarjo", city: "Sidoarjo", address: "Jl. Pahlawan 12", lat: -7.4478, lng: 112.7183, hours: "09:00–18:00", open: true, services: ["Pickup", "Returns"], phone: "+62 31 555 0122" },
  { id: "b3", name: "agere Point Malang", city: "Malang", address: "Jl. Ijen 41", lat: -7.9666, lng: 112.6326, hours: "09:00–19:00", open: true, services: ["Pickup", "Workshop"], phone: "+62 341 555 013" },
  { id: "b4", name: "agere Point Madiun", city: "Madiun", address: "Jl. Pahlawan 5", lat: -7.6298, lng: 111.5239, hours: "09:00–17:00", open: false, services: ["Pickup"], phone: "+62 351 555 014" },
  { id: "b5", name: "agere Point Ngawi", city: "Ngawi", address: "Jl. Teuku Umar 20", lat: -7.4040, lng: 111.4460, hours: "09:00–17:00", open: true, services: ["Pickup", "Returns"], phone: "+62 351 555 015" },
  { id: "b6", name: "agere Point Kediri", city: "Kediri", address: "Jl. Dhoho 77", lat: -7.8166, lng: 112.0114, hours: "09:00–18:00", open: true, services: ["Pickup"], phone: "+62 354 555 016" },
  { id: "b7", name: "agere Point Jember", city: "Jember", address: "Jl. Gajah Mada 102", lat: -8.1724, lng: 113.7005, hours: "09:00–18:00", open: false, services: ["Pickup", "Returns"], phone: "+62 331 555 017" },
];
