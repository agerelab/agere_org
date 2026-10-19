# agere Design System v7

agere's shared product foundation in the **Geist visual language**: Geist Sans and Mono, Geist's 10-step gray and seven accent scales
(contrast-solved in oklch), layered materials, 6/8/12 px radii and 40 px controls — on the full 6.4 component set, the
**Dashboard, Application, Marketing, eCommerce, Auth, Inbox, Workflow-builder, Kanban, Calendar, Gantt, Bento and Map blocks**, the
ClickUp-class workspace modules and 25 state illustrations.

React 19 · TypeScript · Tailwind 3.4 (agere preset) · Radix UI · cva · Recharts 3 · TanStack Table · Style Dictionary v5 (web, iOS, Android,
Compose) · Storybook 10 · Vitest + axe-core · Playwright · Next.js 16 App Router example

**Still copy-paste compatible with shadcn.** Component names, variant names (`default · secondary · outline · ghost · destructive · link`),
`data-slot` attributes and CSS variables (`--card`, `--chart-1…5`, `--sidebar-*`, `--radius`) are unchanged; only their values moved to Geist.

**WCAG 2.1 AA and APCA are CI gates.** Where Geist's values fail (field border 1.2:1, dark-mode secondary text Lc 51) v7 ships the nearest
passing value; `data-contrast="geist"` gives the upstream look for demos. **AGENTS.md** ships the interface rules coding agents must follow —
42 of 67 are enforced in CI. Upgrading from 6.4? See [`MIGRATION.md`](MIGRATION.md) and run `npm run codemod:v7`.

```bash
npm install
npm run dev              # documentation portal (http://localhost:5173)
npm run storybook        # component workshop — a11y + light/dark
npm test                 # 441 tests: behavior, axe-core, token contrast (WCAG + APCA)
npm run lint:guidelines  # AGENTS.md rules G01–G12
npm run verify:browser   # Chromium: axe with contrast on, light + dark, 41 checks
npm run illustrations    # re-export state illustration SVGs from the React source + current tokens
npm run build            # typecheck + portal build
npm run build:docs-single  # portal as ONE self-contained HTML file (dist-single/)
npm run build:next-example  # builds examples/next-app with Next.js 16
npm run codemod:v6 -- src  # v5 → v6 Button variant rename
npm run ci               # everything CI runs
```

## What's inside

| Pillar | Where |
|---|---|
| **1 · Tokens** — color (brand, neutral, semantic, states, viz), typography, spacing, grid, breakpoints, elevation, radius, opacity, blur, motion, z-index | `tokens/` (DTCG JSON) → `scripts/build-tokens.mjs` → `src/styles/tokens.*.css`, `src/tokens/generated`, `build/{ios,android,compose,tokens}` |
| **2 · Components & blocks** — 68 documented components incl. the shadcn Sidebar system, Field, InputGroup, Item, Table, Chart, Calendar/DatePicker, Command/Combobox, Drawer, InputOTP, NavigationMenu, Carousel, ContextMenu, Menubar, Resizable, Accordion, Toggle(Group), ScrollArea, HoverCard; 34 blocks across dashboard, application, marketing, eCommerce, auth, apps (inbox, workflow builder, kanban, event calendar, timeline), bento grid and map (`src/blocks`): atoms, molecules, organisms, workspace (ClickUp-class) and domain modules (chat, finance/time, calendar, docs, marketplace) | `src/components/ui`, `src/components/agere-ds`, `src/blocks` · public entry `src/components/agere-ds/index.ts` |
| **3 · Engineering** — Tailwind preset, token pipeline, Vitest + Testing Library + axe-core, Storybook + Chromatic, CI | `tailwind.preset.ts`, `tests/`, `.storybook/`, `src/stories/`, `.github/workflows/ci.yml` |
| **4 · Guidelines** — do's & don'ts, states & micro-interactions, WCAG 2.1 AA, keyboard spec, ARIA, contrast, UX writing (ID/EN) | Docs portal → Components, Guidelines |
| **5 · Brand & media** — logo system, brand colors, 8 spot + 25 state illustrations (artwork only, token-colored), icon set, photography & motion guides | `src/brand`, `src/icons`, `assets/brand/`, `assets/illustrations/state/`, portal → Brand |
| **6 · Governance** — docs portal, SemVer + Changesets, changelog, migration guide, contribution & ownership | `src/docs`, `CHANGELOG.md`, `MIGRATION.md`, `VERSIONING.md`, `CONTRIBUTING.md`, `.github/` |

## Using it in a venture

