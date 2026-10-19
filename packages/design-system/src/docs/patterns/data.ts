import type { AgereAssignee, AgerePriority, AgerePropertyTag } from "@/lib/agere-tokens";
import { addDays, toDateKey } from "@/lib/date";
import type { FileItem, FileTreeNode, UploadTask } from "@/components/agere-ds";

export const people: AgereAssignee[] = [
  { id: "u1", name: "Bubus Pratama" },
  { id: "u2", name: "Nadia Rahma" },
  { id: "u3", name: "Galih Santoso" },
  { id: "u4", name: "Sekar Ayu" },
  { id: "u5", name: "Rizky Hakim" },
];

export const STATUSES = [
  { value: "backlog", label: "Backlog", tone: "purple" },
  { value: "todo", label: "To do", tone: "blue" },
  { value: "doing", label: "In progress", tone: "yellow" },
  { value: "review", label: "In review", tone: "red" },
  { value: "done", label: "Done", tone: "green" },
] as const;

export type StatusValue = (typeof STATUSES)[number]["value"];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: StatusValue;
  priority: AgerePriority;
  assigneeId?: string;
  startDate: string;
  endDate?: string;
  tags: AgerePropertyTag[];
  checklist: { id: string; label: string; done: boolean }[];
  comments: { id: string; authorId: string; body: string; createdAt: string }[];
  attachments: number;
}

const d = (offset: number) => toDateKey(addDays(new Date(), offset));
const tag = (id: string, label: string, status: AgerePropertyTag["status"]): AgerePropertyTag => ({ id, label, status });

export const initialTasks: Task[] = [
  { id: "t1", title: "Q4 headcount plan", description: "Consolidate requests from Ops, Kitchen and Tech.", status: "doing", priority: "high", assigneeId: "u1", startDate: d(-2), endDate: d(2), tags: [tag("g1", "Planning", "blue")], checklist: [{ id: "c1", label: "Collect team requests", done: true }, { id: "c2", label: "Budget check with Finance", done: false }, { id: "c3", label: "Draft approval memo", done: false }], comments: [{ id: "m1", authorId: "u2", body: "Kitchen needs two more shift leads before December.", createdAt: new Date().toISOString() }], attachments: 3 },
  { id: "t2", title: "Onboarding kit for design hires", description: "", status: "todo", priority: "medium", assigneeId: "u4", startDate: d(1), tags: [tag("g2", "People", "purple")], checklist: [], comments: [], attachments: 0 },
  { id: "t3", title: "Branch access policy review", description: "Align with the Multi-Org engine permission model.", status: "review", priority: "urgent", assigneeId: "u3", startDate: d(-5), endDate: d(-1), tags: [tag("g3", "Security", "red"), tag("g4", "Policy", "yellow")], checklist: [{ id: "c4", label: "Legal sign-off", done: true }], comments: [], attachments: 1 },
  { id: "t4", title: "Payroll cutoff reminder", description: "", status: "done", priority: "low", assigneeId: "u5", startDate: d(-3), tags: [tag("g5", "Finance", "green")], checklist: [], comments: [], attachments: 0 },
  { id: "t5", title: "Interview loop — Senior PM", description: "", status: "doing", priority: "high", assigneeId: "u2", startDate: d(0), endDate: d(4), tags: [tag("g6", "Hiring", "yellow")], checklist: [{ id: "c5", label: "Case study brief", done: true }, { id: "c6", label: "Panel availability", done: true }], comments: [], attachments: 2 },
  { id: "t6", title: "Org chart refresh", description: "", status: "backlog", priority: "low", startDate: d(6), tags: [], checklist: [], comments: [], attachments: 0 },
  { id: "t7", title: "Vendor contract renewals", description: "", status: "todo", priority: "medium", assigneeId: "u1", startDate: d(0), tags: [tag("g5", "Finance", "green")], checklist: [], comments: [], attachments: 4 },
  { id: "t8", title: "Town hall deck", description: "", status: "todo", priority: "medium", assigneeId: "u4", startDate: d(0), tags: [tag("g7", "Comms", "blue")], checklist: [], comments: [], attachments: 0 },
  { id: "t9", title: "Exit interview synthesis", description: "", status: "backlog", priority: "low", assigneeId: "u2", startDate: d(0), tags: [tag("g2", "People", "purple")], checklist: [], comments: [], attachments: 0 },
];

/* ---- File explorer fixtures -------------------------------------- */

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

export const files: FileItem[] = [
  { id: "f1", name: "Hiring pipeline", kind: "folder", modifiedAt: hoursAgo(1), meta: "24 items", owner: "Nadia Rahma" },
  { id: "f2", name: "Headcount Q4.xlsx", kind: "sheet", size: 184_320, modifiedAt: hoursAgo(2), owner: "Bubus Pratama" },
  { id: "f3", name: "Offer letter template.docx", kind: "doc", size: 48_200, modifiedAt: hoursAgo(3), owner: "Sekar Ayu" },
  { id: "f4", name: "Branch photos.zip", kind: "zip", size: 52_428_800, modifiedAt: hoursAgo(5), owner: "Galih Santoso" },
  { id: "f5", name: "Policy v3.pdf", kind: "pdf", size: 1_048_576, modifiedAt: hoursAgo(26), owner: "Galih Santoso" },
  { id: "f6", name: "Team offsite.jpg", kind: "image", size: 3_145_728, modifiedAt: hoursAgo(28), owner: "Rizky Hakim" },
  { id: "f7", name: "Onboarding walkthrough.mp4", kind: "video", size: 104_857_600, modifiedAt: hoursAgo(30), owner: "Sekar Ayu" },
];

export const tree: FileTreeNode[] = [
  { id: "p-talent", label: "agere Talent", children: [{ id: "p-talent-cv", label: "Candidates" }, { id: "p-talent-jd", label: "Job descriptions" }] },
  { id: "p-org", label: "agere Org", children: [{ id: "p-org-policy", label: "Policies" }, { id: "p-org-payroll", label: "Payroll" }] },
  { id: "p-hosp", label: "agere Hospitality" },
  { id: "p-edu", label: "agere Edu" },
];

export const seedUploads: UploadTask[] = [
  { id: "up1", name: "Interview notes.pdf", size: 820_000, progress: 100, status: "success" },
  { id: "up2", name: "Branch floorplan.png", size: 4_200_000, progress: 46, status: "uploading" },
  { id: "up3", name: "Payroll export.csv", size: 96_000, progress: 12, status: "error", error: "Connection lost at 12%. Retry to resume." },
];
