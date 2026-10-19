import * as React from "react";
import { ArrowRight, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardLink } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES, COMPONENTS, byId, type Category } from "../registry";
import { Callout, CodeBlock, DoDont, KeyboardTable, PageHeader, Preview, Section, SpecTable, StatusBadge, href } from "../kit";

/* ================================================================== */
/* Catalog — cal.com/apps layout: search, category chips, tile grid    */
/* ================================================================== */
export function ComponentsCatalog() {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState<Category | "All">("All");
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, COMPONENTS.filter((x) => x.category === c).length]));
  const list = COMPONENTS.filter(
    (c) => (cat === "All" || c.category === cat) && (q === "" || `${c.name} ${c.summary} ${c.level}`.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Library"
        title="Components"
        description={`${COMPONENTS.length} production components — atoms, molecules and organisms — built on Radix primitives, styled only with agere tokens, and audited for WCAG 2.1 AA.`}
      />

      <div className="grid gap-4">
        <SearchInput aria-label="Search components" placeholder="Search components…" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} size="lg" className="max-w-md" />
        <div role="group" aria-label="Filter by category" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {(["All", ...CATEGORIES] as const).map((c) => {
            const on = cat === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setCat(c)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors duration-base focus-ring",
                  on ? "border-brand bg-brand text-brand-fg" : "border-default bg-default text-default hover:border-emphasis hover:bg-muted"
                )}
              >
                {c}
                <span className={cn("text-xs tabular-nums", on ? "text-brand-fg/70" : "text-subtle")}>{c === "All" ? COMPONENTS.length : counts[c]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p role="status" className="sr-only">{list.length} components</p>
      {list.length === 0 ? (
        <EmptyState icon={<Search />} title={`No components match “${q}”`} description="Try a broader term like “input”, “menu” or “table”." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <li key={c.id}>
              <Card variant="interactive" className="h-full gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <span aria-hidden className="grid size-11 place-items-center rounded-lg border border-subtle bg-muted text-emphasis shadow-elevation-1">
                    <c.icon className="size-5" />
                  </span>
                  <div className="flex gap-1"><Badge size="sm" variant="gray">{c.level}</Badge><StatusBadge status={c.status} /></div>
                </div>
                <div className="grid gap-1">
                  <h2 className="type-heading-sm text-emphasis"><CardLink href={href(`/components/${c.id}`)}>{c.name}</CardLink></h2>
                  <p className="text-xs text-subtle">{c.category}</p>
                </div>
                <p className="line-clamp-3 text-sm leading-5 text-default">{c.summary}</p>
                <span aria-hidden className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-emphasis">Details <ArrowRight className="size-3.5" /></span>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const NOT_EXPORTS = new Set(["Plus", "Copy", "AtSign", "Video", "Link", "NavLink", "Pencil", "MoreHorizontal", "KanbanSquare", "CalendarDays", "Link2", "LaunchIcon", "EditorContent", "MoveButton", "DeleteButton"]);
function importLine(code: string) {
  const names = Array.from(new Set(Array.from(code.matchAll(/<([A-Z][A-Za-z]+)/g)).map((m) => m[1]))).filter((n) => !NOT_EXPORTS.has(n));
  if (/\btoast[.(]/.test(code)) names.push("toast");
  return `import {\n  ${names.join(", ")},\n} from "@/components/agere-ds";`;
}

/* ================================================================== */
/* Component detail                                                    */
/* ================================================================== */
export function ComponentPage({ id }: { id: string }) {
  const doc = byId(id);
  if (!doc) return <EmptyState title="Component not found" description={<a href={href("/components")}>Back to all components</a>} />;
  const Demo = doc.demo;
  const States = doc.states;
  return (
    <div className="grid gap-2">
      <PageHeader
        eyebrow={`${doc.category} · ${doc.level}`}
        title={doc.name}
        description={doc.summary}
        badges={<StatusBadge status={doc.status} />}
      />
      <Tabs defaultValue="overview" variant="underline" className="pt-6">
        <TabsList aria-label={`${doc.name} documentation`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="a11y">Accessibility</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid gap-2">
          <Section title="Example">
            <Preview align={doc.category === "Data & Complex" ? "stretch" : "center"}><Demo /></Preview>
          </Section>
          {States && (
            <Section title="Variants & states">
              <Preview align="start"><States /></Preview>
            </Section>
          )}
          {doc.specs && (
            <Section title="Specs & tokens" description="Every value maps to a design token — no magic numbers.">
              <SpecTable head={["Part", "Token / value"]} rows={doc.specs} caption={`${doc.name} specs`} />
            </Section>
          )}
        </TabsContent>

        <TabsContent value="usage" className="grid gap-2">
          <Section title="Do’s & don’ts"><DoDont dos={doc.dos} donts={doc.donts} /></Section>
          {doc.interaction && (
            <Section title="Interactive states & micro-interactions">
              <ul className="grid gap-2 text-sm leading-6 text-default">{doc.interaction.map((i) => <li key={i} className="flex gap-2"><span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-accent" />{i}</li>)}</ul>
            </Section>
          )}
          {doc.content && (
            <Section title="Content guidelines">
              <ul className="grid gap-2 text-sm leading-6 text-default">{doc.content.map((i) => <li key={i} className="flex gap-2"><span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-accent" />{i}</li>)}</ul>
            </Section>
          )}
        </TabsContent>

        <TabsContent value="a11y" className="grid gap-2">
          {doc.a11y.role && (
            <Section title="Semantics"><Callout tone="neutral"><span className="font-medium text-emphasis">Role:</span> {doc.a11y.role}</Callout></Section>
          )}
          {doc.a11y.keyboard && <Section title="Keyboard"><KeyboardTable rows={doc.a11y.keyboard} /></Section>}
          <Section title="Notes">
            <ul className="grid gap-2 text-sm leading-6 text-default">{doc.a11y.notes.map((n) => <li key={n} className="flex gap-2"><span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-success-solid" />{n}</li>)}</ul>
          </Section>
          <Section title="Automated checks">
            <Callout tone="success">This component is covered by the axe-core suite (<code>npm test</code>) and the Storybook a11y addon. Manual screen-reader passes are tracked per release in the changelog.</Callout>
          </Section>
        </TabsContent>

        <TabsContent value="code" className="grid gap-2">
          <Section title="Usage"><CodeBlock code={doc.code} /></Section>
          <Section title="Import"><CodeBlock code={importLine(doc.code)} /></Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
