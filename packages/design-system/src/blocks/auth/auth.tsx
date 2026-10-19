"use client";

import * as React from "react";
import { ArrowLeft, Check, KeyRound, Mail, MailCheck, Smartphone, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/brand/logo";
import { StateIllustrationWelcome } from "@/brand/state-illustrations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField } from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Focus the first invalid control after React has rendered aria-invalid (WCAG 3.3.1). */
function useFocusFirstError(errors: object) {
  const ref = React.useRef<HTMLFormElement>(null);
  const pending = React.useRef(false);
  React.useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    ref.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
  }, [errors]);
  return { ref, flag: () => { pending.current = true; } };
}

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative text-center text-xs text-muted-foreground after:absolute after:inset-x-0 after:top-1/2 after:border-t after:border-border">
      <span className="relative z-[1] bg-card px-2">{children}</span>
    </div>
  );
}

function SocialButtons() {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Button variant="outline" type="button" leadingIcon={<Mail />} onClick={() => toast("Redirecting to Google…")}>Continue with Google</Button>
      <Button variant="outline" type="button" leadingIcon={<KeyRound />} onClick={() => toast("Redirecting to your identity provider…")}>Single sign-on</Button>
    </div>
  );
}

/**
 * Block · Auth layout (shadcnstudio "Login Page" split variant). Form column + brand panel with the
 * Welcome state illustration. The panel is decorative and hidden below lg.
 */
export function AuthLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid min-h-[640px] w-full overflow-hidden rounded-xl border border-border bg-background lg:grid-cols-2", className)}>
      <div className="flex flex-col gap-6 p-6 md:p-10">
        <a href="#/blocks" className="w-fit rounded-md outline-none focus-ring"><Logo height={22} title="agere home" /></a>
        <div className="flex flex-1 items-center justify-center"><div className="w-full max-w-sm">{children}</div></div>
      </div>
      <div aria-hidden className="relative hidden flex-col justify-between bg-muted/60 p-10 lg:flex">
        <div className="grid flex-1 place-items-center"><StateIllustrationWelcome size={360} /></div>
        <figure className="grid gap-2">
          <blockquote className="text-lg font-medium leading-snug">“We launched three ventures on the same foundation this year — none of them rebuilt login.”</blockquote>
          <figcaption className="text-sm text-muted-foreground">Sekar Ayu · COO, Neralink</figcaption>
        </figure>
      </div>
    </div>
  );
}

/** Block · Login form. Errors link to fields; the password field keeps its value on error. */
export function LoginForm({ onForgot, onSignUp, onSuccess }: { onForgot?: () => void; onSignUp?: () => void; onSuccess?: () => void }) {
  const [errors, setErrors] = React.useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = React.useState(false);
  const { ref, flag } = useFocusFirstError(errors);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const next: typeof errors = {};
    if (!EMAIL.test(String(f.get("email")))) next.email = "Enter an email like name@company.com.";
    if (!String(f.get("password"))) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return flag();
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess ? onSuccess() : toast.success("Signed in"); }, 500);
  };
  return (
    <form ref={ref} onSubmit={submit} noValidate className="grid gap-6" aria-labelledby="login-title">
      <div className="grid gap-1.5 text-center">
        <h1 id="login-title" className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your agere workspace</p>
      </div>
      <SocialButtons />
      <Divider>or continue with email</Divider>
      <div className="grid gap-4">
        <FormField label="Email" error={errors.email}><FormControl><Input name="email" type="email" autoComplete="email" placeholder="you@company.com" /></FormControl></FormField>
        <div className="grid gap-2">
          <div className="flex items-center justify-between"><Label htmlFor="login-pw">Password</Label><Button type="button" variant="link" size="sm" className="h-auto text-sm font-normal text-muted-foreground" onClick={onForgot}>Forgot password?</Button></div>
          <PasswordInput id="login-pw" name="password" autoComplete="current-password" aria-invalid={errors.password ? true : undefined} aria-describedby={errors.password ? "login-pw-err" : undefined} />
          {errors.password && <p id="login-pw-err" className="text-sm text-destructive">{errors.password}</p>}
        </div>
        <div className="flex items-center gap-2"><Checkbox id="remember" name="remember" defaultChecked /><Label htmlFor="remember" className="font-normal">Keep me signed in for 30 days</Label></div>
      </div>
      <Button type="submit" size="lg" loading={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
      <p className="text-center text-sm text-muted-foreground">No account? <Button type="button" variant="link" className="h-auto p-0 text-sm" onClick={onSignUp}>Create one</Button></p>
    </form>
  );
}

