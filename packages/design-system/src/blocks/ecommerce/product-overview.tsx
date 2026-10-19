"use client";

import * as React from "react";
import { Heart, Minus, Plus, RotateCcw, ShoppingBag, Star, Truck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "@/components/ui/toast";
import { ProductArt } from "./product-art";
import { idr, products, type Product } from "./data";

/** Quantity stepper: a spinbutton-like pair of buttons around a live value. */
export function QuantityStepper({ value, onChange, max = 99, itemName }: { value: number; onChange: (n: number) => void; max?: number; itemName?: string }) {
  const of = itemName ? ` of ${itemName}` : "";
  return (
    <div role="group" aria-label={`Quantity${of}`} className="inline-flex h-10 items-center rounded-md border border-input shadow-xs">
      <Button variant="ghost" size="icon" className="size-10 rounded-r-none" onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1} aria-label={`Decrease quantity${of}`}><Minus aria-hidden /></Button>
      <output aria-live="polite" className="w-10 text-center text-sm tabular-nums">{value}</output>
      <Button variant="ghost" size="icon" className="size-10 rounded-l-none" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Increase quantity${of}`}><Plus aria-hidden /></Button>
    </div>
  );
}

/**
 * Block · Product overview (shadcnstudio "Product Overview").
 * Gallery with a thumbnail rail · color + size as radio groups · quantity · add to cart / wishlist ·
 * delivery promise · details accordion. Low-stock is stated in text, not only color.
 */
export function ProductOverview({ product = products[4] }: { product?: Product }) {
  const [color, setColor] = React.useState(product.colors[0].id);
  const [size, setSize] = React.useState(product.sizes?.[0]);
  const [view, setView] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const token = product.colors.find((c) => c.id === color)!.token;
  const views = ["Front", "Side", "Detail"];
  return (
    <section aria-labelledby="pdp-title" className="grid w-full gap-8 md:grid-cols-2">
      <div className="grid gap-3">
        <div className="aspect-square rounded-xl border border-border bg-muted/50 p-10">
          <ProductArt kind={product.kind} color={token} label={`${product.name}, ${product.colors.find((c) => c.id === color)!.label}, ${views[view].toLowerCase()} view`} className={cn(view === 1 && "scale-x-[-1]", view === 2 && "scale-125")} />
        </div>
        <div role="group" aria-label="Product images" className="grid grid-cols-3 gap-3">
          {views.map((v, i) => (
            <button key={v} type="button" aria-pressed={view === i} aria-label={`${v} view`} onClick={() => setView(i)}
              className="aspect-square rounded-lg border border-border bg-muted/50 p-3 outline-none transition-colors hover:bg-muted focus-ring aria-pressed:border-primary aria-pressed:shadow-[0_0_0_1px_hsl(var(--primary))]">
              <ProductArt kind={product.kind} color={token} className={cn(i === 1 && "scale-x-[-1]", i === 2 && "scale-125")} />
            </button>
          ))}
        </div>
      </div>

      <div className="grid content-start gap-6">
        <div className="grid gap-2">
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <h2 id="pdp-title" className="text-2xl font-semibold tracking-tight">{product.name}</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex" aria-hidden>{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={cn("size-4", s <= Math.round(product.rating) ? "fill-[hsl(var(--chart-4))] text-[hsl(var(--chart-4))]" : "text-muted-foreground")} />)}</span>
            <span><span className="sr-only">Rated </span>{product.rating}<span className="sr-only"> out of 5</span></span>
            <a href="#/blocks" className="text-muted-foreground underline underline-offset-4 hover:text-foreground">{product.reviews} reviews</a>
          </div>
          <p className="text-2xl font-semibold tabular-nums">{idr(product.price)}</p>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

        <fieldset className="grid gap-3">
          <legend className="mb-3 text-sm font-medium">Color: <span className="text-muted-foreground">{product.colors.find((c) => c.id === color)!.label}</span></legend>
          <RadioGroup value={color} onValueChange={setColor} className="flex gap-3" aria-label="Color">
            {product.colors.map((c) => (
              <Label key={c.id} htmlFor={`c-${c.id}`} className="cursor-pointer">
                <RadioGroupItem id={`c-${c.id}`} value={c.id} aria-label={c.label} className="peer !sr-only" />
                <span aria-hidden className="block size-8 rounded-full border border-border ring-offset-2 ring-offset-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary" style={{ background: `hsl(var(--${c.token}))` }} />
              </Label>
            ))}
          </RadioGroup>
        </fieldset>

        {product.sizes && (
          <fieldset className="grid gap-3">
            <legend className="mb-3 text-sm font-medium">Size</legend>
            <RadioGroup value={size} onValueChange={setSize} className="flex flex-wrap gap-2" aria-label="Size">
              {product.sizes.map((s) => (
                <Label key={s} htmlFor={`s-${s}`} className="cursor-pointer">
                  <RadioGroupItem id={`s-${s}`} value={s} className="peer !sr-only" />
                  <span className="inline-flex h-10 min-w-16 items-center justify-center rounded-md border border-input px-3 text-sm shadow-xs peer-focus-visible:shadow-[0_0_0_3px_hsl(var(--ring)/0.5)] peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground">{s}</span>
                </Label>
              ))}
            </RadioGroup>
          </fieldset>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <QuantityStepper value={qty} onChange={setQty} max={product.stock || 1} />
          <Button className="flex-1" size="lg" leadingIcon={<ShoppingBag />} disabled={!product.stock} onClick={() => toast.success(`${qty} × ${product.name} added to cart`)}>Add to cart</Button>
          <Toggle variant="outline" size="lg" aria-label="Save to wishlist" className="data-[state=on]:[&_svg]:fill-current"><Heart aria-hidden /></Toggle>
        </div>
        {product.stock > 0 && product.stock < 10 && <Badge variant="attention" className="w-fit">Only {product.stock} left</Badge>}

        <ul className="grid gap-2 rounded-lg border border-border p-4 text-sm">
          <li className="flex items-center gap-2"><Truck aria-hidden className="size-4 text-muted-foreground" /> Free delivery in Java on orders over {idr(250_000)}</li>
          <li className="flex items-center gap-2"><RotateCcw aria-hidden className="size-4 text-muted-foreground" /> 14-day returns</li>
        </ul>

        <Accordion type="single" collapsible defaultValue="details">
          <AccordionItem value="details"><AccordionTrigger>Details</AccordionTrigger><AccordionContent className="text-muted-foreground">Food-grade 18/8 stainless steel. BPA-free lid. Hand wash recommended.</AccordionContent></AccordionItem>
          <AccordionItem value="shipping"><AccordionTrigger>Shipping</AccordionTrigger><AccordionContent className="text-muted-foreground">Ships from Surabaya within 24 hours. JNE, SiCepat and GoSend available at checkout.</AccordionContent></AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
