# Spesifikasi Halaman: Pengaturan & Privasi (`/settings`)

> Dokumen acuan Fase P6 sesuai `AGENTS.md` Bagian 7.10 dan `DESIGN.md`.

---

## 1. Tujuan & Filosofi Desain
Pusat kendali pengguna atas profil, privasi, keamanan, dan data pribadi. Dirancang dengan pendekatan **Living Sanctuary** yang transparan, menenangkan, tanpa dark pattern, dan sepenuhnya bebas biaya. Pengguna memiliki kendali penuh atas data mereka (hak ekspor JSON 1-klik dan penghapusan akun permanen lintas 3 database).

---

## 2. Struktur Tab & Navigasi
Halaman terbagi dalam 5 tab yang dapat diakses melalui bilah navigasi kiri/atas yang tenang:
1. **Profil Pengguna (`profile`)**: Nama lengkap, nama panggilan/username, bio suaka, avatar.
2. **Keamanan & Password (`security`)**: Ubah kata sandi lama ke baru, informasi sesi masuk, status privasi akun.
3. **Notifikasi (`notifications`)**: Preferensi notifikasi tersambung ke `NotificationPref` (`companionNotif`, `wellnessNotif`, `communityNotif`).
4. **Privasi & Data (`privacy`)**:
   - **Ekspor Data (JSON)**: Arsip lengkap dalam format JSON yang dapat diunduh langsung.
   - **Hapus Akun**: Konfirmasi bertahap 2 langkah untuk membersihkan seluruh data di ketiga database (`community` → `companion` → `account`).
5. **Tentang Suaka & Bantuan (`about`)**: Nilai privasi ZYBA, etika AI, bebas komersialisasi/gratis 100%, kontak suaka, serta hotline darurat 119.

---

## 3. Matriks State
- **Default**: Menampilkan data profil dan preferensi tersimpan dari server.
- **Loading**: Indikator skeleton bergradasi linen lembut.
- **Saving / Submitting**: Tombol aksi menampilkan status "Menyimpan..." dengan spinner taktil.
- **Success Toast**: Umpan balik positif hijau botani ("Profil berhasil diperbarui", "Preferensi notifikasi tersimpan").
- **Error State**: Pesan galat jujur dan jelas tanpa menyalahkan pengguna.
- **Modal Konfirmasi Hapus Akun**: Dialog modal tegas dengan input kata sandi + ketik "HAPUS" untuk mencegah ketidaksengajaan.

---

## 4. Kontrak API
- `GET /api/settings/profile` → Mengambil data profil, preferensi notifikasi, dan ringkasan data.
- `PATCH /api/settings/profile` → Memperbarui nama, username, bio, dan preferensi notifikasi.
- `POST /api/settings/password` → Mengubah kata sandi (verifikasi kata sandi lama, hash bcrypt kata sandi baru).
- `GET /api/settings/export` → Menghasilkan JSON data lengkap akun pengguna untuk diunduh.
- `DELETE /api/settings/account` → Mengeksekusi penghapusan berurutan di 3 DB: `communityRepo.deleteUserContent()`, `companionRepo.deleteUserData()`, `accountRepo.deleteUser()`.

---

## 5. Kriteria Selesai (DoD P6 Settings)
- [x] Ekspor data menghasilkan berkas JSON utuh dan valid.
- [x] Hapus akun membersihkan data di ketiga database secara idempoten dan aman.
- [x] Perubahan profil dan preferensi tersimpan nyata ke basis data.
- [x] Lolos verifikasi visual 3 viewport (375, 768, 1280) bebas dari elemen AI generik.
