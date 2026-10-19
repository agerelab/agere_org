import type * as React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface StatCardData {
  label: string;
  value: string;
  delta: number;
  footnote: string;
  caption: string;
}

export const STATS: StatCardData[] = [
  { label: "Total revenue", value: "$1,250.00", delta: 12.5, footnote: "Trending up this month", caption: "Visitors for the last 6 months" },
  { label: "New customers", value: "1,234", delta: -20, footnote: "Down 20% this period", caption: "Acquisition needs attention" },
  { label: "Active accounts", value: "45,678", delta: 12.5, footnote: "Strong user retention", caption: "Engagement exceeds targets" },
  { label: "Growth rate", value: "4.5%", delta: 4.5, footnote: "Steady performance increase", caption: "Meets growth projections" },
];

/**
 * 4 → 2 → 1 columns from the CONTAINER width (never 3 + an orphan), no container queries needed:
 * track = 4-up width while that is ≥ 15rem, else 2-up while ≥ 15rem, else 100%.
 */
const QUAD = "calc((100% - 3rem) / 4 - 0.1px)";
const HALF = "calc((100% - 1rem) / 2 - 0.1px)";
const TWO_OR_ONE = `max(${HALF}, min(100%, calc((15rem - ${HALF}) * 999)))`;
const TRACK = `max(${QUAD}, min(${TWO_OR_ONE}, calc((15rem - ${QUAD}) * 999)))`;
export const statGridStyle: React.CSSProperties = { gridTemplateColumns: `repeat(auto-fill, minmax(${TRACK}, 1fr))` };

/**
 * Responds to its container width (auto-fit grid), not the viewport — works inside any shell.
 * Block · Statistics cards (shadcnstudio "Statistics" / shadcn dashboard-01 SectionCards).
 * Trend meaning is carried by text ("Trending up") and the sign, never by color alone (WCAG 1.4.1).
 */
export function SectionCards({ stats = STATS }: { stats?: StatCardData[] }) {
  return (
    <div className="grid w-full gap-4" style={statGridStyle}>
      {stats.map((s) => {
        const up = s.delta >= 0;
        const Icon = up ? TrendingUp : TrendingDown;
        return (
          <Card key={s.label} className="bg-gradient-to-t from-primary/[0.04] to-card">
            <CardHeader>
              <CardDescription>{s.label}</CardDescription>
              <CardTitle as="div" className="text-2xl font-semibold tabular-nums tracking-tight">{s.value}</CardTitle>
              <CardAction>
                <Badge variant="outline" aria-label={`${up ? "Up" : "Down"} ${Math.abs(s.delta)} percent`}>
                  <Icon aria-hidden />
                  {up ? "+" : "−"}{Math.abs(s.delta)}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex gap-2 font-medium">{s.footnote} <Icon className="size-4" aria-hidden /></div>
              <div className="text-muted-foreground">{s.caption}</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
