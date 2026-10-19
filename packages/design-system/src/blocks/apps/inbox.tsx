"use client";

import * as React from "react";
import {
  Archive, ArchiveX, ArrowLeft, Clock, File, Forward, Inbox as InboxIcon, MailOpen, MoreHorizontal, Reply, ReplyAll, Send, Star, Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger } from "@/components/ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/toast";
import { useIsMobile } from "@/hooks/use-mobile";

export interface Mail {
  id: string; from: string; email: string; subject: string; body: string; date: string; read: boolean; starred?: boolean; labels: string[];
}

const MAILS: Mail[] = [
  { id: "m1", from: "Nadia Putri", email: "nadia@kulina.id", subject: "Shortlist for the ops lead role", body: "Hi Bubus,\n\nMimo finished screening the 48 applicants overnight. Six candidates scored above 80 — their summaries and recordings are in the shared folder.\n\nCan we pick the final three by Friday?\n\nNadia", date: "2026-09-25T08:12:00", read: false, starred: true, labels: ["hiring", "important"] },
  { id: "m2", from: "Raka Pratama", email: "raka@careflow.id", subject: "Clinic portal — booking bug on iOS", body: "The time-slot picker jumps back to today when a patient changes month on iOS Safari. Repro video attached. I think it's the date-picker focus effect.", date: "2026-09-25T07:40:00", read: false, labels: ["careflow", "bug"] },
  { id: "m3", from: "Sekar Ayu", email: "sekar@neralink.id", subject: "Branch rollout: week 3 summary", body: "38 of 42 branches are live. The four remaining ones are waiting on network hardware; dates are in the sheet.", date: "2026-09-24T17:05:00", read: true, labels: ["neralink"] },
  { id: "m4", from: "Finance", email: "finance@agere.id", subject: "September invoices ready for review", body: "Twelve invoices are ready. Two need a PO number before we can send them.", date: "2026-09-24T10:30:00", read: true, labels: ["finance"] },
  { id: "m5", from: "Dimas Wibowo", email: "dimas@agere.id", subject: "Design review moved to Monday", body: "Moving the DS review to Monday 10:00 so we can include the new wordmark. Same link.", date: "2026-09-23T15:20:00", read: true, labels: ["design"] },
  { id: "m6", from: "Laras Kinanti", email: "laras@sregep.id", subject: "Sregep: partner onboarding copy", body: "Attached is the Bahasa Indonesia copy for the partner onboarding flow. I kept 'Anda' for the formal steps.", date: "2026-09-22T09:02:00", read: true, labels: ["sregep", "copy"] },
];

const FOLDERS = [
  { id: "inbox", label: "Inbox", icon: InboxIcon, count: 2 },
  { id: "starred", label: "Starred", icon: Star },
  { id: "snoozed", label: "Snoozed", icon: Clock },
  { id: "sent", label: "Sent", icon: Send },
  { id: "drafts", label: "Drafts", icon: File, count: 1 },
  { id: "archive", label: "Archive", icon: Archive },
  { id: "trash", label: "Trash", icon: Trash2 },
];

