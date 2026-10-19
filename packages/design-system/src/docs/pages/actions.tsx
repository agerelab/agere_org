import { Archive, Flag, Link2, Plus, Send, Trash2, Upload, Zap } from "lucide-react";

import {
  PageHeader as AppPageHeader, PageHeaderActions, PageHeaderBack, PageHeaderContent, PageHeaderDescription, PageHeaderLeading, PageHeaderTitle,
} from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock, DoDont, PageHeader, Preview, Section, SpecTable, Callout } from "../kit";

/* ================================================================== */
/* ACTIONS & CTA — v6.4                                                */
/* ================================================================== */
export function ActionsPage() {
  return (
    <div className="grid gap-2">
      <PageHeader
        eyebrow="Guidelines"
        title="Actions & CTA"
        badges={<Badge variant="info">New in 6.4</Badge>}
        description="Which button variant to use, where an action lives, and how actions collapse on small screens. These rules came out of a full CTA audit of the agere/org prototype; the PageHeaderActions component enforces most of them by construction."
      />

      <Section title="Hierarchy" description="Variant names are shadcn's. The rule is about meaning, not looks: one forward action per view.">
        <SpecTable
          head={["Variant", "Use for", "Limit", "Example"]}
          rows={[
            [<Button size="sm">Default</Button>, "The view's forward action: create, save, send", "1 per view", "Tugas baru · Simpan perubahan"],
            [<Button size="sm" variant="outline">Outline</Button>, "Second actions beside the primary", "2 in a page header", "Bagikan · Impor"],
            [<Button size="sm" variant="ghost">Ghost</Button>, "Cancel, toolbar utilities, icon buttons", "—", "Batal · Tandai semua dibaca"],
            [<Button size="sm" variant="destructive">Destructive</Button>, "The final confirm inside a confirm dialog only", "1, in the dialog", "Hapus organisasi"],
            [<Button size="sm" variant="destructive-outline">Destructive outline</Button>, "Entry points into a destructive flow", "—", "Danger zone · dialog footer left"],
            [<Button size="sm" variant="link">Link</Button>, "Inline, inside a sentence", "—", "Lihat panduan harga"],
            [<Button size="sm" variant="secondary">Secondary</Button>, "The selected state of a toggle", "—", "Chosen icon in a picker"],
          ]}
        />
        <SpecTable
          head={["Context", "Size", "Why"]}
          rows={[
            ["Page header, dialog footer, form", "md (40 px)", "Matches 40 px inputs"],
            ["Auth and onboarding submit", "lg (48 px)", "Full-width, single task"],
            ["Toolbar, card or section header, popover", "sm (32 px)", "Secondary density"],
            ["Table and list row actions", "xs (24 px) / icon-xs", "Repeats on every row"],
          ]}
        />
      </Section>

      <Section title="Page header actions" description="Order: access avatars (optional) → up to two outline → one default → ⋯. The ⋯ is always last.">
        <Preview label="PageHeaderActions" align="start">
          <div className="w-full">
            <AppPageHeader>
              <PageHeaderLeading>EN</PageHeaderLeading>
              <PageHeaderContent>
                <PageHeaderBack href="#/guidelines/actions">Product & Tech</PageHeaderBack>
                <PageHeaderTitle as="h2" badges={<><Badge variant="success">On track</Badge><Badge variant="outline">Restricted</Badge></>}>Engineering</PageHeaderTitle>
                <PageHeaderDescription>Client bugs and web features.</PageHeaderDescription>
              </PageHeaderContent>
              <PageHeaderActions
                secondary={[{ label: "Share" }]}
                primary={{ label: "New task", icon: <Plus /> }}
                menu={[{ label: "Project status", icon: <Flag /> }, { label: "Automations", icon: <Zap /> }, { label: "Copy project link", icon: <Link2 /> }, "separator", { label: "Archive project", icon: <Archive /> }, { label: "Move to trash", icon: <Trash2 />, destructive: true }]}
              />
            </AppPageHeader>
          </div>
        </Preview>
        <SpecTable
          head={["Rule", "Detail"]}
          rows={[
            ["Labels", "Verb + object, sentence case. The primary is always labelled."],
            ["Icon on a labelled button", "Optional, only when the icon means one thing (+ for create)."],
            ["Icon-only", "Only ⋯ and actions with a universal icon (close, theme). Always an aria-label and tooltip — IconButton makes the label required."],
            ["One action, one place", "An action shown as a button is never repeated in ⋯ at the same breakpoint. Share is a button, so it is not in ⋯."],
            ["Below md (768 px)", "Outline actions move into ⋯ as its first items, then a separator. The default stays labelled and fills the row."],
            ["Empty state", "When an EmptyState owns the primary, omit primary from the header — never two identical primaries on one screen."],
            ["Formats may grow", "Use a general verb: Import / Export, not Import .md. List the supported formats inside the dialog or menu."],
          ]}
        />
        <CodeBlock code={`<PageHeaderActions
  secondary={[{ label: "Share", onSelect: openShare }]}          // max 2, type-enforced
  primary={{ label: "New task", icon: <Plus />, onSelect: create }}
  menu={[{ label: "Project status" }, "separator", { label: "Move to trash", destructive: true }]}
/>`} />
        <DoDont
          dos={["Keep sharing visible as a button in collaborative views — it is a frequent action.", "Put rare or risky actions (status, archive, trash) in ⋯.", "Use Import with a format list in the dialog: Markdown (.md), plain text (.txt), CSV."]}
          donts={["Don’t make the primary icon-only to save space on desktop.", "Don’t use ghost text buttons in a page header — move them to the toolbar or ⋯.", "Don’t show a red solid button before the user confirms."]}
        />
      </Section>

      <Section title="Destructive flows">
        <SpecTable
          head={["Step", "Component", "Variant"]}
          rows={[
            ["Entry (settings danger zone, dialog footer)", "Button", "destructive-outline, footer-left in dialogs"],
            ["Entry (overflow)", "DropdownMenuItem", "destructive"],
            ["Confirm", "AlertDialog", "destructive, repeats the verb of the title"],
            ["Irreversible (delete org, close account)", "AlertDialog + type-to-confirm", "destructive, disabled until the phrase matches"],
            ["After", "Toast", "“Undo” for 8 s when the item went to Trash"],
          ]}
        />
      </Section>

      <Section title="Editors: save bar or autosave" description="Pick one per surface and say so on screen.">
        <SpecTable
          head={["Surface", "Pattern", "Status copy"]}
          rows={[
            ["Settings forms, skill or form builders", "SaveBar (explicit save, sticky)", "All changes saved · Unsaved changes · Saving… · Couldn’t save"],
            ["Docs and notes", "Autosave, status in the page toolbar", "Saved · Saving…"],
            ["Dialogs", "Footer with Cancel (ghost) and the final action", "“Unsaved changes” guard on close"],
          ]}
        />
        <Callout tone="info" title="Toasts never cover actions">Save bars and dialog footers sit bottom-right, so toasts stack bottom-left, at most two at a time.</Callout>
      </Section>

      <Section title="Import & export" description="Name the verb, not the format.">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" leadingIcon={<Upload />}>Import</Button>
          <Button variant="outline" leadingIcon={<Send />}>Export</Button>
        </div>
        <DoDont dos={["Import — the dialog lists Markdown (.md) and plain text (.txt).", "Export — a menu of formats (Markdown, PDF, CSV)."]} donts={["Import .md", "Import from Markdown file"]} />
      </Section>
    </div>
  );
}
