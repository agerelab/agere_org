"use client";

import * as React from "react";
import {
  ArrowDown, ArrowUp, Bell, CheckCircle2, Circle, Clock, Copy, Filter, GitBranch, ListChecks, Loader2, Mail, MessageCircle, MoreHorizontal, Play, Plus,
  Trash2, UserPlus, Webhook, XCircle, Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger,
} from "@/components/ui/menubar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useIsMobile } from "@/hooks/use-mobile";

type Kind = "trigger" | "action" | "condition" | "delay";
type StepType = { id: string; kind: Kind; label: string; app: string; icon: React.ComponentType<{ className?: string }> };

const CATALOG: StepType[] = [
  { id: "mimo.applied", kind: "trigger", label: "New candidate applied", app: "Mimo", icon: UserPlus },
  { id: "webhook", kind: "trigger", label: "Webhook received", app: "Webhooks", icon: Webhook },
  { id: "filter.score", kind: "condition", label: "Only continue if…", app: "Filter", icon: Filter },
  { id: "branch", kind: "condition", label: "Split into paths", app: "Paths", icon: GitBranch },
  { id: "wait", kind: "delay", label: "Wait", app: "Delay", icon: Clock },
  { id: "wa.send", kind: "action", label: "Send WhatsApp message", app: "WhatsApp Business", icon: MessageCircle },
  { id: "mail.send", kind: "action", label: "Send email", app: "Email", icon: Mail },
  { id: "task.create", kind: "action", label: "Create task", app: "ClickUp", icon: ListChecks },
  { id: "notify", kind: "action", label: "Notify channel", app: "Google Chat", icon: Bell },
];
const typeOf = (id: string) => CATALOG.find((c) => c.id === id)!;

interface Step { uid: string; type: string; name: string; config: string }
type RunState = "idle" | "running" | "success" | "error";

const INITIAL: Step[] = [
  { uid: "s1", type: "mimo.applied", name: "Candidate applies to Ops Lead", config: "Job: Ops Lead · Surabaya" },
  { uid: "s2", type: "filter.score", name: "AI screening score ≥ 80", config: "score >= 80" },
  { uid: "s3", type: "wa.send", name: "Invite to interview", config: "Halo {{candidate.first_name}}, terima kasih sudah melamar. Pilih jadwal interview: {{booking_link}}" },
  { uid: "s4", type: "wait", name: "Wait 2 days", config: "2 days" },
  { uid: "s5", type: "task.create", name: "Remind recruiter to follow up", config: "List: Hiring · Assignee: Nadia" },
];

const KIND_TONE: Record<Kind, string> = {
  trigger: "bg-chart-1/15 text-[hsl(var(--chart-1))]",
  condition: "bg-chart-4/20 text-attention-fg",
  delay: "bg-muted text-muted-foreground",
  action: "bg-chart-2/15 text-[hsl(var(--chart-2))]",
};
const RUN_ICON: Record<RunState, React.ReactNode> = {
  idle: <Circle className="size-4 text-muted-foreground/60" aria-hidden />,
  running: <Loader2 className="size-4 animate-spin text-info" aria-hidden />,
  success: <CheckCircle2 className="size-4 text-success" aria-hidden />,
  error: <XCircle className="size-4 text-error" aria-hidden />,
};
const RUN_TEXT: Record<RunState, string> = { idle: "", running: "running", success: "passed", error: "failed" };

let uidSeq = 100;
const newUid = () => `s${++uidSeq}`;

