// v7 — single source for AGENTS.md, GUIDELINES.md and the docs page Guidelines → Interface rules.
// Adapted from Vercel's Web Interface Guidelines (github.com/vercel-labs/web-interface-guidelines).
// `by` says how agere enforces a rule. Only claims verified against this codebase are tagged built-in/test:
//   lint:Gxx  scripts/lint-guidelines.mjs fails CI (G12 is a warning: review backlog)
//   built-in  the component or globals.css already does it — use the component
//   test      asserted in the Vitest suite or the Chromium check (scripts/verify-browser.py)
//   tokens    guaranteed by the token build + contrast suite (WCAG 2.1 AA + APCA)
//   review    needs human or agent judgment: PR checklist in GUIDELINES.md
export type Level = "MUST" | "SHOULD" | "NEVER";
export interface Rule { level: Level; text: string; by: string[] }
export interface RuleGroup { id: string; title: string; rules: Rule[] }

export const RULE_GROUPS: RuleGroup[] = [
  { id: "keyboard", title: "Keyboard & focus", rules: [
    { level: "MUST", text: "Every flow works with the keyboard, following the WAI-ARIA APG pattern for the widget (Radix primitives provide it).", by: ["built-in", "test"] },
    { level: "MUST", text: "Focus is always visible and never covered by sticky or fixed elements. Use the focus-ring utilities.", by: ["built-in", "test"] },
    { level: "MUST", text: "Focus is trapped, moved and returned as the APG pattern describes (dialogs, sheets, menus).", by: ["built-in", "test"] },
    // agere-guidelines-ignore G03 rule text names the anti-pattern it forbids
    { level: "NEVER", text: "Remove the outline without a visible replacement (focus-ring, focus-ring-inset, focus-ring-field).", by: ["lint:G03"] },
  ]},
  { id: "targets", title: "Targets & input", rules: [
    { level: "MUST", text: "Hit targets are at least 24\u00a0px (44\u00a0px on mobile). Expand the hit area when the visual is smaller.", by: ["review"] },
    { level: "MUST", text: "Inputs are 16\u00a0px on phones so iOS never zooms on focus (Input: text-base md:text-sm).", by: ["built-in", "test"] },
    // agere-guidelines-ignore G05 rule text names the anti-pattern it forbids
    { level: "NEVER", text: "Disable browser zoom (user-scalable=no, maximum-scale=1).", by: ["lint:G05"] },
    { level: "MUST", text: "Controls set touch-action: manipulation (globals.css, v7).", by: ["built-in"] },
    { level: "SHOULD", text: "Set -webkit-tap-highlight-color to match the design (globals.css, v7).", by: ["built-in"] },
  ]},
  { id: "forms", title: "Forms", rules: [
    { level: "MUST", text: "Inputs keep focus and value through hydration.", by: ["review"] },
    { level: "NEVER", text: "Block paste in inputs or textareas.", by: ["lint:G07"] },
    { level: "MUST", text: "Loading buttons show a spinner and keep their label (Button loading sets aria-busy).", by: ["built-in", "test"] },
    { level: "MUST", text: "Enter submits a focused single input; in a textarea ⌘/Ctrl+Enter submits and Enter adds a line.", by: ["review"] },
    { level: "MUST", text: "Submit stays enabled until the request starts, then disables with a spinner.", by: ["review"] },
    { level: "MUST", text: "Accept free text and validate afterwards; never swallow keystrokes.", by: ["review"] },
    { level: "MUST", text: "Errors sit next to their field (FieldError). On submit, focus the first error.", by: ["built-in", "review"] },
    { level: "MUST", text: "Set autocomplete, a meaningful name, the right type and inputmode.", by: ["review"] },
    { level: "SHOULD", text: "Turn spellcheck off for emails, codes and usernames.", by: ["review"] },
    { level: "MUST", text: "Placeholders only in search fields; authoring fields get a visible label and helper text (agere 6.4 guideline, overrides AGENTS.md).", by: ["lint:G12"] },
    { level: "MUST", text: "Search placeholders end with … (“Cari pasien…”). Never after an example value: “you@company.com…” reads as if it continues.", by: ["lint:G08"] },
    { level: "MUST", text: "Warn before navigation discards unsaved changes (SaveBar).", by: ["built-in", "review"] },
    { level: "MUST", text: "Work with password managers and 2FA; one-time codes can be pasted (InputOTP).", by: ["built-in"] },
    { level: "MUST", text: "Trim values so a trailing space from text expansion never fails validation.", by: ["review"] },
    { level: "MUST", text: "Checkboxes and radios have no dead zones: label and control share one hit target.", by: ["review"] },
  ]},
  { id: "state", title: "State & navigation", rules: [
    { level: "MUST", text: "The URL reflects state: filters, tabs, pagination, expanded panels.", by: ["review"] },
    { level: "MUST", text: "Back and Forward restore scroll position.", by: ["review"] },
    { level: "MUST", text: "Navigation uses <a> or a router Link (Button asChild) so Cmd/Ctrl/middle-click work.", by: ["built-in"] },
    { level: "NEVER", text: "Put click handlers on <div> or <span>.", by: ["lint:G06"] },
  ]},
  { id: "feedback", title: "Feedback", rules: [
    { level: "SHOULD", text: "Update optimistically, reconcile with the server, roll back or offer Undo on failure.", by: ["review"] },
    { level: "MUST", text: "Destructive actions need a confirmation (AlertDialog) or an Undo window.", by: ["built-in", "review"] },
    { level: "MUST", text: "Toasts and save status announce through a polite live region (Toaster, SaveStatus, SaveBar).", by: ["built-in", "test"] },
    { level: "SHOULD", text: "Items that open a follow-up and loading states end with …: “Ganti nama…”, “Menyimpan…”.", by: ["lint:G04"] },
  ]},
  { id: "touch", title: "Touch, drag & tooltips", rules: [
    { level: "MUST", text: "The first tooltip waits; neighbours open instantly (Radix TooltipProvider defaults).", by: ["built-in", "test"] },
    { level: "MUST", text: "Modals, sheets and drawers set overscroll-behavior: contain (globals.css, v7).", by: ["built-in", "test"] },
    { level: "MUST", text: "While dragging, disable text selection and mark dragged elements inert.", by: ["review"] },
    { level: "MUST", text: "Every drag has a click and keyboard alternative (Kanban card sheet status change, Nested list keyboard moves).", by: ["built-in", "review"] },
    { level: "MUST", text: "If it looks clickable, it is clickable.", by: ["review"] },
    { level: "SHOULD", text: "Autofocus a single primary input on desktop; rarely on mobile.", by: ["review"] },
  ]},
  { id: "animation", title: "Animation", rules: [
    { level: "MUST", text: "Honor prefers-reduced-motion (globals.css).", by: ["built-in"] },
    { level: "MUST", text: "Animate transform and opacity only.", by: ["lint:G02"] },
    // agere-guidelines-ignore G02 rule text names the anti-pattern it forbids
    { level: "NEVER", text: "Animate top, left, width or height. (v7: Sidebar collapse snaps; a transform slide is planned for 7.1.)", by: ["lint:G02"] },
    // agere-guidelines-ignore G01 rule text names the anti-pattern it forbids
    { level: "NEVER", text: "Use transition: all. List the properties.", by: ["lint:G01"] },
    { level: "SHOULD", text: "Match the easing to the change: ease-standard, ease-enter, ease-exit tokens.", by: ["tokens"] },
    { level: "MUST", text: "Animations can be interrupted; autoplay only muted, non-essential loops, with pause after 5\u00a0s.", by: ["review"] },
    { level: "MUST", text: "transform-origin sits where the motion physically starts; SVG transforms go on a <g> with transform-box: fill-box.", by: ["review"] },
  ]},
  { id: "layout", title: "Layout", rules: [
    { level: "MUST", text: "Align deliberately to the grid, a baseline, an edge or an optical centre.", by: ["review"] },
    { level: "MUST", text: "Check mobile, laptop and ultra-wide (50% zoom).", by: ["test", "review"] },
    { level: "MUST", text: "Respect safe areas with env(safe-area-inset-*) (Drawer does).", by: ["review"] },
    { level: "MUST", text: "No unwanted scrollbars; fix overflow at the source.", by: ["test"] },
  ]},
  { id: "content", title: "Content & accessibility", rules: [
    { level: "MUST", text: "Skeletons mirror the final content so nothing shifts.", by: ["review"] },
    { level: "MUST", text: "<title> matches the current context.", by: ["review"] },
    { level: "MUST", text: "No dead ends: empty and error states offer a next step (EmptyState actions).", by: ["review"] },
    { level: "MUST", text: "Status is never colour alone: pair it with text or an icon label.", by: ["review"] },
    { level: "MUST", text: "Accessible names exist even when the visual label is omitted; decoration is aria-hidden.", by: ["test"] },
    { level: "MUST", text: "Use the … character, never three periods.", by: ["lint:G04"] },
    { level: "MUST", text: "Headings are hierarchical and clear sticky headers (scroll-margin-top, globals.css v7).", by: ["built-in", "test"] },
    { level: "MUST", text: "Layouts survive short, average and very long user content; flex children get min-w-0.", by: ["review"] },
    { level: "MUST", text: "Dates, times, numbers and currency follow the locale; agere defaults to id-ID.", by: ["built-in", "test"] },
    { level: "MUST", text: "Glue numbers to units and keys with a no-break space: 10\u00a0MB, ⌘\u00a0K.", by: ["lint:G11"] },
    { level: "MUST", text: "Images have explicit width and height (no layout shift).", by: ["lint:G09"] },
    { level: "MUST", text: "The brand is lowercase “agere” in visible copy; the legal name PT Agere Teknologi Indonesia keeps its casing.", by: ["lint:G10"] },
  ]},
  { id: "design", title: "Visual design", rules: [
    { level: "MUST", text: "Text meets WCAG 2.1 AA and APCA (Lc 60 body, Lc 45 UI); boundaries and focus meet 3:1.", by: ["tokens", "test"] },
    { level: "MUST", text: "Hover and active increase contrast: primary-hover, *-solid-hover, never a faded /90.", by: ["tokens", "test"] },
    { level: "SHOULD", text: "Shadows layer ambient and direct light (Geist materials in shadow.elevation-*).", by: ["tokens"] },
    { level: "SHOULD", text: "Nested radii are concentric: child ≤ parent.", by: ["review"] },
    { level: "MUST", text: "Charts use the validated colour-blind-safe chart palette and label series directly.", by: ["tokens", "review"] },
    { level: "MUST", text: "Dark themes set color-scheme: dark (globals.css).", by: ["built-in", "test"] },
  ]},
];

export const allRules = (): Rule[] => RULE_GROUPS.flatMap((g) => g.rules);
export const isAutomated = (r: Rule): boolean => r.by.some((b) => b !== "review");
