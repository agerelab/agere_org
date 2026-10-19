# Migrating from v6.4 to v7.0

The component API is unchanged; values and default sizes are not. Do steps 1–3 in one PR per app, then review each product visually.

1. **Upgrade and run the codemod.** `npx agere-codemod-v7 --dry src` to preview, then `npx agere-codemod-v7 src`. It rewrites the deprecated Button aliases (`primary`, `minimal`, `destructive-solid`, `accent`), Button
   `startIcon`/`endIcon`, and `data-contrast="shadcn"` → `"geist"`. It leaves `secondary` alone — if the app is still on v5 names, run
   `codemod:v6` first. Do **not** run it inside the DS repo: `globals.css` keeps the `"shadcn"` alias on purpose.
2. **Check heights.** The codemod lists every Button/Input pinned to the old 36 px (`h-9`) and every `size="lg"` (now 48 px). Fixed-height
   toolbars, table rows and page headers are where 40 px defaults collide; use `size="sm"` (32) in dense rows rather than re-pinning `h-9`.
3. **Remove your Inter import** if the app imported `@fontsource-variable/inter` itself; `globals.css` now loads Geist and Geist Mono.
4. **Hard-coded colours.** Anything not using semantic tokens keeps its v6 look. `grep -rnE "#[0-9a-f]{6}|hsl\(" src` and move to tokens.
   Custom hovers written as `bg-primary/90` lower contrast in v7's palette; use `hover:bg-primary-hover`.
5. **Custom focus styles.** v7 rings are 2 px solid with a 2 px gap. Components that hand-roll `shadow-[0_0_0_3px_…ring-alpha…]` should use
   `focus-ring` / `focus-ring-field`.
6. **Adopt the rules.** Copy `AGENTS.md` into the app root (coding agents read it), add `lint:guidelines` and `check:jsx-comments` to the app's CI,
   and tick `GUIDELINES.md` in UI pull requests.
7. **Sidebar** collapse no longer animates. Nothing to change; it snaps until the transform-based slide in 7.1.

What to look for in the visual review: cards in dark mode now sit on the page colour with a stroke (v6: a lighter `#171717` card); radius
is tighter (controls 6, cards 8); buttons are flat (no shadow); status text is the 900 step of each hue.

---

# Migrating from v6.3 to v6.4

No breaking changes. Optional, in this order:
1. **Status text on neutral surfaces:** replace `text-{info,success,attention,error,special}-fg` with `text-…-on-surface` wherever the text
   sits on `bg-background`, `bg-muted` or a card (not on the matching `-bg`). Find candidates with
   `grep -rnE "text-(info|success|attention|error|special)-fg" src` and keep the ones inside a `bg-…-bg` container.
2. **Page headers:** move header buttons into `PageHeaderActions` — `primary` (one), `secondary` (≤ 2), `menu`. Remove any action you pass to
   `secondary` from `menu`; a dev warning names duplicates.
3. **Explicit-save editors:** use `SaveBar`, and mount `<Toaster position="bottom-left" />` (or pass `offset`) so toasts don't cover it.
   **Autosaving surfaces:** use `SaveStatus` in the toolbar and remove the Save button.
4. **Authoring fields:** remove placeholders from titles, descriptions, comments and messages; move examples and formats to helper text.
5. `DropdownMenuItem asChild`: put the icon inside the child element; `startIcon` and `shortcut` are ignored with `asChild`.

---

# Migrating from v6.2 to v6.3

No breaking changes. Optional:
- New forms: prefer `Field` + `FieldControl` for horizontal rows, choice cards and fieldsets; `FormField` stays for simple stacked fields.
- Choice cards: give each Radix radio/checkbox `aria-labelledby` → its `FieldTitle` id.
- If you import Field's cva from the barrel, it is `fieldLayoutVariants`.
- `CalendarTimeGrid` renders `id-ID` as before; pass `locale="en-US"` (or any BCP 47 tag) to change it.

---

# Migrating from v6.1 to v6.2

No breaking changes. Optional:
- Replace the logo files you copied into a venture with the new masters from `assets/brand/` (or re-run `npm run brand` if you vendor the DS).
- Rename "Agere Lab" to "agere" in your own copy; keep the lowercase form even at the start of a sentence.
- Resizable: write sizes as strings (`defaultSize="30"`); numbers are pixels in react-resizable-panels v4.

---

# Migrating from v6.0 to v6.1

