"use client";

import * as React from "react";
import { Clock, ExternalLink, LocateFixed, MapPin, Phone, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Toggle } from "@/components/ui/toggle";
import { BRANCHES, type Branch } from "./workspace-data";

const HOME = { name: "Surabaya", lat: -7.2575, lng: 112.7521 };
const km = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
/* Equirectangular projection of the branch bounding box (+ padding) into a 1000×560 viewBox. */
const B = { minLat: -8.35, maxLat: -7.1, minLng: 111.25, maxLng: 113.9 };
const project = (lat: number, lng: number) => ({
  x: ((lng - B.minLng) / (B.maxLng - B.minLng)) * 100,
  y: ((B.maxLat - lat) / (B.maxLat - B.minLat)) * 100,
});

/**
 * Block · Store locator (shadcnstudio "Map Blocks"). Search (InputGroup) · "Open now" toggle · branch list (ItemGroup)
 * sorted by real distance (haversine) · a SCHEMATIC map whose pins are placed from real coordinates. Pins are HTML
 * buttons (focusable, named) layered over a decorative SVG; list and map share one selection.
 * Swap the SVG for MapLibre / Leaflet / Google Maps in production — keep the list: it is the accessible view.
 */
export function StoreLocator({ className }: { className?: string }) {
  const [q, setQ] = React.useState("");
  const [openOnly, setOpenOnly] = React.useState(false);
  const [selected, setSelected] = React.useState<string>("b1");
  const list = BRANCHES.map((b) => ({ ...b, km: km(HOME, b) }))
    .filter((b) => (!openOnly || b.open) && `${b.name} ${b.city} ${b.address}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.km - b.km);
  const current = list.find((b) => b.id === selected) ?? list[0];
  const home = project(HOME.lat, HOME.lng);
  const status = (b: Branch) => (b.open ? "Open now" : "Closed");

  return (
    <div className={cn("grid h-[640px] overflow-hidden rounded-xl border border-border bg-background max-md:grid-rows-[minmax(0,1fr)_360px] md:grid-cols-[340px_1fr]", className)}>
      <section aria-labelledby="loc-title" className="flex min-h-0 flex-col border-b border-border md:border-b-0 md:border-r">
        <div className="grid gap-3 border-b border-border p-4">
          <h2 id="loc-title" className="text-base font-semibold">Find a pickup point</h2>
          <InputGroup>
            <InputGroupAddon><Search aria-hidden /></InputGroupAddon>
            <InputGroupInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="City, street or branch…" aria-label="Search pickup points" />
          </InputGroup>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground" aria-live="polite">{list.length} of {BRANCHES.length} · nearest to {HOME.name}</p>
            <Toggle size="sm" variant="outline" pressed={openOnly} onPressedChange={setOpenOnly} className="px-2.5">Open now</Toggle>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {list.length ? (
            <ItemGroup aria-label="Pickup points" className="gap-1">
              {list.map((b) => (
                <Item key={b.id} asChild size="sm" variant={current?.id === b.id ? "muted" : "default"}>
                  <button type="button" onClick={() => setSelected(b.id)} aria-pressed={current?.id === b.id} className="w-full text-left hover:bg-accent/60">
                    <ItemMedia variant="icon"><MapPin aria-hidden /></ItemMedia>
                    <ItemContent>
                      <ItemTitle>{b.name}</ItemTitle>
                      <ItemDescription>{b.address}, {b.city}</ItemDescription>
                    </ItemContent>
                    <div className="grid justify-items-end gap-1 text-xs">
                      <span className="tabular-nums">{b.km < 1 ? "<1" : Math.round(b.km)} km</span>
                      <Badge variant={b.open ? "success" : "gray"} className="text-[11px]">{status(b)}</Badge>
                    </div>
                  </button>
                </Item>
              ))}
            </ItemGroup>
          ) : (
            <p className="p-6 text-center text-sm text-muted-foreground">No pickup points match. Try another city or turn off “Open now”.</p>
          )}
        </div>
      </section>

      <section aria-label="Map" className="relative min-h-[280px] overflow-hidden bg-muted/40">
        {/* On phones the canvas stops above the detail card, so no pin sits underneath it. */}
        <div className="absolute inset-x-0 top-0 bottom-0 max-sm:bottom-[150px]">
        <svg aria-hidden viewBox="0 0 100 56" preserveAspectRatio="none" className="absolute inset-0 size-full">
          <defs><pattern id="loc-grid" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0H0V5" fill="none" className="stroke-[hsl(var(--border))]" strokeWidth="0.15" /></pattern></defs>
          <rect width="100" height="56" fill="url(#loc-grid)" />
          {/* schematic corridors between the branches — not real roads */}
          <polyline fill="none" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" className="stroke-[hsl(var(--border-strong))]" vectorEffect="non-scaling-stroke"
            points={["b5", "b4", "b6", "b3", "b2", "b1"].map((id) => { const b = BRANCHES.find((x) => x.id === id)!; const p = project(b.lat, b.lng); return `${p.x},${(p.y * 56) / 100}`; }).join(" ")} />
          <polyline fill="none" strokeWidth="0.6" strokeLinecap="round" className="stroke-[hsl(var(--border-strong))]" vectorEffect="non-scaling-stroke"
            points={["b3", "b7"].map((id) => { const b = BRANCHES.find((x) => x.id === id)!; const p = project(b.lat, b.lng); return `${p.x},${(p.y * 56) / 100}`; }).join(" ")} />
        </svg>
        <span aria-hidden className="absolute z-[1] grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-info-solid ring-4 ring-info-solid/25" style={{ left: `${home.x}%`, top: `${home.y}%` }} />
        <div role="group" aria-label="Pickup points on the map" className="absolute inset-0">
          {list.map((b) => {
            const p = project(b.lat, b.lng);
            const on = current?.id === b.id;
            return (
              <button key={b.id} type="button" onClick={() => setSelected(b.id)} aria-pressed={on} aria-label={`${b.name}, ${status(b)}, ${Math.round(b.km)} km`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className={cn("absolute z-[2] -translate-x-1/2 -translate-y-full rounded-full outline-none transition-transform focus-ring", on && "z-[3] scale-125")}>
                <MapPin aria-hidden className={cn("size-7 drop-shadow", on ? "fill-primary text-primary-foreground" : b.open ? "fill-[hsl(var(--chart-1))] text-background" : "fill-muted-foreground text-background")} />
              </button>
            );
          })}
        </div>
        </div>
        {/* Detail card sits bottom-LEFT: the south-west of the bounding box is sea, so it never hides a pin. */}
        {current && (
          <div className="absolute inset-x-3 bottom-3 z-[4] rounded-xl border border-border bg-popover p-3 shadow-lg sm:inset-x-auto sm:left-4 sm:w-80 sm:p-4" aria-live="polite">
            <div className="flex items-start justify-between gap-2">
              <div className="grid gap-0.5"><p className="text-sm font-semibold">{current.name}</p><p className="text-xs text-muted-foreground">{current.address}, {current.city}</p></div>
              <Badge variant={current.open ? "success" : "gray"}>{status(current)}</Badge>
            </div>
            {/* Hours and phone stay on phones (that's where a tap-to-call matters most); only the service badges drop. */}
            <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm sm:mt-3 sm:grid">
              <li className="flex items-center gap-2"><Clock className="size-4 text-muted-foreground" aria-hidden />{current.hours}</li>
              <li className="flex items-center gap-2"><Phone className="size-4 text-muted-foreground" aria-hidden /><a href={`tel:${current.phone.replace(/\s/g, "")}`} className="underline-offset-4 hover:underline">{current.phone}</a></li>
              <li className="flex flex-wrap gap-1 pt-1 max-sm:hidden" aria-label="Services">{current.services.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}</li>
            </ul>
            <Button asChild size="sm" className="mt-3 w-full">
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${current.lat},${current.lng}`} target="_blank" rel="noreferrer"
                aria-label={`Directions to ${current.name} (opens Google Maps in a new tab)`}>
                Directions <ExternalLink aria-hidden />
              </a>
            </Button>
          </div>
        )}
        <p className="pointer-events-none absolute left-3 top-3 z-[1] flex items-center gap-1.5 rounded-md bg-background/90 px-2 py-1 text-xs text-muted-foreground shadow-xs">
          <LocateFixed className="size-3.5" aria-hidden /> Schematic — pins from real coordinates, not a street map
        </p>
      </section>
    </div>
  );
}
