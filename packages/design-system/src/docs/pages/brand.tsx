import * as React from "react";
import { Camera, Download } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/brand/logo";
import { ILLUSTRATIONS } from "@/brand/illustrations";
import { STATE_ILLUSTRATION_LIST, type StateIllustrationGroup } from "@/brand/state-illustrations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AGERE_ICONS, Icon } from "@/icons";
import constructionUrl from "../../../assets/brand/construction/agere-construction.svg?url";
import orgUrl from "../../../assets/brand/products/agere-org-primary.svg?url";
import eduUrl from "../../../assets/brand/products/agere-edu-primary.svg?url";
import ledgerUrl from "../../../assets/brand/products/agere-ledger-primary.svg?url";
import hireUrl from "../../../assets/brand/products/agere-hire-primary.svg?url";
import traceUrl from "../../../assets/brand/products/agere-trace-primary.svg?url";
import orgStackedUrl from "../../../assets/brand/products/agere-org-stacked.svg?url";
import orgReversedUrl from "../../../assets/brand/products/agere-org-primary-reversed.svg?url";
import orgBadgeUrl from "../../../assets/brand/products/agere-org-badge.svg?url";
import orgAppIconUrl from "../../../assets/brand/products/agere-org-app-icon.svg?url";
import { Callout, CodeBlock, DoDont, PageHeader, Prose, Section, SpecTable, Token } from "../kit";

