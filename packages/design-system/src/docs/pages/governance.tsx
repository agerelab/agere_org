import { Badge } from "@/components/ui/badge";
import { Stepper } from "@/components/ui/stepper";
import { Callout, CodeBlock, PageHeader, Prose, Section, SpecTable } from "../kit";

/* ================================================================== */
/* VERSIONING & RELEASES                                               */
/* ================================================================== */
export function VersioningPage() {
  return (
    <div className="grid gap-2">
      <PageHeader eyebrow="Governance" title="Versioning & releases" description="Semantic Versioning, automated with Changesets. Every release ships a changelog entry; every major ships a migration guide and codemods where possible." />
      <Section title="SemVer policy">
        <SpecTable
          head={["Bump", "When", "Examples"]}
          rows={[
            [<Badge variant="error">MAJOR 4.0.0</Badge>, "Breaking API or visual contract", "Removing a prop, renaming a token, changing default size, dropping a deprecated alias"],
            [<Badge variant="attention">MINOR 4.1.0</Badge>, "Backwards-compatible features", "New component/variant, new token, new prop with safe default"],
            [<Badge variant="success">PATCH 4.0.1</Badge>, "Fixes with no API change", "a11y fix, visual bug, dependency patch"],
          ]}
        />
        <Callout tone="neutral" title="Token changes are API changes">Changing a semantic token’s value is MINOR if contrast still passes and PATCH if it fixes a regression. Renaming or removing a token is MAJOR.</Callout>
      </Section>
      <Section title="Deprecation lifecycle">
        <Stepper steps={[{ id: "a", label: "Announce", description: "@deprecated JSDoc + changelog" }, { id: "b", label: "Warn", description: "Dev-only console warning (next minor)" }, { id: "c", label: "Codemod", description: "Migration guide + script" }, { id: "d", label: "Remove", description: "Next major (≥ 90 days)" }]} current={1} />
      </Section>
      <Section title="Release flow">
        <CodeBlock lang="bash" code={`npx changeset            # describe the change + bump type in your PR
# merge to main → the Changesets bot opens "Version Packages"
# merging that PR → publishes @agere/design-system, tags vX.Y.Z, posts release notes`} />
        <SpecTable head={["Channel", "Tag", "Who uses it"]} rows={[["Stable", "latest", "All production ventures"], ["Next", "next (4.1.0-next.N)", "Pilot venture validating a feature"], ["Canary", "canary (sha)", "DS team, per PR preview"]]} />
      </Section>
      <Section title="Changelog">
        <div className="grid gap-4">
          <article className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2"><h3 className="type-heading-md">7.0.0</h3><Badge variant="error">Major</Badge><span className="text-xs text-subtle">2026-10-01</span></div>
            <Prose>
              <ul>
                <li><strong>Visual language:</strong> Geist — Geist Sans and Mono, 10-step gray and seven accent scales contrast-solved in oklch, layered materials, <code>--radius</code> 8 px (controls 6, cards 8, menus 12), 2 px gap focus ring.</li>
                <li><strong>Breaking (visual):</strong> controls md 36 → 40 px, lg 40 → 48 px. No prop, variant or token renamed; <code>npm run codemod:v7</code>.</li>
                <li><strong>A11y:</strong> WCAG 2.1 AA and APCA gated (205 contrast tests); hover always increases contrast; <code>data-contrast="geist"</code> opt-in for upstream values.</li>
                <li><strong>Rules:</strong> AGENTS.md (67 rules, 42 automated), <code>lint:guidelines</code>, Chromium verification with axe contrast on in both themes. 441 tests.</li>
                <li><strong>Deprecations:</strong> 6.0 Button aliases now warn in dev; removal no sooner than 2026-12-24 (90-day policy).</li>
              </ul>
            </Prose>
          </article>
          <article className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2"><h3 className="type-heading-md">6.4.0</h3><Badge variant="info">Minor</Badge><Badge variant="outline">Latest</Badge><span className="text-xs text-subtle">2026-09-28</span></div>
            <Prose>
              <ul>
                <li><strong>Tokens:</strong> status <code>on-surface</code> text colors for neutral surfaces, AA on every canvas in both themes.</li>
                <li><strong>Components:</strong> PageHeader with PageHeaderActions (one primary, ≤ 2 outline, ⋯ menu, responsive), SaveBar, SaveStatus, RuleBuilder; Toaster <code>position</code> and <code>offset</code>.</li>
                <li><strong>Guidelines:</strong> Actions &amp; CTA; placeholders only in search fields; Nested list and Block editor patterns with tested tree helpers.</li>
                <li><strong>Fixed:</strong> <code>DropdownMenuItem asChild</code> threw; destructive-outline and status text were near-white in dark mode; Toast spec table.</li>
                <li><strong>QA:</strong> 341 tests.</li>
              </ul>
            </Prose>
          </article>
          <article className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2"><h3 className="type-heading-md">6.3.0</h3><Badge variant="info">Minor</Badge><span className="text-xs text-subtle">2026-09-26</span></div>
            <Prose>
              <ul>
                <li><strong>Components:</strong> Field (+ FieldControl auto-wiring), InputGroup, Item.</li>
                <li><strong>Blocks:</strong> Kanban app, Event calendar, Project timeline, Store locator — 34 blocks.</li>
                <li><strong>Fixed:</strong> checked Checkbox had no fill in dark mode (since 6.0); empty Kanban columns were empty ARIA lists (since 5.x).</li>
                <li><strong>QA:</strong> 273 tests; keyboard-only Kanban move and map pin hit-testing verified in Chromium.</li>
                <li><strong>Chart palette:</strong> one validated palette, same hex in light and dark — #f54900 · #009689 · #4252ff · #ec4699 · #8b5cf6 (visual change for charts).</li>
                <li><strong>Brand:</strong> logo masters of 25 Sep (stem 0.326X, primary 9.102X × 2.195X), the agere/&lt;product&gt; family, and the MIT License with brand assets reserved.</li>
              </ul>
            </Prose>
          </article>
          <article className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2"><h3 className="type-heading-md">6.2.0</h3><Badge variant="info">Minor</Badge><span className="text-xs text-subtle">2026-09-25</span></div>
            <Prose>
              <ul>
                <li><strong>Brand:</strong> new logo masters (wordmark weight A2) and the name “agere” everywhere (was “agere Lab”).</li>{/* agere-guidelines-ignore G10 historical note naming the retired brand */}
                <li><strong>Components:</strong> Carousel, ContextMenu, Menubar, Resizable (react-resizable-panels v4 — sizes as strings are %).</li>
                <li><strong>Blocks:</strong> Inbox app, Workflow builder, Bento grid — 30 blocks in total.</li>
                <li><strong>QA:</strong> 250 tests; interactions inside resizable panes verified in Chromium.</li>
              </ul>
            </Prose>
          </article>
          <article className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2"><h3 className="type-heading-md">6.1.0</h3><Badge variant="info">Minor</Badge><span className="text-xs text-subtle">2026-09-25</span></div>
            <Prose>
              <ul>
                <li><strong>Media:</strong> 25 state illustrations (artwork only, text removed, token-colored) + SVG export from the React source.</li>
                <li><strong>Components:</strong> Calendar, DatePicker/DateRangePicker, Command, Combobox, Drawer, InputOTP, NavigationMenu (barrel aliases <code>DateCalendar</code>, <code>CommandMenuItem</code>).</li>
                <li><strong>Blocks:</strong> marketing (landing page), eCommerce (list → checkout, IDR), authentication (login, register, reset, 2FA). 27 blocks total.</li>
                <li><strong>QA:</strong> 237 tests; five a11y/visual bugs caught and fixed before release.</li>
              </ul>
            </Prose>
          </article>
          <article className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2"><h3 className="type-heading-md">6.0.0</h3><Badge variant="error">Major</Badge><span className="text-xs text-subtle">2026-09-25</span></div>
            <Prose>
              <ul>
                <li><strong>Visual language:</strong> shadcn/ui (neutral base) — exact theme variables, one <code>--radius</code> (10px) deriving sm…4xl, Tailwind v4 shadows, 3px focus ring, Inter only.</li>
                <li><strong>Breaking:</strong> Button variants use shadcn names (<code>secondary</code> is now filled, the bordered button is <code>outline</code>; <code>destructive</code> is solid, <code>destructive-outline</code> is bordered). Input default 36px. Tabs default = muted track. Run <code>npm run codemod:v6</code>.</li>
                <li><strong>New components:</strong> shadcn Sidebar system, Table, Chart (Recharts 3), Accordion, Toggle, ToggleGroup, ScrollArea, HoverCard, CardAction.</li>
                <li><strong>Blocks:</strong> 11 dashboard &amp; application blocks (shadcnstudio categories) in <code>src/blocks</code>.</li>
                <li><strong>A11y:</strong> AA kept where shadcn fails (input border, muted text, ring); <code>data-contrast="shadcn"</code> opt-in for pixel-exact. 181 tests.</li>
              </ul>
            </Prose>
          </article>
          <article className="rounded-xl border border-subtle bg-default p-5">
            <div className="flex flex-wrap items-center gap-2"><h3 className="type-heading-md">5.0.0</h3><Badge variant="error">Major</Badge><span className="text-xs text-subtle">2026-09-24</span></div>
            <Prose>
              <ul>
                <li><strong>Breaking:</strong> Input has two sizes only — <strong>lg 40px (default)</strong> and md 36px for dense UI; <code>size="sm"</code> removed from Input, PasswordInput, SearchInput and SelectTrigger.</li>
                <li><strong>Breaking:</strong> Button md 36px and lg 40px (were 32 / 36) — heights now match Input md / lg.</li>
                <li><strong>New:</strong> ButtonGroup (attached / spaced, horizontal / vertical, split buttons) and Button <code>leadingIcon</code> / <code>trailingIcon</code>.</li>
                <li><strong>Brand:</strong> new agere logo (three-node symbol + geometric wordmark). <code>Logo</code> adds <code>stacked</code> / <code>app-icon</code> variants and an automatic small-size cut; <code>variant="mark"</code> is now the bare symbol.</li>
                <li><strong>Deprecated:</strong> Button <code>startIcon</code> / <code>endIcon</code> (aliases until v6).</li>
              </ul>
            </Prose>
          </article>
          <article className="rounded-xl border border-subtle bg-default p-5">
            <div className="flex flex-wrap items-center gap-2"><h3 className="type-heading-md">4.1.0</h3><Badge variant="attention">Minor</Badge><span className="text-xs text-subtle">2026-09-24</span></div>
            <Prose>
              <ul>
                <li><strong>Workspace layer (ClickUp-class):</strong> ViewSwitcherBar, FilterBar, TaskList/TaskRow with inline editing, GanttChart, status/priority/assignee fields, workspace Kanban cards.</li>
                <li><strong>Domain modules:</strong> chat, time tracking, finance metrics & multi-currency transactions, week/day calendar + booking slots, docs workspace, app marketplace.</li>
                <li><strong>Tokens:</strong> task-status, priority and Comfortable/Compact density.</li>
                <li><strong>Overlays:</strong> Sheet and ⌘K CommandPalette.</li>
                <li><strong>Next.js App Router</strong> example (Next 16, React 19) and a Workspace blueprint doc.</li>
                <li><strong>QA:</strong> 46 new tests (140 total); chat composer semantics fixed after an axe finding.</li>
              </ul>
            </Prose>
          </article>
          <article className="rounded-xl border border-subtle bg-default p-5">
            <div className="flex flex-wrap items-center gap-2"><h3 className="type-heading-md">4.0.0</h3><Badge variant="error">Major</Badge><span className="text-xs text-subtle">2026-09-24</span></div>
            <Prose>
              <ul>
                <li><strong>Visual language:</strong> refactored to the cal.com style — light-first, agere Ink brand, 10px control radius, layered button shadows, Cal Sans display.</li>
                <li><strong>Tokens:</strong> DTCG source + Style Dictionary pipeline (CSS, TS, JSON, Swift, Android, Compose). Raw Tailwind palette removed.</li>
                <li><strong>New:</strong> IconButton, PasswordInput, SearchInput, Select, RadioGroup/RadioCard, Switch, Slider, Spinner/Loader, Skeleton, AvatarGroup, Alert/Banner, Toast, Dialog, ConfirmDialog, Breadcrumb, Pagination, Stepper, SegmentedControl, Navbar, AppShell/Sidebar, Form layout, EmptyState, FileUploader, AppCard, StatCard, Logo, illustrations, custom icons.</li>
                <li><strong>DataTable:</strong> global search, faceted filters, pagination footer, no-results empty state.</li>
                <li><strong>Breaking:</strong> Button <code>default/outline/ghost/accent</code> → <code>primary/secondary/minimal</code> (aliases kept until v5); dark is no longer default (add <code>class="dark"</code>); <code>data-agere-accent</code> removed (use <code>data-brand</code>).</li>
                <li><strong>QA:</strong> Vitest + axe-core suite, token contrast test, Storybook 10 + Chromatic.</li>
              </ul>
            </Prose>
          </article>
          <article className="rounded-xl border border-subtle bg-muted p-5">
            <div className="flex flex-wrap items-center gap-2"><h3 className="type-heading-md">3.0.0-shadcn.0</h3><Badge variant="gray">Previous</Badge></div>
            <p className="mt-2 text-sm text-subtle">v2.3.1 refactored to shadcn/ui architecture: Kanban, Calendar, File Explorer, Data Table, Task Drawer.</p>
          </article>
        </div>
      </Section>
    </div>
  );
}

