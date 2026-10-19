import * as React from "react";
import { ArrowRight, Blocks, Component, Gauge, Layers, Palette, Rocket, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardLink } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COMPONENTS } from "../registry";
import { CodeBlock, Section, href } from "../kit";

const CARDS = [
  { t: "Foundations", d: "Color, typography, spacing, grid, elevation, motion.", to: "/foundations/color", icon: Palette },
  { t: "Components", d: `${COMPONENTS.length} components with live demos, specs, do’s & don’ts.`, to: "/components", icon: Component },
  { t: "Patterns", d: "Auth, onboarding, checkout and dashboard flows.", to: "/patterns", icon: Blocks },
  { t: "Workspace", d: "ClickUp-class app: views, dense task list, board, Gantt, docs, chat, ⌘K.", to: "/workspace", icon: Rocket },
  { t: "Accessibility", d: "WCAG 2.1 AA baseline, keyboard spec, release checklist.", to: "/guidelines/accessibility", icon: ShieldCheck },
  { t: "Engineering", d: "Architecture, token pipeline, testing & CI.", to: "/engineering/architecture", icon: Layers },
];

export function OverviewPage() {
  React.useEffect(() => { document.title = "agere DS"; }, []);
  return (
    <div className="grid gap-4">
      <section className="relative overflow-hidden rounded-2xl border border-subtle bg-default px-6 py-12 shadow-elevation-1 sm:px-10 sm:py-16">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-brand-accent-subtle blur-3xl" />
        <div className="relative grid max-w-2xl gap-5">
          <Badge variant="outline" startIcon={<Sparkles />} className="w-fit">v7.0 · Geist language · 34 blocks · ClickUp-class workspace</Badge>
          <h1 className="type-display-xl text-emphasis">Ship the MVP, not the UI kit.</h1>
          <p className="text-lg leading-7 text-default">agere DS is agere’s shared product foundation: tokens, accessible React components and proven patterns so every venture goes from idea to launch in weeks — and looks like it was built by the same careful team.</p>
          <div className="flex flex-wrap gap-2">
            <Button size="lg" asChild trailingIcon={<ArrowRight />}><a href={href("/components")}>Browse components</a></Button>
            <Button size="lg" variant="outline" asChild><a href={href("/engineering/architecture")}>Get started</a></Button>
          </div>
        </div>
      </section>

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[["Components", String(COMPONENTS.length), Component], ["Semantic tokens", "90+", Palette], ["Platforms", "Web · iOS · Android", Rocket], ["Target", "WCAG 2.1 AA + APCA", Gauge]].map(([k, v, I]) => {
          const Ic = I as typeof Component;
          return (
            <div key={k as string} className="grid gap-1 rounded-xl border border-subtle bg-default p-5">
              <dt className="flex items-center gap-2 text-sm text-subtle"><Ic aria-hidden className="size-4" />{k as string}</dt>
              <dd className="font-sans tracking-tight text-2xl font-semibold text-emphasis">{v as string}</dd>
            </div>
          );
        })}
      </dl>

      <Section title="Explore">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <li key={c.t}>
              <Card variant="interactive" className="h-full gap-3 p-5">
                <span aria-hidden className="grid size-10 place-items-center rounded-lg border border-subtle bg-muted text-emphasis"><c.icon className="size-5" /></span>
                <h3 className="type-heading-sm"><CardLink href={href(c.to)}>{c.t}</CardLink></h3>
                <p className="text-sm text-subtle">{c.d}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Principles">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Speed to market", "Assemble, don’t invent. If two ventures need it, it belongs in the system — once."],
            ["Quiet by default", "Neutral surfaces, one ink brand, restrained amber. The venture’s content and brand color do the talking."],
            ["Accessible by construction", "Contrast is audited from tokens; labels are required by types; keyboard specs ship with every component."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl border border-subtle bg-default p-5"><p className="type-heading-md">{t}</p><p className="mt-1 text-sm text-subtle">{d}</p></div>
          ))}
        </div>
      </Section>

      <Section title="Quick start">
        <CodeBlock lang="bash" code={`npm install          # tokens build automatically (predev/prebuild)
npm run dev          # this documentation portal
npm run storybook    # component workshop (a11y + themes)
npm test             # vitest + axe-core + token contrast audit`} />
        <CodeBlock code={`// tailwind.config.ts in a venture
import agere from "@agere/design-system/tailwind.preset";
export default { presets: [agere], content: ["./src/**/*.{ts,tsx}", "./node_modules/@agere/design-system/dist/**/*.js"] };

// app root
import "@agere/design-system/styles.css";
import { Toaster, TooltipProvider } from "@agere/design-system";
<TooltipProvider><App /><Toaster /></TooltipProvider>`} />
      </Section>
    </div>
  );
}
