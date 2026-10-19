/**
 * Sample data for the reference patterns (clearly fictional).
 * Dates are generated relative to "today" so the demo always looks current.
 */
import { addDays, toDateKey } from "@/lib/date";
import type { CustomFieldDef, WorkspaceMember, WorkspaceTask } from "@/lib/workspace";
import type { ChatMessage, ChannelItem, DirectItem, LinkedTask } from "@/components/agere-ds/chat";
import type { Transaction } from "@/components/agere-ds/finance";
import type { TimedEvent } from "@/components/agere-ds/calendar/time-grid";
import type { DocNode } from "@/components/agere-ds/docs";

const d = (n: number) => toDateKey(addDays(new Date(), n));
const dt = (n: number, hm: string) => `${d(n)}T${hm}`;

export const MEMBERS: WorkspaceMember[] = [
  { id: "u1", name: "Bubus Pratama", presence: "online" },
  { id: "u2", name: "Nadia Rahma", presence: "online" },
  { id: "u3", name: "Galih Santoso", presence: "away" },
  { id: "u4", name: "Sekar Ayu", presence: "busy" },
  { id: "u5", name: "Rizky Hakim", presence: "offline" },
  { id: "u6", name: "Dewi Lestari", presence: "online" },
];
const M = (...ids: string[]) => MEMBERS.filter((m) => ids.includes(m.id));

export const CUSTOM_FIELDS: CustomFieldDef[] = [
  { id: "points", label: "Points", kind: "number" },
  { id: "budget", label: "Budget", kind: "currency", currency: "IDR" },
  { id: "sprint", label: "Sprint", kind: "select", options: [{ value: "s14", label: "Sprint 14" }, { value: "s15", label: "Sprint 15" }] },
];

export const TASKS: WorkspaceTask[] = [
  { id: "t1", key: "AG-101", title: "Validate pricing page with 10 SME owners", status: "complete", priority: "high", assignees: M("u2"), startDate: d(-12), dueDate: d(-4), subtasks: { total: 5, done: 5 }, comments: 8, attachments: 2, timeEstimate: 480, timeTracked: 510, tags: [{ id: "g1", label: "Research", tone: "special" }], custom: { points: 5, sprint: "s14" }, list: "Kulina · Discovery" },
  { id: "t2", key: "AG-114", title: "QRIS checkout flow for subscription plans", status: "in-progress", priority: "urgent", assignees: M("u1", "u4"), startDate: d(-5), dueDate: d(2), subtasks: { total: 8, done: 5 }, comments: 14, attachments: 3, timeEstimate: 960, timeTracked: 620, tags: [{ id: "g2", label: "Payments", tone: "attention" }], custom: { points: 8, budget: 12_500_000, sprint: "s14" }, list: "Kulina · Build" },
  { id: "t3", key: "AG-117", title: "Onboarding wizard — connect Google Calendar", status: "review", priority: "high", assignees: M("u3"), startDate: d(-3), dueDate: d(1), subtasks: { total: 4, done: 3 }, comments: 5, timeEstimate: 360, timeTracked: 300, tags: [{ id: "g3", label: "Growth", tone: "success" }], custom: { points: 5, sprint: "s14" }, list: "Kulina · Build" },
  { id: "t4", key: "AG-120", title: "Migrate invoices to agere Ledger API", status: "blocked", priority: "high", assignees: M("u5"), startDate: d(-2), dueDate: d(4), subtasks: { total: 6, done: 1 }, comments: 3, tags: [{ id: "g4", label: "Finance", tone: "info" }], custom: { points: 8, budget: 30_000_000, sprint: "s14" }, list: "Kulina · Build" },
  { id: "t5", key: "AG-123", title: "WhatsApp reminder templates (ID/EN)", status: "todo", priority: "normal", assignees: M("u6", "u2"), startDate: d(1), dueDate: d(5), subtasks: { total: 3, done: 0 }, comments: 1, tags: [{ id: "g3", label: "Growth", tone: "success" }], custom: { points: 3, sprint: "s15" }, list: "Kulina · Build" },
  { id: "t6", key: "AG-124", title: "Dashboard KPIs: bookings, no-show, revenue", status: "todo", priority: "normal", assignees: M("u1"), startDate: d(3), dueDate: d(9), subtasks: { total: 4, done: 0 }, custom: { points: 5, sprint: "s15" }, list: "Kulina · Build" },
  { id: "t7", key: "AG-126", title: "Accessibility audit: checkout + onboarding", status: "todo", priority: "low", assignees: M("u4"), startDate: d(6), dueDate: d(10), custom: { points: 2, sprint: "s15" }, list: "Kulina · QA" },
  { id: "t8", key: "AG-130", title: "Investor update deck — September", status: "backlog", priority: undefined, assignees: [], dueDate: d(14), custom: {}, list: "agere · Ops" },
  { id: "t9", key: "AG-131", title: "Interview 5 clinic owners for venture #7", status: "in-progress", priority: "normal", assignees: M("u2", "u6", "u3"), startDate: d(-1), dueDate: d(6), subtasks: { total: 5, done: 2 }, comments: 6, tags: [{ id: "g1", label: "Research", tone: "special" }], custom: { points: 3, sprint: "s14" }, list: "Venture #7 · Discovery" },
];

export const LINKABLE_TASKS: LinkedTask[] = TASKS.map((t) => ({ id: t.id, key: t.key!, title: t.title, status: t.status }));

