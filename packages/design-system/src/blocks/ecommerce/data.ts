/** Fictional catalogue for the eCommerce blocks (Indonesian merchant, prices in IDR). */
export type ProductKind = "mug" | "tote" | "notebook" | "cap" | "bottle" | "plant";

export interface Product {
  id: string;
  name: string;
  category: "Kitchen" | "Bags" | "Stationery" | "Apparel" | "Home";
  kind: ProductKind;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  colors: { id: string; label: string; token: "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5" | "primary" }[];
  sizes?: string[];
  badge?: "New" | "Sale" | "Best seller";
  stock: number;
  description: string;
}

export const products: Product[] = [
  { id: "p1", name: "Kopi Enamel Mug", category: "Kitchen", kind: "mug", price: 89_000, rating: 4.8, reviews: 214, colors: [{ id: "ink", label: "Ink", token: "primary" }, { id: "teal", label: "Teal", token: "chart-2" }], badge: "Best seller", stock: 42, description: "Enamel-coated steel mug, 350 ml. Keeps its colour after hundreds of washes." },
  { id: "p2", name: "Pasar Canvas Tote", category: "Bags", kind: "tote", price: 149_000, compareAt: 189_000, rating: 4.6, reviews: 98, colors: [{ id: "natural", label: "Natural", token: "chart-4" }, { id: "ink", label: "Ink", token: "primary" }], badge: "Sale", stock: 18, description: "12 oz cotton canvas with a reinforced base and inner pocket. Carries 15 kg." },
  { id: "p3", name: "Grid Notebook A5", category: "Stationery", kind: "notebook", price: 65_000, rating: 4.9, reviews: 331, colors: [{ id: "orange", label: "Orange", token: "chart-1" }, { id: "deep", label: "Deep sea", token: "chart-3" }], stock: 120, description: "160 pages of 100 gsm paper with a 5 mm dot grid. Lays flat." },
  { id: "p4", name: "Studio Cap", category: "Apparel", kind: "cap", price: 129_000, rating: 4.4, reviews: 56, colors: [{ id: "ink", label: "Ink", token: "primary" }, { id: "amber", label: "Amber", token: "chart-5" }], sizes: ["S/M", "L/XL"], badge: "New", stock: 7, description: "Six-panel washed cotton cap with an adjustable brass buckle." },
  { id: "p5", name: "Tirta Steel Bottle", category: "Kitchen", kind: "bottle", price: 179_000, rating: 4.7, reviews: 142, colors: [{ id: "teal", label: "Teal", token: "chart-2" }, { id: "orange", label: "Orange", token: "chart-1" }], sizes: ["500 ml", "750 ml"], stock: 33, description: "Double-wall vacuum bottle — cold for 24 h, hot for 12 h. Leak-proof lid." },
  { id: "p6", name: "Desk Plant Pot", category: "Home", kind: "plant", price: 99_000, compareAt: 119_000, rating: 4.5, reviews: 77, colors: [{ id: "deep", label: "Deep sea", token: "chart-3" }, { id: "natural", label: "Natural", token: "chart-4" }], badge: "Sale", stock: 0, description: "Glazed stoneware pot with a drainage saucer. Fits a 10 cm nursery pot." },
];

export const reviews = [
  { id: "r1", name: "Laras K.", rating: 5, date: "2026-09-18", title: "Exactly as pictured", body: "Colour is spot on and it survived the dishwasher for a month. Ordering two more for the office." },
  { id: "r2", name: "Bima S.", rating: 4, date: "2026-09-10", title: "Great, slightly smaller", body: "Solid build. It is a little smaller than I expected, so check the dimensions first." },
  { id: "r3", name: "Citra L.", rating: 5, date: "2026-08-29", title: "Fast delivery to Ngawi", body: "Arrived in two days, well packed. Would buy from this shop again." },
];

export const ratingBreakdown = [
  { stars: 5, count: 162 }, { stars: 4, count: 38 }, { stars: 3, count: 9 }, { stars: 2, count: 3 }, { stars: 1, count: 2 },
];

export const idr = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
