"use client";

import * as React from "react";
import { Lock, ShoppingBag, Star, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioCard, RadioGroup } from "@/components/ui/radio-group";
import { Combobox } from "@/components/ui/combobox";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/components/ui/toast";
import { ProductArt } from "./product-art";
import { QuantityStepper } from "./product-overview";
import { idr, products, ratingBreakdown, reviews } from "./data";

const FREE_SHIPPING = 250_000;
type Line = { id: string; qty: number; color: string };

function useCart(initial: Line[]) {
  const [lines, setLines] = React.useState(initial);
  const subtotal = lines.reduce((a, l) => a + products.find((p) => p.id === l.id)!.price * l.qty, 0);
  return {
    lines, subtotal,
    setQty: (id: string, qty: number) => setLines((ls) => ls.map((l) => (l.id === id ? { ...l, qty } : l))),
    remove: (id: string) => setLines((ls) => ls.filter((l) => l.id !== id)),
  };
}

function CartLines({ cart }: { cart: ReturnType<typeof useCart> }) {
  return (
    <ul className="divide-y divide-border">
      {cart.lines.map((l) => {
        const p = products.find((x) => x.id === l.id)!;
        const c = p.colors.find((x) => x.id === l.color) ?? p.colors[0];
        return (
          <li key={l.id} className="flex gap-4 py-4">
            <div className="size-20 shrink-0 rounded-lg border border-border bg-muted/50 p-2"><ProductArt kind={p.kind} color={c.token} /></div>
            <div className="grid min-w-0 flex-1 gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0"><p className="truncate text-sm font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{c.label}</p></div>
                <p className="text-sm font-medium tabular-nums">{idr(p.price * l.qty)}</p>
              </div>
              <div className="flex items-center justify-between">
                <QuantityStepper value={l.qty} onChange={(n) => cart.setQty(l.id, n)} itemName={p.name} />
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => cart.remove(l.id)} leadingIcon={<Trash2 />} aria-label={`Remove ${p.name}`}>Remove</Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const left = Math.max(0, FREE_SHIPPING - subtotal);
  return (
    <div className="grid gap-2 rounded-lg bg-muted/60 p-3 text-sm">
      <p>{left ? <>Add <strong className="tabular-nums">{idr(left)}</strong> for free delivery</> : <strong>Free delivery unlocked</strong>}</p>
      <Progress value={Math.min(100, (subtotal / FREE_SHIPPING) * 100)} size="sm" tone={left ? "default" : "success"} aria-label="Progress to free delivery" />
    </div>
  );
}

/**
 * Block · Shopping cart side sheet (shadcnstudio "Shopping Cart").
 * Quantity steppers, remove, free-delivery meter, sticky summary. Totals update live for screen readers.
 */
export function ShoppingCart() {
  const cart = useCart([{ id: "p1", qty: 2, color: "teal" }, { id: "p3", qty: 1, color: "orange" }]);
  const count = cart.lines.reduce((a, l) => a + l.qty, 0);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" leadingIcon={<ShoppingBag />} aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}>Cart <span aria-hidden className="rounded-md bg-primary px-1.5 text-xs text-primary-foreground tabular-nums">{count}</span></Button>
      </SheetTrigger>
      <SheetContent size="sm">
        <SheetHeader>
          <SheetTitle>Your cart</SheetTitle>
          <SheetDescription>{count} item{count === 1 ? "" : "s"}</SheetDescription>
        </SheetHeader>
        <SheetBody className="grid content-start gap-2">
          {cart.lines.length ? <><FreeShippingMeter subtotal={cart.subtotal} /><CartLines cart={cart} /></> : <p className="py-10 text-center text-sm text-muted-foreground">Your cart is empty.</p>}
        </SheetBody>
        <SheetFooter className="flex-col gap-3 sm:flex-col">
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><output aria-live="polite" className="font-semibold tabular-nums">{idr(cart.subtotal)}</output></div>
          <Button size="lg" disabled={!cart.lines.length} leadingIcon={<Lock />}>Checkout</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/** Block · Product reviews (shadcnstudio "Product Reviews"): rating summary with a breakdown + review list. */
export function ProductReviews() {
  const total = ratingBreakdown.reduce((a, r) => a + r.count, 0);
  const avg = ratingBreakdown.reduce((a, r) => a + r.stars * r.count, 0) / total;
  const Stars = ({ n, className }: { n: number; className?: string }) => (
    <span aria-hidden className={cn("flex", className)}>{[1, 2, 3, 4, 5].map((s) => <Star key={s} className={cn("size-4", s <= Math.round(n) ? "fill-[hsl(var(--chart-4))] text-[hsl(var(--chart-4))]" : "text-muted-foreground/60")} />)}</span>
  );
  return (
    <section aria-labelledby="rev-title" className="grid w-full gap-8 md:grid-cols-[280px_1fr]">
      <div className="grid content-start gap-4">
        <h2 id="rev-title" className="text-xl font-semibold tracking-tight">Customer reviews</h2>
        <div className="flex items-center gap-3"><Stars n={avg} /><p className="text-sm"><span className="font-semibold">{avg.toFixed(1)}</span> out of 5 · {total} reviews</p></div>
        <dl className="grid gap-2">
          {ratingBreakdown.map((r) => (
            <div key={r.stars} className="grid grid-cols-[3rem_1fr_2.5rem] items-center gap-3 text-sm">
              <dt>{r.stars} star</dt>
              <dd className="contents">
                <Progress value={(r.count / total) * 100} size="md" aria-label={`${r.stars} star reviews`} />
                <span className="text-right tabular-nums text-muted-foreground">{Math.round((r.count / total) * 100)}%</span>
              </dd>
            </div>
          ))}
        </dl>
        <Button variant="outline">Write a review</Button>
      </div>
      <ul className="divide-y divide-border">
        {reviews.map((r) => (
          <li key={r.id} className="grid gap-2 py-5 first:pt-0">
            <div className="flex items-center gap-3"><Stars n={r.rating} /><span className="sr-only">{r.rating} out of 5 stars</span><p className="text-sm font-semibold">{r.title}</p></div>
            <p className="text-sm leading-relaxed text-muted-foreground">{r.body}</p>
            <p className="text-xs text-muted-foreground">{r.name} · <time dateTime={r.date}>{new Date(r.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time> · Verified purchase</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

const CITIES = ["Jakarta", "Surabaya", "Bandung", "Semarang", "Yogyakarta", "Malang", "Ngawi", "Madiun", "Solo", "Denpasar"].map((c) => ({ value: c.toLowerCase(), label: c }));
const SHIPPING = { regular: { label: "JNE Regular", eta: "2–3 days", price: 18_000 }, express: { label: "SiCepat BEST", eta: "Next day", price: 32_000 }, sameday: { label: "GoSend Same Day", eta: "Today, Surabaya only", price: 45_000 } };

/**
 * Block · Checkout (shadcnstudio "Checkout Page"). Contact → delivery (city Combobox, delivery DatePicker)
 * → shipping method → payment, with a sticky order summary. Validates on submit and focuses the first error.
 */
export function CheckoutPage() {
  const cart = useCart([{ id: "p5", qty: 1, color: "teal" }, { id: "p2", qty: 1, color: "natural" }]);
  const [ship, setShip] = React.useState<keyof typeof SHIPPING>("regular");
  const [pay, setPay] = React.useState("qris");
  const [city, setCity] = React.useState("");
  const [date, setDate] = React.useState<Date>();
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const formRef = React.useRef<HTMLFormElement>(null);
  const pending = React.useRef(false);
  React.useEffect(() => { if (pending.current) { pending.current = false; formRef.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus(); } }, [errors]);

  const shipping = cart.subtotal >= FREE_SHIPPING && ship === "regular" ? 0 : SHIPPING[ship].price;
  const total = cart.subtotal + shipping;
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0, 0, 0, 0);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(f.get("email")))) next.email = "Enter an email like name@company.com.";
    if (String(f.get("name")).trim().length < 2) next.name = "Enter the recipient's name.";
    if (!/^(\+62|0)8\d{7,11}$/.test(String(f.get("phone")).replace(/[\s-]/g, ""))) next.phone = "Use an Indonesian mobile number, e.g. 0812 3456 7890.";
    if (String(f.get("address")).trim().length < 8) next.address = "Enter the street address.";
    if (!city) next.city = "Choose a city.";
    setErrors(next);
    if (Object.keys(next).length) { pending.current = true; return; }
    toast.success(`Order placed · ${idr(total)}`);
  };

  return (
    <form ref={formRef} onSubmit={submit} noValidate aria-labelledby="co-title" className="grid w-full gap-8 lg:grid-cols-[1fr_380px]">
      <div className="grid content-start gap-8">
        <h2 id="co-title" className="text-2xl font-semibold tracking-tight">Checkout</h2>
        <fieldset className="grid gap-5">
          <legend className="mb-4 text-base font-semibold">Contact</legend>
          <FormField label="Email" error={errors.email} required hint="We'll send the receipt here.">
            <FormControl><Input name="email" type="email" autoComplete="email" /></FormControl>
          </FormField>
        </fieldset>
        <fieldset className="grid gap-5">
          <legend className="mb-4 text-base font-semibold">Delivery</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Recipient name" error={errors.name} required><FormControl><Input name="name" autoComplete="name" /></FormControl></FormField>
            <FormField label="Mobile number" error={errors.phone} required><FormControl><Input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="0812 3456 7890" /></FormControl></FormField>
          </div>
          <FormField label="Street address" error={errors.address} required><FormControl><Input name="address" autoComplete="street-address" /></FormControl></FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="City" error={errors.city} required>
              <FormControl><Combobox options={CITIES} value={city} onValueChange={setCity} placeholder="Choose a city…" searchPlaceholder="Search city…" emptyText="City not found." /></FormControl>
            </FormField>
            <FormField label="Delivery date" optional hint="Leave empty for the earliest slot.">
              <FormControl><DatePicker value={date} onValueChange={setDate} placeholder="Earliest available" disabledDays={[{ before: tomorrow }, { dayOfWeek: [0] }]} formatStr="EEE, d MMM" /></FormControl>
            </FormField>
          </div>
        </fieldset>
        <fieldset className="grid gap-3">
          <legend className="mb-4 text-base font-semibold">Shipping method</legend>
          <RadioGroup value={ship} onValueChange={(v) => setShip(v as keyof typeof SHIPPING)} className="gap-3 sm:grid-cols-3" aria-label="Shipping method">
            {Object.entries(SHIPPING).map(([k, s]) => (
              <RadioCard key={k} value={k} title={s.label} description={`${s.eta} · ${k === "regular" && cart.subtotal >= FREE_SHIPPING ? "Free" : idr(s.price)}`} />
            ))}
          </RadioGroup>
        </fieldset>
        <fieldset className="grid gap-3">
          <legend className="mb-4 text-base font-semibold">Payment</legend>
          <RadioGroup value={pay} onValueChange={setPay} className="gap-3 sm:grid-cols-3" aria-label="Payment method">
            <RadioCard value="qris" title="QRIS" description="Any e-wallet or bank app" />
            <RadioCard value="va" title="Virtual account" description="BCA, BNI, Mandiri, BRI" />
            <RadioCard value="cod" title="Cash on delivery" description="Pay the courier" />
          </RadioGroup>
        </fieldset>
      </div>

      <Card className="h-fit lg:sticky lg:top-6">
        <CardHeader><CardTitle>Order summary</CardTitle><CardDescription>{cart.lines.length} items</CardDescription></CardHeader>
        <CardContent className="grid gap-4">
          <CartLines cart={cart} />
          <div className="flex gap-2"><Input aria-label="Discount code" placeholder="Discount code" /><Button type="button" variant="outline" onClick={() => toast.error("That code isn't valid")}>Apply</Button></div>
          <Separator />
          <dl className="grid gap-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">{idr(cart.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping · {SHIPPING[ship].label}</dt><dd className="tabular-nums">{shipping ? idr(shipping) : "Free"}</dd></div>
            <div className="mt-1 flex justify-between border-t border-border pt-3 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums" aria-live="polite">{idr(total)}</dd></div>
          </dl>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" size="lg" className="w-full" leadingIcon={<Lock />}>Pay {idr(total)}</Button>
          <p className="text-center text-xs text-muted-foreground">Payments are encrypted. You won't be charged until the order ships.</p>
        </CardFooter>
      </Card>
    </form>
  );
}
