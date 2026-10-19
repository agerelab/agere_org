"use client";

import * as React from "react";
import { ShoppingBag, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { ProductArt } from "./product-art";
import { idr, products, type Product } from "./data";

const CATEGORIES = ["Kitchen", "Bags", "Stationery", "Apparel", "Home"] as const;
type Sort = "featured" | "price-asc" | "price-desc" | "rating";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock === 0;
  return (
    <article aria-labelledby={`${product.id}-name`} className="group relative flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted/50 p-6 transition-colors group-hover:bg-muted">
        <ProductArt kind={product.kind} color={product.colors[0].token} />
        {product.badge && <Badge variant={product.badge === "Sale" ? "destructive" : "default"} className="absolute left-3 top-3">{product.badge}</Badge>}
        {soldOut && <Badge variant="secondary" className="absolute right-3 top-3">Sold out</Badge>}
      </div>
      <div className="grid gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 id={`${product.id}-name`} className="text-sm font-medium">
            <a href="#/blocks" className="rounded-sm outline-none after:absolute after:inset-0 after:content-[''] focus-ring">{product.name}</a>
          </h3>
          <p className="shrink-0 text-sm font-semibold tabular-nums">
            {product.compareAt && <span className="sr-only">Now </span>}{idr(product.price)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{product.category}</span>
          {product.compareAt && <s className="tabular-nums"><span className="sr-only">Was </span>{idr(product.compareAt)}</s>}
        </div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star aria-hidden className="size-3.5 fill-[hsl(var(--chart-4))] text-[hsl(var(--chart-4))]" />
          <span><span className="font-medium text-foreground">{product.rating}</span> ({product.reviews} reviews)</span>
        </p>
      </div>
      <Button variant="outline" size="sm" disabled={soldOut} className="relative z-[1]" onClick={() => toast.success(`${product.name} added to cart`)} leadingIcon={<ShoppingBag />} aria-label={`${soldOut ? "Sold out" : "Add to cart"}: ${product.name}`}>
        {soldOut ? "Sold out" : "Add to cart"}
      </Button>
    </article>
  );
}

/**
 * Block · Product list with filters (shadcnstudio "Product List" / "Category Filter").
 * Filters apply instantly and the result count is announced (aria-live). Whole card is one link.
 */
export function ProductList() {
  const [cats, setCats] = React.useState<string[]>([]);
  const [max, setMax] = React.useState(200_000);
  const [inStock, setInStock] = React.useState(false);
  const [sort, setSort] = React.useState<Sort>("featured");

  const shown = React.useMemo(() => {
    const list = products.filter((p) => (!cats.length || cats.includes(p.category)) && p.price <= max && (!inStock || p.stock > 0));
    const by: Record<Sort, (a: Product, b: Product) => number> = {
      featured: () => 0, "price-asc": (a, b) => a.price - b.price, "price-desc": (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating,
    };
    return [...list].sort(by[sort]);
  }, [cats, max, inStock, sort]);

  return (
    <section aria-labelledby="plp-title" className="grid w-full gap-6 lg:grid-cols-[220px_1fr]">
      <aside aria-label="Filters" className="grid content-start gap-6">
        <fieldset className="grid gap-3">
          <legend className="mb-3 text-sm font-semibold">Category</legend>
          {CATEGORIES.map((c) => (
            <div key={c} className="flex items-center gap-2">
              <Checkbox id={`cat-${c}`} checked={cats.includes(c)} onCheckedChange={(v) => setCats((l) => (v ? [...l, c] : l.filter((x) => x !== c)))} />
              <Label htmlFor={`cat-${c}`} className="font-normal">{c}</Label>
            </div>
          ))}
        </fieldset>
        <Separator />
        <div className="grid gap-3">
          <div className="flex items-baseline justify-between"><p id="price-l" className="text-sm font-semibold">Max price</p><span className="text-sm tabular-nums text-muted-foreground">{idr(max)}</span></div>
          <Slider value={[max]} min={50_000} max={200_000} step={10_000} onValueChange={([v]) => setMax(v)} thumbLabels={["Maximum price"]} getValueText={idr} />
        </div>
        <Separator />
        <div className="flex items-center gap-2">
          <Checkbox id="in-stock" checked={inStock} onCheckedChange={(v) => setInStock(v === true)} />
          <Label htmlFor="in-stock" className="font-normal">In stock only</Label>
        </div>
      </aside>
      <div className="grid content-start gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="plp-title" className="text-xl font-semibold tracking-tight">Everyday goods</h2>
            <p className="text-sm text-muted-foreground" aria-live="polite">{shown.length} of {products.length} products</p>
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
            <SelectTrigger className="w-44" aria-label="Sort by"><SelectValue /></SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {shown.length ? (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,13rem),1fr))] gap-x-5 gap-y-8">
            {shown.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
          </ul>
        ) : (
          <div className="grid place-items-center gap-3 rounded-xl border border-dashed border-border p-10 text-center">
            <p className="font-medium">No products match these filters</p>
            <Button variant="outline" size="sm" onClick={() => { setCats([]); setMax(200_000); setInStock(false); }}>Clear filters</Button>
          </div>
        )}
      </div>
    </section>
  );
}
