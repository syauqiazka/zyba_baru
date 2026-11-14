# Mockdoc: Zyba Community (`/community`)

> **Pipeline Tahap C — Spek Desain & Kontrak Rekayasa**  
> **Referensi Desain:** Tata letak forum modern (Convo) yang diselaraskan ke **Habitdo Fresh Botanical & Living Sanctuary Palette** (`DESIGN.md`).

---

## 1. Tujuan

Menyediakan ruang sosial yang aman, hangat, dan suportif bagi pengguna Gen Z untuk saling berbagi cerita, saling mendukung, dan bertukar wawasan mindful tanpa tekanan algoritma adiktif, tanpa metrik toksik, dan dengan perlindungan keamanan krisis yang aktif.

---

## 2. Referensi & Arah Layout (ui-ux-pro-max)

1. **Tata Letak 3-Zona Responsif:**
   - **Zona Kiri — Community Nav:**
     - Tab Feed Utama: *Untuk Kamu* (`/community`), *Mengikuti* (`/community?tab=following`), *Disimpan* (`/community?tab=saved`), *Disukai* (`/community?tab=liked`).
     - Lingkaran Tematik (*Community Circles*): Ruang Tenang, Pejuang Overthinking, Lingkar Syukur, Kebugaran Sadar.
     - Pintasan Pesan Langsung (DM) & Notifikasi dengan indikator hitungan belum dibaca nyata.
   - **Zona Tengah (Maks 640px) — Aliran Feed:**
     - *Inline Composer* di puncak feed: *"Bagikan Cerita Hari Ini..."*, toggle mode Anonim transparan, pemilih tag topik, dan tombol publikasi.
     - Tab beralih cepat: *"Untuk Kamu"* vs *"Mengikuti"*.
     - Daftar postingan terstruktur:
       - Header: Tag topik (mis. `#Refleksi`, `#KisahPulih`) + waktu relatif ("2j lalu") + tombol menu `...` (Laporkan / Salin Tautan).
       - Penulis: Avatar (atau avatar samaran Zibi jika anonim) + Nama + `@handle` (atau *"Teman Berkelana"* jika anonim).
       - Konten: Judul tebal (opsional/prominen) + Teks isi dengan `line-clamp-4` dan tombol ekspansi *"Baca selengkapnya"*.
       - Media opsional: Gambar, audio mindful, atau stiker Zibi.
       - Bilah Aksi Interaktif (Touch Target $\ge 44$px):
         - Suka (ikon Lucide `Heart`, aktif = `text-orange-500 fill-orange-500`).
         - Komentar (ikon Lucide `MessageCircle`, klik membuka drawer/accordion komentar inline).
         - Simpan / Bookmark (ikon Lucide `Bookmark`, aktif = `text-emerald-700 fill-emerald-700`).
         - Bagikan (ikon Lucide `Share2`, menyalin tautan dengan konfirmasi lembut).
   - **Zona Kanan (Desktop $\ge 1024$px) — Widget Suaka Komunitas:**
     - **Topik Refleksi Hangat (*Trending Topics*):** 4 topik reflektif dengan volume cerita terkini.
     - **Lingkar Komunitas Terkurasi (*Suggested Circles*):** Rekomendasi lingkaran pertemanan sehat dengan tombol *"Ikuti"*.
     - **Catatan Aman ZYBA:** Kotak pengingat bahwa komunitas adalah suaka yang saling menghargai dan tautan langsung ke panduan krisis.

2. **Floating Compose Button & Card:**
   - Tombol bulat mengambang `+` (`bg-orange-500 text-brown-900 shadow-lg`) di kanan bawah.
   - Mengklik membuka *floating compose card* di sudut kanan bawah tanpa *dark backdrop* penuh (sesuai `AGENTS.md` §7.6).

3. **Adaptasi Multi-Viewport:**
   - **Desktop (1280px):** 3 zona lengkap (Nav Kiri - Feed Tengah - Widget Kanan).
   - **Tablet (768px):** 2 zona (Nav Kiri ringkas / icon pill + Feed Tengah).
   - **Mobile (375px):** Feed Tengah penuh, tombol filter tab di atas, Community Nav dapat dibuka via drawer samping atau tab bar.

---

## 3. Karakter & Anti-Slop (taste-skill & anti-slop)