export const EVENTS: TimedEvent[] = [
  { id: "e1", title: "Daily stand-up", start: dt(0, "09:00"), end: dt(0, "09:15"), kind: "meeting", tone: "brand", location: "agere Video", attendees: M("u1", "u2", "u3", "u4") },
  { id: "e2", title: "QRIS checkout pairing", start: dt(0, "10:00"), end: dt(0, "12:00"), kind: "task", status: "in-progress", tone: "info" },
  { id: "e3", title: "Clinic owner interview", start: dt(0, "13:30"), end: dt(0, "14:30"), kind: "meeting", tone: "special", location: "Google Meet", attendees: M("u2", "u6") },
  { id: "e4", title: "Focus: onboarding review", start: dt(1, "09:30"), end: dt(1, "11:30"), kind: "focus", tone: "success" },
  { id: "e5", title: "Investor sync", start: dt(1, "15:00"), end: dt(1, "16:00"), kind: "meeting", tone: "attention", location: "Kantor agere" },
  { id: "e6", title: "Ledger API design review", start: dt(2, "11:00"), end: dt(2, "12:30"), kind: "task", status: "blocked", tone: "error" },
  { id: "e7", title: "Sprint 14 demo", start: dt(3, "16:00"), end: dt(3, "17:00"), kind: "meeting", tone: "brand", attendees: MEMBERS },
  { id: "e8", title: "Pricing copy", start: dt(-1, "14:00"), end: dt(-1, "15:30"), kind: "task", status: "complete", tone: "success" },
];

export const CHANNELS: ChannelItem[] = [
  { id: "c1", name: "kulina-build", unread: 4, mentions: 1 },
  { id: "c2", name: "venture-7", unread: 2 },
  { id: "c3", name: "design-system" },
  { id: "c4", name: "random", muted: true },
];
export const DIRECTS: DirectItem[] = [
  { id: "dm2", member: MEMBERS[1], unread: 1 },
  { id: "dm3", member: MEMBERS[2] },
  { id: "dm4", member: MEMBERS[3] },
];

export const MESSAGES: ChatMessage[] = [
  { id: "m1", author: MEMBERS[1], body: "Morning! Pricing interviews are done — 8 of 10 owners prefer the monthly plan with QRIS.", sentAt: `${d(0)}T08:52`, reactions: [{ emoji: "🎉", count: 3, label: "Party" }] },
  { id: "m2", author: MEMBERS[1], body: "Notes are linked here:", sentAt: `${d(0)}T08:53`, linkedTask: LINKABLE_TASKS[0] },
  { id: "m3", author: MEMBERS[0], body: "Great. @Sekar Ayu can we ship #AG-114 behind a flag by Friday?", sentAt: `${d(0)}T09:20`, own: true } as ChatMessage & { own: boolean },
  { id: "m4", author: MEMBERS[3], body: "Yes — webhook retries are the last piece. I'll pair with Bubus at 10.", sentAt: `${d(0)}T09:24`, replies: { count: 3, lastAt: `${d(0)}T09:41`, participants: M("u1", "u4") } },
  { id: "m5", author: MEMBERS[4], body: "Heads up: #AG-120 is blocked on Ledger API credentials from the bank.", sentAt: `${d(0)}T09:58`, attachments: [{ id: "a1", name: "ledger-api-errors.log", size: "18 KB" }] },
];

export const TRANSACTIONS: Transaction[] = [
  { id: "x1", date: d(-1), description: "Subscription — Team plan", counterparty: "Klinik Sehat Bersama", category: "Revenue", type: "income", amount: 499_500, currency: "IDR", status: "paid" },
  { id: "x2", date: d(-1), description: "AWS — Jakarta region", counterparty: "Amazon Web Services", category: "Infrastructure", type: "expense", amount: 1_284.4, currency: "USD", amountBase: 20_550_000, status: "paid" },
  { id: "x3", date: d(-2), description: "Annual license", counterparty: "Toko Roti Hangat", category: "Revenue", type: "income", amount: 5_400_000, currency: "IDR", status: "pending" },
  { id: "x4", date: d(-3), description: "Figma Organization", counterparty: "Figma, Inc.", category: "Software", type: "expense", amount: 225, currency: "USD", amountBase: 3_600_000, status: "paid" },
  { id: "x5", date: d(-4), description: "Contractor — mobile QA", counterparty: "Rizky Hakim", category: "People", type: "expense", amount: 7_500_000, currency: "IDR", status: "paid" },
  { id: "x6", date: d(-5), description: "Subscription — Pro plan", counterparty: "Studio Yoga Ubud", category: "Revenue", type: "income", amount: 199_000, currency: "IDR", status: "failed" },
  { id: "x7", date: d(-6), description: "Singapore entity fees", counterparty: "ACRA", category: "Legal", type: "expense", amount: 315, currency: "SGD", amountBase: 3_860_000, status: "paid" },
  { id: "x8", date: d(-7), description: "Refund — duplicate charge", counterparty: "Kopi Kenangan Lama", category: "Revenue", type: "expense", amount: 499_500, currency: "IDR", status: "refunded" },
  { id: "x9", date: d(-8), description: "Google Workspace", counterparty: "Google", category: "Software", type: "expense", amount: 1_080_000, currency: "IDR", status: "paid" },
  { id: "x10", date: d(-9), description: "Pilot fee — Venture #7", counterparty: "RS Mitra Keluarga", category: "Revenue", type: "income", amount: 25_000_000, currency: "IDR", status: "paid" },
];

export const DOC_TREE: DocNode[] = [
  { id: "d1", title: "Kulina", icon: "🍱", children: [
    { id: "d2", title: "Product brief" },
    { id: "d3", title: "Research", children: [{ id: "d4", title: "Pricing interviews" }, { id: "d5", title: "Competitor scan" }] },
    { id: "d6", title: "Launch checklist" },
  ] },
  { id: "d7", title: "Venture #7 — Clinics", icon: "🩺", children: [{ id: "d8", title: "Problem statement" }] },
  { id: "d9", title: "agere handbook", icon: "📘" },
];