No breaking changes — `npm install` and you're done. Optional:
- Replace hand-rolled date inputs with `DatePicker` / `DateRangePicker`, and long `Select`s with `Combobox`.
- Import shadcn's Calendar / CommandItem from the barrel as `DateCalendar` / `CommandMenuItem`, or from their shadcn paths.
- Use `STATE_ILLUSTRATIONS` in empty / error states; put the words in `EmptyState` (`title`, `description`, `actions`), never in the artwork.
- Headings placed on `bg-primary` or other colored surfaces need an explicit text color (the global `h1–h4` rule applies `fg-emphasis`).

---

# Migrating from v5 to v6

Estimated effort for a typical venture: **1–3 hours** with the codemod, plus visual review. Everything is class- and token-level —
no data or behaviour changes.

## 1. Update the package, then run the codemod
```bash
npm run codemod:v6 -- --dry src        # preview
npm run codemod:v6 -- src              # apply
npm run codemod:v6 -- --tags=LinkButton,ToolbarButton src   # your own Button wrappers
```
| v5 Button variant | v6 | Why |
|---|---|---|
| `primary` | `default` | shadcn name |
| `secondary` (bordered) | `outline` | `secondary` now means the **filled gray** button |
| `minimal` | `ghost` | shadcn name |
| `destructive` (bordered red) | `destructive-outline` | `destructive` now means **solid** red |
| `destructive-solid` | `destructive` | shadcn name |

Old names still compile (deprecated until v7) — but **`secondary` and `destructive` silently change look** if you skip the codemod.
The codemod only rewrites Button-like tags, so `<Badge variant="secondary">` is untouched.

## 2. Sizes
| Component | v5 default | v6 default | Keep v5 |
|---|---|---|---|
| Input / Select / Textarea | `lg` 40px | `md` 36px | `size="lg"` |
| Button `sm` | 28px | 32px | `size="xs"` (24) for dense toolbars |

## 3. Visual changes to review (no code change needed)
- Cards: `py-6 gap-6`; `CardHeader` / `CardContent` / `CardFooter` use `px-6` only. Custom `p-5` on `<Card>` still wins (tailwind-merge).
  Move header buttons into `<CardAction>` to get the shadcn top-right placement.
- Dialog / Sheet / AlertDialog footers have no muted strip; Dialog content is padded `p-6 gap-4` by the component.
- Tabs default to the shadcn muted track. For page sections keep `variant="underline"`.
- Badge default is solid primary — pass `variant="gray"` where you relied on the implicit v5 default.
- Headings use Inter (Cal Sans removed). `font-display` / `type-display-*` now resolve to Inter with tight tracking.

## 4. Layout shell (optional, recommended)
`AppShell` / `SidebarSection` / `SidebarItem` still work. New shells:
```tsx
<SidebarProvider>
  <AppSidebar />                 {/* copy from src/blocks/app-sidebar.tsx */}
  <SidebarInset><SiteHeader />…</SidebarInset>
</SidebarProvider>
```

## 5. Copying from ui.shadcn.com / shadcnstudio.com
- Class names and APIs match. Chart configs with `color: "var(--chart-1)"` work as-is.
- Raw palette utilities (`text-green-600`, `bg-amber-500`) are still **not** in the preset — map to `text-success-fg`, `bg-chart-4`, etc.
- Tailwind v4-only syntax in pasted blocks (`@container`, `size-(--x)`, `*:data-[slot=x]:`) needs the Tailwind 3 form (`[&_[data-slot=x]]:`).

## 6. Verify
`npm run ci` (tokens → typecheck → 181 tests → build → Storybook), then check light, dark and `data-density="compact"` in the portal.

---

# Migrating from v3 to v4

Estimated effort for a typical venture: **½–1 day**. Most changes are find-and-replace; visual review is the real work.

## 1. Styles & theme
```diff
- <html class="dark">            // v3 was dark-first
+ <html>                          // v4 is light-first; add class="dark" to opt in
```
`globals.css` now imports fonts and generated tokens. If you copied v3's `globals.css`, replace it and run `npm run tokens`.

## 2. Tailwind
```ts
// tailwind.config.ts
import agere from "@agere/design-system/tailwind.preset";
export default { presets: [agere], content: [...] };
```
Raw palette classes (`bg-gray-100`, `text-amber-500`) no longer resolve. Replace with semantic tokens:

| v3 / raw | v4 |
|---|---|
| `bg-foreground/5` hover | `bg-subtle` |
| `bg-foreground/10` selected | `bg-emphasis` |
| `text-foreground/80` | `text-default` |
| `text-muted-foreground` | `text-subtle` (alias still works) |
| `bg-ring/10`, `border-ring` for selection | `bg-brand/5`, `border-brand` |
| `bg-accent` (amber) | `bg-brand-accent` (signature) or `bg-brand` (action) |
| `bg-black/50` overlay | `bg-overlay/50` |
| `focus-visible:ring-2 ring-ring` | `focus-ring` |
| `shadow-sm / shadow-2xl` | `shadow-elevation-1 / shadow-elevation-4` (aliases kept) |

## 3. Components
```bash
# codemod (run from the venture repo root)
npx jscodeshift -t node_modules/@agere/design-system/codemods/v4-variants.js src   # planned; manual sed below works today
sed -i -E 's/variant="ghost"/variant="minimal"/g; s/variant="outline"/variant="secondary"/g' $(grep -rl 'Button' src)
```
| Component | Change |
|---|---|
| Button | `default→primary`, `outline→secondary`, `ghost→minimal`, `accent→secondary`. `md` = 32px / 14px text. New `startIcon`, `endIcon`, `fullWidth`. |
| Badge | `status-red→error`, `status-amber→attention`, `status-blue→info`, `status-green→success`, `status-purple→special`, `default/secondary→gray`. Default size `md`. |
| Input | Border is `border-control` (darker, WCAG 1.4.11). `leadingIcon` unchanged; new `trailing`, `addonStart/End`. |
| Tabs | New `variant` prop; default `pills` matches v3. ViewSwitcher uses `segmented`. |
| Icon-only buttons | Prefer `<IconButton label="…">` — the label is required by type. |

## 4. Brand
`data-agere-accent="canonical"` is gone. For a venture color:
```tsx
<html data-brand="indigo">                       // preset
applyBrandColor(document.documentElement, hex)   // runtime, auto text contrast
```

## 5. Verify
`npm run typecheck && npm test`, then review Chromatic diffs in light and dark.

---

# Migrating from v4.0 to v4.1

- **React 19 is now the peer.** Upgrade `react`, `react-dom`, `@types/react`, `@types/react-dom` to 19.x. Radix, dnd-kit and TanStack Table already support it.
- If you use Next.js App Router, move to Next 15+ (the example uses 16): `params`, `searchParams` and `cookies()` are async.
- Tailwind `content` must include the DS `src/lib/**/*.ts` (status/priority class maps live there), not only `src/components`.
- Everything else is additive.

---

# Migrating from v4.1 to v5.0

**Input sizes.** Only `lg` (40px, **default**) and `md` (36px) remain. Fields without a `size` prop grow from 32px to 40px.
```bash
# size="sm" → size="md" (dense UI keeps a compact field)
grep -rlE '<(Input|PasswordInput|SearchInput|SelectTrigger)[^>]*size="sm"' src | xargs sed -i -E 's/(<(Input|PasswordInput|SearchInput|SelectTrigger)[^>]*) size="sm"/\1 size="md"/g'
# size="lg" is now the default — the prop can be dropped
```
Forms, dialogs, auth and checkout get 40px fields with 16px text (no iOS zoom on focus).
In toolbars, filter bars and popovers, set `size="md"` and check alignment with 28–32px buttons and chips.

**Button heights.** `md` is now 36px and `lg` 40px (were 32 / 36) so buttons line up with fields. Rule of thumb: Button `lg`
next to a default (lg) Input, Button `md` next to `size="md"` fields. In very dense toolbars use `size="sm"` (28px) explicitly.

**Button icons.** `startIcon`/`endIcon` still work; rename when convenient:
```bash
sed -i -E 's/\bstartIcon=/leadingIcon=/g; s/\bendIcon=/trailingIcon=/g' $(grep -rl 'Icon=' src)
```

**New:** wrap related buttons in `<ButtonGroup aria-label="…">`.

**Logo.** The new logo ships with the same `<Logo>` API. `lockup` (default), `wordmark` and every `tone` keep working.
`variant="mark"` is now the bare three-node symbol, not a filled tile. Where a square badge is needed (app rails, avatars,
auth headers on tinted backgrounds), switch to `variant="app-icon"`:
```bash
grep -rn 'variant="mark"' src   # review each: symbol alone, or app-icon tile?
```
Replace old files: `assets/brand/agere-{logo,mark,wordmark}*.svg` → `assets/brand/svg/agere-{primary,symbol,wordmark,stacked,app-icon}*.svg`.
Favicons: `/favicon.svg` (adapts to light/dark), `/favicon.ico`, `/apple-touch-icon.png`.