- **Warna & Kanvas:** Latar `bg-[#F5F8F5]` / `bg-cream`, kartu konten `bg-white` dengan border halus `border-brown-900/10` dan elevasi 1.
- **Ikon:** 100% ikon Lucide (stroke 1.8px). **DILARANG memakai emoji** sebagai pengganti ikon atau avatar persona.
- **Anti-Toxic Design:**
  - Tidak ada metrik ranking popularitas atau badge superioritas pengguna.
  - Jumlah suka dan komentar disajikan tenang tanpa animasi bergetar berlebihan.
  - Teks di atas tombol oranye wajib `text-brown-900` (WCAG AA kontras $\ge 5.4:1$).
- **Keamanan Mental & Krisis (`detectRisk`):**
  - Setiap postingan yang diketik melewati sensor `detectRisk()`.
  - Jika teks mengandung sinyal keputusasaan atau bahaya diri: sistem **tidak memblokir diam-diam**, melainkan memunculkan dialog kepedulian yang menawarkan bantuan hotline langsung sebelum postingan disimpan.

---

## 4. Matriks State

| State | Kondisi UI |
|---|---|
| **Default** | Feed menampilkan aliran post nyata dengan cursor pagination, counter suka/komentar akurat, dan status interaksi user. |
| **Loading** | Skeleton shimmer lembut (`bg-brown-900/5`) untuk post card dan widget. |
| **Empty** | Jika tab (mis. *Disimpan* atau *Mengikuti*) belum memiliki konten: Menampilkan maskot Zibi pose `listening` dengan copy ramah: *"Belum ada cerita yang disimpan. Simpan cerita yang menyentuh hatimu saat berselancar."* |
| **Active / Expanding** | Panel komentar inline terbuka dengan input balasan cepat dan daftar komentar berantai. |
| **Crisis Triggered** | Banner bantuan krisis muncul lembut di atas form compose dengan nomor darurat 119. |
| **Floating Compose Open** | Kartu melayang di kanan-bawah aktif, fokus otomatis ke textarea. |

---

## 5. Kontrak API

### A. Aliran Feed
- **Endpoint:** `GET /api/community/posts?tab=for-you|following|saved|liked&cursor=&limit=10`
- **Response:**
```json
{
  "posts": [
    {
      "id": "post_1",
      "author": {
        "id": "user_123",
        "name": "Syauqi",
        "avatarUrl": null,
        "isAnonymous": false
      },
      "title": "Belajar Menerima Hari-Hari yang Lambat",
      "content": "Hari ini saya memutuskan untuk berhenti memaksakan diri menyelesaikan semua to-do list...",
      "topicTag": "Pikiran Tenang",
      "createdAt": "2026-11-13T08:00:00.000Z",
      "likesCount": 12,
      "commentsCount": 4,
      "isLiked": false,
      "isBookmarked": false
    }
  ],
  "nextCursor": "post_10"
}
```

### B. Buat Postingan Baru
- **Endpoint:** `POST /api/community/posts`
- **Request Body:**
```json
{
  "title": "string (opsional)",
  "content": "string (wajib)",
  "topicTag": "string (opsional)",
  "isAnonymous": false
}
```
- **Response:** Post object baru (`201 Created`) atau `{ "error": "...", "crisisDetected": true }`.

### C. Aksi Interaksi
- `POST /api/community/posts/[id]/like`: Toggle like (upsert/delete di `CommunityLike`).
- `POST /api/community/posts/[id]/bookmark`: Toggle simpan (upsert/delete di `CommunityBookmark`).
- `GET /api/community/posts/[id]/comments`: Daftar komentar post.
- `POST /api/community/posts/[id]/comments`: Tambah komentar baru.
- `POST /api/community/reports`: Laporkan konten tidak pantas.

---

## 6. Kriteria Penerimaan Terverifikasi

1. **Struktur Route:** Folder `src/app/(app)/community/` dengan `layout.tsx` (merender `CommunitySidebar` sekali) dan `page.tsx` (feed utama responsif).
2. **Dua Titik Compose:**
   - *Inline compose bar* di atas feed dapat mengirim postingan baru secara instan.
   - *Floating action button (+)* membuka kartu compose melayang di kanan bawah tanpa backdrop gelap penuh, dan teruji klik nyata.
3. **Penyelarasan Palet:** Seluruh elemen menggunakan token Habitdo Fresh Botanical & ZYBA cream (tidak ada tema gelap atau aksen kuning asing).
4. **Keamanan Krisis:** Teks krisis memicu tawaran hotline bantuan tanpa menghakimi penulis.
5. **Verifikasi Build & Test:** `pnpm build`, `tsc --noEmit`, dan unit test lulus tanpa error. Screenshot di 3 viewport (375, 768, 1280).