```ts
// tailwind.config.ts
import agere from "@agere/design-system/tailwind.preset";
export default { presets: [agere], content: ["./src/**/*.{ts,tsx}"] };
```
```tsx
import "@/styles/globals.css";
import { Button, Dialog, DataTable, Toaster, TooltipProvider, toast } from "@/components/agere-ds";

<TooltipProvider>
  <App />
  <Toaster />
</TooltipProvider>
```

**Theming:** `<html class="dark">` · `data-brand="indigo | emerald | agere-amber"` · `applyBrandColor(el, "#0EA5E9")` (auto text contrast + AA report) · `data-contrast="more | geist"` · `--radius` on any subtree.

```tsx
// A full dashboard in three lines (see src/blocks/dashboard.tsx)
import { DashboardPage } from "@/blocks";
export default function Page() { return <DashboardPage />; }
```

## Folder structure

```
tokens/                 primitive · semantic (light/dark/typography) · component
scripts/                build-tokens.mjs · build-brand.mjs · build-illustrations.mjs · codemod-v6.mjs
assets/brand/           logo masters: svg/ png/ favicon/ construction/ + README (1X construction rules)
assets/illustrations/   state/{light,dark}/*.svg — generated from src/brand/state-illustrations.tsx
build/                  generated native tokens (iOS, Android, Compose, JSON)
examples/next-app/      Next.js 16 App Router venture example
src/
  styles/               globals.css + generated token CSS
  tokens/               generated TS tokens, type style names
  lib/                  utils, date, theme (setTheme, applyBrandColor, contrastRatio), workspace vocabulary
  patterns/             sample workspace data (fictional)
  components/ui/        primitives (shadcn layout — `npx shadcn add` compatible)
  components/agere-ds/  organisms, cards, feature modules, workspace, chat, finance, docs, marketplace, public entry
  blocks/               shadcnstudio-style blocks: dashboard & app (root), marketing/, ecommerce/, auth/, apps/ (inbox, workflow, bento)
  hooks/                useIsMobile
  brand/  icons/        Logo, illustrations, custom icons
  docs/                 documentation portal (kit, registry, pages, patterns)
  stories/              Storybook stories (catalog is generated from the docs registry)
tests/                  vitest + axe-core + token contrast audit
docs/v2.3.1-source/     historical specs
```

## Verified in this release (6.4.0)
- CI stages each exit 0: tokens · typecheck · **341/341 tests** · `vite build` · `storybook build`; `next build examples/next-app` exits 0.
- Chromium, built portal: PageHeader keeps Share as a button and out of ⋯ at 1440 px, and moves it to the first ⋯ item at 390 px;
  destructive-outline renders red (#fd6366) in dark mode; the new component, guideline, pattern and release pages load with no console errors.
- Contrast: every `on-surface` token measured 6.21–11.00:1 on `bg.default`, `bg.muted` and `bg.surface` in both themes.

## Not yet done
- Nested list and Block editor are documented patterns, not components: the tree helpers are tested, but the drag-and-drop rows and the editor engine
  are assembled per product (@dnd-kit; an editor engine such as Tiptap or Lexical styled with DS tokens).
- Modals rely on Radix `aria-hidden` + focus trap for the page behind them; adding `inert` as well would make that robust
  for assistive tech that ignores aria-hidden (tracked; the axe helper documents the current exclusion).
- Screen-reader passes (VoiceOver / NVDA) are listed in the release checklist, not yet executed.
- The Figma library is not updated to v6; the DTCG JSON in `tokens/` imports into Tokens Studio.
- The store-locator map is schematic (no tiles — the published portal blocks remote images). Production apps should swap in MapLibre / Leaflet / Google Maps and keep the list.
- Chromatic needs `CHROMATIC_PROJECT_TOKEN` and a real `projectId`. The package still ships as source (shadcn-style), not a compiled library.
- Gantt bars are not draggable yet; the chat composer is plain text with markdown shortcuts.

## License
Agere DS is © 2026 **PT Agere Teknologi Indonesia**, released under the **MIT License** (`LICENSE`): use, copy, modify and ship the code,
tokens, components, blocks, docs and state illustrations in any product, commercial included; keep the notice with every copy.
The agere name, logo, symbol, app icons and `agere/<product>` logos are **not** MIT-licensed (`TRADEMARKS.md`).
Third-party parts keep their own licenses (`THIRD-PARTY-NOTICES.md`: shadcn/ui MIT, Inter and Geist OFL 1.1, Lucide ISC, class-variance-authority Apache-2.0).
