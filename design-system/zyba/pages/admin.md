# Spesifikasi Halaman: Admin Panel Moderasi Komunitas (`/admin`)

> Dokumen acuan Fase P6 sesuai `AGENTS.md` Bagian 7.11 dan `DESIGN.md`.

---

## 1. Tujuan & Filosofi Desain
Panel kontrol bagi administrator untuk memantau laporan pelanggaran komunitas (`CommunityReport`) dan mengambil tindakan moderasi yang etis, terukur, dan penuh empati. Fokus ZYBA adalah menjaga ruang suaka yang aman dan suportif bagi generasi muda. Jika terindikasi risiko kesehatan mental / self-harm, sistem mengarahkan ke bantuan krisis, bukan hukuman represif.

---

## 2. Struktur & Fitur
1. **Otorisasi Ketat**: Hanya dapat diakses oleh pengguna dengan `role === "ADMIN"`. Pengguna biasa dialihkan kembali ke Dashboard dengan status 403.
2. **Statistik Cepat**:
   - Total Laporan Menunggu (`PENDING`)
   - Laporan Sedang Ditinjau (`REVIEWING`)
   - Laporan Telah Ditindak (`ACTION_TAKEN`)
   - Laporan Ditolak / Tidak Melanggar (`DISMISSED`)
3. **Daftar Laporan Komunitas**:
   - Filter status (`Semua`, `Menunggu`, `Selesai`)
   - Filter tipe sasaran (`Post`, `Komentar`)
   - Tampilan ringkasan: Nama pelapor, pengguna terlapor, alasan laporan (*Harassment*, *Self Harm*, *Inappropriate*, *Spam*, dll.), waktu laporan, serta cuplikan teks yang dilaporkan.
4. **Tindakan Moderasi Administrator**:
   - `Sembunyikan Konten`: Menyembunyikan post/komentar dari linimasa publik (`isHidden = true`).
   - `Hapus Konten`: Menghapus permanen konten yang melanggar berat.
   - `Beri Peringatan`: Menambahkan catatan peringatan pada profil pengguna terlapor (`warningCount += 1`).
   - `Tangguhkan / Blokir`: Menangguhkan akses sementara atau permanen bagi pelanggar berulang.
   - `Tolak Laporan`: Menyelesaikan laporan jika konten dinilai tidak melanggar panduan suaka.
   - `Tawarkan Sumber Bantuan Krisis`: Aksi khusus jika konten mengandung sinyal bahaya diri.
5. **Pencatatan Audit (`ModerationLog`)**:
   - Setiap tindakan administrator wajib mencatat `adminId`, `targetUserId`, `action`, `reason`, dan `reportId` di basis data Account.

---

## 3. Kontrak API
- `GET /api/admin/reports` → Mengambil daftar laporan komunitas dengan pagination dan filter status.
- `POST /api/admin/reports/[id]/action` → Menjalankan tindakan moderasi pada laporan tertentu dan mencatat log audit ke `ModerationLog`.
- `GET /api/admin/stats` → Mengambil metrik agregat laporan untuk dasbor admin.

---

## 4. Kriteria Selesai (DoD P6 Admin)
- [x] Otorisasi role ADMIN ditegakkan di server dan antarmuka.
- [x] Aksi moderasi berhasil mengubah status post di Community DB dan mencatat log di Account DB.
- [x] Antarmuka responsif dan bersih dari dekorasi tak fungsional.
