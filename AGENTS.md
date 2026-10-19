# Aturan agent agere/org

Spesifikasi mengalahkan kode. Urutan: PRD dan amandemen C-34, TECH-01, UI-01, Agere DS 7.0, lalu kode.

- `apps/web` tidak mengimpor database dan tidak menghitung harga, kursi, atau kredit.
- Teks antarmuka lewat `t()` di `apps/web/lib/i18n.ts`. Katalog saat ini Bahasa Indonesia.
- Komponen dari Agere DS 7.0. Tidak ada warna hex dan tidak ada kelas palet Tailwind.
- Jalur terkunci (identitas, authz, migrasi, uang, AI) tidak diimplementasikan di kerangka ini. Test jalur itu ditulis orang sebelum kodenya.
- Rahasia hanya di environment. Jangan memasukkan client secret Google ke repo.
