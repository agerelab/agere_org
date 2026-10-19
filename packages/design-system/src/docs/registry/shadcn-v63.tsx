import * as React from "react";
import { AtSign, Copy, FormInput, LayoutList, Rows3, Search, Send, ShieldCheck, TextCursorInput } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldControl, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/components/ui/item";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Kbd } from "@/components/ui/kbd";
import { toast } from "@/components/ui/toast";
import type { ComponentDoc } from "./types";

export const shadcnV63Docs: ComponentDoc[] = [
  {
    id: "field", name: "Field", category: "Actions & Inputs", level: "Molecule", status: "new", icon: FormInput,
    summary: "shadcn's composable field primitives — FieldSet, FieldLegend, FieldGroup, Field (vertical · horizontal · responsive), FieldLabel, FieldContent, FieldTitle, FieldDescription, FieldError. agere adds FieldControl, which wires id, aria-describedby and aria-invalid for you.",
    demo: () => {
      const [email, setEmail] = React.useState("bubus@");
      const bad = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
      return (
        <FieldSet className="w-full max-w-md">
          <FieldLegend>Account</FieldLegend>
          <FieldGroup>
            <Field invalid={bad}>
              <FieldLabel>Email</FieldLabel>
              <FieldControl><Input value={email} onChange={(e) => setEmail(e.target.value)} /></FieldControl>
              <FieldDescription>Used for sign-in and receipts.</FieldDescription>
              {bad && <FieldError>Enter an email like name@company.com.</FieldError>}
            </Field>
            <Field orientation="horizontal">
              <FieldContent><FieldLabel>Weekly digest</FieldLabel><FieldDescription>A Monday summary of your workspace.</FieldDescription></FieldContent>
              <FieldControl><Switch defaultChecked /></FieldControl>
            </Field>
            <Field orientation="horizontal"><FieldControl><Checkbox defaultChecked /></FieldControl><FieldLabel className="font-normal">Remember this device</FieldLabel></Field>
          </FieldGroup>
        </FieldSet>
      );
    },
    states: () => (
      <RadioGroup aria-label="Plan" defaultValue="pro" className="w-full max-w-md gap-3">
        {[{ v: "starter", t: "Starter", d: "1 project · 3 members" }, { v: "pro", t: "Pro", d: "Unlimited projects · 25 members" }].map((p) => (
          <FieldLabel key={p.v} htmlFor={`fp-${p.v}`}>
            <Field orientation="horizontal">
              <FieldContent><FieldTitle id={`fp-${p.v}-t`}>{p.t}</FieldTitle><FieldDescription>{p.d}</FieldDescription></FieldContent>
              <RadioGroupItem id={`fp-${p.v}`} value={p.v} aria-labelledby={`fp-${p.v}-t`} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    ),
    code: `<Field invalid={!!errors.email}>
  <FieldLabel>Email</FieldLabel>
  <FieldControl><Input {...register("email")} /></FieldControl>        {/* id + aria-describedby + aria-invalid wired */}
  <FieldDescription>Used for sign-in.</FieldDescription>
  <FieldError errors={[errors.email]} />                                {/* react-hook-form / zod shape */}
</Field>

{/* choice card: point the radio at its title (a wrapping <label> doesn't reliably name a button) */}
<FieldLabel htmlFor="pro"><Field orientation="horizontal">
  <FieldContent><FieldTitle id="pro-t">Pro</FieldTitle></FieldContent>
  <RadioGroupItem id="pro" value="pro" aria-labelledby="pro-t" />
</Field></FieldLabel>`,
    specs: [["Gap", "FieldGroup gap-7 · Field gap-3"], ["Invalid", "data-invalid → label & text destructive; control aria-invalid"], ["Orientation", "vertical (default) · horizontal · responsive (row from md)"]],
    dos: ["Use FieldControl so ids and descriptions can't drift.", "Group related choices in a FieldSet with a FieldLegend.", "For choice cards give the radio aria-labelledby → FieldTitle."],
    donts: ["Don't put the error outside its Field — it won't be linked to the control.", "Don't pass `id` to FieldControl; pass it to Field (FieldLabel's htmlFor uses it)."],
    a11y: { notes: ["FieldControl MERGES your aria-describedby with the description and error ids.", "FieldError is role=alert; render it only when there is an error.", "Field is role=group; FieldSet/FieldLegend give radio and checkbox groups a name."] },
  },
  {
    id: "input-group", name: "Input group", category: "Actions & Inputs", level: "Molecule", status: "new", icon: TextCursorInput,
    summary: "One field frame with addons — icons, text, buttons, kbd hints, counters — inline (start/end) or as a row above/below a textarea. One border, one focus ring.",
    demo: () => {
      const [msg, setMsg] = React.useState("");
      return (
        <div className="grid w-full max-w-md gap-4">
          <InputGroup><InputGroupAddon><Search aria-hidden /></InputGroupAddon><InputGroupInput aria-label="Search" placeholder="Search…" /><InputGroupAddon align="inline-end"><Kbd>⌘K</Kbd></InputGroupAddon></InputGroup>
          <InputGroup><InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon><InputGroupInput aria-label="Website" placeholder="agere.id" className="pl-0.5" /><InputGroupAddon align="inline-end"><InputGroupButton size="icon-xs" aria-label="Copy URL" onClick={() => toast("Copied")}><Copy aria-hidden /></InputGroupButton></InputGroupAddon></InputGroup>
          <InputGroup><InputGroupAddon><AtSign aria-hidden /></InputGroupAddon><InputGroupInput aria-label="Username" defaultValue="bubus" /><InputGroupAddon align="inline-end"><ShieldCheck aria-hidden className="text-success" /><span className="sr-only">Available</span></InputGroupAddon></InputGroup>
          <InputGroup>
            <InputGroupTextarea aria-label="Message" placeholder="Ask, search or chat…" value={msg} onChange={(e) => setMsg(e.target.value)} />
            <InputGroupAddon align="block-end"><InputGroupText className="text-xs tabular-nums">{msg.length}/280</InputGroupText><InputGroupButton variant="default" size="icon-xs" className="ml-auto rounded-full" aria-label="Send" disabled={!msg.trim()}><Send aria-hidden /></InputGroupButton></InputGroupAddon>
          </InputGroup>
        </div>
      );
    },
    code: `<InputGroup>
  <InputGroupAddon><Search /></InputGroupAddon>
  <InputGroupInput aria-label="Search" />
  <InputGroupAddon align="inline-end"><InputGroupButton size="icon-xs" aria-label="Clear"><X /></InputGroupButton></InputGroupAddon>
</InputGroup>`,
    specs: [["Frame", "h-9 · border-input · shadow-xs · focus = border-ring + 3px ring"], ["Addon align", "inline-start · inline-end · block-start · block-end"], ["Button sizes", "xs · sm · icon-xs · icon-sm (type=button)"]],
    dos: ["Label the input itself (aria-label or a FieldLabel) — addon text is not its name.", "Icon-only InputGroupButtons need aria-label."],
    donts: ["Don't put a second input in one group.", "Don't rely on an addon icon alone to convey state — add text (sr-only is fine)."],
    a11y: { notes: ["Clicking an addon focuses the field (mouse convenience); buttons and links inside keep their own behaviour.", "Your own onClick on an addon runs first and can preventDefault() to opt out."] },
  },
  {
    id: "item", name: "Item", category: "Display", level: "Molecule", status: "new", icon: LayoutList,
    summary: "Flexible row — media, title, description, actions — for people, files, settings and notifications. ItemGroup is a real list (agere fixes shadcn's missing listitem roles).",
    demo: () => (
      <ItemGroup aria-label="Team" className="w-full max-w-md rounded-xl border border-border">
        {[["Nadia Putri", "nadia@agere.id", "Owner"], ["Raka Pratama", "raka@agere.id", "Admin"], ["Sekar Ayu", "sekar@agere.id", "Member"]].map(([n, e, r], i, a) => (
          <React.Fragment key={n}>
            <Item>
              <ItemMedia><Avatar name={n} size="lg" aria-hidden /></ItemMedia>
              <ItemContent><ItemTitle>{n}</ItemTitle><ItemDescription>{e}</ItemDescription></ItemContent>
              <ItemActions><span className="text-sm text-muted-foreground">{r}</span><Button size="sm" variant="outline" aria-label={`Manage ${n}`}>Manage</Button></ItemActions>
            </Item>
            {i < a.length - 1 && <ItemSeparator />}
          </React.Fragment>
        ))}
      </ItemGroup>
    ),
    states: () => (
      <div className="grid w-full max-w-md gap-3">
        <Item variant="outline"><ItemMedia variant="icon"><Rows3 aria-hidden /></ItemMedia><ItemContent><ItemTitle>Outline</ItemTitle><ItemDescription>Bordered row for standalone settings.</ItemDescription></ItemContent></Item>
        <Item variant="muted" size="sm"><ItemContent><ItemTitle>Muted · small</ItemTitle></ItemContent></Item>
        <Item asChild variant="outline"><a href="#/components/item"><ItemContent><ItemTitle>As a link</ItemTitle><ItemDescription>asChild keeps the link's own role.</ItemDescription></ItemContent></a></Item>
      </div>
    ),
    code: `<ItemGroup aria-label="Team">
  <Item>
    <ItemMedia><Avatar name="Nadia Putri" /></ItemMedia>
    <ItemContent><ItemTitle>Nadia Putri</ItemTitle><ItemDescription>Owner</ItemDescription></ItemContent>
    <ItemActions><Button size="sm" variant="outline">Manage</Button></ItemActions>
  </Item>
</ItemGroup>`,
    specs: [["Variants", "default · outline · muted"], ["Sizes", "default gap-4 p-4 · sm gap-2.5 px-4 py-3"], ["Media", "default · icon (size-8) · image (size-10)"]],
    dos: ["Name the ItemGroup (aria-label) when there's no visible heading.", "Use asChild for a whole-row link or button."],
    donts: ["Don't nest interactive rows inside interactive rows."],
    a11y: { role: "list / listitem", notes: ["Inside ItemGroup each Item is a listitem; with asChild the listitem wraps your link/button so it keeps its role."] },
  },
];
