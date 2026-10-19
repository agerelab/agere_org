# agere — logo system

Master files are pure vector: filled paths only, no strokes, raster images, filters, gradients or fonts. Every SVG uses a `viewBox` and **1 X = 100 SVG units**.

## Base unit

**X = the diameter of one symbol node.** φ = 1.61803398875. Every other measurement below comes from X and φ.

## 1 · Symbol construction

| Element | Rule | Value |
|---|---|---|
| Nodes | three equal circles | Ø 1X |
| Gap L–T (edge to edge) | X / φ³ | 0.236X |
| Gap T–B (bridged) | X / φ² | 0.382X |
| Gap L–B | X / φ | 0.618X |
| Centre distances | 1X + gap | 1.236X · 1.382X · 1.618X |
| Orientation | L–T axis on the 45° diagonal | angle at L = 55.9° (cos = √5/4) |
| Bridge | carved by two *negative* nodes, r = 0.5X, tangent to T and B | waist 0.446X |
| Bounding box | | 2.588X × 2.183X (≈ 1.19 : 1) |

Each gap is φ times the one before it, and 0.236 + 0.382 = 0.618, so the three gaps form one Fibonacci step. The circles that cut the connection are the same size as the nodes, which ties the negative space to the positive shapes.

The mark is 1.19 : 1, not an exact square. Getting a perfect square means turning the triangle about 22° more. That stands the dumbbell upright and loses the diagonal movement of the reference. The square containers (app icon and favicon) take care of any layout that needs a square.

## 2 · Wordmark construction

Weight: **A2** (chosen 25 Sep 2026), lighter than the first 0.382X version. Every value below is a power or sum of powers of φ; no free "optical" numbers remain.

| Element | Rule | Value |
|---|---|---|
| x-height | 2X / φ (the same as the L–T centre distance) | 1.236X |
| Stem weight | X/φ³ + X/φ⁵ (= X/φ² − X/φ⁶), weight "A2" | 0.326X |
| Horizontal weight | x-height / φ³ (= stem − X/φ⁷), optical thinning | 0.292X |
| e crossbar | stem / φ | 0.202X |
| Bowls | circles, x-height + 2 × overshoot | Ø 1.262X |
| Overshoot | X / φ⁹ | 0.013X |
| Descender | x-height / φ² | 0.472X |
| r shoulder and g hook radius | x-height / φ² | 0.472X |
| Terminals | full circles (they echo the nodes); e and c terminals sit at 360°/φ⁴ = 52.5° | — |
| Corner fillets | concave stem/φ⁴ · convex stem/φ³ | 0.048X · 0.077X |
| Letter gap | X / φ⁵; straight→straight × φ; r→round × 1/φ²; open shapes × 1/φ | 0.090X |
| g tail terminal | centre at bowl width / φ³ | — |
| Wordmark width | | 6.132X |

## 3 · Lockups

**Primary (horizontal):** the symbol's bounding box is centred on the x-height midline. The gap from symbol to wordmark is **0.382X**, the same as the T–B gap in the symbol. Overall size is **9.102X × 2.195X** (SVG 910.18 × 219.49). The symbol's lowest point falls within 0.012X of the g descender line.

**Stacked:** the symbol is scaled by φ and sits **0.618X** above the x-height line. It is centred on its visual mass centroid rather than its bounding box, because the mark is heavier on the right. Overall size is **6.132X × 5.872X**.

**App icon:** the symbol's width is tile ÷ φ. The tile corner radius is tile ÷ φ³ (23.6%). Favicon: symbol width = tile ÷ (1 + 1/φ⁵).

## 4 · Clear space

Keep at least **1X (one node diameter)** clear on every side of any lockup. For quick checks, one node of the logo itself fits exactly in that space. The `-reversed` files already include this 1X margin on the dark field.

## 5 · Minimum sizes (digital)

| Asset | Minimum | Use below that |
|---|---|---|
| Primary lockup | 24 px high (≈ 100 px wide) | `agere-primary-small` for 16–23 px high |
| Stacked | 48 px high | primary or symbol |
| Symbol | 24 px | `agere-symbol-small` / favicon for 16–23 px |
| Anything under 16 px high | — | symbol only |

