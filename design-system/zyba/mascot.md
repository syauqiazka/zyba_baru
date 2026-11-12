# Dokumentasi Maskot Resmi ZYBA

> **Status:** Final & Terlindungi (Protected Brand Asset)  
> **Karakter:** Axolotl hijau dengan insang daun suaka  
> **Nama Representasi:** Didefinisikan di `src/lib/brand.ts` (`MASCOT_NAME = "Zibi"`)

---

## 1. Filosofi & Peran Maskot

Maskot resmi ZYBA adalah pendamping visual yang hangat, lembut, dan menghadirkan rasa aman bagi pengguna Gen Z. Karakter ini mewakili kehadiran kawan yang mindful, tidak menuntut, dan selalu siap menyambut sesi hening maupun curhat tanpa penghakiman.

---

## 2. Aset & Dimensi Sumber

Aset maskot adalah potongan berlatar transparan dari lembar karakter resmi (*character sheet*):

| Kategori | Lokasi File | Dimensi Kanvas Asli | Batas Tampil Maksimal (CSS px) |
|---|---|---|---|
| **Uniform Poses** | `public/mascot/uniform/*.png` | 197 &times; 189 px | **Maks 197 &times; 189 px** |
| **Hero Greeting** | `public/mascot/hero.png` | 348 &times; 391 px | **Maks 348 &times; 391 px** |

> [!CAUTION]
> Kanvas semua file di `public/mascot/uniform/` berukuran sama (197x189) dengan posisi kaki sejajar di batas bawah. Pergantian pose antar file dijamin tidak membuat posisi maskot melompat.

---

## 3. Pemetaan Pose Resmi (`src/lib/mascotPoses.json`)

| Nama Pose di Kode | File Sumber | Konteks Penggunaan |
|---|---|---|
| `default` | `uniform/depan.png` | Keadaan santai umum, landing page, header, check-in siang/pagi |
| `happy` | `uniform/senang.png` | Selesai check-in, momen perayaan kecil, onboarding step |
| `listening` | `uniform/penasaran.png` | Empty state Companion di atas "Cerita apa hari ini?" |
| `thinking` | `uniform/bingung.png` | State menimbang, proses loading ringan |
| `sad` | `uniform/sedih.png` | Empty state / error ramah non-krisis |
| `sleep` | `uniform/tidur.png` | Check-in malam hari (&ge; 21:00 WIB) |

*Catatan:* File cadangan lain (`semangat.png`, `terkejut.png`, `kesal.png`, `membawa.png`, `bersembunyi.png`, `samping.png`, `belakang.png`, `tiga_perempat.png`) tersedia di repositori namun **dilarang dipakai** kecuali jika mockdoc halaman menyetujuinya secara tertulis.

---

## 4. Aturan Keras Integrasi (Non-Negotiable)

1. **Dilarang Trace ke SVG / Upscale AI:** File PNG dipakai persis seperti aslinya. Dilarang menggambar ulang, mewarnai ulang, memfilter, atau meng-upscale dengan AI.
2. **Dilarang Transform Kasar:** Dilarang meng-crop, memutar, memiringkan, atau meng-flip gambar. Satu-satunya transform yang diizinkan adalah animasi napas 4s (`translateY` dan `scale`).
3. **Batas Ukuran CSS px:** Tidak boleh ditampilkan lebih besar dari dimensi aslinya (maks 197px lebar untuk uniform, maks 348px lebar untuk hero) agar tidak pecah/blur.
4. **Pengecualian Palet Terkunci:** Maskot adalah aset brand mandiri yang dikecualikan dari palet warna ZYBA. Elemen UI di sekeliling maskot tetap tunduk pada token `DESIGN.md`.
5. **Zona Larangan Maskot:**
   - Dilarang di banner bantuan krisis / hotline darurat.
   - Dilarang di Guidebook krisis.
   - Dilarang di modal kuota habis (jangan membuat ekspresi sedih untuk menekan user).
   - Dilarang memakai pose "kesal" atau "terkejut" pada konteks krisis atau stres.
6. **Empat Persona Companion Berbeda:** Persona hewan Companion (Kina, Ollie, Rubi, Bruno) di `AGENTS.md` D5 adalah entitas terpisah. Maskot ZYBA bukan salah satu persona tersebut.
7. **Bebas Tanpa Kotak Pembatas (Box-Free Integration):** Maskot Zibi dilarang dikurung di dalam kotak persegi/rounded kecil, kartu dengan border pembatas, atau background box buatan. Maskot harus berdiri dan tampil bebas langsung di atas kanvas/layout alami agar tampak hidup dan organik.

---

## 5. Komponen React (`src/components/ui/Mascot.tsx`)

- `<Mascot pose="default" size={160} decorative={true} animate={true} />`
- `<MascotCrossfade pose={pose} size={160} />` (untuk transisi halus 300ms antar pose)
- `<MascotHero size={348} priority={true} decorative={false} />` (khusus landing hero)

---

## 6. Daftar Tempat Pemakaian Resmi

1. **Landing Hero:** `MascotHero` di kolom kanan dengan komposisi 65:35.
2. **Onboarding Carousel:** Pose `default`, `happy`, dan `listening` per slide.
3. **Companion Empty State:** Pose `listening` di atas heading "Cerita apa hari ini?".
4. **Companion Header:** Pose `default` ukuran 40-48px tanpa animasi.
5. **Check-In Harian:** Pose `default` (siang) / `sleep` (malam).
6. **Error / Empty State Non-Krisis:** Pose `sad` dengan copy ramah dan empatik.

