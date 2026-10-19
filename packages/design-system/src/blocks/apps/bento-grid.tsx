"use client";

import * as React from "react";
import { Area, AreaChart, XAxis } from "recharts";
import { Accessibility, ArrowUpRight, Bot, Check, Globe, Palette, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "@/components/ui/carousel";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { STATE_ILLUSTRATION_LIST } from "@/brand/state-illustrations";

const series = [18, 22, 21, 27, 31, 29, 36, 41, 39, 47, 52, 58].map((v, i) => ({ m: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"][i], v }));
const config = { v: { label: "Ventures shipped", color: "var(--chart-2)" } } satisfies ChartConfig;

function Tile({ className, children, labelledBy }: { className?: string; children: React.ReactNode; labelledBy: string }) {
  return (
    <li aria-labelledby={labelledBy} className={cn("group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md", className)}>
      {children}
    </li>
  );
}
function TileHead({ id, icon: Icon, title, text }: { id: string; icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return (
    <div className="grid gap-2">
      <span aria-hidden className="grid size-9 place-items-center rounded-lg border border-border bg-muted/60"><Icon className="size-4" /></span>
      <h3 id={id} className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

/**
 * Block · Bento grid (shadcnstudio "Bento Grid"). Six tiles on a 6-column grid (spans 4·2 / 2·2·2 / 3·3),
 * one column on phones. It's a list of features (ul > li), each tile named by its heading; live content inside
 * tiles is decorative or independently operable (the carousel), never the only place information lives.
 */
export function BentoGrid() {
  const art = STATE_ILLUSTRATION_LIST.filter((i) => ["universal/success", "ledger/reconciled", "education/complete", "hiring/applied", "universal/caught-up"].includes(i.id));
  return (
    <section aria-labelledby="bento-title" className="mx-auto w-full max-w-6xl">
      <div className="mb-10 grid max-w-2xl gap-3">
        <Badge variant="outline" className="w-fit">Why agere</Badge>
        <h2 id="bento-title" className="text-3xl font-semibold tracking-tight">One foundation, every venture</h2>
        <p className="text-muted-foreground">Design system, blocks and illustrations that ship together — so the first sprint goes to the problem, not the plumbing.</p>
      </div>
      <ul aria-label="Features" className="grid gap-4 md:auto-rows-[minmax(13rem,auto)] md:grid-cols-6">
        <Tile labelledBy="b1" className="md:col-span-4 md:row-span-2">
          <TileHead id="b1" icon={ArrowUpRight} title="Dashboards on day one" text="Shell, stat cards, charts and data tables — wired to your API instead of built from scratch." />
          <div className="mt-6 flex items-end gap-6">
            <p><span className="block text-4xl font-semibold tracking-tight tabular-nums">58</span><span className="text-sm text-muted-foreground">screens shipped in September</span></p>
            <Badge variant="success" className="mb-1">+12% vs August</Badge>
          </div>
          <ChartContainer config={config} className="-mx-2 mt-auto aspect-auto h-44 w-[calc(100%+1rem)]" title="Screens shipped per month, October to September, rising from 18 to 58">
            <AreaChart data={series} margin={{ left: 8, right: 8, top: 8 }}>
              <defs><linearGradient id="bento-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-v)" stopOpacity={0.6} /><stop offset="95%" stopColor="var(--color-v)" stopOpacity={0.05} /></linearGradient></defs>
              <XAxis dataKey="m" tickLine={false} axisLine={false} tickMargin={8} interval="preserveStartEnd" />
              <Area dataKey="v" type="natural" stroke="var(--color-v)" strokeWidth={2} fill="url(#bento-fill)" />
            </AreaChart>
          </ChartContainer>
        </Tile>

        <Tile labelledBy="b2" className="md:col-span-2">
          <TileHead id="b2" icon={Accessibility} title="Accessible by default" text="WCAG 2.1 AA is a CI gate — contrast, keyboard and axe-core on every PR." />
          <p className="mt-auto pt-6"><span className="text-4xl font-semibold tracking-tight">4.5:1</span> <span className="text-sm text-muted-foreground">minimum text contrast</span></p>
        </Tile>

        <Tile labelledBy="b3" className="md:col-span-2">
          <TileHead id="b3" icon={Palette} title="White-label in minutes" text="One brand token per venture; text contrast is recalculated for you." />
          <div aria-hidden className="mt-auto flex gap-2 pt-6">
            {["hsl(var(--primary))", "#4f46e5", "#047857", "#db7706"].map((c) => <span key={c} className="size-9 rounded-full border border-border shadow-xs" style={{ background: c }} />)}
          </div>
        </Tile>

        <Tile labelledBy="b4" className="md:col-span-3">
          <TileHead id="b4" icon={Check} title="25 state illustrations" text="Empty, success, error and onboarding moments in one line style — token colored, no text inside." />
          <Carousel label="Illustration samples" opts={{ loop: true }} className="mt-4">
            <CarouselContent>
              {art.map(({ id, Component }, i) => (
                <CarouselItem key={id} index={i} className="grid place-items-center"><Component size={220} /></CarouselItem>
              ))}
            </CarouselContent>
            <CarouselDots className="mt-2" />
          </Carousel>
        </Tile>

        <Tile labelledBy="b5" className="md:col-span-3">
          <TileHead id="b5" icon={Globe} title="Built for Indonesia" text="Rupiah formatting, Bahasa Indonesia copy rules and local rails out of the box." />
          <ul aria-label="Local integrations" className="mt-auto flex flex-wrap gap-2 pt-6">
            {["IDR · id-ID", "QRIS", "Virtual account", "COD", "JNE · SiCepat · GoSend", "WhatsApp Business"].map((t) => <li key={t}><Badge variant="secondary">{t}</Badge></li>)}
          </ul>
        </Tile>

        <Tile labelledBy="b6" className="md:col-span-4">
          <div className="grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-center">
            <TileHead id="b6" icon={Bot} title="AI where it helps" text="Mimo screens candidates, summarises threads and drafts replies — with a human approving every send." />
            <div aria-hidden className="grid gap-2 rounded-xl border border-border bg-muted/40 p-4 text-sm">
              <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-background px-3 py-2 shadow-xs">Summarise the 48 applicants for Ops Lead.</p>
              <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground">6 scored ≥ 80. Top pick: Ayu W. — 7 yrs in 3PL ops, strong Bahasa & English.</p>
            </div>
          </div>
        </Tile>

        <Tile labelledBy="b7" className="md:col-span-2">
          <TileHead id="b7" icon={ShieldCheck} title="Enterprise ready" text="SSO, audit log and role-based access for multi-branch teams." />
          <Button variant="outline" size="sm" className="mt-auto w-fit" aria-label="Talk to sales about enterprise">Talk to sales</Button>
        </Tile>
      </ul>
    </section>
  );
}
