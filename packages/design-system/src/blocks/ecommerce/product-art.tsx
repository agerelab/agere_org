import { cn } from "@/lib/utils";
import type { Product, ProductKind } from "./data";

/**
 * Product artwork for the eCommerce blocks — line style matching the DS illustrations, colored by token
 * (the variant color is the product body), so it follows dark mode and white-label brands.
 * In a real store, swap for <img> with width/height set (prevents layout shift) and a real `alt`.
 */
const L = "stroke-[hsl(var(--ag-fg-subtle))]";
const F0 = "fill-[hsl(var(--ag-bg-default))]";

export function ProductArt({ kind, color = "primary", className, label }: { kind: ProductKind; color?: Product["colors"][number]["token"]; className?: string; label?: string }) {
  const body = { fill: `hsl(var(--${color}))`, fillOpacity: color === "primary" ? 0.9 : 0.85 };
  return (
    <svg viewBox="0 0 200 200" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={cn("h-full w-full", className)}>
      <ellipse cx="100" cy="176" rx="62" ry="6" className="fill-[hsl(var(--ag-bg-emphasis))]" />
      {kind === "mug" && (<><path className={L} style={body} d="M58,70 H132 V150 Q132,168 114,168 H76 Q58,168 58,150 Z" /><path className={cn(L)} d="M132,88 Q160,88 160,112 Q160,136 132,136" /><path className={L} d="M70,82 H120" /><path className={L} strokeDasharray="2 6" d="M84,54 q-6,-10 0,-20 M100,54 q-6,-10 0,-20" /></>)}
      {kind === "tote" && (<><path className={L} d="M76,72 Q76,36 100,36 Q124,36 124,72" /><path className={L} style={body} d="M52,70 H148 L156,168 H44 Z" /><rect className={cn(L, F0)} x="82" y="100" width="36" height="28" rx="3" /></>)}
      {kind === "notebook" && (<><rect className={L} style={body} x="58" y="34" width="92" height="134" rx="6" /><path className={L} d="M72,34 V168" /><rect className={cn(L, F0)} x="88" y="60" width="48" height="18" rx="3" /><path className={L} d="M150,110 h8" /></>)}
      {kind === "cap" && (<><path className={L} style={body} d="M46,128 Q46,66 100,62 Q154,66 154,128 Z" /><path className={cn(L, F0)} d="M126,128 Q170,126 176,140 Q150,146 110,140 Z" /><path className={L} d="M100,62 V128 M72,74 Q86,96 88,128" /><circle className={cn(L, F0)} cx="100" cy="60" r="5" /></>)}
      {kind === "bottle" && (<><rect className={cn(L, F0)} x="84" y="28" width="32" height="18" rx="4" /><path className={L} style={body} d="M80,46 H120 Q134,56 134,74 V156 Q134,168 122,168 H78 Q66,168 66,156 V74 Q66,56 80,46 Z" /><path className={L} d="M66,96 H134 M66,128 H134" /></>)}
      {kind === "plant" && (<><path className={L} style={body} d="M62,110 H138 L128,168 H72 Z" /><path className={cn(L, F0)} d="M100,110 Q96,72 70,58 Q66,88 100,110 Z" /><path className={cn(L, F0)} d="M100,110 Q108,64 138,52 Q142,90 100,110 Z" /><path className={L} d="M100,110 V70" /></>)}
    </svg>
  );
}
