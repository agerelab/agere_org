# Contributing to Agere DS

A federated model: a small **core team** owns the system; **venture squads** contribute.
Rule of thumb: a pattern enters core once **two ventures** need it.

## Setup
```bash
npm install
npm run dev          # docs portal (tokens build first)
npm run storybook    # workshop
npm test             # vitest + axe-core + token contrast audit
```

## Proposing a component
1. **Check** the docs portal and open issues — can existing parts be composed?
2. **Propose** via the *Component proposal* issue template: problem, ≥ 2 venture use cases, anatomy & states, WAI-ARIA APG pattern.
3. **Triage** at the weekly DS sync (SLA 5 working days): accept → core · accept → venture-local · decline with reason.
4. **Design review** — Figma spec using tokens only, all states (ideal / empty / loading / error / edge), responsive rules, copy.
5. **Build** — component in `src/components/ui` (primitive) or `src/components/agere-ds` (organism), story in `src/stories`,
   registry entry in `src/docs/registry` (demo, specs, do/don't, a11y), tests with `expectNoA11yViolations`, changeset. Status starts **beta**.
6. **Promote** to **stable** after one release in production at two ventures with no P1 bugs.

## Code rules
- Semantic tokens only — the preset removes the raw palette; CI greps for stragglers.
- `React.forwardRef`, export the `Props` type and the `cva` recipe.
- Controlled + uncontrolled APIs; no product logic or data fetching in components.
- Accessibility props are required by types where possible (e.g. `IconButton.label`).
- Outline focus (`focus-ring`, `focus-ring-inset`), never `outline: none` without a replacement.

## Bug reports
Use the *Bug report* template. Severity SLAs: **P1** (blocker, a11y blocker, data loss) respond 4h / patch ≤ 2 days ·
**P2** respond 2 days / next minor · **P3** weekly triage.

## Review
| Check | Owner | Required |
|---|---|---|
| Code | 1 core engineer (CODEOWNERS) | Always |
| Design | DS design owner | Visual or API changes |
| Accessibility | A11y champion | New components, keyboard/ARIA changes |
| Visual diffs | Chromatic reviewer | Any snapshot change |
| Changeset | CI | Always (except docs-only) |

## Ownership (RACI)
| Area | Responsible | Accountable | Consulted | Informed |
|---|---|---|---|---|
| Tokens & theming | DS design engineer | DS lead | Venture designers | All squads |
| Core components | DS core engineers | DS lead | A11y champion | All squads |
| Feature modules | Owning venture squad | DS lead | DS core | All squads |
| Docs & Storybook | DS core | DS lead | Content designer | All |
| Brand & media | Brand designer | Head of design | DS lead | Ventures |
| Releases | Release captain (rotating) | DS lead | QA | All |

**Adoption metrics** (quarterly): component coverage per venture, overridden/detached components, time-to-first-MVP-screen,
a11y defects per release, token overrides outside `brand.*`.
