import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Callout, DoDont, KeyboardTable, PageHeader, Prose, Section, SpecTable } from "../kit";

/* ================================================================== */
/* ACCESSIBILITY                                                       */
/* ================================================================== */
export function AccessibilityPage() {
  return (
    <div className="grid gap-2">
      <PageHeader
        eyebrow="Guidelines"
        title="Accessibility"
        description="Target: WCAG 2.1 Level AA for every component and pattern, plus the WCAG 2.2 AA additions (target size, focus not obscured). Accessibility is a release gate, not a backlog item."
      />
      <Section title="Our baseline">
        <SpecTable
          head={["Area", "Standard", "How the DS guarantees it"]}
          rows={[
            ["Text contrast", "1.4.3 — 4.5:1 (3:1 ≥ 24px / 19px bold)", "Token pairs audited in CI (tests/tokens.contrast.test.ts); fg.muted restricted to the canvas"],
            ["Non-text contrast", "1.4.11 — 3:1 for controls & focus", "border.control (3.4:1), switch off-track border, focus.ring (4.8:1)"],
            ["Use of color", "1.4.1", "Badges carry words; status dots are paired with text; errors have icon + text"],
            ["Keyboard", "2.1.1 / 2.1.2", "Radix primitives; roving tabindex; documented keymaps per component; no traps outside modals"],
            ["Focus visible", "2.4.7 (+ 2.4.11 in 2.2)", "Outline-based .focus-ring (visible in forced-colors); sticky headers never cover focused rows"],
            ["Target size", "2.5.8 (2.2) — 24×24", "Smallest control 24px; checkbox/radio/switch hit areas extended with ::before"],
            ["Name, role, value", "4.1.2", "IconButton requires `label`; FormControl wires aria-describedby/invalid/required"],
            ["Status messages", "4.1.3", "Toasts, uploads, selection counts and pagination use polite live regions"],
            ["Reflow & zoom", "1.4.4 / 1.4.10", "No fixed-height text containers; layouts reflow at 320px and 200% zoom"],
            ["Motion", "2.3.3 / 2.2.2", "Global prefers-reduced-motion rule; no auto-playing loops > 5s"],
            ["Timing", "2.2.1", "Toasts ≥ 4s, pause on hover/focus, errors 8s, sticky allowed"],
          ]}
        />
      </Section>
      <Section title="Keyboard navigation spec" description="Global conventions every product must keep.">
        <KeyboardTable
          rows={[
            ["Tab / Shift+Tab", "Move between interactive elements in DOM order"],
            ["Enter", "Activate links and buttons; submit forms from a text field"],
            ["Space", "Activate buttons; toggle checkbox/switch; pick up / drop draggable items"],
            ["↑ / ↓ / ← / →", "Move within composite widgets (menus, tabs, radio groups, trees, grids)"],
            ["Home / End", "First / last item in a composite widget"],
            ["Esc", "Close the top-most overlay and return focus to its trigger; cancel edits and drags"],
            ["F8", "Jump to the toast region"],
            ["/", "Focus page search (only where a SearchInput shows the hint)"],
          ]}
        />
      </Section>
      <Section title="Screen reader labels & ARIA">
        <DoDont
          dos={[
            "Prefer native elements (<button>, <a href>, <input>) — ARIA is a last resort.",
            "Name icon-only buttons after the action and object: “Delete event type”, not “Trash”.",
            "Use aria-current=\"page\" for the active nav item and aria-current=\"step\" in steppers.",
            "Announce async results in a polite live region (“3 files added”).",
            "Give every dialog a DialogTitle; use sr-only when the design hides it.",
          ]}
          donts={[
            "Don’t add role=\"button\" to a div — use Button.",
            "Don’t put aria-label on non-interactive <div>/<span> (it’s ignored by most AT).",
            "Don’t hide focusable content with aria-hidden.",
            "Don’t announce every keystroke or timer tick.",
            "Don’t use title as the only accessible name.",
          ]}
        />
      </Section>
      <Section title="Release checklist" description="A component PR cannot merge until each box is checked in the PR template.">
        <Prose>
          <ol>
            <li>axe-core passes in unit tests (<code>expectNoA11yViolations</code>) and in Storybook’s a11y panel.</li>
            <li>Keyboard-only walkthrough of every state, documented in the component’s <em>Accessibility</em> tab.</li>
            <li>VoiceOver (macOS/iOS) and NVDA (Windows) pass for new organisms; TalkBack for mobile-first flows.</li>
            <li>200% zoom and 320px viewport with no horizontal scroll (except data tables, which scroll inside their container).</li>
            <li>Windows High Contrast / <code>forced-colors</code> spot-check: focus and control boundaries remain visible.</li>
            <li>prefers-reduced-motion verified.</li>
          </ol>
        </Prose>
        <Callout tone="attention" title="Known gaps (tracked)">File Explorer drag-to-folder still needs a “Move to…” menu as its keyboard alternative in each product; DataTable is not virtualized (announce row counts server-side above 1,000 rows).</Callout>
      </Section>
    </div>
  );
}

