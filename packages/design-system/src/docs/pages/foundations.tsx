import * as React from "react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { contrastRatio } from "@/lib/theme";
import { lightTokens, darkTokens } from "@/tokens";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TYPE_STYLES } from "@/tokens/type-styles";
import { Callout, CodeBlock, PageHeader, Prose, Section, SpecTable, Token } from "../kit";

type Theme = "light" | "dark";
const T = { light: lightTokens as any, dark: darkTokens as any };
const get = (theme: Theme, path: string) => path.split(".").reduce((o, k) => o?.[k], T[theme]) as string | undefined;

/* ================================================================== */
/* COLOR                                                               */
/* ================================================================== */
const GROUPS: { title: string; desc: string; tokens: { path: string; use: string; tw: string }[] }[] = [
  {
    title: "Background",
    desc: "Four gray tiers plus inverted. The canvas is white; sidebars and table headers sit on muted; hover uses subtle; selected uses emphasis.",
    tokens: [
      { path: "bg.default", use: "Canvas, cards, inputs", tw: "bg-default" },
      { path: "bg.muted", use: "Sidebar, table header, footers", tw: "bg-muted" },
      { path: "bg.subtle", use: "Hover, secondary surfaces", tw: "bg-subtle" },
      { path: "bg.emphasis", use: "Selected nav item, badges", tw: "bg-emphasis" },
      { path: "bg.inverted", use: "Tooltips, toasts", tw: "bg-inverted" },
    ],
  },
  {
    title: "Text",
    desc: "emphasis for headings and values, default for body, subtle for secondary, muted only for placeholders and meta on the canvas.",
    tokens: [
      { path: "fg.emphasis", use: "Headings, values, active", tw: "text-emphasis" },
      { path: "fg.default", use: "Body copy", tw: "text-default" },
      { path: "fg.subtle", use: "Secondary text, icons", tw: "text-subtle" },
      { path: "fg.muted", use: "Placeholder, meta (canvas only)", tw: "text-muted" },
      { path: "fg.disabled", use: "Disabled text (exempt)", tw: "text-disabled" },
    ],
  },
  {
    title: "Border",
    desc: "subtle for cards and dividers (decorative); default for outlined buttons; control for anything a user must identify as a form control (≥ 3:1).",
    tokens: [
      { path: "border.subtle", use: "Cards, dividers", tw: "border-subtle" },
      { path: "border.default", use: "Secondary buttons, dashed", tw: "border-default" },
      { path: "border.emphasis", use: "Hover on cards", tw: "border-emphasis" },
      { path: "border.control", use: "Inputs, checkbox, switch", tw: "border-control" },
    ],
  },
  {
    title: "Brand",
    desc: "agere Ink is the default brand (shadcn neutral-900 #171717). Amber is the signature accent — logo spark, highlights, illustrations. Products white-label by overriding brand.* only.",
    tokens: [
      { path: "brand.default", use: "Primary buttons, selection", tw: "bg-brand" },
      { path: "brand.emphasis", use: "Primary hover", tw: "bg-brand-emphasis" },
      { path: "brand.fg", use: "Text on brand", tw: "text-brand-fg" },
      { path: "brand.accent", use: "Signature accent (sparingly)", tw: "text-brand-accent" },
      { path: "focus.ring", use: "Focus outline", tw: "outline-focus" },
    ],
  },
];
const STATUS = ["info", "success", "attention", "error", "special"] as const;

function Swatch({ path, use, tw, theme }: { path: string; use: string; tw: string; theme: Theme }) {
  const hex = get(theme, path) ?? "";
  const cssVar = `--ag-${path.replace(/\./g, "-")}`;
  const onCanvas = hex ? contrastRatio(hex, get(theme, "bg.default")!) : 0;
  return (
    <li className="overflow-hidden rounded-xl border border-subtle bg-default">
      <div className="h-16 border-b border-subtle" style={{ background: hex }} />
      <div className="grid gap-1 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs font-medium text-emphasis">{path}</span>
          <span className="font-mono text-2xs uppercase text-subtle">{hex}</span>
        </div>
        <p className="text-xs text-subtle">{use}</p>
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <Token>{tw}</Token>
          <span className="text-2xs text-subtle tabular-nums" title={`Contrast vs bg.default (${theme})`}>{onCanvas.toFixed(2)}:1</span>
        </div>
        <span className="sr-only">CSS variable {cssVar}</span>
      </div>
    </li>
  );
}

