# agere/org

Kerangka minggu pertama (BE-01 dan FE-01). API mengecek Postgres lewat `DATABASE_URL`. Layar organisasi masih data demo. Belum ada masuk sungguhan, Space yang bisa diedit, billing, atau AI.

## Yang ada

- `apps/web` — Next.js. Shell Desk, Space, dan Pengaturan dari Agere DS 7.0. Tanpa cookie sesi, rute organisasi diarahkan ke `/masuk`.
- `apps/api` — NestJS di port 3001, prefiks `/api`. Web meneruskan `/api/*` ke sana.
- `packages/contracts` — skema Zod, klien HTTP, dan klien palsu. Layar memakai klien palsu sampai `CONTRACTS_MODE=http`.

Data demo: organisasi `studio-rintis`, space Produk dan Operasi.

## Menjalankan

Dari folder ini:

```bash
pnpm install
pnpm dev
```

Buka http://localhost:3000. Tombol di halaman masuk hanya memasang cookie demo. `DATABASE_URL` di `.env` membuat health API mengecek Postgres. Layar tetap memakai data demo.

## Vercel

Dua proyek dari repo ini, region Singapore (`sin1` sudah ada di `vercel.json`). Nyalakan pemakaian file di luar root directory.

- Web: root `apps/web`. Environment `API_URL` = URL proyek API, tanpa garis miring di akhir.
- API: root `apps/api`. Environment `DATABASE_URL` hanya di sini.

`/api/*` pada web diteruskan ke API saat permintaan masuk, jadi `API_URL` tidak perlu ada pada saat build.

## Yang sengaja belum dibuat

Identitas, DOKU, OpenRouter, dan tugas sungguhan menunggu akun serta keputusan owner. Jangan menyalin `client_secret` Google ke repo ini.

Spesifikasi ada di `../agere org/PRD & Development/agere-org-prd-v4.14.2`.
