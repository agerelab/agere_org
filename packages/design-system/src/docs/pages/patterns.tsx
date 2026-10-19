import * as React from "react";
import { CalendarDays, CreditCard, Lock, QrCode, TrendingUp, Users, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Stepper } from "@/components/ui/stepper";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField } from "@/components/ui/form";
import { toast } from "@/components/ui/toast";
import { StatCard } from "@/components/agere-ds/cards";
import { Logo } from "@/brand/logo";
import { IllustrationLaunch, IllustrationSuccess } from "@/brand/illustrations";
import { TableDemo } from "../patterns/table-demo";
import { DoDont, PageHeader, Section, SpecTable } from "../kit";

/* ---------------- Auth ---------------- */
function AuthPattern() {
  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [email, setEmail] = React.useState("");
  const [err, setErr] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email, like name@company.com.");
    setErr(undefined); setLoading(true);
    setTimeout(() => { setLoading(false); toast.success(mode === "login" ? "Signed in" : "Account created"); }, 1200);
  };
  return (
    <div className="grid w-full place-items-center bg-muted py-10">
      <div className="grid w-full max-w-[400px] gap-6 px-4">
        <div className="grid justify-items-center gap-3 text-center">
          <Logo variant="mark" height={40} />
          <h3 className="type-heading-xl">{mode === "login" ? "Welcome back" : "Create your account"}</h3>
          <p className="text-sm text-subtle">{mode === "login" ? "Sign in to manage your ventures." : "Free for your first venture. No card required."}</p>
        </div>
        <form noValidate onSubmit={submit} className="grid gap-4 rounded-2xl border border-subtle bg-default p-6 shadow-elevation-2">
          <Button type="button" variant="outline" size="lg" fullWidth leadingIcon={<svg viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M21.35 11.1H12v2.9h5.35c-.23 1.4-1.64 4.1-5.35 4.1a6.1 6.1 0 0 1 0-12.2c1.9 0 3.17.8 3.9 1.5l2.66-2.56C16.87 3.3 14.66 2.3 12 2.3a9.7 9.7 0 1 0 0 19.4c5.6 0 9.3-3.94 9.3-9.48 0-.64-.07-1.12-.15-1.62Z" /></svg>}>
            Continue with Google
          </Button>
          <div className="flex items-center gap-3 text-xs text-subtle"><Separator className="flex-1" />or<Separator className="flex-1" /></div>
          {mode === "register" && <FormField label="Full name"><FormControl><Input autoComplete="name" /></FormControl></FormField>}
          <FormField label="Email" error={err}><FormControl><Input type="email" autoComplete="email" inputMode="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} /></FormControl></FormField>
          <FormField label="Password" hint={mode === "register" ? "At least 8 characters, including a number." : undefined}>
            <FormControl><PasswordInput autoComplete={mode === "login" ? "current-password" : "new-password"} /></FormControl>
          </FormField>
          {mode === "login" ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Checkbox id="remember" /><Label htmlFor="remember" className="font-normal text-default">Remember me</Label></div>
              <a href="#/patterns" className="rounded-sm text-sm font-medium text-emphasis underline-offset-2 hover:underline focus-ring">Forgot password?</a>
            </div>
          ) : (
            <div className="flex items-start gap-2"><Checkbox id="tos" className="mt-0.5" /><Label htmlFor="tos" className="font-normal leading-5 text-default">I agree to the Terms and Privacy Policy</Label></div>
          )}
          <Button type="submit" size="lg" fullWidth loading={loading}>{loading ? (mode === "login" ? "Signing in…" : "Creating…") : mode === "login" ? "Sign in" : "Create account"}</Button>
        </form>
        <p className="text-center text-sm text-subtle">
          {mode === "login" ? "New to agere? " : "Already have an account? "}
          <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setErr(undefined); }} className="rounded-sm font-medium text-emphasis underline-offset-2 hover:underline focus-ring">
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

