const catalog = {
  "app.name": "agere",
  "app.description": "Kerangka agere/org",
  "nav.desk": "Desk",
  "nav.space": "Space",
  "nav.settings": "Pengaturan",
  "shell.rail": "Utama",
  "shell.spaces": "Space",
  "shell.skip": "Lewati ke isi",
  "shell.menu": "Buka navigasi",
  "shell.fakeTitle": "Data demo",
  "shell.fakeBody": "Angka di layar ini berasal dari klien palsu. Masuk sungguhan, database, dan billing belum dibangun.",
  "masuk.title": "Masuk",
  "masuk.body": "Akun sungguhan belum tersedia. Lanjutkan dengan sesi demo untuk membuka kerangka ruang kerja.",
  "masuk.submit": "Lanjutkan ke ruang kerja",
  "desk.title": "Desk",
  "desk.description": "Tugas saya dan kotak masuk akan tinggal di sini.",
  "desk.emptyTitle": "Belum ada tugas",
  "desk.emptyBody": "Modul kerja belum dihubungkan. Daftar ini kosong sampai tugas sungguhan ada.",
  "space.title": "Space",
  "space.description": "Space menampung proyek. Yang tampil masih data demo.",
  "space.empty": "Organisasi ini belum punya space.",
  "settings.title": "Pengaturan",
  "settings.description": "Profil dan keamanan menyusul. Yang bisa dilakukan sekarang hanya keluar dari sesi demo.",
  "settings.signOut": "Keluar dari sesi demo",
  "notFound.title": "Halaman tidak ditemukan",
  "notFound.body": "Organisasi ini tidak ada di data demo.",
  "notFound.back": "Kembali ke masuk",
} as const;

export type MessageKey = keyof typeof catalog;

export function t(key: MessageKey): string {
  return catalog[key];
}