const RULES = [
  { id: "len", label: "At least 10 characters", test: (p: string) => p.length >= 10 },
  { id: "case", label: "Upper and lower case letters", test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { id: "num", label: "A number or symbol", test: (p: string) => /[\d\W]/.test(p) },
];

/** Block · Register form with a live password checklist (not a vague "weak/strong" bar). */
export function RegisterForm({ onSignIn }: { onSignIn?: () => void }) {
  const [pw, setPw] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const { ref, flag } = useFocusFirstError(errors);
  const passed = RULES.filter((r) => r.test(pw)).length;
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (String(f.get("name")).trim().length < 2) next.name = "Enter your full name.";
    if (!EMAIL.test(String(f.get("email")))) next.email = "Enter an email like name@company.com.";
    if (passed < RULES.length) next.password = "Your password doesn't meet all the requirements yet.";
    if (!f.get("terms")) next.terms = "Accept the terms to create an account.";
    setErrors(next);
    if (Object.keys(next).length) return flag();
    toast.success("Account created — check your inbox");
  };
  return (
    <Card>
      <form ref={ref} onSubmit={submit} noValidate className="grid gap-6" aria-labelledby="reg-title">
        <CardHeader className="text-center">
          <CardTitle as="h1" id="reg-title" className="text-2xl">Create your account</CardTitle>
          <CardDescription>Free for one project. No card required.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <FormField label="Full name" error={errors.name}><FormControl><Input name="name" autoComplete="name" /></FormControl></FormField>
          <FormField label="Work email" error={errors.email}><FormControl><Input name="email" type="email" autoComplete="email" /></FormControl></FormField>
          <div className="grid gap-2">
            <Label htmlFor="reg-pw">Password</Label>
            <PasswordInput id="reg-pw" name="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} aria-describedby="reg-pw-rules" aria-invalid={errors.password ? true : undefined} />
            <div aria-hidden className="grid grid-cols-3 gap-1">{RULES.map((r, i) => <span key={r.id} className={cn("h-1 rounded-full bg-muted", i < passed && (passed === RULES.length ? "bg-success-solid" : "bg-attention-solid"))} />)}</div>
            <ul id="reg-pw-rules" className="grid gap-1 text-sm">
              {RULES.map((r) => {
                const ok = r.test(pw);
                return (
                  <li key={r.id} className={cn("flex items-center gap-2", ok ? "text-success-on-surface" : "text-muted-foreground")}>
                    {ok ? <Check className="size-4" aria-hidden /> : <X className="size-4" aria-hidden />}{r.label}<span className="sr-only">{ok ? " — done" : " — not yet"}</span>
                  </li>
                );
              })}
            </ul>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>
          <div className="grid gap-1.5">
            <div className="flex items-start gap-2">
              <Checkbox id="reg-terms" name="terms" value="yes" aria-invalid={errors.terms ? true : undefined} aria-describedby={errors.terms ? "reg-terms-err" : undefined} />
              <Label htmlFor="reg-terms" className="font-normal leading-snug">I agree to the Terms of Service and Privacy Policy</Label>
            </div>
            {errors.terms && <p id="reg-terms-err" className="pl-6 text-sm text-destructive">{errors.terms}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button type="submit" size="lg" className="w-full">Create account</Button>
          <p className="text-sm text-muted-foreground">Already have an account? <Button type="button" variant="link" className="h-auto p-0 text-sm" onClick={onSignIn}>Sign in</Button></p>
        </CardFooter>
      </form>
    </Card>
  );
}

/** Block · Forgot password. The confirmation never reveals whether the email exists (account enumeration). */
export function ForgotPasswordForm({ onBack }: { onBack?: () => void }) {
  const [sent, setSent] = React.useState<string>();
  const [error, setError] = React.useState<string>();
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  React.useEffect(() => { if (sent) headingRef.current?.focus(); }, [sent]);
  if (sent) {
    return (
      <div className="grid justify-items-center gap-4 text-center">
        <span aria-hidden className="grid size-12 place-items-center rounded-full bg-muted"><MailCheck className="size-6" /></span>
        <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold tracking-tight outline-none">Check your email</h1>
        <p className="text-sm text-muted-foreground">If an account exists for <strong className="text-foreground">{sent}</strong>, a reset link is on its way. It expires in 30 minutes.</p>
        <Button variant="outline" className="w-full" onClick={() => setSent(undefined)}>Use a different email</Button>
        <Button variant="link" onClick={onBack} leadingIcon={<ArrowLeft />}>Back to sign in</Button>
      </div>
    );
  }
  return (
    <form
      noValidate
      className="grid gap-6"
      aria-labelledby="fp-title"
      onSubmit={(e) => {
        e.preventDefault();
        const v = String(new FormData(e.currentTarget).get("email"));
        if (!EMAIL.test(v)) { setError("Enter an email like name@company.com."); e.currentTarget.querySelector<HTMLInputElement>("input")?.focus(); return; }
        setError(undefined); setSent(v);
      }}
    >
      <div className="grid gap-1.5 text-center">
        <h1 id="fp-title" className="text-2xl font-semibold tracking-tight">Reset your password</h1>
        <p className="text-sm text-muted-foreground">Enter the email you sign in with and we'll send a reset link.</p>
      </div>
      <FormField label="Email" error={error}><FormControl><Input name="email" type="email" autoComplete="email" /></FormControl></FormField>
      <Button type="submit" size="lg">Send reset link</Button>
      <Button type="button" variant="link" onClick={onBack} leadingIcon={<ArrowLeft />}>Back to sign in</Button>
    </form>
  );
}

/**
 * Block · Two-factor verification (shadcnstudio "Two Factor Authentication" / "Verify Email").
 * InputOTP (paste + SMS autofill), auto-submit on the 6th digit, resend with a visible countdown.
 */
export function TwoFactorForm({ phone = "+62 812-••••-7890", code = "246810", onVerified }: { phone?: string; code?: string; onVerified?: () => void }) {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [wait, setWait] = React.useState(30);
  React.useEffect(() => { if (wait <= 0) return; const t = setTimeout(() => setWait((w) => w - 1), 1000); return () => clearTimeout(t); }, [wait]);
  const verify = (v: string) => {
    if (v === code) { setError(undefined); onVerified ? onVerified() : toast.success("Verified"); }
    else { setError("That code isn't right. Check the latest SMS and try again."); setValue(""); }
  };
  return (
    <form noValidate className="grid gap-6" aria-labelledby="otp-title" onSubmit={(e) => { e.preventDefault(); verify(value); }}>
      <div className="grid justify-items-center gap-3 text-center">
        <span aria-hidden className="grid size-12 place-items-center rounded-full bg-muted"><Smartphone className="size-6" /></span>
        <h1 id="otp-title" className="text-2xl font-semibold tracking-tight">Enter verification code</h1>
        <p id="otp-help" className="text-sm text-muted-foreground">We sent a 6-digit code to <strong className="text-foreground">{phone}</strong>.</p>
      </div>
      <div className="grid justify-items-center gap-2">
        <Label htmlFor="otp-code" className="sr-only">6-digit code</Label>
        <InputOTP id="otp-code" maxLength={6} value={value} onChange={(v) => { setValue(v); if (error) setError(undefined); }} onComplete={verify}
          aria-invalid={error ? true : undefined} aria-describedby={error ? "otp-err otp-help" : "otp-help"} containerClassName="justify-center">
          <InputOTPGroup><InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /></InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup><InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} /></InputOTPGroup>
        </InputOTP>
        <p id="otp-err" role="alert" className="min-h-5 text-sm text-destructive">{error}</p>
      </div>
      <Button type="submit" size="lg" disabled={value.length < 6}>Verify</Button>
      <p className="text-center text-sm text-muted-foreground">
        Didn't get it?{" "}
        {wait > 0 ? <span aria-live="polite">Resend in <span className="tabular-nums">{wait}</span>s</span> : <Button type="button" variant="link" className="h-auto p-0 text-sm" onClick={() => { setWait(30); toast("New code sent"); }}>Resend code</Button>}
      </p>
    </form>
  );
}

/** Interactive auth flow for the docs: login ⇄ register ⇄ forgot, login → 2FA. */
export function AuthFlow() {
  const [step, setStep] = React.useState<"login" | "register" | "forgot" | "otp">("login");
  return (
    <AuthLayout>
      {step === "login" && <LoginForm onForgot={() => setStep("forgot")} onSignUp={() => setStep("register")} onSuccess={() => setStep("otp")} />}
      {step === "register" && <RegisterForm onSignIn={() => setStep("login")} />}
      {step === "forgot" && <ForgotPasswordForm onBack={() => setStep("login")} />}
      {step === "otp" && <TwoFactorForm onVerified={() => { toast.success("Signed in"); setStep("login"); }} />}
    </AuthLayout>
  );
}