/* ================================================================== */
/* LOGO & BRAND IDENTITY                                               */
/* ================================================================== */
export function LogoPage() {
  /* 1X = one node diameter. Primary lockup is 2.195X high → X ≈ height / 2.195. */
  const H = 40;
  const X = Math.round((H / 2.1949) * 10) / 10;
  return (
    <div className="grid gap-2">
      <PageHeader
        eyebrow="Brand"
        title="Logo & identity"
        description="Three equal nodes joined by a carved bridge: ideas connecting and moving forward, the way a venture studio works. The wordmark is drawn on the same geometry. Every measure comes from one unit, X (one node’s diameter), and the golden ratio φ."
        actions={<span className="inline-flex items-center gap-2 text-sm text-subtle"><Download aria-hidden className="size-4" />Masters (SVG, PNG, favicon) live in <Token>assets/brand/</Token></span>}
      />
      <Section title="Variations">
        <div className="grid gap-4 md:grid-cols-3">
          <figure className="grid place-items-center gap-3 rounded-xl border border-subtle bg-white p-8 md:col-span-2"><Logo height={48} tone="ink" /><figcaption className="text-xs text-[#4b5563]">Primary · horizontal (default)</figcaption></figure>
          <figure className="grid place-items-center gap-3 rounded-xl border border-subtle bg-white p-8"><Logo variant="stacked" height={96} tone="ink" /><figcaption className="text-xs text-[#4b5563]">Stacked · ≥ 48px high</figcaption></figure>
          <figure className="grid place-items-center gap-3 rounded-xl border border-subtle bg-white p-8"><Logo variant="mark" height={56} tone="ink" /><figcaption className="text-xs text-[#4b5563]">Symbol · avatars, social, favicon</figcaption></figure>
          <figure className="grid place-items-center gap-3 rounded-xl border border-subtle bg-white p-8"><Logo variant="wordmark" height={32} tone="ink" /><figcaption className="text-xs text-[#4b5563]">Wordmark · when the symbol is already nearby</figcaption></figure>
          <figure className="grid place-items-center gap-3 rounded-xl border border-subtle bg-white p-8">
            <div className="flex items-center gap-3"><Logo variant="app-icon" height={56} tone="inverse" className="rounded-[23.6%] shadow-[0_0_0_1px_#e5e7eb]" /><Logo variant="app-icon" height={56} tone="ink" /></div>
            <figcaption className="text-xs text-[#4b5563]">App icon · light / dark</figcaption>
          </figure>
        </div>
      </Section>
      <Section title="Color" description="One color only. No gradients, no second color, no amber in the logo.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <figure className="grid place-items-center gap-3 rounded-xl border border-subtle bg-white p-6"><Logo height={28} tone="ink" /><figcaption className="text-xs text-[#4b5563]">Ink on light</figcaption></figure>
          <figure className="grid place-items-center gap-3 rounded-xl border border-subtle bg-[#111111] p-6"><Logo height={28} tone="inverse" /><figcaption className="text-xs text-white/75">Reversed · on dark</figcaption></figure>
          <figure className="grid place-items-center gap-3 rounded-xl border border-subtle bg-[#E6E4DF] p-6"><Logo height={28} tone="ink" /><figcaption className="text-xs text-[#4b5563]">Ink on neutral</figcaption></figure>
          <figure className="grid place-items-center gap-3 rounded-xl border border-subtle bg-muted p-6 text-emphasis"><Logo height={28} tone="auto" /><figcaption className="text-xs text-subtle">Auto · follows light/dark</figcaption></figure>
        </div>
        <SpecTable
          head={["Tone", "Fill", "Use"]}
          rows={[
            [<Token>auto</Token>, "fg.emphasis token", "Product chrome. Switches with the theme"],
            [<Token>ink</Token>, "#111111", "Light backgrounds, print, marketing"],
            [<Token>inverse</Token>, "#FFFFFF", "Dark or photographic backgrounds with enough contrast"],
            [<Token>mono</Token>, "currentColor", "Inherits text color: endorsements, footers, one-color print"],
          ]}
        />
      </Section>
      <Section title="Construction" description="Base unit X = node diameter · φ = 1.618. Node gaps follow the golden sequence 0.236X : 0.382X : 0.618X. The bridge is carved by two negative nodes the same size as the positive ones.">
        <div className="overflow-hidden rounded-xl border border-subtle bg-white p-2">
          <img src={constructionUrl} alt="Logo construction: three nodes of diameter 1X with golden-ratio gaps, wordmark x-height 1.236X and stem 0.326X, primary lockup 9.102X by 2.195X with 1X clear space." className="h-auto w-full" loading="lazy" width={3200} height={3000} />
        </div>
        <SpecTable
          head={["Element", "Rule", "Value"]}
          rows={[
            ["Symbol box", "Three Ø 1X nodes, L–T axis on 45°", "2.588X × 2.183X"],
            ["Wordmark x-height", "2X / φ (the same as the L–T centre distance)", "1.236X"],
            ["Stem weight", "X/φ³ + X/φ⁵ — weight “A2”", "0.326X"],
            ["Horizontal weight", "x-height / φ³ (optical thinning)", "0.292X"],
            ["e crossbar", "Stem / φ", "0.202X"],
            ["Corner fillets", "Concave stem/φ⁴ · convex stem/φ³", "0.048X · 0.077X"],
            ["Symbol → wordmark gap", "Same as the symbol’s T–B gap", "0.382X"],
            ["Primary lockup", "Symbol centred on the x-height midline", "9.102X × 2.195X"],
            ["Stacked lockup", "Symbol × φ, 0.618X above the x-height", "6.132X × 5.872X"],
            ["App icon", "Symbol width = tile ÷ φ, corner radius tile ÷ φ³ (23.6%)", "Square"],
          ]}
        />
      </Section>
      <Section title="Clear space & minimum size" description="Keep at least 1X (one node diameter) clear on every side. Quick check: one node of the logo fits in that space.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid place-items-center rounded-xl border border-subtle bg-white p-8">
            <div className="relative outline outline-1 outline-dashed outline-[#ef4444]" style={{ padding: X }}>
              <span aria-hidden className="absolute left-0 top-0 rounded-full border border-[#ef4444] bg-[#fee2e2]" style={{ width: X, height: X }} />
              <span aria-hidden className="absolute bottom-0 right-0 rounded-full border border-[#ef4444] bg-[#fee2e2]" style={{ width: X, height: X }} />
              <Logo height={H} tone="ink" />
              <span className="absolute -top-5 left-0 text-2xs font-medium text-[#b91c1c]">1X</span>
            </div>
          </div>
          <SpecTable
            head={["Asset", "Minimum", "Below that"]}
            rows={[
              ["Primary lockup", "24px high (≈ 100px wide)", "Small cut from 16–23px (automatic)"],
              ["Stacked", "48px high", "Use primary or symbol"],
              ["Symbol", "24px", "Small cut or favicon from 16–23px"],
              ["Under 16px", "—", "Symbol only"],
            ]}
          />
        </div>
        <Callout tone="info" title="Small-size cut is automatic">
          <code>{'<Logo height={20} />'}</code> switches to the small cut below 24px: slightly lighter stems, a more open “e” and wider tracking. The left node also moves out one golden step so the symbol doesn’t fill in. Force it with <code>cut="small"</code> or <code>cut="regular"</code>.
        </Callout>
        <div className="flex flex-wrap items-end gap-8 rounded-xl border border-subtle bg-white p-6 text-[#4b5563]">
          {[48, 32, 24, 20, 16].map((h) => (
            <figure key={h} className="grid justify-items-start gap-2"><Logo height={h} tone="ink" title="" /><figcaption className="text-2xs">{h}px{h < 24 ? " · small cut" : ""}</figcaption></figure>
          ))}
        </div>
      </Section>
      <Section title="Usage in code">
        <CodeBlock code={`import { Logo } from "@/components/agere-ds";

<Logo />                                  // primary lockup, 24px, follows theme
<Logo height={20} title="agere home" />   // small cut applied automatically
<Logo variant="mark" height={32} />       // symbol
<Logo variant="stacked" height={120} tone="ink" />
<Logo variant="app-icon" height={40} />   // rounded tile, inverts in dark mode
<Logo tone="mono" className="text-subtle" title="" />  // decorative, inherits color`} />
        <CodeBlock lang="html" code={`<link rel="icon" href="/favicon.svg" type="image/svg+xml">  <!-- adapts to light/dark -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">`} />
      </Section>
      <Section title="Product family" description="Every agere product uses the main symbol, unchanged, knocked out of a black badge, then agere/<product> in Geist Bold outlines. Products are told apart only by the name — never by colour or a different symbol.">
        <div className="grid gap-3 rounded-xl border border-subtle bg-white p-6">
          {[
            ["agere/org", orgUrl, 15.49],
            ["agere/edu", eduUrl, 15.93],
            ["agere/ledger", ledgerUrl, 19.17],
            ["agere/hire", hireUrl, 16.2],
            ["agere/trace", traceUrl, 17.87],
          ].map(([name, url, w]) => (
            <img key={name as string} src={url as string} alt={name as string} height={32} width={Math.round(((w as number) / 3.236) * 32)} className="h-8 w-auto" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <figure className="grid place-items-center gap-3 rounded-xl border border-subtle bg-white p-6"><img src={orgStackedUrl} alt="agere/org stacked" width={145} height={80} className="h-20 w-auto" /><figcaption className="text-xs text-[#4b5563]">Stacked</figcaption></figure>
          <figure className="grid place-items-center gap-3 rounded-xl border border-subtle bg-[#111111] p-6"><img src={orgReversedUrl} alt="agere/org reversed" width={134} height={40} className="h-10 w-auto" /><figcaption className="text-xs text-white/75">Reversed</figcaption></figure>
          <figure className="grid place-items-center gap-3 rounded-xl border border-subtle bg-white p-6"><img src={orgBadgeUrl} alt="" width={48} height={48} className="size-12" /><figcaption className="text-xs text-[#4b5563]">Badge · every product&rsquo;s favicon</figcaption></figure>
          <figure className="grid place-items-center gap-3 rounded-xl border border-subtle bg-white p-6"><img src={orgAppIconUrl} alt="" width={56} height={56} className="size-14" /><figcaption className="text-xs text-[#4b5563]">App icon</figcaption></figure>
        </div>
        <SpecTable
          head={["Element", "Rule", "Value"]}
          rows={[
            ["Typeface", "Geist Bold (shadcn/ui’s font, OFL), converted to outlines", "—"],
            ["x-height", "Same as the master system", "1.236X"],
            ["Badge", "Black disc, Ø = x-height × φ²", "3.236X"],
            ["Symbol in badge", "Width = badge ÷ φ, optically centred", "2.0X"],
            ["Badge → text gap", "Badge ÷ φ² (= x-height)", "1.236X"],
            ["Stacked", "Badge centred above the text, gap badge ÷ φ²", "1.236X"],
            ["Primary lockup height", "Exactly one badge tall", "3.24X"],
            ["Clear space · minimum", "1X on every side · 24px high", "—"],
          ]}
        />
        <Callout tone="info" title="Files">
          <code>assets/brand/products/</code> — per product: <code>-primary</code> and <code>-stacked</code> (ink, <code>-white</code>, <code>-mono</code>, <code>-reversed</code>), <code>-badge</code> (ink, <code>-white</code>, <code>-mono</code>), <code>-symbol</code>, <code>-app-icon</code>; <code>agere-product-family.png</code>. A new product gets the same set and nothing else that differs. Not MIT-licensed — see <code>TRADEMARKS.md</code>.
        </Callout>
      </Section>
      <Section title="Misuse" description="Never modify the logo. These are all wrong:">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["Stretched", { transform: "scaleX(1.5)" }],
            ["Rotated", { transform: "rotate(-24deg)" }],
            ["Second color", { filter: "sepia(1) saturate(8) hue-rotate(5deg)" }],
            ["Low contrast", { opacity: 0.25 }],
            ["Effects", { filter: "drop-shadow(3px 3px 0 #ef4444)" }],
            ["Blurred", { filter: "blur(0.8px)" }],
          ].map(([label, style]) => (
            <figure key={label as string} className="grid gap-2">
              <div className="relative grid h-24 place-items-center overflow-hidden rounded-xl border border-error-border bg-white">
                <div style={style as React.CSSProperties}><Logo variant="mark" height={36} tone="ink" title="" /></div>
                <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top_right,transparent_calc(50%-1px),hsl(var(--ag-error-solid))_50%,transparent_calc(50%+1px))]" />
              </div>
              <figcaption className="text-xs text-error-on-surface">✗ {label as string}</figcaption>
            </figure>
          ))}
        </div>
      </Section>
      <Section title="Brand colors">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[["Logo Ink", "#111111", "Logo masters only", "text-white"], ["agere Ink", "#111827", "UI brand token: primary buttons, focus", "text-white"], ["Paper", "#FFFFFF", "Canvas · reversed logo", "text-[#111827]"], ["agere Amber", "#F59E0B", "UI accent · ≤ 5% of any screen · never in the logo", "text-[#111827]"]].map(([n, hex, use, fg]) => (
            <div key={n} className="overflow-hidden rounded-xl border border-subtle">
              <div className={cn("flex h-24 items-end p-3 font-sans tracking-tight text-lg font-semibold", fg)} style={{ background: hex }}>{n}</div>
              <div className="grid gap-0.5 bg-default p-3 text-xs"><span className="font-mono uppercase text-emphasis">{hex}</span><span className="text-subtle">{use}</span></div>
            </div>
          ))}
        </div>
        <Callout tone="neutral" title="Venture brands">Each agere venture gets its own brand color via <code>data-brand</code> or <code>applyBrandColor()</code>. The agere logo appears only in “Built by agere” endorsements, never inside a venture’s product chrome.</Callout>
      </Section>
    </div>
  );
}

