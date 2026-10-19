# agere/org

Kerangka minggu pertama (BE-01 dan FE-01). Belum ada database, masuk sungguhan, Space yang bisa diedit, billing, atau AI.

## Yang ada

- `apps/web` — Next.js. Shell Desk, Space, dan Pengaturan dari Agere DS 7.0. Tanpa cookie sesi, rute organisasi diarahkan ke `/masuk`.
- `apps/api` — NestJS di port 3001, prefiks `/api`. Web meneruskan `/api/*` ke sana.
- `packages/contracts` — skema Zod, klien HTTP, dan klien palsu. Layar memakai klien palsu sampai `CONTRACTS_MODE=http`.

Data demo: organisasi `studio-rintis`, space Produk dan Operasi.

## Menjalankan

Dari folder design system, sekali saja:

```bash
npm install --no-package-lock --no-audit --no-fund
npm run tokens
```

Lalu dari folder ini:

```bash
pnpm install
pnpm dev
```

Buka http://localhost:3000. Tombol di halaman masuk hanya memasang cookie demo.

## Yang sengaja belum dibuat

Identitas, Postgres, DOKU, OpenRouter, dan tugas sungguhan menunggu akun serta keputusan owner. Jangan menyalin `client_secret` Google ke repo ini.

Spesifikasi ada di `../agere org/PRD & Development/agere-org-prd-v4.14.2`.
