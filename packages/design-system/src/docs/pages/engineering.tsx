import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Callout, CodeBlock, PageHeader, Prose, Section, SpecTable } from "../kit";

/* ================================================================== */
/* ARCHITECTURE                                                        */
/* ================================================================== */
export function ArchitecturePage() {
  return (
    <div className="grid gap-2">
      <PageHeader eyebrow="Engineering" title="Architecture" description="React 18 + TypeScript, Tailwind CSS 3.4 with an agere preset, Radix UI primitives, class-variance-authority recipes. Components follow the shadcn/ui ‘own your source’ model so ventures can fork a primitive without forking the system." />
      <Section title="Stack decision" description="Option A vs Option B, evaluated for a venture studio that ships many MVPs in parallel.">
        <SpecTable
          head={["Criterion", "A · Tailwind + CSS variables (chosen)", "B · CSS-in-JS (Emotion / styled-components)"]}
          rows={[
            ["Runtime cost", "Zero — static CSS", "Style injection at runtime; RSC friction"],
            ["Theming / white-label", "Swap CSS variables per subtree; works in any framework", "Theme provider per tree; JS required"],
            ["Next.js App Router / RSC", "Native", "Needs client boundaries"],
            ["Onboarding speed", "Engineers already know Tailwind", "Library-specific patterns"],
            ["Governance", "Preset removes raw palette; lint by grep", "Harder to prevent ad-hoc values"],
            ["Trade-off", "Long class strings (mitigated by cva recipes)", "Better co-location of styles"],
          ]}
        />
        <Callout tone="neutral" title="Cross-platform">Web is the reference implementation. iOS (SwiftUI) and Android (Jetpack Compose) consume the same tokens from <code>build/ios</code> and <code>build/compose</code>; Flutter can read <code>build/tokens/*.json</code>. Native component parity is a roadmap item, tracked per component status.</Callout>
      </Section>
      <Section title="Repository layout">
        <CodeBlock lang="text" code={`tokens/                    DTCG JSON — the single source of truth
  primitive/               color, space, radius, typography, effects, layout
  semantic/                color.light.json · color.dark.json · typography.json
  component/               button, input, card, dialog … sizes
scripts/
  build-tokens.mjs         Style Dictionary v5 pipeline
  build-brand.mjs          outlines the wordmark → assets/brand/*.svg
src/
  styles/                  globals.css (+ generated tokens.light/dark.css)
  tokens/                  generated TS tokens + type style names
  components/ui/           primitives (shadcn layout, npx shadcn add compatible)
  components/agere-ds/     organisms + feature modules + public entry (index.ts)
  brand/  icons/           logo, illustrations, custom icons
  docs/                    this documentation portal
tests/                     vitest + testing-library + axe-core
.storybook/                Storybook 10 (a11y + themes addons) → Chromatic
tailwind.preset.ts         the published preset (semantic-only palette)`} />
      </Section>
      <Section title="Component anatomy">
        <CodeBlock code={`// 1. recipe — every visual decision is a token-backed class
export const buttonVariants = cva(base, { variants: { variant, size }, defaultVariants });

// 2. component — forwardRef, asChild via Radix Slot, a11y props enforced in types
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => …);

// 3. public entry — one import path for products
export { Button, buttonVariants, type ButtonProps } from "@/components/ui/button";`} />
        <Prose>
          <ul>
            <li><strong>Composition over configuration:</strong> compound parts (<code>Dialog</code> → <code>DialogHeader</code> → <code>DialogFooter</code>) instead of 30-prop mega-components.</li>
            <li><strong>Controlled + uncontrolled:</strong> every stateful component accepts <code>value/onValueChange</code> and a default.</li>
            <li><strong>No product logic:</strong> components emit intent (<code>onCardMove</code>); products own persistence and rollback.</li>
            <li><strong>data-slot</strong> attributes mark parts for forced-colors styling and product-level overrides.</li>
          </ul>
        </Prose>
      </Section>
    </div>
  );
}

/* ================================================================== */
/* TOKEN PIPELINE                                                      */
/* ================================================================== */
export function TokensPage() {
  return (
    <div className="grid gap-2">
      <PageHeader eyebrow="Engineering" title="Token pipeline" description="Tokens are authored once in W3C DTCG JSON and compiled by Style Dictionary v5 to every platform. Figma (Tokens Studio) reads the same files." />
      <Section title="Flow">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
          {[["Figma · Tokens Studio", "Designers edit variables → PR to /tokens"], ["tokens/*.json (DTCG)", "Primitive → semantic → component tiers"], ["Style Dictionary v5", "npm run tokens"]].map(([t, d], i) => (
            <React.Fragment key={t}>
              <div className="rounded-xl border border-subtle bg-default p-4"><p className="type-heading-sm">{t}</p><p className="text-sm text-subtle">{d}</p></div>
              {i < 2 && <span aria-hidden className="hidden text-center text-subtle md:block">→</span>}
            </React.Fragment>
          ))}
        </div>
        <SpecTable
          head={["Output", "Path", "Consumer"]}
          rows={[
            ["CSS variables (HSL channels)", "src/styles/tokens.light.css · tokens.dark.css", "Web (Tailwind preset)"],
            ["TypeScript objects", "src/tokens/generated/light.ts · dark.ts", "Charts, canvas, docs"],
            ["Nested JSON", "build/tokens/tokens.{light,dark}.json", "Flutter, Tokens Studio, docs"],
            ["SwiftUI", "build/ios/AgereTokens.swift · AgereTokensDark.swift", "iOS"],
            ["Android XML", "build/android/values(-night)/agere_colors.xml · agere_dimens.xml", "Android Views"],
            ["Jetpack Compose", "build/compose/AgereTokens.kt · AgereTokensDark.kt", "Android Compose"],
          ]}
        />
      </Section>
      <Section title="Naming">
        <SpecTable
          head={["Tier", "Example", "Rule"]}
          rows={[
            [<Badge variant="gray">Primitive</Badge>, "color.gray.900 · space.4 · radius.control", "Raw values. Never referenced by components."],
            [<Badge variant="info">Semantic</Badge>, "bg.subtle · fg.emphasis · border.control · error.fg", "Role-based; has light + dark values."],
            [<Badge variant="special">Component</Badge>, "component.button.height.md", "Only when a component needs a value the semantic tier doesn’t express."],
          ]}
        />
        <CodeBlock lang="json" code={`// tokens/semantic/color.light.json
{
  "border": {
    "control": {
      "$type": "color",
      "$value": "{color.gray.400}",
      "$description": "Form-control boundaries — ≥3:1 vs bg.default (WCAG 1.4.11)"
    }
  }
}`} />
        <CodeBlock lang="css" code={`/* generated: src/styles/tokens.light.css */
:root, :host, [data-theme="light"] {
  --ag-border-control: 220 8.9% 56.1%;
}
/* usage via the preset */
.border-control { border-color: hsl(var(--ag-border-control) / 1); }`} />
      </Section>
      <Section title="Theming & white-label">
        <CodeBlock code={`<html class="dark">                       // dark mode
<div data-brand="indigo">…</div>           // preset brand on a subtree
<div data-contrast="more">…</div>          // high-contrast mode
<div data-contrast="geist">…</div>         // upstream-exact Geist values (demos only, not AA)

import { applyBrandColor } from "@/components/agere-ds";
const r = applyBrandColor(el, "#0EA5E9");   // runtime brand + auto text color
if (!r.passesAA) warn("Brand color fails AA as a filled control");`} />
      </Section>
    </div>
  );
}

/* ================================================================== */
/* TESTING & QA                                                        */
/* ================================================================== */
export function TestingPage() {
  return (
    <div className="grid gap-2">
      <PageHeader eyebrow="Engineering" title="Testing & QA" description="Four layers run on every pull request. A red check blocks merge." />
      <Section title="Layers">
        <SpecTable
          head={["Layer", "Tool", "What it catches", "Command"]}
          rows={[
            ["Unit & interaction", "Vitest 5 + Testing Library + user-event", "Behavior, keyboard, controlled/uncontrolled", "npm test"],
            ["Automated a11y", "axe-core (in tests) + @storybook/addon-a11y", "ARIA misuse, names, contrast in stories", "npm test · Storybook panel"],
            ["Token contrast", "tests/tokens.contrast.test.ts", "Any token change that breaks AA pairs", "npm test"],
            ["Visual regression", "Storybook 10 + Chromatic", "Pixel diffs per story, light + dark", "npm run chromatic"],
            ["Types & build", "tsc, vite build, storybook build", "API breaks, dead imports", "npm run ci"],
          ]}
        />
      </Section>
      <Section title="Writing an a11y test">
        <CodeBlock code={`import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoA11yViolations } from "./utils/axe";
import { Switch } from "@/components/ui/switch";

it("toggles with the keyboard and has no axe violations", async () => {
  const { container } = render(<><label htmlFor="s">Require confirmation</label><Switch id="s" /></>);
  const sw = screen.getByRole("switch", { name: "Require confirmation" });
  sw.focus();
  await userEvent.keyboard(" ");
  expect(sw).toHaveAttribute("aria-checked", "true");
  await expectNoA11yViolations(container);
});`} />
      </Section>
      <Section title="CI pipeline">
        <CodeBlock lang="yaml" code={`# .github/workflows/ci.yml
jobs:
  quality:   npm ci → npm run tokens → npm run typecheck → npm test -- --coverage → npm run build
  storybook: npm run build-storybook → chromaui/action (visual review, a11y results)
  release:   changesets/action → version PR → npm publish + GitHub release notes`} />
        <Prose><p>Chromatic snapshots every story in light and dark (via the themes addon). Visual changes need an approver from the DS core team; unintended diffs block merge.</p></Prose>
      </Section>
    </div>
  );
}
