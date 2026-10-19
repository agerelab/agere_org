"use client";

import * as React from "react";
import { FolderPlus, Link2, Plus, Upload, X } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { team } from "./data";

/**
 * Block · Empty state (shadcnstudio "Empty State"). Anatomy: icon tile → what's missing → why it
 * matters → primary + secondary action. The dashed frame signals "drop or create something here".
 */
export function EmptyProjects() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 rounded-xl border border-dashed border-border p-10 text-center md:p-14">
      <div className="flex -space-x-2" aria-hidden>
        <span className="grid size-12 -rotate-6 place-items-center rounded-xl border border-border bg-card shadow-sm"><Upload className="size-5 text-muted-foreground" /></span>
        <span className="z-[1] grid size-12 place-items-center rounded-xl border border-border bg-card shadow-sm"><FolderPlus className="size-5" /></span>
        <span className="grid size-12 rotate-6 place-items-center rounded-xl border border-border bg-card shadow-sm"><Link2 className="size-5 text-muted-foreground" /></span>
      </div>
      <div className="grid max-w-sm gap-2">
        <h3 className="text-lg font-semibold tracking-tight">No projects yet</h3>
        <p className="text-sm text-muted-foreground">Projects group your tasks, docs and dashboards. Create one from scratch or import from a CSV.</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button leadingIcon={<Plus />}>Create project</Button>
        <Button variant="outline" leadingIcon={<Upload />}>Import CSV</Button>
      </div>
    </div>
  );
}

/** Block · Invite members dialog (shadcnstudio "Dashboard Dialog"). */
export function InviteMembersDialog() {
  const [emails, setEmails] = React.useState<string[]>(["raka@agere.id"]);
  const [draft, setDraft] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [open, setOpen] = React.useState(false);

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return setError("Enter a valid email address.");
    if (emails.includes(v)) return setError("That address is already on the list.");
    setEmails((e) => [...e, v]);
    setDraft("");
    setError(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" leadingIcon={<Plus />}>Invite members</Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Invite to agere</DialogTitle>
          <DialogDescription>Invitees get an email and join as Members. You can change roles later.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="flex items-start gap-2">
            <FormField label="Email address" hideLabel error={error} className="flex-1">
              <FormControl>
                <Input value={draft} placeholder="name@company.com" onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
              </FormControl>
            </FormField>
            <Select defaultValue="member">
              <SelectTrigger className="w-28" aria-label="Role for new invites"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={add}>Add</Button>
          </div>
          {emails.length > 0 && (
            <ul aria-label="Pending invites" className="flex flex-wrap gap-2">
              {emails.map((e) => (
                <li key={e} className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-muted/50 pl-2 pr-1 text-sm">
                  {e}
                  <button type="button" onClick={() => setEmails((l) => l.filter((x) => x !== e))} aria-label={`Remove ${e}`} className="inline-flex size-5 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-ring">
                    <X className="size-3.5" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Separator />
          <div className="grid gap-3">
            <p className="text-sm font-medium">People with access</p>
            {team.slice(0, 3).map((m) => (
              <div key={m.id} className="flex items-center gap-3">
                <Avatar name={m.name} size="md" aria-hidden />
                <div className="grid min-w-0 flex-1">
                  <span className="truncate text-sm font-medium">{m.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{m.email}</span>
                </div>
                <span className="text-sm text-muted-foreground">{m.role}</span>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button disabled={!emails.length} onClick={() => { setOpen(false); toast.success(`${emails.length} invite${emails.length > 1 ? "s" : ""} sent`); }}>
            Send {emails.length || ""} invite{emails.length === 1 ? "" : "s"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