const PAIRS: [string, string, "text" | "ui"][] = [
  ["fg.emphasis", "bg.default", "text"], ["fg.default", "bg.default", "text"], ["fg.subtle", "bg.default", "text"], ["fg.subtle", "bg.subtle", "text"],
  ["fg.muted", "bg.default", "text"], ["brand.fg", "brand.default", "text"], ["info.fg", "info.bg", "text"], ["success.fg", "success.bg", "text"],
  ["attention.fg", "attention.bg", "text"], ["error.fg", "error.bg", "text"], ["special.fg", "special.bg", "text"], ["error.on-solid", "error.solid", "text"],
  ["success.on-surface", "bg.default", "text"], ["attention.on-surface", "bg.muted", "text"], ["error.on-surface", "bg.surface", "text"],
  ["border.control", "bg.default", "ui"], ["border.control", "bg.muted", "ui"], ["focus.ring", "bg.default", "ui"], ["focus.ring", "brand.default", "ui"],
];

export function ColorPage() {
  const [theme, setTheme] = React.useState<Theme>(document.documentElement.classList.contains("dark") ? "dark" : "light");
  return (
    <div className="grid gap-2">
      <PageHeader
        eyebrow="Foundations"
        title="Color"
        description="Semantic tokens on shadcn/ui’s neutral base (exact hex of shadcn’s oklch values) in both themes, with two values tuned darker to pass WCAG 2.1 AA. Components never touch the primitive palette; Tailwind’s raw colors are removed from the preset."
        actions={<SegmentedControl aria-label="Show values for" value={theme} onValueChange={setTheme} options={[{ value: "light", label: "Light values" }, { value: "dark", label: "Dark values" }]} />}
      />
      {GROUPS.map((g) => (
        <Section key={g.title} title={g.title} description={g.desc}>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{g.tokens.map((t) => <Swatch key={t.path} {...t} theme={theme} />)}</ul>
        </Section>
      ))}

      <Section title="Semantic status" description="Each status has seven roles: bg (tinted surface), fg (text on bg), border, solid (fills, dots), on-solid (text on solid), on-surface (status text on neutral page, card and muted surfaces — new in 6.4), icon.">
        <div className="grid gap-3 lg:grid-cols-5">
          {STATUS.map((s) => (
            <div key={s} className="overflow-hidden rounded-xl border border-subtle bg-default">
              <div className="grid gap-2 p-3" style={{ background: get(theme, `${s}.bg`) }}>
                <span className="text-sm font-semibold capitalize" style={{ color: get(theme, `${s}.fg`) }}>{s === "attention" ? "Attention (warning)" : s}</span>
                <span className="inline-flex w-fit rounded-sm px-1.5 py-1 text-xs font-medium leading-none" style={{ background: get(theme, `${s}.solid`), color: get(theme, `${s}.on-solid`) }}>solid</span>
              </div>
              <p className="border-t border-subtle px-3 pt-3 text-xs font-medium" style={{ color: get(theme, `${s}.on-surface`) }}>on-surface text</p>
              <dl className="grid gap-1 p-3 font-mono text-2xs text-subtle">
                {["bg", "fg", "border", "solid", "on-solid", "on-surface", "icon"].map((r) => (
                  <div key={r} className="flex items-center justify-between gap-2">
                    <dt className="flex items-center gap-1.5"><span className="size-3 rounded-sm border border-subtle" style={{ background: get(theme, `${s}.${r}`) }} />{r}</dt>
                    <dd className="uppercase">{get(theme, `${s}.${r}`)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Data visualization" description="shadcn chart-1…5 for Chart blocks (they swap palette in dark mode), plus seven categorical viz hues for dense data. Use emphasis for marks, subtle for fills/areas, fg for labels on subtle.">
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="grid w-24 gap-1 text-center">
              <div className="h-10 rounded-lg" style={{ background: get(theme, `viz.${i}.emphasis`) }} />
              <div className="h-6 rounded-md" style={{ background: get(theme, `viz.${i}.subtle`) }} />
              <span className="font-mono text-2xs text-subtle">viz.{i}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Interactive states" description="States are expressed with tokens, not ad-hoc opacity.">
        <SpecTable
          head={["State", "Treatment", "Tokens"]}
          rows={[
            ["Hover", "Surface steps one tier; primary darkens", "bg.subtle · brand.emphasis · border.emphasis"],
            ["Active / pressed", "Inset shadow", "shadow.button-*-active"],
            ["Focus-visible", "2px outline, 2px offset (inset in lists)", "focus.ring"],
            ["Selected", "Tier + aria-current / aria-selected", "bg.emphasis · brand @ 5%"],
            ["Disabled", "40% opacity, no pointer events", "opacity.disabled"],
            ["Invalid", "Error border + message", "error.solid · error.fg"],
          ]}
        />
      </Section>

      <Section title="Contrast audit" description={`Computed live from the generated tokens (${theme}). Text needs ≥ 4.5:1 (AA), UI boundaries and focus indicators ≥ 3:1 (WCAG 1.4.11). The same matrix runs in CI (tests/tokens.contrast.test.ts).`}>
        <SpecTable
          head={["Foreground", "Background", "Ratio", "Requirement", "Result"]}
          rows={PAIRS.map(([fg, bg, kind]) => {
            const r = contrastRatio(get(theme, fg)!, get(theme, bg)!);
            const pass = r >= (kind === "text" ? 4.5 : 3);
            return [
              <Token>{fg}</Token>, <Token>{bg}</Token>, <span className="tabular-nums">{r.toFixed(2)}:1</span>, kind === "text" ? "Text ≥ 4.5" : "UI ≥ 3.0",
              <Badge variant={pass ? "success" : "error"} startIcon={pass ? <Check /> : <X />}>{pass ? "Pass" : "Fail"}</Badge>,
            ];
          })}
        />
        <Callout tone="attention" title="Deviations from Geist (intentional, v7)">
          Form controls use <code>--input</code> = gray-700 #8a8a8a (Geist borders are gray-alpha-400 ≈ #ebebeb — 1.2:1, fails WCAG 1.4.11; Geist gray-700 #8f8f8f is 2.89:1 on gray-100). Muted text is gray-800 #737373 (Geist #7d7d7d). In dark mode gray-700/800/900 are raised to #7a7a7a / #9a9a9a / #b4b4b4 because Geist's values pass WCAG but fail APCA (Lc 33–51). Set <code>data-contrast="geist"</code> on a subtree for the upstream-exact look (not AA); <code>"shadcn"</code> still works as a deprecated alias.
        </Callout>
      </Section>

      <Section title="Usage">
        <CodeBlock code={`// ✅ semantic
<div className="bg-muted border-subtle text-default" />
<p className="text-subtle" />
<span className="bg-success-bg text-success-fg" />

// ❌ raw palette — not available in the preset
<div className="bg-gray-50 text-gray-500" />`} />
      </Section>
    </div>
  );
}

/* ================================================================== */
/* TYPOGRAPHY                                                          */
/* ================================================================== */
const SAMPLE: Record<string, string> = {
  "display-2xl": "Launch in weeks", "display-xl": "Launch in weeks", "display-lg": "Build the MVP, not the UI kit", "display-md": "Scheduling infrastructure",
  "heading-xl": "Event types", "heading-lg": "Availability", "heading-md": "Add a new event type", "heading-sm": "Working hours",
  "body-lg": "agere DS lets every venture ship a consistent, accessible product from day one.", "body-md": "Create events to share for people to book on your calendar.",
  "body-sm": "Last synced 2 minutes ago · 14 events", "label-md": "Save changes", "label-sm": "30 min", caption: "Times are shown in Asia/Jakarta (WIB).",
  overline: "Schedule", code: "npm run tokens",
};

export function TypographyPage() {
  const t = lightTokens.type as any;
  return (
    <div className="grid gap-2">
      <PageHeader eyebrow="Foundations" title="Typography" description="v7: Geist Sans for interface and reading text, Geist Mono for code and identifiers. Hierarchy from weight and tight tracking (headings −0.025em, display −0.05em). Self-hosted (SIL OFL), with system fallbacks." />
      <Section title="Families">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-subtle bg-default p-6"><p className="font-sans tracking-tight text-5xl font-semibold tracking-tight text-emphasis">Aa</p><p className="mt-3 type-heading-sm">Geist Sans — UI, text and display</p><p className="text-sm text-subtle">One family for everything from 10 px labels to 60 px display. Display sizes use −0.05em tracking.</p></div>
          <div className="rounded-xl border border-subtle bg-default p-6"><p className="font-mono text-5xl font-semibold text-emphasis">Aa</p><p className="mt-3 type-heading-sm">Geist Mono — code & identifiers</p><p className="text-sm text-subtle">Commands, IDs, hashes, keyboard keys. Only the identifier, never the sentence around it.</p></div>
        </div>
      </Section>
      <Section title="Type scale" description="Use the composite classes — they set family, size, weight, line-height and tracking together.">
        <div className="divide-y divide-[hsl(var(--ag-border-subtle))] overflow-hidden rounded-xl border border-subtle bg-default">
          {TYPE_STYLES.map((name) => {
            const s = t[name];
            return (
              <div key={name} className="grid gap-2 p-5 md:grid-cols-[180px_1fr] md:items-baseline">
                <div className="grid gap-0.5">
                  <Token>type-{name}</Token>
                  <span className="text-2xs text-subtle tabular-nums">{s.fontSize} / {s.lineHeight} · {s.fontWeight} · {s.letterSpacing}</span>
                </div>
                <p className={cn(`type-${name}`, "truncate text-emphasis")}>{SAMPLE[name]}</p>
              </div>
            );
          })}
        </div>
      </Section>
      <Section title="Rules">
        <Prose>
          <ul>
            <li><strong>Weights:</strong> 400 regular (body), 500 medium (labels, buttons), 600 semibold (headings). 700 is reserved for numbers in marketing.</li>
            <li><strong>Line length:</strong> 60–75 characters for prose (<code>max-w-prose</code>, 720px).</li>
            <li><strong>Letter spacing:</strong> tighter (−2%) only at ≥ 36px; overline uses +6% caps.</li>
            <li><strong>Numbers:</strong> use <code>tabular-nums</code> in tables, timers and KPIs.</li>
            <li><strong>Resizing:</strong> all sizes are px tokens but layouts reflow to 200% zoom and 320px width (WCAG 1.4.4 / 1.4.10). Never fix heights on text containers.</li>
            <li><strong>Bahasa Indonesia</strong> runs ~15–25% longer than English — design buttons and tabs for the longer string.</li>
          </ul>
        </Prose>
      </Section>
    </div>
  );
}

/* ================================================================== */
/* SPACING & LAYOUT                                                    */
/* ================================================================== */
export function SpacingPage() {
  const space = lightTokens.space as Record<string, string>;
  const keys = ["0-5", "1", "1-5", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24"];
  const [bp, setBp] = React.useState<"mobile" | "tablet" | "desktop">("desktop");
  const cols = { mobile: 4, tablet: 8, desktop: 12 }[bp];
  return (
    <div className="grid gap-2">
      <PageHeader eyebrow="Foundations" title="Spacing & layout" description="A 4-point scale with a 2px half-step, a 4 / 8 / 12-column responsive grid, and five breakpoints. Tailwind spacing keys map 1:1 to tokens (p-4 = space.4 = 16px)." />
      <Section title="Spacing scale">
        <div className="grid gap-2 rounded-xl border border-subtle bg-default p-5">
          {keys.map((k) => (
            <div key={k} className="grid grid-cols-[72px_64px_1fr] items-center gap-3 text-sm">
              <Token>space.{k}</Token>
              <span className="tabular-nums text-subtle">{space[k]}</span>
              <span className="h-3 rounded-sm bg-brand-accent" style={{ width: space[k] }} />
            </div>
          ))}
        </div>
        <SpecTable head={["Use", "Value"]} rows={[["Inline gap (icon ↔ label)", "space.1-5 · 6px"], ["Control padding", "space.3 · 12px"], ["Field ↔ field", "space.5 · 20px"], ["Card padding", "space.5 · 20px"], ["Section gap", "space.8 · 32px"], ["Page gutter", "16 / 24 / 32px by breakpoint"]]} />
      </Section>
      <Section title="Layout grid" description="Use the .ag-container and .ag-grid utilities. Gutters and margins come from grid tokens.">
        <SegmentedControl aria-label="Breakpoint" value={bp} onValueChange={setBp} options={[{ value: "mobile", label: "Mobile · 4" }, { value: "tablet", label: "Tablet · 8" }, { value: "desktop", label: "Desktop · 12" }]} />
        <div className="rounded-xl border border-subtle bg-muted p-4">
          <div className="grid h-40" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, columnGap: bp === "mobile" ? 16 : 24 }}>
            {Array.from({ length: cols }).map((_, i) => <div key={i} className="rounded-md bg-attention-bg ring-1 ring-inset ring-[hsl(var(--ag-attention-border))]" />)}
          </div>
        </div>
        <SpecTable
          head={["Breakpoint", "Min width", "Columns", "Gutter", "Margin", "Tailwind"]}
          rows={[
            ["Mobile", "0", "4", "16px", "16px", "—"], ["Small", "640px", "4", "16px", "16px", "sm:"],
            ["Tablet", "768px", "8", "24px", "24px", "md:"], ["Desktop", "1024px", "12", "24px", "32px", "lg:"],
            ["Large", "1280px", "12", "24px", "32px", "xl:"], ["Wide screen", "1440px", "12", "24px", "auto (max 1440)", "2xl:"],
          ]}
        />
        <CodeBlock code={`<div className="ag-container">
  <div className="ag-grid gap-y-6">
    <aside className="col-span-4 lg:col-span-3">…</aside>
    <main className="col-span-4 md:col-span-8 lg:col-span-9">…</main>
  </div>
</div>`} />
      </Section>
    </div>
  );
}

/* ================================================================== */
/* EFFECTS & MOTION                                                    */
/* ================================================================== */
export function EffectsPage() {
  const radius = lightTokens.radius as Record<string, string>;
  const [played, setPlayed] = React.useState(false);
  return (
    <div className="grid gap-2">
      <PageHeader eyebrow="Foundations" title="Effects & motion" description="Elevation, radius, opacity, blur, and motion tokens. v7 follows Geist materials: layered shadows (ambient + direct) and one --radius (8 px) that derives sm 4 · md 6 · lg 8 · xl 12 · 2xl 16." />
      <Section title="Elevation" description="Five levels. Dark mode uses stronger alpha plus a 1px highlight ring because shadows vanish on dark canvases.">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[0, 1, 2, 3, 4].map((e) => (
            <div key={e} className={cn("grid h-28 place-items-center rounded-xl border border-subtle bg-default text-center", ["shadow-elevation-0", "shadow-elevation-1", "shadow-elevation-2", "shadow-elevation-3", "shadow-elevation-4"][e])}>
              <div><p className="type-heading-sm">elevation-{e}</p><p className="text-xs text-subtle">{["Flat, tables", "Cards (rested)", "Cards (hover), segmented", "Menus, popovers", "Dialogs, toasts"][e]}</p></div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3"><Button>shadow.button-solid</Button><Button variant="outline">shadow.button-outline</Button></div>
      </Section>
      <Section title="Border radius">
        <div className="flex flex-wrap gap-4">
          {Object.entries(radius).filter(([k]) => k !== "full").map(([k, v]) => (
            <div key={k} className="grid justify-items-center gap-2">
              <div className="size-16 border-2 border-emphasis bg-subtle" style={{ borderRadius: v }} />
              <span className="font-mono text-2xs text-emphasis">{k}</span><span className="text-2xs text-subtle">{v}</span>
            </div>
          ))}
        </div>
        <SpecTable head={["Radius", "Used for"]} rows={[["sm 4 px", "Badges, checkbox, kbd"], ["md · control 6 px", "Buttons, inputs, selects, nav items, tooltips"], ["lg 8 px", "Cards, alerts, tables"], ["xl 12 px", "Popovers, menus, dialogs"], ["2xl 16 px", "Sheets and full-screen surfaces"], ["full", "Avatars, pills, switches"]]} />
      </Section>
      <Section title="Opacity & blur">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-end gap-2 rounded-xl border border-subtle bg-default p-5">
            {[100, 90, 70, 50, 40, 20, 10, 5].map((o) => <div key={o} className="grid flex-1 justify-items-center gap-1"><div className="h-12 w-full rounded-md bg-brand" style={{ opacity: o / 100 }} /><span className="text-2xs text-subtle">{o}</span></div>)}
          </div>
          <div className="relative overflow-hidden rounded-xl border border-subtle bg-default p-5">
            <div className="absolute inset-0 grid grid-cols-6 gap-2 p-3 opacity-80">{Array.from({ length: 12 }).map((_, i) => <div key={i} className="rounded-md" style={{ background: `hsl(var(--ag-viz-${(i % 7) + 1}-emphasis))` }} />)}</div>
            <div className="relative grid h-24 place-items-center rounded-lg bg-default/70 backdrop-blur-glass"><p className="text-sm font-medium">blur.glass 24px — sticky headers</p></div>
          </div>
        </div>
        <SpecTable head={["Token", "Value", "Use"]} rows={[["opacity.disabled", "0.4", "Disabled controls"], ["opacity.scrim", "0.5", "Modal overlay (bg.overlay)"], ["blur.overlay", "4px", "Behind dialogs"], ["blur.glass", "24px", "Translucent sticky headers"]]} />
      </Section>
      <Section title="Motion" description="Motion explains cause and effect; it is never decoration. Everything collapses to 0.01ms under prefers-reduced-motion.">
        <div className="grid gap-3 rounded-xl border border-subtle bg-default p-5">
          {[["fast", "100ms", "Hover, color"], ["base", "150ms", "Buttons, toggles"], ["moderate", "200ms", "Dialogs, popovers enter"], ["slow", "300ms", "Drawers, progress"]].map(([k, v, use]) => (
            <div key={k} className="grid grid-cols-[88px_56px_1fr] items-center gap-3 text-sm">
              <Token>duration.{k}</Token><span className="text-subtle" title={use}>{v}</span>
              <div className="relative h-3 rounded-full bg-subtle">
                <span className="absolute left-0 top-0 size-3 rounded-full bg-brand transition-transform ease-emphasized" style={{ transform: played ? "translateX(calc(min(420px, 60vw)))" : "none", transitionDuration: v }} />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="justify-self-start" onClick={() => setPlayed((p) => !p)}>Play</Button>
        </div>
        <SpecTable head={["Easing", "Curve", "Use"]} rows={[["ease.standard", "cubic-bezier(0.2, 0, 0, 1)", "Most UI transitions"], ["ease.emphasized", "cubic-bezier(0.16, 1, 0.3, 1)", "Drawers, dialogs, switch thumb (cal.com)"], ["ease.exit", "cubic-bezier(0.4, 0, 1, 1)", "Elements leaving"]]} />
        <Callout tone="neutral" title="3D & motion assets">Lottie/Rive files live in <code>assets/motion/</code> (one file per state, ≤ 150 KB, 24–30 fps, ≤ 3s loops). Provide a static first frame for reduced motion and never autoplay audio.</Callout>
      </Section>
    </div>
  );
}