/* ================================================================== */
/* MEDIA ASSETS                                                        */
/* ================================================================== */
const STATE_GROUPS: { id: StateIllustrationGroup; label: string }[] = [
  { id: "universal", label: "Universal" },
  { id: "ledger", label: "Ledger" },
  { id: "education", label: "Education" },
  { id: "hiring", label: "Hiring" },
];

export function MediaPage() {
  return (
    <div className="grid gap-2">
      <PageHeader eyebrow="Brand" title="Media assets" description="Illustrations, icons, photography and motion — one visual language across every venture." />
      <Section title="Spot illustrations" description="Line style on the icon grid; colors come only from tokens so they follow dark mode and white-label brands automatically.">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Object.entries(ILLUSTRATIONS).map(([name, Ill]) => (
            <li key={name} className="grid justify-items-center gap-2 rounded-xl border border-subtle bg-default p-5">
              <Ill size={140} />
              <Token>{name}</Token>
            </li>
          ))}
        </ul>
        <CodeBlock code={`import { IllustrationEmpty } from "@/components/agere-ds";
<EmptyState illustration={<IllustrationEmpty size={160} />} title="No bookings yet" />`} />
        <DoDont
          dos={["Use one illustration per screen, in empty, success, error or onboarding moments.", "Keep 2px stroke at 160px; scale proportionally.", "New illustrations: 160×120 artboard, max 3 fills (bg.default, bg.subtle, brand.accent-subtle) + one amber accent."]}
          donts={["Don’t use illustrations as decoration in dense work screens.", "Don’t mix in stock 3D or flat-vector packs.", "Don’t put text inside illustrations (it won’t translate)."]}
        />
      </Section>
      <Section
        id="state-illustrations"
        title="State illustrations"
        description="25 larger scenes (320×220) for empty, success, error, onboarding and domain moments — universal, ledger, education, hiring. Artwork only: the title, description and actions belong to the surrounding EmptyState. Token colors, so they follow dark mode and white-label brands."
      >
        <Tabs defaultValue="universal">
          <TabsList aria-label="Illustration group">
            {STATE_GROUPS.map((g) => (
              <TabsTrigger key={g.id} value={g.id} count={STATE_ILLUSTRATION_LIST.filter((i) => i.group === g.id).length}>{g.label}</TabsTrigger>
            ))}
          </TabsList>
          {STATE_GROUPS.map((g) => (
            <TabsContent key={g.id} value={g.id} className="mt-4">
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
                {STATE_ILLUSTRATION_LIST.filter((i) => i.group === g.id).map(({ id, file, Component }) => (
                  <li key={id} className="grid justify-items-center gap-3 rounded-xl border border-border bg-card p-4">
                    <Component size={200} />
                    <Token>{file}</Token>
                  </li>
                ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
        <CodeBlock code={`import { StateIllustrationLedgerEmpty, STATE_ILLUSTRATIONS } from "@/components/agere-ds";

<EmptyState illustration={<StateIllustrationLedgerEmpty size={240} />} title="…" description="…" actions={…} />

// by id (e.g. from a CMS): "universal/not-found" · "ledger/bank-sync" · "hiring/closed" …
const Art = STATE_ILLUSTRATIONS["universal/not-found"];
<Art title="Page not found" />   // pass title only when the image carries meaning on its own

// Static SVG (Figma, email, native): assets/illustrations/state/{light,dark}/<group>-<name>.svg
// regenerated from the React source with current token values: npm run illustrations`} />
        <SpecTable
          head={["Part", "Token", "Light", "Dark"]}
          rows={[
            ["Line (2px, non-scaling)", <Token>fg.subtle</Token>, "#6b6b6b", "#a1a1a1"],
            ["Base fill", <Token>bg.default</Token>, "#ffffff", "#0a0a0a"],
            ["Ground / neutral fill", <Token>bg.emphasis</Token>, "#e5e5e5", "#404040"],
            ["Accent", <Token>brand.accent</Token>, "#db7706", "#f59f0a"],
            ["Accent subtle", <Token>brand.accent-subtle</Token>, "#fef3c8", "#76350f"],
          ]}
        />
      </Section>
      <Section title="Icon set" description="Lucide is the base set; custom agere glyphs cover venture-studio concepts. SVG components tree-shake; no icon font.">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Object.entries(AGERE_ICONS).map(([n, G]) => (
            <div key={n} className="grid justify-items-center gap-2 rounded-xl border border-subtle bg-default p-4 text-emphasis"><Icon icon={G} size="xl" /><span className="text-2xs text-subtle">{n.replace("Icon", "")}</span></div>
          ))}
        </div>
        <SpecTable head={["Rule", "Spec"]} rows={[["Grid", "24×24, 2px live area padding"], ["Stroke", "2px, round caps & joins (1.75 at ≥ 24px display)"], ["Corners", "2px radius on rectangles"], ["Delivery", "React components (src/icons); raw SVG on request via build script"], ["Naming", "Concept, not shape: LaunchIcon, not RocketIcon"]]} />
      </Section>
      <Section title="Photography style guide">
        <div className="grid gap-3 sm:grid-cols-3">
          {[["Real teams, real work", "Indonesian founders and teams in actual workspaces. Natural light, candid moments, hands on laptops and whiteboards."], ["Warm, not staged", "Warm white balance, soft shadows, shallow depth of field. No over-saturated stock smiles or pointing at screens."], ["Room for UI", "Leave 30–40% negative space for product UI overlays; crop 4:3, 16:9 and 1:1."]].map(([t, d]) => (
            <div key={t} className="grid gap-3 overflow-hidden rounded-xl border border-subtle bg-default">
              <div className="grid aspect-[4/3] place-items-center bg-[linear-gradient(135deg,hsl(var(--ag-brand-accent-subtle)),hsl(var(--ag-bg-subtle)))] text-subtle"><Camera className="size-8" aria-hidden /></div>
              <div className="grid gap-1 px-4 pb-4"><p className="type-heading-sm">{t}</p><p className="text-sm text-subtle">{d}</p></div>
            </div>
          ))}
        </div>
        <Prose>
          <ul>
            <li><strong>Treatment:</strong> no filters or duotones; subtle grade only (+5 warmth). Rounded corners follow the container (radius.xl).</li>
            <li><strong>Representation:</strong> reflect Indonesia’s diversity — region, gender, age, hijab and non-hijab, disability.</li>
            <li><strong>Accessibility:</strong> informative photos need alt text describing purpose; decorative photos use <code>alt=""</code>. Never put essential text in images.</li>
            <li><strong>Performance:</strong> AVIF/WebP, ≤ 200 KB above the fold, explicit width/height to prevent layout shift.</li>
            <li><strong>Rights:</strong> signed model releases stored in the DAM; no scraped or AI-generated people presented as real customers.</li>
          </ul>
        </Prose>
      </Section>
      <Section title="3D & motion assets">
        <SpecTable head={["Asset", "Format", "Budget", "Rules"]} rows={[["Micro-animations", "Lottie JSON / Rive", "≤ 150 KB, ≤ 3s", "Token colors via theming; static frame for reduced motion"], ["Product walkthroughs", "MP4/WebM + captions", "≤ 4 MB", "Muted autoplay only, visible pause control (WCAG 2.2.2)"], ["3D hero objects", "GLB + PNG fallback", "≤ 1.5 MB", "Soft clay material, amber accent, one per page"]]} />
      </Section>
    </div>
  );
}