/* ---------------- Onboarding ---------------- */
const OB_STEPS = [
  { id: "1", label: "Welcome" }, { id: "2", label: "Connect calendar" }, { id: "3", label: "Availability" }, { id: "4", label: "Done" },
];
function OnboardingPattern() {
  const [step, setStep] = React.useState(0);
  return (
    <div className="grid w-full place-items-center bg-muted py-10">
      <div className="grid w-full max-w-[520px] gap-6 px-4">
        <Stepper steps={OB_STEPS} current={step} variant="bars" />
        <div className="grid gap-5 rounded-2xl border border-subtle bg-default p-6 shadow-elevation-2">
          {step === 0 && (<><IllustrationLaunch size={120} /><div className="grid gap-1"><h3 className="type-heading-xl">Welcome to agere</h3><p className="text-sm text-subtle">We’ll set up your booking page in about 2 minutes.</p></div>
            <FormField label="Username" hint="This becomes agere.id/your-name."><FormControl><Input addonStart="agere.id/" defaultValue="bubus" /></FormControl></FormField>
            <FormField label="Timezone"><Select defaultValue="jkt"><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="jkt">Asia/Jakarta (WIB)</SelectItem><SelectItem value="mks">Asia/Makassar (WITA)</SelectItem><SelectItem value="jyp">Asia/Jayapura (WIT)</SelectItem></SelectContent></Select></FormField></>)}
          {step === 1 && (<><div className="grid gap-1"><h3 className="type-heading-xl">Connect your calendar</h3><p className="text-sm text-subtle">We check for conflicts so you’re never double-booked.</p></div>
            <div className="grid gap-2">{["Google Calendar", "Outlook", "Apple Calendar"].map((c, i) => (<div key={c} className="flex items-center justify-between rounded-xl border border-subtle p-3"><span className="flex items-center gap-3 text-sm font-medium"><span className="grid size-8 place-items-center rounded-lg bg-subtle"><CalendarDays className="size-4" aria-hidden /></span>{c}</span>{i === 0 ? <Badge variant="success" dot>Connected</Badge> : <Button size="sm" variant="outline">Connect</Button>}</div>))}</div></>)}
          {step === 2 && (<><div className="grid gap-1"><h3 className="type-heading-xl">Set your availability</h3><p className="text-sm text-subtle">You can change this any time.</p></div>
            <div className="grid gap-2">{["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (<div key={d} className="flex items-center gap-3"><span className="w-10 text-sm font-medium">{d}</span><Input defaultValue="09.00" aria-label={`${d} start`} className="w-24" /><span className="text-subtle">–</span><Input defaultValue="17.00" aria-label={`${d} end`} className="w-24" /></div>))}</div></>)}
          {step === 3 && (<div className="grid justify-items-center gap-3 text-center"><IllustrationSuccess size={140} /><h3 className="type-heading-xl">You’re all set</h3><p className="text-sm text-subtle">Share agere.id/bubus to start taking bookings.</p></div>)}
          <div className="flex justify-between gap-2 border-t border-subtle pt-4">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
            {step < 3 ? <Button onClick={() => setStep(step + 1)}>Continue</Button> : <Button onClick={() => setStep(0)}>Go to dashboard</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Checkout ---------------- */
function CheckoutPattern() {
  const [method, setMethod] = React.useState("qris");
  const [paying, setPaying] = React.useState(false);
  return (
    <div className="grid w-full gap-6 bg-muted p-4 sm:p-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="grid content-start gap-5 rounded-2xl border border-subtle bg-default p-6">
        <Stepper steps={[{ id: "a", label: "Details" }, { id: "b", label: "Payment" }, { id: "c", label: "Confirmation" }]} current={1} />
        <RadioGroup value={method} onValueChange={setMethod} aria-label="Payment method" className="gap-2">
          <RadioCard value="qris" title="QRIS" description="Scan with any bank or e-wallet app" />
          <RadioCard value="va" title="Virtual account" description="BCA, BNI, BRI, Mandiri, Permata" />
          <RadioCard value="card" title="Credit / debit card" description="Visa, Mastercard, JCB" />
        </RadioGroup>
        {method === "card" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Card number" className="sm:col-span-2"><FormControl><Input inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" leadingIcon={<CreditCard />} /></FormControl></FormField>
            <FormField label="Expiry"><FormControl><Input autoComplete="cc-exp" placeholder="MM/YY" /></FormControl></FormField>
            <FormField label="CVC"><FormControl><Input inputMode="numeric" autoComplete="cc-csc" placeholder="123" /></FormControl></FormField>
          </div>
        )}
        <Alert variant="info" icon={<Lock className="size-4" />}>Payments are processed by our PCI-DSS certified partner. We never store card numbers.</Alert>
      </div>
      <aside aria-label="Order summary" className="grid content-start gap-4 rounded-2xl border border-subtle bg-default p-6">
        <h3 className="type-heading-md">Order summary</h3>
        <dl className="grid gap-2 text-sm">
          <div className="flex justify-between"><dt className="text-subtle">Team plan · 3 seats</dt><dd className="tabular-nums">Rp450.000</dd></div>
          <div className="flex justify-between"><dt className="text-subtle">PPN 11%</dt><dd className="tabular-nums">Rp49.500</dd></div>
          <Separator />
          <div className="flex justify-between font-semibold text-emphasis"><dt>Total / month</dt><dd className="tabular-nums">Rp499.500</dd></div>
        </dl>
        <Button size="lg" fullWidth loading={paying} leadingIcon={method === "qris" ? <QrCode /> : <Wallet />} onClick={() => { setPaying(true); setTimeout(() => { setPaying(false); toast.success("Payment received", { description: "Receipt sent to nadia@contoh.id" }); }, 1400); }}>
          {paying ? "Processing…" : "Pay Rp499.500"}
        </Button>
        <p className="text-xs text-subtle">Cancel any time. Prices include VAT.</p>
      </aside>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function DashboardPattern() {
  return (
    <div className="grid w-full gap-5 bg-muted p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h3 className="type-heading-xl">Insights</h3><p className="text-sm text-subtle">Last 30 days · all event types</p></div>
        <Select defaultValue="30"><SelectTrigger className="w-40" aria-label="Date range"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">Last 7 days</SelectItem><SelectItem value="30">Last 30 days</SelectItem><SelectItem value="90">Last 90 days</SelectItem></SelectContent></Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Bookings" value="1,284" delta={12.4} icon={<CalendarDays />} />
        <StatCard label="New attendees" value="642" delta={8.1} icon={<Users />} />
        <StatCard label="No-show rate" value="3.1%" delta={0.8} positiveIsGood={false} icon={<TrendingUp />} />
        <StatCard label="Revenue" value="Rp38,2 jt" delta={21.7} icon={<Wallet />} />
      </div>
      <div className="rounded-xl border border-subtle bg-default p-5">
        <div className="flex items-center justify-between"><h4 className="type-heading-sm">Bookings per week</h4><div className="flex gap-3 text-xs text-subtle"><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-viz-3" />Accepted</span><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-viz-6" />Cancelled</span></div></div>
        <div role="img" aria-label="Bar chart: accepted bookings rose from 180 to 320 per week over 8 weeks; cancellations stayed between 8 and 20." className="mt-4 flex h-40 items-end gap-3">
          {[180, 210, 196, 240, 262, 251, 298, 320].map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-col justify-end gap-0.5" style={{ height: 140 }}>
                <div className="w-full rounded-t-md bg-viz-3" style={{ height: `${(v / 340) * 100}%` }} />
                <div className="w-full rounded-b-sm bg-viz-6" style={{ height: `${([12, 8, 20, 15, 10, 18, 9, 14][i] / 340) * 100}%` }} />
              </div>
              <span className="text-2xs text-subtle">W{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
      <TableDemo />
    </div>
  );
}

export function PatternsPage() {
  return (
    <div className="grid gap-2">
      <PageHeader eyebrow="Patterns" title="UX patterns" description="Proven flows assembled only from agere components: authentication, onboarding, checkout (IDR, QRIS, VA) and an analytics dashboard. Copy them as the starting point of every MVP." />
      <Tabs defaultValue="auth" variant="underline" className="pt-6">
        <TabsList aria-label="Patterns">
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="checkout">Checkout</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tree">Nested list</TabsTrigger>
          <TabsTrigger value="editor">Block editor</TabsTrigger>
        </TabsList>
        <TabsContent value="auth" className="grid gap-2">
          <Section title="Sign in / Register"><div className="overflow-hidden rounded-xl border border-subtle"><AuthPattern /></div></Section>
          <Section title="Rules"><DoDont dos={["Offer SSO first (Google), email second.", "Use autocomplete tokens (email, current-password, new-password) so password managers work.", "Show password rules before typing; allow paste.", "Keep the user on the form after an error; focus the first invalid field."]} donts={["Don’t reveal whether an email exists on sign-in errors (“Email or password is incorrect”).", "Don’t use CAPTCHAs without an accessible alternative.", "Don’t split email and password across steps unless SSO discovery requires it."]} /></Section>
        </TabsContent>
        <TabsContent value="onboarding" className="grid gap-2">
          <Section title="Setup wizard (cal.com style)"><div className="overflow-hidden rounded-xl border border-subtle"><OnboardingPattern /></div></Section>
          <Section title="Rules"><DoDont dos={["≤ 4 steps; each step one decision.", "Prefill from what you know (timezone, name from SSO).", "Let users skip non-essential steps and finish later."]} donts={["Don’t ask for billing during onboarding of a free tier.", "Don’t lose entered data when going Back."]} /></Section>
        </TabsContent>
        <TabsContent value="checkout" className="grid gap-2">
          <Section title="Payment (Indonesia)"><div className="overflow-hidden rounded-xl border border-subtle"><CheckoutPattern /></div></Section>
          <Section title="Rules"><DoDont dos={["Show the full total including PPN before the pay button; repeat the amount on the button.", "Default to the most used local method (QRIS).", "Disable double-submit with `loading`; show a receipt screen + email."]} donts={["Don’t surprise with fees at the last step.", "Don’t time out payment pages without warning (WCAG 2.2.1)."]} /></Section>
        </TabsContent>
        <TabsContent value="dashboard" className="grid gap-2">
          <Section title="Analytics dashboard"><div className="overflow-hidden rounded-xl border border-subtle"><DashboardPattern /></div></Section>
          <Section title="Rules"><DoDont dos={["4 KPIs max above the fold, each with a comparison window.", "Charts: use viz tokens, label series directly or with a legend, provide a text summary (aria-label or table).", "Put the detailed table under the chart for drill-down."]} donts={["Don’t use pie charts for > 4 categories.", "Don’t encode good/bad only with green/red — add arrows and words."]} /></Section>
        </TabsContent>
        <TabsContent value="tree" className="grid gap-2">
          <Section title="Nested list (tasks → subtasks)" description="New in 6.4 as a documented pattern, assembled from Checkbox, IconButton, DropdownMenu and @dnd-kit. One level of nesting; a subtask keeps its own status, assignee and due date.">
            <SpecTable
              head={["Part", "Spec"]}
              rows={[
                ["Indent", "28 px per level, with a 1 px connector (border-emphasis) from the parent"],
                ["Row", "44 px parent · 40 px subtask; grip · checkbox · caret · status · name · columns · ⋯"],
                ["Caret", "IconButton xs, aria-expanded, name “Expand 3 subtasks of <task>”"],
                ["Inline add", "“+ Add subtask” on row hover; the row opens under the parent with quick-set icons (assignee, due, priority), Cancel (ghost xs) and Save (default xs) — Enter saves, Esc closes"],
                ["Helpers", "getDropZone(y, rect, canNest) · canDrop(items, id, target) · moveTreeItem(items, id, target) from @/components/agere-ds — pure, tested, one level by default (maxDepth 1)"],
                ["Drop targets", "top 30 % → before · middle 40 % → nest · bottom 30 % → after · group header → change status"],
                ["Indicators", "2 px line (before/after) · 1.5 px outline + bg-subtle (nest) · dashed outline (group)"],
                ["Counts", "Tab and group counts use top-level tasks on the current board, so they match the cards on the board"],
              ]}
            />
          </Section>
          <Section title="Rules"><DoDont dos={["Offer every drag as a menu action too: Move up, Move down, Make subtask of…, Remove from parent (WCAG 2.5.7).", "Announce each move and offer Undo in a toast.", "Keep subtasks under their parent regardless of the subtask's status."]} donts={["Don't nest deeper than one level in lists.", "Don't allow dropping a parent into its own subtask.", "Don't count subtasks in board-level counts."]} /></Section>
        </TabsContent>
        <TabsContent value="editor" className="grid gap-2">
          <Section title="Block editor (docs)" description="New in 6.4 as a documented pattern. Always editable, autosaved, and no placeholder text — a new doc opens empty with the caret in the title.">
            <SpecTable
              head={["Part", "Spec"]}
              rows={[
                ["Title", "type-display-lg (36/44, 600), contenteditable, Enter moves to the body"],
                ["Body", "type-body-lg (16/24); blocks: paragraph, heading 1 (type-heading-xl 24/32), heading 2 (type-heading-lg 20/28), bulleted, numbered, to-do, quote, code (type-code), divider, task mention"],
                ["Slash menu", "“/” opens a listbox of blocks filtered as you type; ↑ ↓ Enter, Esc closes"],
                ["Markdown shortcuts", "# · ## · - · 1. · [] · > then Space; --- or ``` then Enter"],
                ["Block handle", "+ (insert below) and ⋮⋮ (turn into, duplicate, delete) in the left gutter on hover"],
                ["Selection toolbar", "Bold · Italic · Strikethrough · Code · Make task"],
                ["Status", "SaveStatus in the page toolbar (Saved · Saving… · Couldn’t save); no Save button"],
              ]}
            />
          </Section>
          <Section title="Rules"><DoDont dos={["Keep keyboard parity: every gutter action is reachable from the slash menu or a shortcut.", "Import accepts Markdown and plain text; export lists its formats in a menu."]} donts={["Don't show placeholder text in the title or empty blocks.", "Don't add an Edit / View mode toggle."]} /></Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