**Small-size cut (optical adjustments only):**
- stem X/φ³ + X/φ⁶ = 0.292X, crossbar = stem/φ = 0.180X
- tracking × φ (0.146X)
- the e aperture opens from 360°/φ⁴ (52.5°) to 90°/φ (55.6°)
- the left node moves out so the L–T gap goes up one golden step (0.236X → 0.382X), so it doesn't fill in at 16 px

## 6 · Colour

- Ink: `#111111`
- Paper: `#FFFFFF`
- No gradients and no second colour in the master.
- `-mono` files use `currentColor`, so they take the colour of the surrounding CSS text.

## Files

```
svg/          agere-{primary|stacked|symbol|wordmark}[-white|-mono|-reversed].svg
              agere-primary-small(-white).svg · agere-symbol-small.svg
              agere-app-icon(-dark).svg
favicon/      favicon.svg (adapts to light/dark) · favicon.ico (16/32/48)
              favicon-{16…512}.png · apple-touch-icon.png (180)
png/          2048 px exports + reversed · app icon 1024
construction/ agere-construction.svg / .png
products/     agere-<org|edu|ledger|hire|trace>-{primary|stacked}[-white|-mono|-reversed].svg
              agere-<product>-badge[-white|-mono].svg · -symbol.svg · -app-icon.svg
              agere-product-family.png
agere-brand-sheet.png
```

`npm run brand` syncs `svg/` into the React `<Logo />` (`src/brand/logo-paths.ts`) and the favicon into `public/` and `index.html`.

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

## Misuse

Never recolour (no second colour, no amber), add effects or shadows, outline, stretch, rotate, re-space the symbol and wordmark, or set "agere" in another typeface next to the symbol.

---

# Product logos (`products/`)

These product logos use the master baseline (base unit **X = node diameter**, 1X = 100 SVG units). Every product uses the **main agere symbol, unchanged**; products are told apart only by the name after the slash. Every measurement is a power, or a sum of powers, of φ.

## Naming lockup — badge style (shadcn/studio pattern)

`(● symbol)  agere/product` — the separator is a slash, as in shadcn/studio.

| Element | Rule | Value |
|---|---|---|
| Typeface | **Geist Bold**, the font used by shadcn/ui (SIL Open Font License), converted to outlines | — |
| x-height | same as the master system | 1.236X |
| Badge | a black disc with the product symbol knocked out, Ø = x-height × φ² | 3.236X |
| Symbol inside the badge | width = badge ÷ φ, optically centred between its bounding box and its mass centroid | 2.0X |
| Gap from badge to text | badge ÷ φ² (= x-height) | 1.236X |
| Vertical alignment | the badge centre sits on the x-height midline, so the lockup is exactly one badge tall | — |
| Stacked | badge centred above the text, gap = badge ÷ φ² | 1.236X |
| Kerning | Geist's own kerning, no extra tracking | — |

The master **agere** logo keeps its custom wordmark. Geist is used only for the product logos.

## Symbol

All products use the main agere symbol, knocked out of the badge. There are no product-specific symbol variants.

## Colour

Black only, the same as the master:

- Ink `#111111` on paper `#FFFFFF`.
- Reversed versions are white on `#111111`.
- `-mono` files use `currentColor`.

Products are told apart by their name, never by colour or symbol.

## Sizes

| Product | Primary lockup | Stacked |
|---|---|---|
| agere/org | 15.49X × 3.24X | 11.02X × 6.08X |
| agere/edu | 15.93X × 3.24X | 11.46X × 6.08X |
| agere/ledger | 19.17X × 3.24X | 14.70X × 6.08X |
| agere/hire | 16.20X × 3.24X | 11.73X × 6.08X |
| agere/trace | 17.87X × 3.24X | 13.40X × 6.08X |

- **Clear space:** 1X on every side.
- **Minimum size:** 24 px high for the lockup.
- **Favicon:** the badge, with width = tile ÷ (1 + 1/φ⁵). The favicon is the same badge for every product.
- **App icon:** a black rounded tile with the white symbol; symbol width = tile ÷ φ, corner radius = tile ÷ φ³.

A new product gets the same set: the unchanged agere symbol in the badge, its name after the slash in Geist Bold outlines, and nothing else that differs.

## Trademarks

Everything in this folder is **not** MIT-licensed: © 2026 PT Agere Teknologi Indonesia, all rights reserved. See `TRADEMARKS.md` at the repository root.