const when = (iso: string) => {
  const d = new Date(iso);
  return d.toDateString() === new Date("2026-09-25").toDateString()
    ? d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

type Actions = { archive: (id: string) => void; toggleRead: (id: string) => void; remove: (id: string) => void; star: (id: string) => void };

/** The same actions, offered two ways: right-click (ContextMenu) and a visible "⋯" (DropdownMenu). */
function MailActions({ mail, a, trigger }: { mail: Mail; a: Actions; trigger: "context" | "menu" }) {
  const items = [
    { k: "reply", label: "Reply", icon: <Reply />, run: () => toast(`Replying to ${mail.from}`), sc: "R" },
    { k: "read", label: mail.read ? "Mark as unread" : "Mark as read", icon: <MailOpen />, run: () => a.toggleRead(mail.id), sc: "U" },
    { k: "star", label: mail.starred ? "Unstar" : "Star", icon: <Star />, run: () => a.star(mail.id), sc: "S" },
    { k: "archive", label: "Archive", icon: <Archive />, run: () => a.archive(mail.id), sc: "E" },
  ];
  if (trigger === "context") {
    return (
      <ContextMenuContent className="w-52">
        {items.map((i) => <ContextMenuItem key={i.k} onSelect={i.run}>{i.icon}{i.label}<ContextMenuShortcut>{i.sc}</ContextMenuShortcut></ContextMenuItem>)}
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onSelect={() => a.remove(mail.id)}><Trash2 />Delete<ContextMenuShortcut>#</ContextMenuShortcut></ContextMenuItem>
      </ContextMenuContent>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7 opacity-0 focus-visible:opacity-100 group-hover/mail:opacity-100 data-[state=open]:opacity-100" aria-label={`Actions for “${mail.subject}”`}>
          <MoreHorizontal aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {items.map((i) => <DropdownMenuItem key={i.k} startIcon={i.icon} shortcut={i.sc} onSelect={i.run}>{i.label}</DropdownMenuItem>)}
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive startIcon={<Trash2 />} onSelect={() => a.remove(mail.id)}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MailList({ mails, selected, onSelect, a }: { mails: Mail[]; selected?: string; onSelect: (id: string) => void; a: Actions }) {
  if (!mails.length) return <p className="p-8 text-center text-sm text-muted-foreground">No messages match.</p>;
  return (
    <ul aria-label="Messages" className="grid gap-2 p-4 pt-0">
      {mails.map((m) => (
        <li key={m.id} className="group/mail relative">
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <button
                type="button"
                onClick={() => onSelect(m.id)}
                aria-current={selected === m.id ? "true" : undefined}
                className={cn(
                  "grid w-full gap-2 rounded-lg border border-border p-3 pr-10 text-left text-sm outline-none transition-colors hover:bg-accent focus-ring",
                  selected === m.id && "bg-muted"
                )}
              >
                <span className="flex items-center gap-2">
                  <span className={cn("truncate", !m.read && "font-semibold")}>{m.from}</span>
                  {!m.read && <span className="size-2 shrink-0 rounded-full bg-info-solid" aria-hidden />}
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground"><time dateTime={m.date}>{when(m.date)}</time></span>
                </span>
                <span className={cn("truncate text-xs", !m.read ? "font-medium" : "text-muted-foreground")}>
                  {!m.read && <span className="sr-only">Unread: </span>}{m.subject}
                </span>
                <span className="line-clamp-2 text-xs text-muted-foreground">{m.body.replace(/\n+/g, " ")}</span>
                <span className="flex flex-wrap gap-1">{m.labels.map((l) => <Badge key={l} variant={l === "important" ? "default" : "secondary"} className="text-[11px]">{l}</Badge>)}</span>
              </button>
            </ContextMenuTrigger>
            <MailActions mail={m} a={a} trigger="context" />
          </ContextMenu>
          <div className="absolute right-2 top-2"><MailActions mail={m} a={a} trigger="menu" /></div>
        </li>
      ))}
    </ul>
  );
}

function Reader({ mail, a, onBack }: { mail?: Mail; a: Actions; onBack?: () => void }) {
  const [reply, setReply] = React.useState("");
  const [mute, setMute] = React.useState(false);
  const tool = (label: string, icon: React.ReactNode, run: () => void, disabled = false) => (
    <Tooltip>
      <TooltipTrigger asChild><Button variant="ghost" size="icon" className="size-8" aria-label={label} onClick={run} disabled={disabled}>{icon}</Button></TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
  return (
    <div className="flex h-full flex-col">
      <div role="toolbar" aria-label="Message actions" className="flex h-[52px] items-center gap-1 px-2">
        {onBack && tool("Back to messages", <ArrowLeft aria-hidden />, onBack)}
        {tool("Archive", <Archive aria-hidden />, () => mail && a.archive(mail.id), !mail)}
        {tool("Move to junk", <ArchiveX aria-hidden />, () => toast("Moved to junk"), !mail)}
        {tool("Delete", <Trash2 aria-hidden />, () => mail && a.remove(mail.id), !mail)}
        <Separator orientation="vertical" className="mx-1 !h-6" />
        {tool("Snooze", <Clock aria-hidden />, () => toast("Snoozed until tomorrow 09:00"), !mail)}
        <div className="ml-auto flex items-center gap-1">
          {tool("Reply", <Reply aria-hidden />, () => document.getElementById("reply-box")?.focus(), !mail)}
          {tool("Reply all", <ReplyAll aria-hidden />, () => document.getElementById("reply-box")?.focus(), !mail)}
          {tool("Forward", <Forward aria-hidden />, () => toast("Forward"), !mail)}
        </div>
      </div>
      <Separator />
      {mail ? (
        <article aria-labelledby="mail-subject" className="flex min-h-0 flex-1 flex-col">
          <header className="flex items-start gap-3 p-4">
            <Avatar name={mail.from} size="lg" aria-hidden />
            <div className="grid min-w-0 gap-0.5 text-sm">
              <h2 id="mail-subject" className="font-semibold leading-tight">{mail.subject}</h2>
              <p>{mail.from} <span className="text-muted-foreground">&lt;{mail.email}&gt;</span></p>
            </div>
            <time dateTime={mail.date} className="ml-auto shrink-0 text-xs text-muted-foreground">{new Date(mail.date).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</time>
          </header>
          <Separator />
          <div className="min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap p-4 text-sm leading-relaxed">{mail.body}</div>
          <Separator />
          <form className="grid gap-3 p-4" onSubmit={(e) => { e.preventDefault(); if (!reply.trim()) return; toast.success(`Reply sent to ${mail.from}`); setReply(""); }}>
            <label htmlFor="reply-box" className="sr-only">Reply to {mail.from}</label>
            <Textarea id="reply-box" value={reply} onChange={(e) => setReply(e.target.value)} placeholder={`Reply to ${mail.from}…`} className="min-h-24" />
            <div className="flex items-center gap-2">
              <Switch id="mute" checked={mute} onCheckedChange={setMute} size="sm" />
              <Label htmlFor="mute" className="text-xs font-normal">Mute this thread</Label>
              <Button type="submit" size="sm" className="ml-auto" disabled={!reply.trim()}>Send</Button>
            </div>
          </form>
        </article>
      ) : (
        <p className="grid flex-1 place-items-center p-8 text-sm text-muted-foreground">No message selected</p>
      )}
    </div>
  );
}

/**
 * Block · Inbox app (shadcnstudio "Inbox App" / shadcn mail example).
 * Three resizable panes (folders · list · reader); on phones it becomes list → reader with a Back button.
 * Every right-click action is also in the visible "⋯" menu and the toolbar (context menus are not discoverable).
 */
export function InboxApp({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  const [mails, setMails] = React.useState(MAILS);
  const [folder, setFolder] = React.useState("inbox");
  const [tab, setTab] = React.useState<"all" | "unread">("all");
  const [q, setQ] = React.useState("");
  const [selected, setSelected] = React.useState<string | undefined>(isMobile ? undefined : "m1");
  const [showReader, setShowReader] = React.useState(false);

  const a: Actions = {
    archive: (id) => { setMails((l) => l.filter((m) => m.id !== id)); toast({ title: "Archived", action: { label: "Undo", onClick: () => setMails(MAILS), altText: "Undo archive" } }); if (selected === id) setSelected(undefined); },
    remove: (id) => { setMails((l) => l.filter((m) => m.id !== id)); toast("Moved to trash"); if (selected === id) setSelected(undefined); },
    toggleRead: (id) => setMails((l) => l.map((m) => (m.id === id ? { ...m, read: !m.read } : m))),
    star: (id) => setMails((l) => l.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))),
  };
  // Whatever is shown in the reader is read — including the message pre-selected on desktop.
  React.useEffect(() => {
    if (selected && (!isMobile || showReader)) setMails((l) => (l.some((m) => m.id === selected && !m.read) ? l.map((m) => (m.id === selected ? { ...m, read: true } : m)) : l));
  }, [selected, isMobile, showReader]);
  const open = (id: string) => { setSelected(id); if (isMobile) setShowReader(true); };
  const shown = mails.filter((m) => (folder !== "starred" || m.starred) && (tab === "all" || !m.read) && `${m.from} ${m.subject} ${m.body}`.toLowerCase().includes(q.toLowerCase()));
  const unread = mails.filter((m) => !m.read).length;
  const current = mails.find((m) => m.id === selected);

  const listPane = (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex h-[52px] items-center gap-2 px-4">
        <h2 className="text-lg font-semibold tracking-tight">{FOLDERS.find((f) => f.id === folder)!.label}</h2>
        {/* A filter, not tabs: there are no separate tab panels, so ToggleGroup (radio semantics) is the honest pattern. */}
        <ToggleGroup type="single" variant="outline" size="sm" value={tab} onValueChange={(v) => v && setTab(v as "all" | "unread")} aria-label="Filter messages" className="ml-auto">
          <ToggleGroupItem value="all" className="flex-none px-3">All</ToggleGroupItem>
          <ToggleGroupItem value="unread" className="flex-none gap-1.5 px-3">Unread <span className="rounded-sm bg-muted px-1 text-xs tabular-nums">{unread}</span></ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Separator />
      <div className="p-4"><SearchInput size="md" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} placeholder="Search mail…" aria-label="Search mail" /></div>
      <p className="sr-only" aria-live="polite">{shown.length} messages</p>
      <div className="min-h-0 flex-1 overflow-y-auto"><MailList mails={shown} selected={selected} onSelect={open} a={a} /></div>
    </div>
  );

  if (isMobile) {
    return (
      <div className={cn("h-[640px] overflow-hidden rounded-xl border border-border bg-background", className)}>
        {showReader ? <Reader mail={current} a={a} onBack={() => setShowReader(false)} /> : listPane}
      </div>
    );
  }

  return (
    <div className={cn("h-[680px] overflow-hidden rounded-xl border border-border bg-background", className)}>
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="18" minSize="14" maxSize="26">
          <nav aria-label="Mail folders" className="flex h-full flex-col">
            <div className="flex h-[52px] items-center px-4 text-sm font-semibold">bubus@agere.id</div>
            <Separator />
            <ul className="grid gap-1 p-2">
              {FOLDERS.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    aria-current={folder === f.id ? "page" : undefined}
                    onClick={() => setFolder(f.id)}
                    className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-sm outline-none hover:bg-accent focus-ring aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
                  >
                    <f.icon className="size-4" aria-hidden />{f.label}
                    {f.count && <span className="ml-auto text-xs tabular-nums">{f.id === "inbox" ? unread : f.count}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize folder list" />
        <ResizablePanel defaultSize="36" minSize="28">{listPane}</ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize message list" />
        <ResizablePanel defaultSize="46" minSize="30"><Reader mail={current} a={a} /></ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
