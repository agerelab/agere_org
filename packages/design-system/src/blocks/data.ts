/** Fictional sample data for the blocks gallery. Deterministic so screenshots and tests are stable. */

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

const r = rng(42);
const start = new Date("2026-06-28T00:00:00");

/** 90 days of visitors by channel (area chart). */
export const visitorsSeries = Array.from({ length: 90 }, (_, i) => {
  const d = new Date(start);
  d.setDate(start.getDate() + i);
  const weekly = Math.sin((i / 7) * Math.PI * 2) * 40;
  const trend = i * 2.2;
  return {
    date: d.toISOString().slice(0, 10),
    desktop: Math.round(220 + trend + weekly + r() * 120),
    mobile: Math.round(160 + trend * 1.3 - weekly / 2 + r() * 140),
  };
});

/** Monthly revenue by plan (stacked bar). */
export const revenueByPlan = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"].map((month, i) => ({
  month,
  starter: Math.round(8200 + i * 900 + r() * 1400),
  pro: Math.round(14600 + i * 2100 + r() * 2400),
  enterprise: Math.round(9800 + i * 3200 + r() * 3000),
}));

/** Traffic sources (donut). Keys match ChartConfig. */
export const trafficSources = [
  { source: "organic", visitors: 4280, fill: "var(--color-organic)" },
  { source: "direct", visitors: 2610, fill: "var(--color-direct)" },
  { source: "referral", visitors: 1740, fill: "var(--color-referral)" },
  { source: "social", visitors: 1190, fill: "var(--color-social)" },
  { source: "email", visitors: 780, fill: "var(--color-email)" },
];

export type OrderStatus = "paid" | "pending" | "refunded" | "failed";
export interface Order {
  id: string;
  customer: string;
  email: string;
  plan: "Starter" | "Pro" | "Enterprise";
  status: OrderStatus;
  amount: number;
  date: string;
}

const NAMES = [
  "Nadia Putri", "Raka Pratama", "Sekar Ayu", "Dimas Wibowo", "Laras Kinanti", "Bima Saputra", "Citra Lestari", "Fajar Nugroho",
  "Intan Maharani", "Galih Permana", "Ayu Wulandari", "Yoga Aditya", "Putri Anjani", "Reza Hidayat", "Wulan Sari", "Arif Rahman",
  "Maya Kusuma", "Hendra Wijaya", "Dewi Safitri", "Taufik Hakim", "Sinta Rahayu", "Andi Firmansyah", "Rina Oktaviani", "Bayu Setiawan",
];
const STATUSES: OrderStatus[] = ["paid", "paid", "paid", "pending", "paid", "refunded", "paid", "failed"];
const PLANS: Order["plan"][] = ["Starter", "Pro", "Pro", "Enterprise"];
const PRICE = { Starter: 19, Pro: 49, Enterprise: 299 } as const;

export const orders: Order[] = NAMES.map((customer, i) => {
  const plan = PLANS[i % PLANS.length];
  const d = new Date("2026-09-24T00:00:00");
  d.setDate(d.getDate() - Math.floor(i * 1.4));
  return {
    id: `INV-${(4821 - i).toString()}`,
    customer,
    email: `${customer.split(" ")[0].toLowerCase()}@example.com`,
    plan,
    status: STATUSES[i % STATUSES.length],
    amount: PRICE[plan] * (plan === "Enterprise" ? 1 : 1 + (i % 3)),
    date: d.toISOString().slice(0, 10),
  };
});

export const activity = [
  { id: "a1", who: "Nadia Putri", what: "upgraded to", target: "Pro", when: "2 min ago", kind: "upgrade" as const },
  { id: "a2", who: "Raka Pratama", what: "invited", target: "3 teammates", when: "18 min ago", kind: "invite" as const },
  { id: "a3", who: "Payment", what: "failed for", target: "INV-4814", when: "1 h ago", kind: "alert" as const },
  { id: "a4", who: "Sekar Ayu", what: "published", target: "Q3 roadmap", when: "3 h ago", kind: "doc" as const },
  { id: "a5", who: "Dimas Wibowo", what: "closed", target: "12 tickets", when: "Yesterday", kind: "done" as const },
];

export const team = [
  { id: "t1", name: "Nadia Putri", email: "nadia@agere.id", role: "Owner" },
  { id: "t2", name: "Raka Pratama", email: "raka@agere.id", role: "Admin" },
  { id: "t3", name: "Sekar Ayu", email: "sekar@agere.id", role: "Member" },
  { id: "t4", name: "Dimas Wibowo", email: "dimas@agere.id", role: "Member" },
];

export const currentUser = { name: "Bubus", email: "bubus@agere.id" };

export const usd = (n: number, digits = 0) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: digits, minimumFractionDigits: digits });
