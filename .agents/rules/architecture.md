# Arsitektur

`apps/web` merender UI. `apps/api` adalah satu-satunya pemilik database kelak. Sekarang API memakai klien palsu yang sama dengan web. Modul tidak membaca tabel modul lain. `ctx` akan menjadi argumen pertama repository saat migrasi dimulai.
