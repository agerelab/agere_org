import * as React from "react";
import { Archive, CloudUpload, Flag, Inbox, PanelTop, Plus, Save, Trash2, Workflow, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PageHeader, PageHeaderActions, PageHeaderBack, PageHeaderContent, PageHeaderDescription, PageHeaderLeading, PageHeaderMeta, PageHeaderTitle,
} from "@/components/ui/page-header";
import { SaveBar, type SaveBarState } from "@/components/ui/save-bar";
import { SaveStatus, type SaveStatusState } from "@/components/ui/save-status";
import { Button } from "@/components/ui/button";
import { RuleBuilder, RuleBuilderPreview, RuleBuilderRow } from "@/components/ui/rule-builder";
import { toast } from "@/components/ui/toast";
import type { ComponentDoc } from "./types";

const EVENTS: Record<string, string> = { request: "a request arrives", late: "a task becomes overdue", moved: "a task moves column" };
const SCOPES: Record<string, string> = { org: "the whole organisation", design: "Design Studio", eng: "Engineering" };
const PRIO: Record<string, string> = { any: "", urgent: "priority is Urgent", high: "priority is High" };

export const v64Docs: ComponentDoc[] = [
  {
    id: "page-header", name: "PageHeader", category: "Navigation", level: "Organism", status: "new", icon: PanelTop,
    summary: "The top of an app page — back link, leading tile, title with badges, description, meta and actions. PageHeaderActions encodes the action hierarchy: one default, at most two outline (type-enforced), everything else in ⋯, and outline actions move into ⋯ below md.",
    demo: () => (
      <div className="w-full">
        <PageHeader>
          <PageHeaderLeading>SD</PageHeaderLeading>
          <PageHeaderContent>
            <PageHeaderBack href="#/components/page-header">Marketing</PageHeaderBack>
            <PageHeaderTitle as="h2" badges={<><Badge variant="success">On track</Badge><Badge variant="outline">All members</Badge></>}>Design Studio</PageHeaderTitle>
            <PageHeaderDescription>Design queue for every division: banners, video and decks.</PageHeaderDescription>
            <PageHeaderMeta><span>12 open tasks</span><span>Target 31 Dec</span></PageHeaderMeta>
          </PageHeaderContent>
          <PageHeaderActions
            secondary={[{ label: "Share", onSelect: () => toast({ title: "Share dialog opens" }) }]}
            primary={{ label: "New task", icon: <Plus />, onSelect: () => toast({ title: "New task" }) }}
            menu={[{ label: "Project status", icon: <Flag /> }, { label: "Automations", icon: <Zap /> }, "separator", { label: "Archive project", icon: <Archive /> }, { label: "Move to trash", icon: <Trash2 />, destructive: true }]}
          />
        </PageHeader>
      </div>
    ),
    code: `<PageHeader>
  <PageHeaderLeading>SD</PageHeaderLeading>
  <PageHeaderContent>
    <PageHeaderBack href="/spaces/marketing">Marketing</PageHeaderBack>
    <PageHeaderTitle badges={<Badge variant="success">On track</Badge>}>Design Studio</PageHeaderTitle>
    <PageHeaderDescription>Design queue for every division.</PageHeaderDescription>
  </PageHeaderContent>
  <PageHeaderActions
    secondary={[{ label: "Share", onSelect: openShare }]}             // ≤ 2 — moves into ⋯ below md
    primary={{ label: "New task", icon: <Plus />, onSelect: create }}  // one, always labelled
    menu={[{ label: "Project status" }, "separator", { label: "Move to trash", destructive: true }]}
  />
</PageHeader>`,
    specs: [["Title", "type-heading-xl (24/32), h1 by default"], ["Leading tile", "48 px, radius xl, hidden below md"], ["Actions", "md buttons, gap 8; ⋯ is IconButton ghost, always last"], ["Breakpoint", "md (768 px): outline → ⋯ first items + separator"]],
    dos: ["Pass the page's one forward action as `primary`.", "Keep frequent collaboration actions (Share) in `secondary`.", "Omit `primary` when an EmptyState on the page already owns it."],
    donts: ["Don't pass the same action to `secondary` and `menu` — one action, one place.", "Don't put a third outline button in the header; it won't type-check, move it to `menu`.", "Don't add ghost text buttons to the header."],
    a11y: { role: "banner-less header; h1 title", keyboard: [["Tab", "Back link → secondary → primary → ⋯"], ["Enter / Space on ⋯", "Opens the menu; ↑ ↓ move, Esc closes"]], notes: ["The leading tile is decorative (aria-hidden); the title carries the name.", "The ⋯ trigger is an IconButton, so its accessible name is required.", "Href actions render as links, in the header and in the menu."] },
    content: ["Button labels: verb + object, sentence case.", "Use general verbs when formats may grow: Import, Export."],
  },
  {
    id: "save-bar", name: "SaveBar", category: "Actions & Inputs", level: "Molecule", status: "new", icon: Save,
    summary: "Sticky footer for long editors and settings with an explicit save. A polite live status (All changes saved · Unsaved changes · Saving… · Couldn’t save), Cancel as ghost and Save as default; both are disabled while nothing is unsaved.",
    demo: () => {
      const [name, setName] = React.useState("Triage incoming requests");
      const [saved, setSaved] = React.useState(name);
      const [state, setState] = React.useState<SaveBarState>("saved");
      React.useEffect(() => { if (state !== "saving") setState(name === saved ? "saved" : "dirty"); }, [name, saved, state]);
      return (
        <div className="w-full max-w-lg overflow-hidden rounded-xl border border-border">
          <div className="grid gap-2 p-5"><Label htmlFor="sb-name">Skill name</Label><Input id="sb-name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <SaveBar sticky={false} state={state} onCancel={() => setName(saved)} onSave={() => { setState("saving"); setTimeout(() => { setSaved(name); setState("saved"); }, 700); }} />
        </div>
      );
    },
    states: () => (
      <div className="grid w-full max-w-lg gap-3">
        {(["saved", "dirty", "saving", "error"] as SaveBarState[]).map((s) => (
          <div key={s} className="overflow-hidden rounded-xl border border-border"><SaveBar sticky={false} label={`Save bar, ${s}`} state={s} onSave={() => {}} onCancel={() => {}} /></div>
        ))}
      </div>
    ),
    code: `<SaveBar
  state={isSaving ? "saving" : isDirty ? "dirty" : "saved"}
  onCancel={reset}
  onSave={handleSubmit(save)}
  saveLabel="Simpan skill" cancelLabel="Batal"
  messages={{ saved: "Semua perubahan tersimpan", dirty: "Perubahan belum disimpan" }}
/>`,
    specs: [["Padding", "px-6 py-3 (px-4 below sm)"], ["Status", "text-sm; dirty → attention-on-surface, error → error-on-surface"], ["Surface", "bg-background/95 + backdrop blur, border-t"]],
    dos: ["Use it on surfaces with an explicit save: settings, builders, long forms.", "Pair it with a leave-page guard while dirty."],
    donts: ["Don't use it where content autosaves (docs) — use SaveStatus in the toolbar instead.", "Don't let toasts cover it: mount `<Toaster position=\"bottom-left\" />` or pass `offset` equal to the bar height."],
    a11y: { role: "region (named) with an aria-live=polite status", keyboard: [["Tab", "Cancel → Save"]], notes: ["Status changes are announced once, politely.", "Save shows aria-busy while saving."] },
  },
  {
    id: "rule-builder", name: "RuleBuilder", category: "Workspace", level: "Organism", status: "new", icon: Workflow,
    summary: "“When · Where · If · Then” automation rules with a sentence preview that always reads the rule back in plain language. Each row is a labelled group; the preview is a status region, so changes are announced.",
    demo: () => {
      const [ev, setEv] = React.useState("request");
      const [scope, setScope] = React.useState("design");
      const [prio, setPrio] = React.useState("any");
      return (
        <div className="w-full max-w-xl">
          <RuleBuilder preview={<RuleBuilderPreview icon={<Inbox />}>When <b>{EVENTS[ev]}</b> in <b>{SCOPES[scope]}</b>{PRIO[prio] ? <>, if <b>{PRIO[prio]}</b></> : null}, run <b>/triage</b> and send the suggestion to the <b>project owner</b>.</RuleBuilderPreview>}>
            <RuleBuilderRow label="When"><Select value={ev} onValueChange={setEv}><SelectTrigger aria-label="Event"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="request">A request arrives</SelectItem><SelectItem value="late">A task becomes overdue</SelectItem><SelectItem value="moved">A task moves column</SelectItem></SelectContent></Select></RuleBuilderRow>
            <RuleBuilderRow label="Where"><Select value={scope} onValueChange={setScope}><SelectTrigger aria-label="Scope"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="org">Whole organisation</SelectItem><SelectItem value="design">Design Studio</SelectItem><SelectItem value="eng">Engineering</SelectItem></SelectContent></Select></RuleBuilderRow>
            <RuleBuilderRow label="If" optional><Select value={prio} onValueChange={setPrio}><SelectTrigger aria-label="Priority condition"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Any priority</SelectItem><SelectItem value="urgent">Urgent</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></RuleBuilderRow>
          </RuleBuilder>
        </div>
      );
    },
    code: `<RuleBuilder preview={<RuleBuilderPreview icon={<Inbox />}>When <b>a request arrives</b> in <b>Design</b>, run <b>/triage</b>.</RuleBuilderPreview>}>
  <RuleBuilderRow label="When"><Select …/></RuleBuilderRow>
  <RuleBuilderRow label="Where"><Select …/></RuleBuilderRow>
  <RuleBuilderRow label="If" optional><Select …/></RuleBuilderRow>
  <RuleBuilderRow label="Then"><Select …/><Select …/></RuleBuilderRow>
</RuleBuilder>`,
    specs: [["Row", "label column 6rem from md; controls share the row equally from sm"], ["Preview", "bg-muted, border, radius lg, p-4; bold words are the chosen values"]],
    dos: ["Rebuild the preview sentence from the same state as the controls.", "Keep conditions optional and say so in the label."],
    donts: ["Don't let the preview drift from the controls.", "Don't hide which skill runs — name it in the Then row and the sentence."],
    a11y: { role: "group per row (named by its label); preview is role=status", notes: ["Give each Select an aria-label that says what it chooses.", "The “(optional)” suffix is part of the row's accessible name."] },
  },
  {
    id: "save-status", name: "SaveStatus", category: "Feedback & Overlay", level: "Atom", status: "new", icon: CloudUpload,
    summary: "Inline status for autosaving surfaces — docs, notes, block editors: Saved · Saving… · Couldn’t save (with Try again) · Offline. It replaces a Save button; surfaces with an explicit save use SaveBar.",
    demo: () => {
      const [state, setState] = React.useState<SaveStatusState>("saved");
      const t = React.useRef<number | undefined>(undefined);
      const type = () => { setState("saving"); window.clearTimeout(t.current); t.current = window.setTimeout(() => setState("saved"), 600); };
      React.useEffect(() => () => window.clearTimeout(t.current), []);
      return (
        <div className="grid w-full max-w-lg gap-3">
          <div className="flex items-center gap-2 border-b border-border pb-3"><span className="mr-auto text-sm font-medium">SOP Operasional</span><SaveStatus state={state} onRetry={type} /><Button size="sm" variant="outline">Share</Button></div>
          <Label htmlFor="ss-doc">Type to autosave</Label><Input id="ss-doc" defaultValue="How to submit a request" onChange={type} />
        </div>
      );
    },
    states: () => (
      <div className="grid gap-3">
        {(["saved", "saving", "error", "offline"] as SaveStatusState[]).map((s) => <SaveStatus key={s} state={s} onRetry={() => {}} />)}
      </div>
    ),
    code: `<SaveStatus
  state={saving ? "saving" : error ? "error" : "saved"}
  onRetry={flush}
  messages={{ saved: "Tersimpan", saving: "Menyimpan…", error: "Gagal menyimpan" }}
  retryLabel="Coba lagi"
/>`,
    specs: [["Text", "text-xs; error → error-on-surface (medium), offline → attention-on-surface"], ["Icon", "3.5 (14 px); Loader2 spins while saving, stops with reduced motion"], ["Place", "page toolbar, before Share"]],
    dos: ["Debounce saves (≈500 ms) and show Saving… only while a request is in flight.", "Keep the last good state on error and offer Try again."],
    donts: ["Don't add a Save button next to it.", "Don't toast every autosave — the status is enough."],
    a11y: { role: "status, aria-live=polite", notes: ["Announced politely; the error state keeps its retry button reachable by Tab."] },
  },
];