function AddStep({ after, onAdd, allowTrigger }: { after: string; onAdd: (typeId: string) => void; allowTrigger?: boolean }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative flex h-12 items-center justify-center">
      <span aria-hidden className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border" />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="relative z-[1] size-7 rounded-full bg-background" aria-label={`Add a step after “${after}”`}>
            <Plus aria-hidden />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0">
          <Command label="Choose a step">
            <CommandInput placeholder="Search apps and steps…" />
            <CommandList>
              <CommandEmpty>No steps found.</CommandEmpty>
              {(["condition", "delay", "action"] as Kind[]).concat(allowTrigger ? ["trigger"] : []).map((k) => (
                <CommandGroup key={k} heading={k === "condition" ? "Logic" : k === "delay" ? "Timing" : k === "trigger" ? "Triggers" : "Actions"}>
                  {CATALOG.filter((c) => c.kind === k).map((c) => (
                    <CommandItem key={c.id} value={`${c.app} ${c.label}`} onSelect={() => { onAdd(c.id); setOpen(false); }}>
                      <c.icon />
                      <span className="grid"><span>{c.label}</span><span className="text-xs text-muted-foreground">{c.app}</span></span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function StepMenu({ step, index, total, ops, as }: { step: Step; index: number; total: number; ops: Ops; as: "context" | "menu" }) {
  const isTrigger = index === 0;
  const entries = [
    { k: "dup", label: "Duplicate", icon: <Copy />, run: () => ops.duplicate(step.uid), disabled: isTrigger, sc: "⌘D" },
    { k: "up", label: "Move up", icon: <ArrowUp />, run: () => ops.move(step.uid, -1), disabled: index <= 1, sc: "⌥↑" },
    { k: "down", label: "Move down", icon: <ArrowDown />, run: () => ops.move(step.uid, 1), disabled: isTrigger || index === total - 1, sc: "⌥↓" },
  ];
  if (as === "context") {
    return (
      <ContextMenuContent className="w-52">
        {entries.map((e) => <ContextMenuItem key={e.k} disabled={e.disabled} onSelect={e.run}>{e.icon}{e.label}<ContextMenuShortcut>{e.sc}</ContextMenuShortcut></ContextMenuItem>)}
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" disabled={isTrigger} onSelect={() => ops.remove(step.uid)}><Trash2 />Delete step</ContextMenuItem>
      </ContextMenuContent>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7" aria-label={`Actions for step ${index + 1}, ${step.name}`}><MoreHorizontal aria-hidden /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {entries.map((e) => <DropdownMenuItem key={e.k} disabled={e.disabled} startIcon={e.icon} shortcut={e.sc} onSelect={e.run}>{e.label}</DropdownMenuItem>)}
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive disabled={isTrigger} startIcon={<Trash2 />} onSelect={() => ops.remove(step.uid)}>Delete step</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type Ops = { duplicate: (uid: string) => void; move: (uid: string, d: -1 | 1) => void; remove: (uid: string) => void; insertAfter: (uid: string, type: string) => void };

/**
 * Block · Workflow builder (shadcnstudio "Workflow Builder").
 * Menubar (File · Edit · View · Run) → linear step flow (an ordered list — every step keyboard-reachable,
 * no drag-only interactions) with "+" inserts, a resizable inspector, and a simulated test run announced
 * step by step in a live region. Step actions live in a visible "⋯" menu AND a right-click menu.
 */
export function WorkflowBuilder({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  const [steps, setSteps] = React.useState(INITIAL);
  const [selected, setSelected] = React.useState("s3");
  const [active, setActive] = React.useState(false);
  const [numbers, setNumbers] = React.useState(true);
  const [run, setRun] = React.useState<Record<string, RunState>>({});
  const [announce, setAnnounce] = React.useState("");
  const running = Object.values(run).includes("running");

  const ops: Ops = {
    duplicate: (uid) => setSteps((l) => { const i = l.findIndex((s) => s.uid === uid); const copy = { ...l[i], uid: newUid(), name: `${l[i].name} (copy)` }; return [...l.slice(0, i + 1), copy, ...l.slice(i + 1)]; }),
    move: (uid, d) => setSteps((l) => { const i = l.findIndex((s) => s.uid === uid); const j = i + d; if (i < 1 || j < 1 || j >= l.length) return l; const n = [...l]; [n[i], n[j]] = [n[j], n[i]]; setAnnounce(`${l[i].name} moved to step ${j + 1}`); return n; }),
    remove: (uid) => setSteps((l) => { if (l[0].uid === uid) return l; const n = l.filter((s) => s.uid !== uid); if (selected === uid) setSelected(n[0].uid); setAnnounce("Step deleted"); return n; }),
    insertAfter: (uid, type) => setSteps((l) => { const i = l.findIndex((s) => s.uid === uid); const t = typeOf(type); const step = { uid: newUid(), type, name: t.label, config: "" }; setSelected(step.uid); setAnnounce(`${t.label} added as step ${i + 2}`); return [...l.slice(0, i + 1), step, ...l.slice(i + 1)]; }),
  };
  const update = (patch: Partial<Step>) => setSteps((l) => l.map((s) => (s.uid === selected ? { ...s, ...patch } : s)));
  const current = steps.find((s) => s.uid === selected) ?? steps[0];
  const incomplete = steps.filter((s, i) => i > 0 && !s.config.trim());

  const testRun = async () => {
    if (incomplete.length) { toast.error(`Finish setting up ${incomplete.length} step${incomplete.length > 1 ? "s" : ""} first`); setSelected(incomplete[0].uid); return; }
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
    setRun(Object.fromEntries(steps.map((s) => [s.uid, "idle" as RunState])));
    for (const [i, s] of steps.entries()) {
      setRun((r) => ({ ...r, [s.uid]: "running" }));
      setAnnounce(`Step ${i + 1}, ${s.name}: running`);
      await wait(450);
      setRun((r) => ({ ...r, [s.uid]: "success" }));
    }
    setAnnounce(`Test run finished: all ${steps.length} steps passed`);
    toast.success("Test run passed");
  };

  const canvas = (
    <div className="h-full overflow-y-auto bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px] p-6">
      <ol aria-label="Workflow steps" className="mx-auto grid max-w-md">
        {steps.map((s, i) => {
          const t = typeOf(s.type);
          const state = run[s.uid] ?? "idle";
          return (
            <li key={s.uid}>
              {i > 0 && <span aria-hidden className="mx-auto block h-4 w-px bg-border" />}
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <div className={cn("group relative rounded-xl border bg-card shadow-sm transition-colors", selected === s.uid ? "border-primary ring-1 ring-primary" : "border-border hover:border-border-strong")}>
                    <button type="button" onClick={() => setSelected(s.uid)} aria-current={selected === s.uid ? "step" : undefined}
                      className="grid w-full grid-cols-[auto_1fr_auto] items-start gap-3 rounded-xl p-4 pr-12 text-left outline-none focus-ring">
                      <span aria-hidden className={cn("grid size-9 place-items-center rounded-lg", KIND_TONE[t.kind])}><t.icon className="size-4" /></span>
                      <span className="grid min-w-0 gap-0.5">
                        <span className="flex items-center gap-2 text-xs text-muted-foreground">
                          {numbers && <span className="tabular-nums">{i + 1}.</span>}
                          <span className="capitalize">{i === 0 ? "Trigger" : t.kind}</span>{t.app.toLowerCase() !== t.kind && <> · {t.app}</>}
                        </span>
                        <span className="truncate text-sm font-medium">{s.name}</span>
                        {s.config ? <span className="truncate text-xs text-muted-foreground">{s.config}</span> : <span className="text-xs text-attention-on-surface">Needs setup</span>}
                      </span>
                      <span className="pt-0.5">{run[s.uid] && <>{RUN_ICON[state]}<span className="sr-only">{RUN_TEXT[state]}</span></>}</span>
                    </button>
                    <div className="absolute right-2 top-2"><StepMenu step={s} index={i} total={steps.length} ops={ops} as="menu" /></div>
                  </div>
                </ContextMenuTrigger>
                <StepMenu step={s} index={i} total={steps.length} ops={ops} as="context" />
              </ContextMenu>
              <AddStep after={s.name} onAdd={(type) => ops.insertAfter(s.uid, type)} />
            </li>
          );
        })}
      </ol>
      <p className="mx-auto max-w-md text-center text-xs text-muted-foreground">End of workflow</p>
    </div>
  );

  const t = typeOf(current.type);
  const inspector = (
    <aside aria-label="Step settings" className="flex h-full flex-col">
      <div className="flex h-12 items-center gap-2 px-4">
        <span aria-hidden className={cn("grid size-7 place-items-center rounded-md", KIND_TONE[t.kind])}><t.icon className="size-3.5" /></span>
        <h3 className="truncate text-sm font-semibold">Step {steps.indexOf(current) + 1} · {t.label}</h3>
      </div>
      <Separator />
      <form className="grid content-start gap-5 overflow-y-auto p-4" onSubmit={(e) => { e.preventDefault(); toast.success("Step saved"); }}>
        <FormField label="Step name"><FormControl><Input value={current.name} onChange={(e) => update({ name: e.target.value })} /></FormControl></FormField>
        {t.kind === "condition" && (
          <FormField label="Condition" hint="Uses the fields of the previous steps." error={!current.config.trim() ? "Add a condition." : undefined}>
            <FormControl><Input className="font-mono" value={current.config} onChange={(e) => update({ config: e.target.value })} placeholder="score >= 80" /></FormControl>
          </FormField>
        )}
        {t.kind === "delay" && (
          <FormField label="Wait for">
            <Select value={current.config || undefined} onValueChange={(v) => update({ config: v })}>
              <SelectTrigger aria-label="Wait for"><SelectValue placeholder="Choose a duration" /></SelectTrigger>
              <SelectContent>{["1 hour", "1 day", "2 days", "1 week"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </FormField>
        )}
        {(t.kind === "action" || t.kind === "trigger") && (
          <FormField label={t.kind === "trigger" ? "Trigger settings" : "Message / settings"} hint="Insert fields with {{double.braces}}." error={t.kind === "action" && !current.config.trim() ? "This step needs content before it can run." : undefined}>
            <FormControl><Textarea value={current.config} onChange={(e) => update({ config: e.target.value })} className="min-h-28" /></FormControl>
          </FormField>
        )}
        <div className="flex gap-2">
          <Button type="submit" size="sm">Save step</Button>
          {steps.indexOf(current) > 0 && <Button type="button" size="sm" variant="destructive-outline" leadingIcon={<Trash2 />} onClick={() => ops.remove(current.uid)}>Delete</Button>}
        </div>
      </form>
    </aside>
  );

  return (
    <div className={cn("flex h-[720px] flex-col overflow-hidden rounded-xl border border-border bg-background", className)}>
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-3 py-2">
        <Menubar aria-label="Workflow" className="border-none shadow-none">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={() => { setSteps(INITIAL.slice(0, 1)); setSelected("s1"); }}>New workflow<MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
              <MenubarItem onSelect={() => toast("Workflow duplicated")}>Duplicate<MenubarShortcut>⌘D</MenubarShortcut></MenubarItem>
              <MenubarSeparator />
              <MenubarItem onSelect={() => { navigator.clipboard?.writeText(JSON.stringify(steps, null, 2)).catch(() => undefined); toast("Workflow JSON copied"); }}>Copy as JSON</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={() => ops.insertAfter(current.uid, "wait")}>Add wait after selected</MenubarItem>
              <MenubarItem disabled={steps.indexOf(current) === 0} onSelect={() => ops.duplicate(current.uid)}>Duplicate step<MenubarShortcut>⌘D</MenubarShortcut></MenubarItem>
              <MenubarSeparator />
              <MenubarItem variant="destructive" disabled={steps.indexOf(current) === 0} onSelect={() => ops.remove(current.uid)}>Delete step<MenubarShortcut>⌫</MenubarShortcut></MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem checked={numbers} onCheckedChange={setNumbers}>Step numbers</MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Run</MenubarTrigger>
            <MenubarContent>
              <MenubarItem disabled={running} onSelect={testRun}>Test run<MenubarShortcut>⌘↵</MenubarShortcut></MenubarItem>
              <MenubarItem onSelect={() => setRun({})}>Clear results</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <div className="flex min-w-0 items-center gap-2">
          <Zap className="size-4 text-muted-foreground" aria-hidden />
          <h2 className="truncate text-sm font-semibold">Screen & invite applicants</h2>
          <Badge variant={active ? "success" : "secondary"}>{active ? "Active" : "Draft"}</Badge>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch id="wf-active" checked={active} disabled={!!incomplete.length} onCheckedChange={(v) => { setActive(v); toast(v ? "Workflow is live" : "Workflow paused"); }} />
            <Label htmlFor="wf-active" className="text-sm font-normal">Active</Label>
          </div>
          <Button size="sm" leadingIcon={running ? undefined : <Play />} loading={running} onClick={testRun}>{running ? "Running…" : "Test run"}</Button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{announce}</p>
      <div className="min-h-0 flex-1">
        {isMobile ? (
          <div className="grid h-full grid-rows-[1fr_auto] overflow-hidden">{canvas}<div className="max-h-[45%] overflow-y-auto border-t border-border">{inspector}</div></div>
        ) : (
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize="62" minSize="40">{canvas}</ResizablePanel>
            <ResizableHandle withHandle aria-label="Resize step settings" />
            <ResizablePanel defaultSize="38" minSize="26">{inspector}</ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}
