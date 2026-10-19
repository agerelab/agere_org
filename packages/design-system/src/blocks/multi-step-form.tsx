"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import { Stepper } from "@/components/ui/stepper";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const STEPS = [
  { id: "workspace", label: "Workspace", description: "Name and URL" },
  { id: "plan", label: "Plan", description: "Pick a tier" },
  { id: "team", label: "Team", description: "Invite people" },
];

type Data = { name: string; slug: string; plan: string; invites: string; terms: boolean };

/**
 * Block · Multi-step form (shadcnstudio "Multi Step Form").
 * Each step validates before advancing; Back never loses input; the heading is focused on step change
 * so screen-reader users hear where they are ("Step 2 of 3: Plan").
 */
export function MultiStepForm() {
  const [step, setStep] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [data, setData] = React.useState<Data>({ name: "", slug: "", plan: "pro", invites: "", terms: false });
  const [errors, setErrors] = React.useState<Partial<Record<keyof Data, string>>>({});
  const [slugEdited, setSlugEdited] = React.useState(false);
  const slugify = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const set = <K extends keyof Data>(k: K, v: Data[K]) => setData((d) => ({ ...d, [k]: v }));

  // Move focus only when the user changes step — never on mount (WCAG 3.2.1: no context change on load).
  const mounted = React.useRef(false);
  React.useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    headingRef.current?.focus();
  }, [step, done]);

  const validate = () => {
    const e: typeof errors = {};
    if (step === 0) {
      if (data.name.trim().length < 2) e.name = "Use at least 2 characters.";
      if (!/^[a-z0-9-]{3,}$/.test(data.slug)) e.slug = "Lowercase letters, numbers and dashes, 3+ characters.";
    }
    if (step === 2) {
      const bad = data.invites.split(",").map((s) => s.trim()).filter(Boolean).filter((s) => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s));
      if (bad.length) e.invites = `Check ${bad.length === 1 ? "this address" : "these addresses"}: ${bad.join(", ")}`;
      if (!data.terms) e.terms = "Accept the terms to continue.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step === STEPS.length - 1) setDone(true);
    else setStep((s) => s + 1);
  };

  if (done) {
    return (
      <Card className="w-full max-w-xl">
        <CardHeader className="justify-items-center text-center">
          <span aria-hidden className="mb-2 grid size-12 place-items-center rounded-full bg-success-bg text-success-fg"><Check className="size-6" /></span>
          <CardTitle as="h2" ref={headingRef} tabIndex={-1} className="outline-none">{data.name} is ready</CardTitle>
          <CardDescription>agere.id/{data.slug} · {data.plan === "pro" ? "Pro" : data.plan === "team" ? "Team" : "Starter"} plan</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button variant="outline" onClick={() => { setDone(false); setStep(0); }}>Start over</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="gap-6">
        <Stepper steps={STEPS} current={step} onStepClick={(i) => setStep(i)} aria-label="Setup progress" />
        <div className="grid gap-1.5">
          <CardTitle as="h2" ref={headingRef} tabIndex={-1} className="outline-none">
            <span className="sr-only">Step {step + 1} of {STEPS.length}:</span>{" "}{["Create your workspace", "Choose a plan", "Invite your team"][step]}
          </CardTitle>
          <CardDescription>{["You can change these later in Settings.", "Switch or cancel any time.", "Separate addresses with commas. You can skip this."][step]}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {step === 0 && (
          <div className="grid gap-5">
            <FormField label="Workspace name" error={errors.name} required>
              <FormControl>
                <Input value={data.name} placeholder="agere" onChange={(e) => { set("name", e.target.value); if (!slugEdited) set("slug", slugify(e.target.value)); }} />
              </FormControl>
            </FormField>
            <FormField label="Workspace URL" error={errors.slug} required>
              <FormControl><Input addonStart="agere.id/" value={data.slug} onChange={(e) => { setSlugEdited(true); set("slug", e.target.value); }} /></FormControl>
            </FormField>
          </div>
        )}
        {step === 1 && (
          <RadioGroup value={data.plan} onValueChange={(v) => set("plan", v)} aria-label="Plan" className="gap-3">
            <RadioCard value="starter" title="Starter · $19/mo" description="1 project, 3 members, community support." />
            <RadioCard value="pro" title="Pro · $49/mo" description="Unlimited projects, 25 members, priority support." />
            <RadioCard value="team" title="Team · $299/mo" description="SSO, audit log, 99.9% SLA." />
          </RadioGroup>
        )}
        {step === 2 && (
          <div className="grid gap-5">
            <FormField label="Email addresses" hint="e.g. raka@agere.id, sekar@agere.id" error={errors.invites} optional>
              <FormControl><Input value={data.invites} onChange={(e) => set("invites", e.target.value)} placeholder="name@company.com" /></FormControl>
            </FormField>
            <div className="grid gap-1.5">
              <div className="flex items-start gap-3">
                <Checkbox id="terms" checked={data.terms} onCheckedChange={(v) => set("terms", v === true)} aria-invalid={errors.terms ? true : undefined} aria-describedby={errors.terms ? "terms-error" : undefined} />
                <Label htmlFor="terms" className="leading-snug">I agree to the Terms of Service and Privacy Policy</Label>
              </div>
              {errors.terms && <p id="terms-error" className="pl-7 text-sm text-destructive">{errors.terms}</p>}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between border-t pt-6">
        <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0}><ArrowLeft aria-hidden /> Back</Button>
        <Button onClick={next}>{step === STEPS.length - 1 ? "Create workspace" : "Continue"} {step < STEPS.length - 1 && <ArrowRight aria-hidden />}</Button>
      </CardFooter>
    </Card>
  );
}
