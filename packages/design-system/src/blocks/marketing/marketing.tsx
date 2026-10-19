"use client";

import * as React from "react";
import {
  ArrowRight, BarChart3, Bot, Check, CreditCard, Globe, Layers, Menu, MessageSquare, ShieldCheck, Sparkles, Users, Workflow, Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/brand/logo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { SectionCards } from "../section-cards";

const PRODUCTS = [
  { title: "Mimo", description: "AI interviews that screen candidates while you sleep.", icon: Bot },
  { title: "Careflow", description: "Clinic scheduling and patient portal.", icon: Users },
  { title: "Neralink", description: "Multi-branch operations for enterprises.", icon: Workflow },
  { title: "Insights", description: "Dashboards across every venture.", icon: BarChart3 },
];
const RESOURCES = [
  { title: "Docs", description: "Guides and API reference." },
  { title: "Changelog", description: "What shipped this month." },
  { title: "Community", description: "Ask and share with other builders." },
];

/** Block · Marketing navbar (shadcnstudio "Navbar"): NavigationMenu mega-menu on desktop, Drawer on mobile. */
export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-header border-b border-border bg-background/85 backdrop-blur-glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <a href="#/blocks" className="rounded-md outline-none focus-ring"><Logo height={22} title="agere home" /></a>
        <NavigationMenu aria-label="Main" className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[520px] grid-cols-2 gap-1 p-1">
                  {PRODUCTS.map((p) => (
                    <li key={p.title}>
                      <NavigationMenuLink href="#/blocks" className="flex-row items-start gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-background"><p.icon className="!text-foreground" aria-hidden /></span>
                        <span className="grid gap-0.5"><span className="font-medium leading-none">{p.title}</span><span className="text-sm leading-snug text-muted-foreground">{p.description}</span></span>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-1 p-1">
                  {RESOURCES.map((r) => (
                    <li key={r.title}><NavigationMenuLink href="#/blocks"><span className="font-medium leading-none">{r.title}</span><span className="text-sm text-muted-foreground">{r.description}</span></NavigationMenuLink></li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem><NavigationMenuLink href="#/blocks" className={navigationMenuTriggerStyle()}>Pricing</NavigationMenuLink></NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild><a href="#/blocks">Sign in</a></Button>
          <Button size="sm" asChild><a href="#/blocks">Get started</a></Button>
          <Drawer direction="right">
            <DrawerTrigger asChild><Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu"><Menu aria-hidden /></Button></DrawerTrigger>
            <DrawerContent>
              <DrawerHeader><DrawerTitle>Menu</DrawerTitle></DrawerHeader>
              <nav aria-label="Mobile" className="grid gap-1 px-4 pb-6">
                <p className="px-2 pb-1 pt-2 text-xs font-medium text-muted-foreground">Products</p>
                {PRODUCTS.map((p) => <DrawerClose key={p.title} asChild><a href="#/blocks" className="flex items-center gap-3 rounded-md px-2 py-2 text-sm outline-none hover:bg-accent focus-ring"><p.icon className="size-4 text-muted-foreground" aria-hidden />{p.title}</a></DrawerClose>)}
                <Separator className="my-2" />
                {["Pricing", "Docs", "Sign in"].map((t) => <DrawerClose key={t} asChild><a href="#/blocks" className="rounded-md px-2 py-2 text-sm outline-none hover:bg-accent focus-ring">{t}</a></DrawerClose>)}
              </nav>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}

/** Block · Hero (shadcnstudio "Hero Section"): announcement pill, headline, two CTAs, product preview. */
export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-16 text-center sm:px-6 md:pt-24">
        <div className="grid justify-items-center gap-6">
          <a href="#/blocks" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm shadow-xs outline-none hover:bg-accent focus-ring">
            <Badge className="rounded-full px-2 py-0">New</Badge> Mimo voice interviews are live <ArrowRight className="size-3.5" aria-hidden />
          </a>
          <h1 id="hero-title" className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">Launch ventures on one product foundation</h1>
          <p className="max-w-2xl text-balance text-lg text-muted-foreground">agere builds, validates and scales software companies in Indonesia. Every venture ships on the same design system, data layer and AI toolkit.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" trailingIcon={<ArrowRight />}>Start building</Button>
            <Button size="lg" variant="outline">Book a demo</Button>
          </div>
        </div>
        <div className="mx-auto w-full max-w-5xl rounded-2xl border border-border bg-muted/40 p-2 shadow-xl">
          <div className="rounded-xl border border-border bg-background p-4 text-left sm:p-6" aria-label="Product preview" role="img">
            <div aria-hidden className="pointer-events-none"><SectionCards /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Block · Logo cloud (shadcnstudio "Logo Cloud"). Wordmarks, not images, so no layout shift and no licensing. */
export function LogoCloud() {
  const names = ["Kulina", "Sregep", "FinKu", "Careflow", "Mimo", "Neralink"];
  return (
    <section aria-label="Trusted by" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-center text-sm text-muted-foreground">Trusted by teams building across Southeast Asia</p>
      <ul className="mt-6 grid grid-cols-2 items-center gap-6 text-center sm:grid-cols-3 lg:grid-cols-6">
        {names.map((n) => <li key={n} className="text-xl font-semibold tracking-tight text-muted-foreground/80">{n}</li>)}
      </ul>
    </section>
  );
}

const FEATURES = [
  { icon: Layers, title: "One design system", text: "shadcn-grade components and tokens, white-labelled per venture in minutes." },
  { icon: ShieldCheck, title: "Accessible by default", text: "WCAG 2.1 AA is a CI gate: contrast, keyboard and screen-reader tests on every PR." },
  { icon: Zap, title: "Fast to ship", text: "Dashboard, commerce and auth blocks you copy, wire to your API and deploy." },
  { icon: Globe, title: "Built for Indonesia", text: "IDR, Bahasa Indonesia copy rules, QRIS and local couriers out of the box." },
  { icon: MessageSquare, title: "AI where it helps", text: "Interview, triage and summarise with guardrails and human review." },
  { icon: CreditCard, title: "Billing included", text: "Plans, credits and invoices shared across ventures." },
];

/** Block · Features grid (shadcnstudio "Features Section"). */
export function FeaturesSection() {
  return (
    <section aria-labelledby="feat-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-2xl gap-3 text-center">
        <Badge variant="outline" className="mx-auto">Platform</Badge>
        <h2 id="feat-title" className="text-3xl font-semibold tracking-tight">Everything a new venture needs on day one</h2>
        <p className="text-muted-foreground">Stop rebuilding the same foundations. Spend the first sprint on the problem only you can solve.</p>
      </div>
      <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <li key={f.title} className="grid content-start gap-3 bg-background p-6">
            <span className="grid size-10 place-items-center rounded-lg border border-border bg-muted/50"><f.icon className="size-5" aria-hidden /></span>
            <h3 className="font-semibold">{f.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{f.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const TIERS = [
  { id: "starter", name: "Starter", monthly: 0, description: "For validating an idea.", features: ["1 project", "3 members", "Community support"], cta: "Start free" },
  { id: "pro", name: "Pro", monthly: 490_000, description: "For ventures with paying users.", features: ["Unlimited projects", "25 members", "Priority support", "Custom domain"], cta: "Start 14-day trial", featured: true },
  { id: "scale", name: "Scale", monthly: 2_900_000, description: "For multi-branch operations.", features: ["Everything in Pro", "SSO & audit log", "99.9% uptime SLA", "Dedicated success manager"], cta: "Contact sales" },
];
const rp = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

/** Block · Pricing (shadcnstudio "Pricing Component"): monthly/yearly switch (−20%), featured tier. */
export function PricingSection() {
  const [yearly, setYearly] = React.useState(true);
  return (
    <section aria-labelledby="price-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-2xl justify-items-center gap-4 text-center">
        <h2 id="price-title" className="text-3xl font-semibold tracking-tight">Simple, predictable pricing</h2>
        <p className="text-muted-foreground">Prices in Rupiah, excluding VAT. Cancel any time.</p>
        <div className="flex items-center gap-3 text-sm">
          <Label htmlFor="billing">Monthly</Label>
          <Switch id="billing" checked={yearly} onCheckedChange={setYearly} aria-label="Bill yearly" />
          <Label htmlFor="billing">Yearly <Badge variant="success" className="ml-1">Save 20%</Badge></Label>
        </div>
      </div>
      <ul className="mt-12 grid gap-6 lg:grid-cols-3">
        {TIERS.map((t) => {
          const price = yearly ? Math.round((t.monthly * 0.8) / 1000) * 1000 : t.monthly;
          return (
            <li key={t.id}>
              <Card className={cn("h-full", t.featured && "border-primary shadow-lg ring-1 ring-primary")}>
                <CardHeader>
                  <div className="flex items-center justify-between"><CardTitle as="h3">{t.name}</CardTitle>{t.featured && <Badge>Most popular</Badge>}</div>
                  <CardDescription>{t.description}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <p><span className="text-3xl font-semibold tracking-tight tabular-nums">{t.monthly ? rp(price) : "Free"}</span>{t.monthly > 0 && <span className="text-sm text-muted-foreground"> / month{yearly ? ", billed yearly" : ""}</span>}</p>
                  <ul className="grid gap-2 text-sm">{t.features.map((f) => <li key={f} className="flex items-center gap-2"><Check className="size-4 text-success" aria-hidden />{f}</li>)}</ul>
                </CardContent>
                <CardFooter><Button className="w-full" variant={t.featured ? "default" : "outline"} aria-label={`${t.cta} — ${t.name} plan`}>{t.cta}</Button></CardFooter>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const QUOTES = [
  { name: "Nadia Putri", role: "Head of Talent, Kulina", quote: "We screened 400 applicants in a week with Mimo — and the shortlist was better than our manual one." },
  { name: "dr. Raka Pratama", role: "Owner, Klinik Sehat", quote: "Patients book themselves now. Our front desk finally answers the phone again." },
  { name: "Sekar Ayu", role: "COO, Neralink", quote: "Rolling out to 38 branches took two weekends instead of two quarters." },
];

/** Block · Testimonials (shadcnstudio "Testimonials"). Real <blockquote> + <figcaption>. */
export function TestimonialsSection() {
  return (
    <section aria-labelledby="t-title" className="bg-muted/40 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="t-title" className="text-center text-3xl font-semibold tracking-tight">Loved by operators</h2>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {QUOTES.map((q) => (
            <li key={q.name}>
              <figure className="grid h-full content-between gap-6 rounded-xl border border-border bg-card p-6 shadow-sm">
                <blockquote className="text-sm leading-relaxed">“{q.quote}”</blockquote>
                <figcaption className="flex items-center gap-3"><Avatar name={q.name} size="lg" aria-hidden /><span className="grid"><span className="text-sm font-medium">{q.name}</span><span className="text-xs text-muted-foreground">{q.role}</span></span></figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const FAQ = [
  ["Can each venture use its own brand?", "Yes. Set data-brand or call applyBrandColor(); text contrast is recalculated automatically and checked against WCAG AA."],
  ["Do you support Bahasa Indonesia?", "All blocks follow the DS UX-writing rules for Indonesian and English, including the Anda/kamu voice per product."],
  ["Which payment methods are supported?", "QRIS, virtual accounts from major Indonesian banks, cards and cash on delivery."],
  ["Is there a free plan?", "Starter is free forever for one project and three members."],
];

/** Block · FAQ (shadcnstudio "FAQ"): Accordion, one open at a time. */
export function FaqSection() {
  return (
    <section aria-labelledby="faq-title" className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.4fr]">
      <div className="grid content-start gap-3">
        <h2 id="faq-title" className="text-3xl font-semibold tracking-tight">Questions, answered</h2>
        <p className="text-muted-foreground">Can't find what you need? <a href="#/blocks" className="font-medium text-foreground underline underline-offset-4">Talk to us</a>.</p>
      </div>
      <Accordion type="single" collapsible defaultValue="q0">
        {FAQ.map(([q, a], i) => (
          <AccordionItem key={q} value={`q${i}`}><AccordionTrigger>{q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{a}</AccordionContent></AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

/** Block · CTA with newsletter (shadcnstudio "CTA Section"). */
export function CtaSection() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string>();
  return (
    <section aria-labelledby="cta-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-6 rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
        <Sparkles className="mx-auto size-8" aria-hidden />
        <h2 id="cta-title" className="text-3xl font-semibold tracking-tight text-primary-foreground">Build your next venture with us</h2>
        <p className="mx-auto max-w-xl text-primary-foreground/80">Monthly notes on what we launch, what we learn and what we kill.</p>
        <form
          noValidate
          className="mx-auto grid w-full max-w-md gap-2 text-left sm:grid-cols-[1fr_auto]"
          onSubmit={(e) => { e.preventDefault(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("Enter a valid email address."); setError(undefined); setEmail(""); toast.success("You're subscribed"); }}
        >
          <label htmlFor="cta-email" className="sr-only">Email address</label>
          <Input id="cta-email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={error ? true : undefined} aria-describedby={error ? "cta-err" : undefined}
            className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:border-primary-foreground" />
          <Button type="submit" variant="secondary">Subscribe</Button>
          {error && <p id="cta-err" className="text-sm font-medium sm:col-span-2">{error}</p>}
        </form>
      </div>
    </section>
  );
}

/** Block · Footer (shadcnstudio "Footer"). */
export function MarketingFooter() {
  const cols = { Product: ["Mimo", "Careflow", "Neralink", "Pricing"], Company: ["About", "Careers", "Press"], Resources: ["Docs", "Changelog", "Status"], Legal: ["Privacy", "Terms"] };
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_repeat(4,1fr)]">
        <div className="grid content-start gap-3"><Logo height={22} title="agere" /><p className="text-sm text-muted-foreground">Venture studio · Surabaya & Jakarta</p></div>
        {Object.entries(cols).map(([h, links]) => (
          <nav key={h} aria-label={h} className="grid content-start gap-2 text-sm">
            <p className="font-medium">{h}</p>
            {links.map((l) => <a key={l} href="#/blocks" className="w-fit rounded-sm text-muted-foreground outline-none hover:text-foreground focus-ring">{l}</a>)}
          </nav>
        ))}
      </div>
      <div className="border-t border-border"><p className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground sm:px-6">© 2026 agere. All rights reserved.</p></div>
    </footer>
  );
}

/** Full landing page composed of the marketing blocks. */
export function LandingPage() {
  return (
    <div className="min-h-dvh bg-background">
      <MarketingNavbar />
      <main id="landing-main">
        <HeroSection /><LogoCloud /><FeaturesSection /><PricingSection /><TestimonialsSection /><FaqSection /><CtaSection />
      </main>
      <MarketingFooter />
    </div>
  );
}
