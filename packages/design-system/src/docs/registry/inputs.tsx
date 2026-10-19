import * as React from "react";
import {
  AlignCenter, AlignLeft, AlignRight, ArrowRight, AtSign, Bell, ChevronDown, ChevronLeft, ChevronRight, Copy, Download, ExternalLink, Filter,
  MousePointerClick, Pencil, Plus, Rows3, Save, SlidersHorizontal, SquareCheck, TextCursorInput, ToggleRight, CircleDot, ListChecks, Trash2, Settings,
} from "lucide-react";

import { Button, ButtonGroup, IconButton } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { Input, PasswordInput, SearchInput } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioCard, RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField } from "@/components/ui/form";
import type { ComponentDoc } from "./types";

const Row = ({ children, label }: { children: React.ReactNode; label?: string }) => (
  <div className="grid w-full gap-2">
    {label && <p className="text-xs font-medium text-muted-foreground text-subtle">{label}</p>}
    <div className="flex flex-wrap items-center gap-3">{children}</div>
  </div>
);

export const inputDocs: ComponentDoc[] = [
  /* ------------------------------------------------------------------ */
  {
    id: "button",
    name: "Button",
    category: "Actions & Inputs",
    level: "Atom",
    status: "stable",
    icon: MousePointerClick,
    summary: "Triggers an action. shadcn/ui variants — default (primary fill), secondary (gray fill), outline, ghost, destructive, link — plus agere destructive-outline, loading and icon slots.",
    demo: () => {
      const [loading, setLoading] = React.useState(false);
      return (
        <>
          <Button leadingIcon={<Plus />}>New event</Button>
          <Button variant="outline" trailingIcon={<ChevronDown />}>Export</Button>
          <Button variant="ghost" leadingIcon={<Settings />}>Settings</Button>
          <Button variant="destructive-outline" leadingIcon={<Trash2 />}>Delete</Button>
          <Button loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1600); }}>
            {loading ? "Saving…" : "Save changes"}
          </Button>
        </>
      );
    },
    states: () => (
      <div className="grid w-full gap-6">
        <Row label="Variants">
          <Button>Default</Button><Button variant="secondary">Secondary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button><Button variant="destructive-outline">Destructive outline</Button><Button variant="link">Link</Button>
        </Row>
        <Row label="Sizes — xs 24 · sm 32 · md 40 (default) · lg 48 (md/lg match Input)">
          <Button size="xs">Extra small</Button><Button size="sm">Small</Button><Button size="md">Medium</Button><Button size="lg">Large</Button>
        </Row>
        <Row label="Leading & trailing icons">
          <Button leadingIcon={<Plus />}>Leading icon</Button>
          <Button variant="outline" trailingIcon={<ChevronDown />}>Trailing icon</Button>
          <Button variant="outline" leadingIcon={<Download />} trailingIcon={<ChevronDown />}>Both</Button>
          <Button variant="ghost" trailingIcon={<ExternalLink />}>Open docs</Button>
          <Button variant="link" trailingIcon={<ArrowRight />}>Learn more</Button>
        </Row>
        <Row label="Button group">
          <ButtonGroup aria-label="Save options">
            <Button leadingIcon={<Save />}>Save</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button size="icon" aria-label="More save options"><ChevronDown /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end"><DropdownMenuItem>Save as draft</DropdownMenuItem><DropdownMenuItem>Save and publish</DropdownMenuItem></DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
          <ButtonGroup aria-label="Range" variant="outline"><Button>Day</Button><Button>Week</Button><Button>Month</Button></ButtonGroup>
        </Row>
        <Row label="Icon buttons (label required)">
          <IconButton label="Copy link" icon={<Copy />} variant="outline" />
          <IconButton label="Notifications" icon={<Bell />} />
          <IconButton label="Add" icon={<Plus />} variant="default" size="lg" />
        </Row>
        <Row label="States">
          <Button disabled>Disabled</Button><Button variant="outline" disabled>Disabled</Button><Button loading>Loading</Button>
          <Button shape="pill" variant="outline">Pill</Button>
        </Row>
      </div>
    ),
    code: `import { Button, IconButton } from "@/components/agere-ds";

<Button leadingIcon={<Plus />}>New event</Button>
<Button variant="outline" trailingIcon={<ChevronDown />}>Export</Button>
<Button variant="outline" leadingIcon={<Download />} trailingIcon={<ChevronDown />}>Download</Button>
<Button variant="ghost" size="sm">Edit</Button>
<Button loading={saving}>Save changes</Button>
<IconButton label="Copy link" icon={<Copy />} />   // label → aria-label + tooltip
<Button asChild><a href="/billing">Upgrade</a></Button>`,
    specs: [
      ["Height", "xs 24 · sm 32 · md 40 · lg 48 px (component.button.height.*) — md/lg line up with Input md/lg"],
      ["Icon button", "icon-xs 24 · icon-sm 28 · icon 36 · icon-lg 40 (square)"],
      ["Radius", "radius.control = 6 px"],
      ["Padding-x", "8 · 10 · 14 · 16 px"],
      ["Type", "label-md — Geist 500 14/16 (xs uses 12 px)"],
      ["Icons", "leadingIcon / trailingIcon · 16px (md, lg) · 14px (sm) · 12px (xs) · gap 6px · decorative (aria-hidden)"],
      ["Primary", "bg brand.default · text brand.fg · shadow.button-solid → -hover → -active"],
      ["Secondary", "bg bg.default · border border.default · shadow.button-outline"],
      ["Focus", "2px outline focus.ring, offset 2px (survives forced-colors)"],
      ["Disabled", "opacity.disabled (0.4), pointer-events none"],
    ],
    dos: [
      "One primary button per view or dialog — it marks the most likely next step.",
      "Start labels with a verb and name the object: “Save changes”, “Invite member”.",
      "Place the primary action last (right) in a button group; secondary to its left.",
      "Use `loading` for async submits so the button keeps its width and blocks double-submits.",
      "Pair a button with the field it sits next to: Button lg beside a default (lg) Input, Button md beside an Input md.",
      "Leading icon = what the action is (+ New, ⬇ Download). Trailing icon = what happens next (▾ opens a menu, ↗ leaves the app, → continues).",
    ],
    donts: [
      "Don’t use a link styled as a button for navigation inside forms — use a real link.",
      "Don’t disable a submit button to signal invalid input; let the user submit and show errors.",
      "Don’t ship an icon-only button without a label (IconButton enforces this in types).",
      "Don’t stack two primary buttons side by side.",
      "Don’t put an icon on both sides unless the trailing one signals behaviour (menu, external link).",
    ],
    a11y: {
      role: "button (native <button type=\"button\">; submit only when inside a form)",
      keyboard: [["Enter / Space", "Activate"], ["Tab", "Move focus to / from the button"]],
      notes: [
        "`loading` sets aria-busy and swallows clicks; the visible label should change to the progressive (“Saving…”).",
        "`asChild` renders your <a>/<Link>: disabled links get aria-disabled instead of the disabled attribute.",
        "Target size ≥ 24×24 px at every size (WCAG 2.2 SC 2.5.8). Use lg (36px) for primary mobile CTAs.",
        "Brand text contrast: 17.4:1 (ink) — white-label brands are validated by applyBrandColor().",
      ],
    },
    interaction: [
      "Hover: primary darkens to brand.emphasis and the top highlight strengthens (150ms, ease-standard).",
      "Active: inset shadow (button-solid-active) — a physical ‘press’ without scale jank.",
      "Loading: spinner replaces the start icon; width is preserved.",
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    id: "button-group",
    name: "Button group",
    category: "Actions & Inputs",
    level: "Molecule",
    status: "new",
    icon: Rows3,
    summary: "Related actions joined into one control: attached (shared borders, outer corners rounded) or spaced. Sets size and variant for its buttons; powers split buttons.",
    demo: () => {
      const [align, setAlign] = React.useState("left");
      return (
        <div className="grid justify-items-center gap-6">
          <ButtonGroup aria-label="Save options">
            <Button leadingIcon={<Save />} onClick={() => toast.success("Saved")}>Save</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button size="icon" aria-label="More save options"><ChevronDown /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end"><DropdownMenuItem>Save as draft</DropdownMenuItem><DropdownMenuItem>Save and publish</DropdownMenuItem><DropdownMenuItem>Save as template</DropdownMenuItem></DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
          <ButtonGroup aria-label="Text alignment" variant="outline">
            {([["left", AlignLeft], ["center", AlignCenter], ["right", AlignRight]] as const).map(([v, I]) => (
              <Button key={v} size="icon" aria-label={`Align ${v}`} aria-pressed={align === v} onClick={() => setAlign(v)} className={align === v ? "bg-subtle text-emphasis" : undefined}><I /></Button>
            ))}
          </ButtonGroup>
          <ButtonGroup aria-label="Week navigation" variant="outline">
            <Button size="icon" aria-label="Previous week"><ChevronLeft /></Button>
            <Button>Today</Button>
            <Button size="icon" aria-label="Next week"><ChevronRight /></Button>
          </ButtonGroup>
        </div>
      );
    },
    states: () => (
      <div className="grid w-full gap-6">
        <Row label="Attached — secondary · primary · sizes">
          <ButtonGroup aria-label="Range" variant="outline"><Button>Day</Button><Button>Week</Button><Button>Month</Button></ButtonGroup>
          <ButtonGroup aria-label="Publish"><Button>Publish</Button><Button size="icon" aria-label="Publish options"><ChevronDown /></Button></ButtonGroup>
          <ButtonGroup aria-label="Small range" variant="outline" size="sm"><Button>1D</Button><Button>1W</Button><Button>1M</Button><Button>1Y</Button></ButtonGroup>
        </Row>
        <Row label="With leading icons">
          <ButtonGroup aria-label="Row actions" variant="outline">
            <Button leadingIcon={<Pencil />}>Edit</Button><Button leadingIcon={<Copy />}>Duplicate</Button><Button leadingIcon={<Trash2 />}>Delete</Button>
          </ButtonGroup>
        </Row>
        <Row label="Spaced (attached={false}) — dialog footer / toolbar">
          <ButtonGroup aria-label="Dialog actions" attached={false}><Button variant="outline">Cancel</Button><Button>Continue</Button></ButtonGroup>
          <ButtonGroup aria-label="Filters" attached={false} variant="outline" size="sm"><Button leadingIcon={<Filter />}>Filter</Button><Button leadingIcon={<Rows3 />}>Group</Button></ButtonGroup>
        </Row>
        <Row label="Vertical · full width">
          <div className="w-56"><ButtonGroup aria-label="Export format" orientation="vertical" variant="outline" fullWidth><Button>CSV</Button><Button>Excel</Button><Button>PDF</Button></ButtonGroup></div>
        </Row>
      </div>
    ),
    code: `import { Button, ButtonGroup } from "@/components/agere-ds";

// Split button
<ButtonGroup aria-label="Save options">
  <Button leadingIcon={<Save />} onClick={save}>Save</Button>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button size="icon" aria-label="More save options"><ChevronDown /></Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">…</DropdownMenuContent>
  </DropdownMenu>
</ButtonGroup>

// Segmented actions — the group sets variant/size for every child
<ButtonGroup aria-label="Range" variant="outline" size="sm">
  <Button>Day</Button><Button>Week</Button><Button>Month</Button>
</ButtonGroup>

// Spaced group (dialog footer)
<ButtonGroup aria-label="Dialog actions" attached={false}>
  <Button variant="outline">Cancel</Button><Button>Continue</Button>
</ButtonGroup>`,
    specs: [
      ["Attached", "shared 1px border (−1px overlap), outer corners radius.control, inner corners square"],
      ["Divider on solid fills", "brand.fg @ 25% between primary buttons"],
      ["Spaced", "gap 8px (space.2), wraps on narrow screens"],
      ["Props", "aria-label (required) · orientation · attached · size · variant · fullWidth"],
      ["Stacking", "hovered child z-1, focused child z-10 so the focus ring is never clipped"],
    ],
    dos: [
      "Use for 2–5 tightly related actions; a split button is primary action + ▾ menu of alternatives.",
      "Give every icon-only child an aria-label (e.g. “More save options”).",
      "Keep one variant per attached group.",
    ],
    donts: [
      "Don’t use a ButtonGroup for a single-choice state (view mode, tabs) — use SegmentedControl or Tabs, which expose the selected state.",
      "Don’t mix primary and secondary buttons inside an attached group.",
      "Don’t put more than one primary action in a group.",
    ],
    a11y: {
      role: "group (aria-label required by type); each button is its own tab stop",
      keyboard: [["Tab / Shift+Tab", "Move between buttons in the group"], ["Enter / Space", "Activate"], ["↓ / Enter", "Open the split-button menu"]],
      notes: [
        "Toggle-style groups set aria-pressed on each button.",
        "Focus ring renders above neighbours (z-10) so it is never hidden by the overlapping border.",
      ],
    },
    interaction: ["Hover lifts the hovered child above its neighbours so its border color is fully visible.", "Split-button menu aligns to the group’s end edge."],
  },
  /* ------------------------------------------------------------------ */
  {
    id: "input",
    name: "Input",
    category: "Actions & Inputs",
    level: "Atom",
    status: "stable",
    icon: TextCursorInput,
    summary: "Single-line text entry with text, password (reveal toggle), search (clear + shortcut hint) and addon variants.",
    demo: () => {
      const [q, setQ] = React.useState("");
      return (
        <div className="grid w-full max-w-sm gap-4">
          <FormField label="Email" hint="We’ll send the booking confirmation here.">
            <FormControl><Input type="email" placeholder="nama@perusahaan.com" leadingIcon={<AtSign />} /></FormControl>
          </FormField>
          <FormField label="Password" error="Use at least 8 characters.">
            <FormControl><PasswordInput defaultValue="agere" /></FormControl>
          </FormField>
          <FormField label="Search events" hideLabel>
            <FormControl><SearchInput placeholder="Search events…" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} shortcut="/" /></FormControl>
          </FormField>
          <FormField label="Public link">
            <FormControl><Input addonStart="agere.id/" defaultValue="bubus/30min" /></FormControl>
          </FormField>
        </div>
      );
    },
    states: () => (
      <div className="grid w-full max-w-sm gap-3">
        {/* v7: the labels now match the props (6.4 labelled the default-size field "Large"). */}
        <Input size="lg" placeholder="Large · 48 px…" aria-label="Large" />
        <Input placeholder="Medium · 40 px (default)…" aria-label="Medium" />
        <SearchInput size="lg" placeholder="Search · 48 px…" aria-label="Search" shortcut="/" />
        <SearchInput placeholder="Toolbar search · 40 px (default)…" aria-label="Toolbar search" />
        <Input disabled placeholder="Disabled" aria-label="Disabled" />
        <Input readOnly defaultValue="Read-only value" aria-label="Read only" />
        <Input aria-invalid defaultValue="Invalid value" aria-label="Invalid" />
        <Textarea placeholder="Textarea — autoResize grows to maxRows" autoResize aria-label="Notes" />
      </div>
    ),
    code: `<FormField label="Email" hint="We’ll send the confirmation here." error={errors.email}>
  <FormControl>
    <Input type="email" autoComplete="email" leadingIcon={<AtSign />} />
  </FormControl>
</FormField>

<PasswordInput autoComplete="new-password" />
<SearchInput value={q} onChange={…} onClear={() => setQ("")} shortcut="/" />
<Input addonStart="agere.id/" />`,
    specs: [
      ["Sizes", "Two only: lg 40px (DEFAULT) · md 36px — component.input.height.{lg,md}"],
      ["When md", "Dense UI only: toolbars, filter bars, table footers, popovers, inline editors"],
      ["Padding-x / text", "lg 14px · 16px text (no iOS focus zoom) · md 12px · 14px text"],
      ["Radius", "radius.control (6 px)"],
      ["Border", "border.control — 3.4:1 vs canvas (WCAG 1.4.11)"],
      ["Hover / focus border", "fg.subtle + 2px focus outline at 35%"],
      ["Placeholder", "fg.muted — 4.8:1 on white"],
      ["Invalid", "error.solid border; message in error.fg with icon"],
    ],
    dos: [
      "Always pair with a visible label (FormField). Placeholder is an example, not a label.",
      "Set `type`, `inputMode` and `autoComplete` — it drives mobile keyboards and password managers.",
      "Keep hint text visible when an error appears; the error adds, it doesn’t replace.",
      "Size the field to the expected input (postal code ≠ full width).",
      "Use the default Large (40px) in forms, dialogs, auth and checkout; switch to size=\"md\" only inside dense toolbars and popovers.",
    ],
    donts: [
      "Don’t validate on every keystroke; validate on blur, re-validate on change once invalid.",
      "Don’t use placeholder text for critical instructions — it disappears on typing.",
      "Don’t disable paste on password or OTP fields.",
      "Don’t mix Large and Medium fields in the same form.",
    ],
    a11y: {
      role: "textbox / searchbox (native input)",
      keyboard: [["Tab", "Focus field"], ["Esc", "SearchInput: browser clears (we hide the native ×)"], ["Enter / Space", "Password reveal toggle"]],
      notes: [
        "FormControl injects id, aria-describedby (hint + error), aria-invalid and aria-required.",
        "Password toggle is a real button with aria-pressed + aria-controls; the value is never announced.",
        "Leading icons are aria-hidden; they must not carry meaning.",
      ],
    },
    content: ["Labels: sentence case, no colon, ≤ 3 words (“Work email”).", "Placeholder: an example value (“nama@perusahaan.com”), never “Enter your email”."],
  },
  /* ------------------------------------------------------------------ */
  {
    id: "select",
    name: "Select",
    category: "Actions & Inputs",
    level: "Molecule",
    status: "stable",
    icon: ChevronDown,
    summary: "Choose one value from a short list (≤ 15). Styled as an Input; opens a listbox with typeahead.",
    demo: () => (
      <div className="w-full max-w-xs">
        <FormField label="Event duration">
          <Select defaultValue="30">
            <FormControl><SelectTrigger><SelectValue placeholder="Pick a duration" /></SelectTrigger></FormControl>
            <SelectContent>
              {["15", "30", "45", "60", "90"].map((m) => <SelectItem key={m} value={m}>{m} minutes</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
      </div>
    ),
    code: `<Select value={duration} onValueChange={setDuration}>
  <SelectTrigger aria-label="Event duration"><SelectValue placeholder="Pick a duration" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="30">30 minutes</SelectItem>
  </SelectContent>
</Select>`,
    dos: ["Order options logically (numeric, chronological) or by frequency — not alphabetically by default.", "Use RadioGroup when there are ≤ 4 options that benefit from being visible at once."],
    donts: ["Don’t use Select for > 15 options — use a combobox with search.", "Don’t use Select for navigation (it’s not a menu)."],
    a11y: {
      role: "combobox → listbox",
      keyboard: [["Enter / Space / ↓", "Open"], ["↑ / ↓", "Move"], ["Home / End", "First / last"], ["Type a letter", "Typeahead"], ["Esc", "Close without change"]],
      notes: ["Selected value is announced on the trigger.", "Popover content is portaled; focus returns to the trigger."],
    },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "checkbox",
    name: "Checkbox",
    category: "Actions & Inputs",
    level: "Atom",
    status: "stable",
    icon: SquareCheck,
    summary: "Select any number of options, or confirm a single statement. Supports indeterminate for parent rows.",
    demo: () => {
      const [items, setItems] = React.useState({ email: true, sms: false, wa: true });
      const all = Object.values(items).every(Boolean);
      const some = Object.values(items).some(Boolean);
      return (
        <fieldset className="grid gap-3">
          <legend className="mb-2 text-sm font-medium text-emphasis">Reminders</legend>
          <div className="flex items-center gap-2">
            <Checkbox id="all" checked={all ? true : some ? "indeterminate" : false} onCheckedChange={(v) => setItems({ email: !!v, sms: !!v, wa: !!v })} />
            <Label htmlFor="all">All channels</Label>
          </div>
          {(["email", "sms", "wa"] as const).map((k) => (
            <div key={k} className="ml-6 flex items-center gap-2">
              <Checkbox id={k} checked={items[k]} onCheckedChange={(v) => setItems((s) => ({ ...s, [k]: !!v }))} />
              <Label htmlFor={k} className="font-normal text-default">{{ email: "Email", sms: "SMS", wa: "WhatsApp" }[k]}</Label>
            </div>
          ))}
        </fieldset>
      );
    },
    code: `<div className="flex items-center gap-2">
  <Checkbox id="terms" checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} />
  <Label htmlFor="terms">I agree to the Terms</Label>
</div>`,
    specs: [["Box", "16px, radius.sm (4px), hit area extended to 24px"], ["Unchecked border", "border.control (3.4:1)"], ["Checked", "brand.default fill, brand.fg check"]],
    dos: ["Group related checkboxes in a <fieldset> with a <legend>.", "Phrase labels positively (“Send reminders”, not “Don’t send reminders”)."],
    donts: ["Don’t use a checkbox for an immediate on/off setting — use Switch.", "Don’t make the label unclickable; always associate with htmlFor/id."],
    a11y: { role: "checkbox (aria-checked true | false | mixed)", keyboard: [["Space", "Toggle"], ["Tab", "Next control"]], notes: ["Indeterminate announces as “mixed”.", "Invalid state: aria-invalid + border error.solid."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "radio",
    name: "Radio group",
    category: "Actions & Inputs",
    level: "Atom",
    status: "stable",
    icon: CircleDot,
    summary: "Pick exactly one of 2–5 visible options. RadioCard gives plan / event-type pickers a larger target.",
    demo: () => (
      <div className="grid w-full max-w-md gap-6">
        <RadioGroup defaultValue="video" aria-label="Location">
          {[["video", "agere Video"], ["phone", "Phone call"], ["office", "In person"]].map(([v, l]) => (
            <div key={v} className="flex items-center gap-2"><RadioGroupItem value={v} id={`r-${v}`} /><Label htmlFor={`r-${v}`} className="font-normal text-default">{l}</Label></div>
          ))}
        </RadioGroup>
        <RadioGroup defaultValue="team" aria-label="Plan" className="gap-2">
          <RadioCard value="free" title="Free" description="1 user, unlimited event types" />
          <RadioCard value="team" title="Team" description="Round-robin, collective events, workflows" />
        </RadioGroup>
      </div>
    ),
    code: `<RadioGroup value={plan} onValueChange={setPlan} aria-label="Plan">
  <RadioCard value="team" title="Team" description="Round-robin & workflows" />
</RadioGroup>`,
    dos: ["Pre-select the safest or most common option.", "Keep options mutually exclusive and exhaustive."],
    donts: ["Don’t use radios for > 5 options — use Select.", "Don’t mix radio and checkbox semantics in one group."],
    a11y: { role: "radiogroup > radio", keyboard: [["Tab", "Enter group (focus lands on checked item)"], ["↑ / ↓ / ← / →", "Move + select"], ["Space", "Select focused"]], notes: ["One tab stop per group (roving tabindex).", "Label the group with aria-label or a legend."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "switch",
    name: "Switch",
    category: "Actions & Inputs",
    level: "Atom",
    status: "stable",
    icon: ToggleRight,
    summary: "Turns a setting on or off with immediate effect — shadcn 32×18 switch.",
    demo: () => {
      const [on, setOn] = React.useState(true);
      return (
        <div className="grid w-full max-w-md gap-4">
          <div className="flex items-start justify-between gap-6 rounded-xl border border-subtle bg-default p-4">
            <div className="grid gap-0.5">
              <Label htmlFor="sw1">Require confirmation</Label>
              <p id="sw1-d" className="text-sm text-subtle">New bookings stay pending until you approve them.</p>
            </div>
            <Switch id="sw1" aria-describedby="sw1-d" checked={on} onCheckedChange={setOn} />
          </div>
          <div className="flex items-center gap-3"><Switch size="sm" id="sw2" /><Label htmlFor="sw2" className="font-normal">Small</Label><Switch disabled id="sw3" aria-label="Disabled" /></div>
        </div>
      );
    },
    code: `<Label htmlFor="confirm">Require confirmation</Label>
<Switch id="confirm" checked={on} onCheckedChange={save} />`,
    specs: [["Track", "md 36×20 · sm 28×16; off = bg.emphasis + border.control; on = brand"], ["Thumb", "bg.default, shadow.switch-thumb, ease-emphasized 150ms"]],
    dos: ["Apply the change immediately and confirm with a toast when it has side effects.", "Label describes the ON state (“Require confirmation”)."],
    donts: ["Don’t use a switch inside a form that needs a Save button — use Checkbox.", "Don’t add “On/Off” text next to the switch; state is announced."],
    a11y: { role: "switch (aria-checked)", keyboard: [["Space / Enter", "Toggle"]], notes: ["Off track has a 3.4:1 border so the control is identifiable without color.", "Forced-colors: border falls back to CanvasText."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "slider",
    name: "Slider",
    category: "Actions & Inputs",
    level: "Atom",
    status: "stable",
    icon: SlidersHorizontal,
    summary: "Pick a value or range where approximate is fine (buffer time, price filter).",
    demo: () => {
      const [v, setV] = React.useState([15]);
      const [range, setRange] = React.useState([100, 450]);
      return (
        <div className="grid w-full max-w-sm gap-8">
          <div className="grid gap-3">
            <div className="flex justify-between text-sm"><span className="font-medium text-emphasis" id="buf">Buffer after event</span><span className="tabular-nums text-subtle">{v[0]} min</span></div>
            <Slider value={v} onValueChange={setV} max={60} step={5} thumbLabels={["Buffer after event"]} getValueText={(n) => `${n} minutes`} />
          </div>
          <div className="grid gap-3">
            <div className="flex justify-between text-sm"><span className="font-medium text-emphasis">Price</span><span className="tabular-nums text-subtle">Rp{range[0]}k – Rp{range[1]}k</span></div>
            <Slider value={range} onValueChange={setRange} min={0} max={500} step={10} thumbLabels={["Minimum price", "Maximum price"]} getValueText={(n) => `Rp ${n} ribu`} />
          </div>
        </div>
      );
    },
    code: `<Slider value={v} onValueChange={setV} max={60} step={5}
  thumbLabels={["Buffer after event"]} getValueText={(n) => \`\${n} minutes\`} />`,
    dos: ["Always show the current value as text next to the label.", "Offer a numeric Input as well when exact values matter."],
    donts: ["Don’t use a slider for precise entry (phone, money to the rupiah)."],
    a11y: { role: "slider (aria-valuenow / aria-valuetext)", keyboard: [["← / →", "± step"], ["PageUp / PageDown", "± 10 steps"], ["Home / End", "Min / max"]], notes: ["Every thumb needs a label; range sliders name both ends.", "aria-valuetext gives units (“15 minutes”)."] },
  },
  /* ------------------------------------------------------------------ */
  {
    id: "form",
    name: "Form layout",
    category: "Data & Complex",
    level: "Organism",
    status: "new",
    icon: ListChecks,
    summary: "FormSection (settings two-column), FormField (label/hint/error wiring), FormRow, FormActions and an error summary.",
    demo: () => {
      const [submitted, setSubmitted] = React.useState(false);
      const [name, setName] = React.useState("");
      const nameError = submitted && !name ? "Enter your full name." : undefined;
      return (
        <form className="w-full max-w-3xl rounded-xl border border-subtle bg-default p-6" noValidate onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <section className="grid gap-5 lg:grid-cols-[1fr_2fr] lg:gap-10">
            <div className="grid content-start gap-1"><h3 className="type-heading-md">Profile</h3><p className="text-sm text-subtle">Shown on your public booking page.</p></div>
            <div className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Full name" required error={nameError}>
                  <FormControl><Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></FormControl>
                </FormField>
                <FormField label="Username" hint="Letters, numbers and dashes.">
                  <FormControl><Input addonStart="agere.id/" defaultValue="bubus" /></FormControl>
                </FormField>
              </div>
              <FormField label="About" optional>
                <FormControl><Textarea placeholder="A sentence about you" /></FormControl>
              </FormField>
            </div>
          </section>
          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-subtle pt-4 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => { setSubmitted(false); setName(""); }}>Reset</Button>
            <Button type="submit">Save profile</Button>
          </div>
        </form>
      );
    },
    code: `<form noValidate onSubmit={submit}>
  <FormErrorSummary errors={errors} />
  <FormSection title="Profile" description="Shown on your public booking page.">
    <FormRow>
      <FormField label="Full name" required error={errors.name}>
        <FormControl><Input autoComplete="name" /></FormControl>
      </FormField>
      <FormField label="Username" hint="Letters, numbers and dashes.">
        <FormControl><Input addonStart="agere.id/" /></FormControl>
      </FormField>
    </FormRow>
  </FormSection>
  <FormActions>
    <Button variant="outline">Cancel</Button>
    <Button type="submit">Save profile</Button>
  </FormActions>
</form>`,
    specs: [["Field gap", "label→control 6px · field→field 20px · section padding 32px"], ["Section grid", "lg: 1fr / 2fr, gap 40px"], ["Actions", "Right-aligned, primary last; stacked full-width < sm"]],
    dos: ["Single column for data entry; pair fields in a FormRow only when they’re read together (first/last name).", "Mark the minority: if most fields are required, label the optional ones.", "On submit, show FormErrorSummary and move focus to it."],
    donts: ["Don’t use multi-column forms for long flows — scanning zig-zags.", "Don’t clear the user’s input when validation fails."],
    a11y: { notes: ["FormSection is a <section> labelled by its heading.", "Errors are tied via aria-describedby and summarized in a role=alert region that links to each field (WCAG 3.3.1, 3.3.3).", "Required = native `required`/aria-required + visual asterisk or ‘(optional)’ on the rest."] },
  },
];