/* ================================================================== */
/* CONTRIBUTION & OWNERSHIP                                            */
/* ================================================================== */
export function ContributionPage() {
  return (
    <div className="grid gap-2">
      <PageHeader eyebrow="Governance" title="Contribution & ownership" description="A federated model: a small core team owns the system; venture squads contribute. The bar is ‘used by two ventures’ before anything enters the core library." />
      <Section title="Proposing a new component">
        <Stepper
          orientation="vertical"
          current={-1}
          steps={[
            { id: "1", label: "Check", description: "Search the portal and open issues. Can a composition of existing parts solve it?" },
            { id: "2", label: "Propose", description: "Open a ‘Component proposal’ issue: problem, 2 venture use cases, anatomy sketch, a11y pattern (WAI-ARIA APG link)." },
            { id: "3", label: "Triage (weekly DS sync)", description: "Core team labels: accept → core · accept → venture-local · decline (with reason). SLA: 5 working days." },
            { id: "4", label: "Design review", description: "Figma spec using only tokens; states, responsive behavior, content rules. Approved by DS design owner." },
            { id: "5", label: "Build", description: "PR with component, story, tests (unit + axe), docs registry entry, changeset. Status starts as ‘beta’." },
            { id: "6", label: "Promote", description: "After one release in production at two ventures with no P1 bugs → ‘stable’." },
          ]}
        />
      </Section>
      <Section title="Bug reporting">
        <SpecTable
          head={["Severity", "Definition", "Response", "Fix target"]}
          rows={[
            [<Badge variant="error">P1</Badge>, "Blocks a user task, a11y blocker (keyboard trap, invisible focus), data loss", "4 working hours", "Patch within 2 days"],
            [<Badge variant="attention">P2</Badge>, "Degraded experience with a workaround", "2 working days", "Next minor"],
            [<Badge variant="gray">P3</Badge>, "Cosmetic, docs", "Weekly triage", "Backlog"],
          ]}
        />
        <Prose><p>Use the <strong>Bug report</strong> issue template: component + version, steps, expected vs actual, browser/AT, screenshot or Storybook link.</p></Prose>
      </Section>
      <Section title="Review process">
        <SpecTable
          head={["Check", "Owner", "Required"]}
          rows={[
            ["Code review", "1 core engineer (CODEOWNERS)", "Always"],
            ["Design review", "DS design owner", "Visual or API changes"],
            ["Accessibility review", "A11y champion", "New components, keyboard/ARIA changes"],
            ["Visual diff approval", "Chromatic reviewer", "Any snapshot change"],
            ["Changeset present", "CI bot", "Always (except docs-only)"],
          ]}
        />
      </Section>
      <Section title="Ownership structure (RACI)">
        <SpecTable
          head={["Area", "Responsible", "Accountable", "Consulted", "Informed"]}
          rows={[
            ["Tokens & theming", "DS design engineer", "DS lead", "Venture designers", "All squads"],
            ["Core components", "DS core engineers", "DS lead", "A11y champion", "All squads"],
            ["Feature modules (Kanban, Calendar…)", "Owning venture squad", "DS lead", "DS core", "All squads"],
            ["Docs portal & Storybook", "DS core", "DS lead", "Content designer", "All"],
            ["Brand & media assets", "Brand designer", "Head of design", "DS lead", "Ventures"],
            ["Releases", "Release captain (rotating)", "DS lead", "QA", "All"],
          ]}
        />
        <Callout tone="info" title="Adoption metrics (reviewed quarterly)">Component coverage per venture (imports from @agere/design-system ÷ total UI components), detached/overridden components, time-to-first-MVP-screen, a11y defects per release, and token overrides outside <code>brand.*</code>.</Callout>
        <CodeBlock lang="text" code={`# .github/CODEOWNERS
/tokens/                         @agere/ds-design-eng
/src/components/ui/              @agere/ds-core
/src/components/agere-ds/kanban/ @agere/squad-ops @agere/ds-core
/src/brand/  /assets/brand/      @agere/brand`} />
      </Section>
      <Section title="License" description="agere DS is © 2026 PT Agere Teknologi Indonesia under the MIT License. LICENSE, TRADEMARKS.md and THIRD-PARTY-NOTICES.md ship at the repository root.">
        <SpecTable
          head={["What", "License"]}
          rows={[
            ["Code, tokens, components, blocks, docs, state illustrations", "MIT — use, modify and ship in any product, commercial included; keep the notice"],
            ["agere name, logo, symbol, app icons, agere/<product> logos", "Not MIT — © PT Agere Teknologi Indonesia, all rights reserved (TRADEMARKS.md)"],
            ["shadcn/ui source, Inter, Geist, Lucide, npm dependencies", "Their own licenses (MIT, OFL 1.1, ISC, Apache-2.0), all compatible"],
          ]}
        />
        <Prose>
          <ul>
            <li><strong>Without asking:</strong> use, copy, modify and ship the design system in any product; say truthfully that a product is “built with agere DS”.</li>
            <li><strong>Needs written permission:</strong> using the agere name or logos in your product, marketing or domain, or in a way that suggests endorsement; publishing a fork under the agere name. A public fork renames itself and replaces <code>assets/brand/</code> and <code>&lt;Logo /&gt;</code> with its own mark.</li>
            <li><strong>Third parties:</strong> shadcn/ui (MIT, © 2023 shadcn — keep its notice), Inter and Geist (SIL OFL 1.1), Lucide (ISC), class-variance-authority (Apache-2.0); every other runtime dependency is MIT.</li>
          </ul>
        </Prose>
        <CodeBlock lang="text" code={`MIT License

Copyright (c) 2026 PT Agere Teknologi Indonesia`} />
      </Section>
    </div>
  );
}
