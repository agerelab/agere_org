import * as React from "react";
import { CalendarDays, ChevronsUpDown, Compass, KeyRound, PanelBottom, Search, Calculator, Settings, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker";
import { Combobox } from "@/components/ui/combobox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { MarketingNavbar } from "@/blocks/marketing";
import type { ComponentDoc } from "./types";

const FRAMEWORKS = [
  { value: "next", label: "Next.js", group: "React" }, { value: "remix", label: "React Router", group: "React" }, { value: "astro", label: "Astro", group: "Other" },
  { value: "nuxt", label: "Nuxt", group: "Vue" }, { value: "sveltekit", label: "SvelteKit", group: "Other" }, { value: "laravel", label: "Laravel", group: "Other", keywords: ["php", "inertia"] },
];

export const shadcnV61Docs: ComponentDoc[] = [
  {
    id: "calendar", name: "Calendar", category: "Actions & Inputs", level: "Molecule", status: "new", icon: CalendarDays,
    summary: "Date grid on react-day-picker 10 — single, multiple and range selection, dropdown captions, disabled days, locales. Barrel name: DateCalendar (Calendar is the workspace event calendar).",
    demo: () => {
      const [d, setD] = React.useState<Date | undefined>(new Date(2026, 8, 25));
      return <div className="flex flex-wrap gap-4"><Calendar mode="single" selected={d} onSelect={setD} defaultMonth={new Date(2026, 8, 1)} className="rounded-lg border border-border shadow-sm" /><Calendar mode="range" numberOfMonths={1} captionLayout="dropdown" defaultMonth={new Date(2026, 8, 1)} selected={{ from: new Date(2026, 8, 8), to: new Date(2026, 8, 13) }} className="rounded-lg border border-border shadow-sm" /></div>;
    },
    code: `import { Calendar } from "@/components/ui/calendar";   // or { DateCalendar } from "@/components/agere-ds"

<Calendar mode="single" selected={date} onSelect={setDate} className="rounded-lg border" />
<Calendar mode="range" numberOfMonths={2} captionLayout="dropdown" selected={range} onSelect={setRange} />`,
    specs: [["Cell", "--cell-size 2rem (override per instance)"], ["Selected", "bg-primary · text-primary-foreground"], ["Range middle", "bg-accent"], ["Today", "bg-accent"]],
    dos: ["Disable impossible dates (past delivery slots, Sundays) instead of rejecting them after submit.", "Pass `locale` for Bahasa Indonesia month and day names."],
    donts: ["Don't use a calendar for dates far in the past (birthdays) — use three inputs or a dropdown caption."],
    a11y: { role: "grid", keyboard: [["← → ↑ ↓", "Day / week"], ["PageUp / PageDown", "Month"], ["Shift + PageUp/Down", "Year"], ["Home / End", "Start / end of week"]], notes: ["Each day is a button whose name is the full date.", "The month caption labels the grid."] },
  },
  {
    id: "date-picker", name: "Date picker", category: "Actions & Inputs", level: "Molecule", status: "new", icon: CalendarDays,
    summary: "DatePicker and DateRangePicker: outline trigger (36px, same as Input) → Popover → Calendar. The trigger's name always includes the current value.",
    demo: () => (
      <div className="grid w-full max-w-sm gap-4">
        <div className="grid gap-2"><Label htmlFor="dp1">Due date</Label><DatePicker id="dp1" defaultValue={new Date(2026, 8, 30)} /></div>
        <div className="grid gap-2"><Label htmlFor="dp2">Reporting period</Label><DateRangePicker id="dp2" defaultValue={{ from: new Date(2026, 8, 1), to: new Date(2026, 8, 30) }} /></div>
      </div>
    ),
    code: `<Label htmlFor="due">Due date</Label>
<DatePicker id="due" value={date} onValueChange={setDate} disabledDays={{ before: new Date() }} />
<DateRangePicker label="Period" value={range} onValueChange={setRange} numberOfMonths={2} />`,
    specs: [["Trigger", "Button outline · h-9 · CalendarIcon leading"], ["Format", "date-fns — PPP (single), LLL d, y (range); pass locale"], ["Popover", "p-0 · align start · focus moves into the grid"]],
    dos: ["Wrap in FormField / FormControl — id, aria-invalid and aria-describedby pass through.", "Show the format users expect in the hint when typing is also allowed."],
    donts: ["Don't auto-close a range picker after the first click."],
    a11y: { notes: ["Focus returns to the trigger on close (Radix Popover).", "`label` adds the value to the trigger's accessible name when no <label> is associated."] },
  },
  {
    id: "combobox", name: "Combobox", category: "Actions & Inputs", level: "Molecule", status: "new", icon: ChevronsUpDown,
    summary: "Searchable select (Popover + Command): single or multiple, groups, keywords, disabled options.",
    demo: () => (
      <div className="grid w-full max-w-sm gap-4">
        <div className="grid gap-2"><Label htmlFor="cb1">Framework</Label><Combobox id="cb1" options={FRAMEWORKS} placeholder="Select framework…" /></div>
        <div className="grid gap-2"><Label htmlFor="cb2">Frameworks</Label><Combobox id="cb2" multiple defaultValue={["next", "astro"]} options={FRAMEWORKS} /></div>
      </div>
    ),
    code: `<Combobox options={[{ value: "next", label: "Next.js", group: "React" }, …]} value={v} onValueChange={setV} />
<Combobox multiple options={options} value={list} onValueChange={setList} maxShown={2} />`,
    specs: [["Trigger", "role=combobox · outline · min-h-9 (grows with chips)"], ["List", "cmdk · max-h 300px · fuzzy filter on label + keywords"]],
    dos: ["Use when there are ~8+ options or users know what they're looking for.", "Add keywords for synonyms (\"php\" → Laravel, \"mangga\" → Mango)."],
    donts: ["Don't use for 2–5 options — RadioGroup or Select is faster."],
    a11y: { role: "combobox + listbox", keyboard: [["Enter / Space", "Open"], ["Type", "Filter"], ["↑ / ↓", "Move"], ["Enter", "Choose"], ["Esc", "Close"]], notes: ["Selected options carry \", selected\" in their name (cmdk reserves aria-selected for the highlight)."] },
  },
  {
    id: "command", name: "Command", category: "Navigation", level: "Organism", status: "new", icon: Search,
    summary: "shadcn command menu on cmdk — the primitive behind Combobox and ⌘K menus. Barrel name for the item: CommandMenuItem.",
    demo: () => (
      <Command label="Command menu" className="w-full max-w-md rounded-lg border border-border shadow-md">
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions"><CommandItem><CalendarDays />Calendar</CommandItem><CommandItem><Calculator />Calculator</CommandItem></CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings"><CommandItem><User />Profile<CommandShortcut>⌘P</CommandShortcut></CommandItem><CommandItem><Settings />Settings<CommandShortcut>⌘S</CommandShortcut></CommandItem></CommandGroup>
        </CommandList>
      </Command>
    ),
    code: `import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";`,
    dos: ["Use CommandDialog for a global ⌘K menu; CommandPalette stays for simple data-driven palettes."],
    donts: ["Don't nest a Command inside another scrollable list."],
    a11y: { keyboard: [["↑ / ↓", "Move"], ["Enter", "Run"]], notes: ["Focus stays in the input; the active option is aria-activedescendant."] },
  },
  {
    id: "drawer", name: "Drawer", category: "Feedback & Overlay", level: "Organism", status: "new", icon: PanelBottom,
    summary: "Drag-to-dismiss sheet on vaul, from any edge. Mobile action sheets and quick forms; Sheet stays for desktop side panels.",
    demo: () => (
      <Drawer>
        <DrawerTrigger asChild><Button variant="outline">Open drawer</Button></DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader><DrawerTitle>Daily goal</DrawerTitle><DrawerDescription>Set how many interviews to schedule per day.</DrawerDescription></DrawerHeader>
            <p className="px-4 text-center text-6xl font-semibold tabular-nums tracking-tighter">12</p>
            <DrawerFooter><Button>Save</Button><DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose></DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    ),
    code: `<Drawer direction="bottom">   {/* bottom · top · left · right */}
  <DrawerTrigger asChild><Button>Open</Button></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader><DrawerTitle>…</DrawerTitle><DrawerDescription>…</DrawerDescription></DrawerHeader>
    <DrawerFooter><DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose></DrawerFooter>
  </DrawerContent>
</Drawer>`,
    specs: [["Bottom", "rounded-t-lg · max-h 80vh · 100×8 handle"], ["Side", "w-3/4 · sm:max-w-sm"], ["Safe area", "pb env(safe-area-inset-bottom)"]],
    dos: ["Always include a visible Close/Cancel — dragging is not discoverable for everyone."],
    donts: ["Don't put long forms in a bottom drawer; use a page."],
    a11y: { role: "dialog", keyboard: [["Esc", "Close"]], notes: ["Radix Dialog underneath: focus trap, aria-modal, focus return."] },
  },
  {
    id: "input-otp", name: "Input OTP", category: "Actions & Inputs", level: "Molecule", status: "new", icon: KeyRound,
    summary: "One-time-code field on input-otp: one real input behind the slots, so paste, SMS autofill and screen readers work.",
    demo: () => (
      <div className="grid gap-2">
        <Label htmlFor="otp-demo">Verification code</Label>
        <InputOTP id="otp-demo" maxLength={6}><InputOTPGroup><InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /></InputOTPGroup><InputOTPSeparator /><InputOTPGroup><InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} /></InputOTPGroup></InputOTP>
        <p className="text-sm text-muted-foreground">Enter the 6 digits we sent by SMS.</p>
      </div>
    ),
    code: `<InputOTP maxLength={6} onComplete={verify} pattern={REGEXP_ONLY_DIGITS}>
  <InputOTPGroup><InputOTPSlot index={0} />…<InputOTPSlot index={2} /></InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup><InputOTPSlot index={3} />…<InputOTPSlot index={5} /></InputOTPGroup>
</InputOTP>`,
    specs: [["Slot", "size-9 · border-input · shadow-xs"], ["Active", "border-ring + 3px ring"], ["Defaults", "autocomplete=one-time-code · inputmode=numeric"]],
    dos: ["State how many characters are expected and where the code was sent.", "Offer resend with a visible countdown."],
    donts: ["Don't split the code into separate inputs — it breaks paste and autofill."],
    a11y: { notes: ["Label the single input (Label htmlFor / aria-label).", "Announce errors with role=alert and clear the value so users can retype."] },
  },
  {
    id: "navigation-menu", name: "Navigation menu", category: "Navigation", level: "Organism", status: "new", icon: Compass,
    summary: "Site navigation with mega-menu panels sharing one animated viewport (Radix). Marketing sites; apps use Sidebar.",
    demo: () => <div className="w-full rounded-xl border border-border pb-64"><MarketingNavbar /></div>,
    code: `<NavigationMenu aria-label="Main">
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent><ul className="grid w-[520px] grid-cols-2">…<NavigationMenuLink href="/mimo">Mimo</NavigationMenuLink>…</ul></NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem><NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>Pricing</NavigationMenuLink></NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
    dos: ["Give each panel a short description per link — it's a menu of destinations, not actions.", "Pair with a Drawer on mobile (see Blocks → Marketing → Navbar)."],
    donts: ["Don't put buttons that perform actions in a navigation menu."],
    a11y: { role: "navigation", keyboard: [["Tab", "Between top-level items"], ["Enter / Space / ↓", "Open a panel"], ["Esc", "Close"]], notes: ["Triggers expose aria-expanded; links use aria-current via `active`."] },
  },
];
