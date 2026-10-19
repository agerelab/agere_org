"use client";

import * as React from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Label, Pie, PieChart, PolarRadiusAxis, RadialBar, RadialBarChart, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { revenueByPlan, trafficSources, usd, visitorsSeries } from "./data";

const fmtDay = (v: string) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" });

/* ------------------------------------------------------------------ */
/* Area — interactive range (shadcn chart-area-interactive)            */
/* ------------------------------------------------------------------ */
const visitorsConfig = {
  visitors: { label: "Visitors" },
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
} satisfies ChartConfig;

type Range = "90d" | "30d" | "7d";
const RANGE_LABEL: Record<Range, string> = { "90d": "Last 3 months", "30d": "Last 30 days", "7d": "Last 7 days" };

/** Block · Chart card with range switcher. ToggleGroup on desktop, Select below 768px (same state). */
export function ChartAreaInteractive() {
  const [range, setRange] = React.useState<Range>("90d");
  const data = React.useMemo(() => visitorsSeries.slice(-Number(range.replace("d", ""))), [range]);
  const total = data.reduce((a, d) => a + d.desktop + d.mobile, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total visitors</CardTitle>
        <CardDescription>
          <span className="hidden sm:inline">{total.toLocaleString()} visits · {RANGE_LABEL[range]}</span>
          <span className="sm:hidden">{RANGE_LABEL[range]}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup type="single" value={range} onValueChange={(v) => v && setRange(v as Range)} variant="outline" className="hidden md:flex" aria-label="Time range">
            <ToggleGroupItem value="90d" className="px-3">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d" className="px-3">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d" className="px-3">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={range} onValueChange={(v) => setRange(v as Range)}>
            <SelectTrigger className="flex w-40 md:hidden" size="md" aria-label="Time range"><SelectValue /></SelectTrigger>
            <SelectContent className="rounded-lg">
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={visitorsConfig} className="aspect-auto h-[250px] w-full" title={`Area chart of desktop and mobile visitors, ${RANGE_LABEL[range]}`}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={1} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={fmtDay} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(v) => fmtDay(String(v))} indicator="dot" />} />
            <Area dataKey="mobile" type="natural" fill="url(#fillMobile)" stroke="var(--color-mobile)" stackId="a" />
            <Area dataKey="desktop" type="natural" fill="url(#fillDesktop)" stroke="var(--color-desktop)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Stacked bar — revenue by plan                                       */
/* ------------------------------------------------------------------ */
const planConfig = {
  starter: { label: "Starter", color: "var(--chart-3)" },
  pro: { label: "Pro", color: "var(--chart-2)" },
  enterprise: { label: "Enterprise", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function ChartBarStacked() {
  const last = revenueByPlan[revenueByPlan.length - 1];
  const prev = revenueByPlan[revenueByPlan.length - 2];
  const sum = (m: typeof last) => m.starter + m.pro + m.enterprise;
  const growth = ((sum(last) - sum(prev)) / sum(prev)) * 100;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by plan</CardTitle>
        <CardDescription>April – September 2026</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={planConfig} className="aspect-auto h-[240px] w-full" title="Stacked bar chart of monthly revenue by plan">
          <BarChart data={revenueByPlan}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="starter" stackId="a" fill="var(--color-starter)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="pro" stackId="a" fill="var(--color-pro)" />
            <Bar dataKey="enterprise" stackId="a" fill="var(--color-enterprise)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="flex gap-2 font-medium leading-none">Up {growth.toFixed(1)}% vs August <TrendingUp className="size-4" aria-hidden /></div>
        <div className="leading-none text-muted-foreground">{usd(sum(last))} billed in September</div>
      </CardFooter>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Donut — traffic sources, total in the middle                        */
/* ------------------------------------------------------------------ */
const trafficConfig = {
  visitors: { label: "Visitors" },
  organic: { label: "Organic", color: "var(--chart-1)" },
  direct: { label: "Direct", color: "var(--chart-2)" },
  referral: { label: "Referral", color: "var(--chart-3)" },
  social: { label: "Social", color: "var(--chart-4)" },
  email: { label: "Email", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function ChartDonut() {
  const total = trafficSources.reduce((a, s) => a + s.visitors, 0);
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Traffic sources</CardTitle>
        <CardDescription>September 2026</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={trafficConfig} className="mx-auto aspect-square max-h-[220px]" title={`Donut chart of ${total.toLocaleString()} visitors by source`}>
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="source" />} />
            <Pie data={trafficSources} dataKey="visitors" nameKey="source" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">{total.toLocaleString()}</tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 22} className="fill-muted-foreground text-xs">Visitors</tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          {trafficSources.map((s) => (
            <li key={s.source} className="flex items-center gap-2">
              <span aria-hidden className="size-2 rounded-[2px]" style={{ background: `hsl(var(--chart-${Object.keys(trafficConfig).indexOf(s.source)}))` }} />
              <span className="text-muted-foreground">{trafficConfig[s.source as keyof typeof trafficConfig].label}</span>
              <span className="ml-auto font-medium tabular-nums">{Math.round((s.visitors / total) * 100)}%</span>
            </li>
          ))}
        </ul>
      </CardFooter>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Radial — goal progress                                              */
/* ------------------------------------------------------------------ */
const goalConfig = { mrr: { label: "MRR", color: "var(--chart-2)" } } satisfies ChartConfig;

export function ChartRadialGoal({ value = 72_400, goal = 100_000 }: { value?: number; goal?: number }) {
  const pct = Math.round((value / goal) * 100);
  const data = [{ name: "mrr", mrr: value, fill: "var(--color-mrr)" }];
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Q3 MRR goal</CardTitle>
        <CardDescription>{usd(goal)} target</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={goalConfig} className="mx-auto aspect-square max-h-[220px]" title={`Radial chart: ${pct}% of the ${usd(goal)} MRR goal reached`}>
          <RadialBarChart data={data} startAngle={90} endAngle={90 - (360 * pct) / 100} innerRadius={80} outerRadius={110}>
            <RadialBar dataKey="mrr" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">{pct}%</tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-xs">{usd(value)}</tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-1.5 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">{usd(goal - value)} to go <TrendingUp className="size-4" aria-hidden /></div>
        <div className="leading-none text-muted-foreground">Ends 30 September</div>
      </CardFooter>
    </Card>
  );
}