/* ================================================================== */
/* CONTENT & UX WRITING                                                */
/* ================================================================== */
export function ContentPage() {
  return (
    <div className="grid gap-2">
      <PageHeader
        eyebrow="Guidelines"
        title="Content & UX writing"
        description="agere products speak to Indonesian founders, teams and their customers. Write Bahasa Indonesia first (English where the product is English-first), with the same voice in both."
      />
      <Section title="Voice & tone" description="Voice is constant; tone flexes with the moment.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Jelas (Clear)", "Plain words, one idea per sentence. The user should never need to re-read.", "“Link disalin.” not “Tautan telah berhasil disalin ke papan klip Anda.”"],
            ["Hangat (Warm)", "Friendly and respectful — ‘kamu’ for consumer products, ‘Anda’ for B2B/finance. Pick one per product and never mix.", "“Selamat datang, Nadia 👋” (consumer) / “Selamat datang kembali.” (B2B)"],
            ["Yakin (Confident)", "Say what happens; no hedging, no hype. Skip “mohon maaf atas ketidaknyamanannya” unless we caused real harm.", "“Pembayaran diproses dalam 1–2 menit.”"],
          ].map(([t, d, e]) => (
            <div key={t} className="grid content-start gap-2 rounded-xl border border-subtle bg-default p-5">
              <p className="type-heading-md">{t}</p><p className="text-sm text-default">{d}</p><p className="rounded-lg bg-muted p-3 text-sm text-subtle">{e}</p>
            </div>
          ))}
        </div>
        <SpecTable
          head={["Moment", "Tone", "Example (ID)", "Example (EN)"]}
          rows={[
            ["Success", "Brief, past tense", "Jadwal tersimpan.", "Schedule saved."],
            ["Error we caused", "Own it + next step", "Kami gagal memuat jadwal. Coba lagi.", "We couldn’t load your schedule. Try again."],
            ["User error", "Neutral, specific", "Masukkan email yang valid, contoh: nama@perusahaan.com", "Enter a valid email, like name@company.com"],
            ["Destructive", "Serious, explicit", "Hapus tipe acara? Tautan publiknya tidak bisa dipakai lagi.", "Delete event type? Its public link will stop working."],
            ["Empty / first use", "Encouraging", "Belum ada booking. Bagikan tautanmu untuk mulai.", "No bookings yet. Share your link to get started."],
          ]}
        />
      </Section>
      <Section title="Error message standard" description="Every error answers three questions: what happened, why (if useful), and what to do now.">
        <div className="grid gap-3 md:grid-cols-2">
          <Alert variant="error" title="Kartu ditolak oleh bank" live="off">Saldo tidak cukup atau kartu diblokir. Coba kartu lain atau bayar dengan QRIS.</Alert>
          <Alert variant="error" title="Terjadi kesalahan" live="off">Error 500. Silakan hubungi admin.</Alert>
        </div>
        <DoDont
          dos={["Place field errors under the field; summarize on submit.", "Use the field’s name: “Masukkan nomor WhatsApp.”", "Keep the user’s input; tell them exactly what to change.", "Give codes only as secondary detail for support (“Kode: PAY-402”)."]}
          donts={["Don’t blame: “Anda salah memasukkan…”.", "Don’t use jargon (“Invalid payload”, “null”).", "Don’t use ALL CAPS or exclamation marks in errors.", "Don’t say “Oops!” for anything involving money or data loss."]}
        />
      </Section>
      <Section title="Buttons, labels & placeholders">
        <SpecTable
          head={["Element", "Rule", "✓", "✗"]}
          rows={[
            ["Buttons", "Verb + object, sentence case, ≤ 3 words", "Simpan perubahan · Undang anggota", "OK · Submit · KLIK DI SINI"],
            ["Destructive confirm", "Repeat the verb from the title", "Hapus tipe acara", "Ya · Lanjutkan"],
            ["Labels", "Noun, sentence case, no colon", "Email kerja", "Masukkan Email Kerja:"],
            ["Placeholders", "Search fields only, as the visible hint. Authoring fields (titles, descriptions, comments, messages, docs) have none: a visible label plus helper text for formats. (6.4)", "Cari tugas, proyek, orang", "Contoh: kriteria selesai… · Masukkan email Anda"],
            ["Formats", "Put examples and formats in helper text under the field, not in the field", "Pisahkan dengan koma, maksimal 20 email.", "placeholder=\"nama@perusahaan.com\""],
            ["Helper text", "Constraints before the user types", "Minimal 8 karakter, 1 angka.", "(shown only after an error)"],
            ["Links", "Describe the destination", "Lihat panduan harga", "Klik di sini"],
          ]}
        />
      </Section>
      <Section title="Punctuation & formatting">
        <Prose>
          <ul>
            <li><strong>Sentence case</strong> everywhere (titles, buttons, tabs). Proper nouns keep capitals: Google Calendar, WhatsApp, QRIS.</li>
            <li><strong>Periods:</strong> none in titles, labels, buttons or single-phrase toasts; use them in full-sentence descriptions and errors.</li>
            <li><strong>Numbers & currency (ID):</strong> Rp150.000 (no space, dot thousands), 1,5 jam, 24/09/2026 or 24 Sep 2026; time 14.30 WIB. Use <code>Intl.NumberFormat("id-ID")</code> and <code>Intl.DateTimeFormat("id-ID")</code> — never hand-format.</li>
            <li><strong>Ranges:</strong> en dash without spaces: 09.00–17.00, Senin–Jumat.</li>
            <li><strong>Ellipsis</strong> (…) only for in-progress states (“Menyimpan…”) and truncated text.</li>
            <li><strong>Quotes:</strong> curly “ ” and ’; straight quotes only in code.</li>
            <li><strong>Emoji:</strong> at most one, only in celebratory/onboarding moments, never in errors.</li>
            <li><strong>Loanwords:</strong> prefer common Indonesian where natural (<em>unggah, simpan, hapus</em>); keep product terms users already use (<em>booking, link, dashboard</em>) consistent within a product glossary.</li>
          </ul>
        </Prose>
        <div className="flex flex-wrap gap-2"><Badge variant="success">Menyimpan…</Badge><Badge variant="gray">Rp150.000</Badge><Badge variant="info">14.30 WIB</Badge><Badge variant="attention">Senin–Jumat</Badge></div>
      </Section>
    </div>
  );
}
