import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Callout, CodeBlock, PageHeader, Section } from "../kit";
import { RULE_GROUPS, allRules, isAutomated, type Rule } from "../registry/interface-rules";

type Filter = "all" | "automated" | "review";
const tone = (b: string) =>
  b.startsWith("lint") ? "info" : b === "test" ? "special" : b === "built-in" ? "success" : b === "tokens" ? "brand" : "gray";
const label = (b: string) => (b.startsWith("lint:") ? b.slice(5) : b);

/** v7 — AGENTS.md rules with how each one is enforced. Same data generates AGENTS.md and GUIDELINES.md. */
export function InterfaceRulesPage() {
  const [filter, setFilter] = React.useState<Filter>("all");
  const rules = allRules();
  const auto = rules.filter(isAutomated).length;
  const show = (r: Rule) => filter === "all" || (filter === "automated" ? isAutomated(r) : !isAutomated(r));
  const shown = rules.filter(show).length;
  return (
    <div className="grid gap-2">
      <PageHeader
        eyebrow="Guidelines"
        title="Interface rules"
        badges={<Badge variant="info">New in 7.0</Badge>}
        description={<>The rules from <code>AGENTS.md</code>, each tagged with how agere enforces it. Statically checkable rules fail CI (<code>npm run lint:guidelines</code>); behavioural ones are built into components and covered by tests or the Chromium check; the rest form the review checklist in <code>GUIDELINES.md</code>.</>}
      />
      <Section title="Coverage" description={`${auto} of ${rules.length} rules are enforced automatically.`}>
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl<Filter>
            aria-label="Show rules"
            value={filter}
            onValueChange={setFilter}
            options={[{ value: "all", label: "All" }, { value: "automated", label: "Automated" }, { value: "review", label: "Needs review" }]}
          />
          <span className="text-sm tabular-nums text-subtle" aria-live="polite">{shown} shown</span>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-subtle">
          {[["lint:G01", "fails CI"], ["built-in", "the component does it"], ["test", "asserted in tests"], ["tokens", "guaranteed by tokens"], ["review", "PR checklist"]].map(([b, d]) => (
            <span key={b} className="inline-flex items-center gap-1.5"><Badge size="sm" variant={tone(b) as never}>{b === "lint:G01" ? "lint" : b}</Badge>{d}</span>
          ))}
        </div>
        <Callout tone="neutral" title="One deliberate override">
          AGENTS.md suggests placeholders that end with … and show an example. agere&apos;s 6.4 Forms guideline is stricter and wins: placeholders only in search fields (they end with …); authoring fields get a visible label and helper text. An ellipsis after an example value backfires — “you@company.com…” reads as if the address continues. G12 lists the 39 existing authoring placeholders as a warning, not a failure, so each surface gets a design decision instead of a mechanical edit.
        </Callout>
      </Section>
      {RULE_GROUPS.map((g) => {
        const list = g.rules.filter(show);
        if (!list.length) return null;
        return (
          <Section key={g.id} id={`rules-${g.id}`} title={g.title}>
            <ul className="grid divide-y divide-border rounded-xl border border-subtle">
              {list.map((r, i) => (
                <li key={i} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 px-4 py-3">
                  <span className={r.level === "NEVER" ? "font-mono text-xs font-semibold text-error-on-surface" : "font-mono text-xs font-semibold text-emphasis"} translate="no">{r.level}</span>
                  <div className="grid min-w-0 gap-1.5">
                    <span className="text-sm text-default">{r.text}</span>
                    <span className="flex flex-wrap gap-1">{r.by.map((b) => <Badge key={b} size="sm" variant={tone(b) as never} translate="no">{label(b)}</Badge>)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        );
      })}
      <Section title="Suppressing a finding">
        <CodeBlock code={`// agere-guidelines-ignore G03 Radix focuses this container only when it holds no focusable child
className="… outline-none"`} />
      </Section>
    </div>
  );
}
