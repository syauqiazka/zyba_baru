---
name: ZYBA
description: Gen Z Wellness Support — Fresh Botanical Sanctuary
colors:
  cream: "#F5F8F5"
  brown-900: "#1B241E"
  brown-700: "#526056"
  green-500: "#3E7B54"
  green-100: "#EAF4EC"
  orange-500: "#F28C6E"
  orange-100: "#FDF1EB"
  mood-depressed: "#A99BE0"
  mood-sad: "#F28C6E"
  mood-neutral: "#708075"
  mood-happy: "#E8C24A"
  mood-overjoyed: "#3E7B54"
  danger: "#D9534F"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontWeight: 700
  body:
    fontFamily: "DM Sans, sans-serif"
    fontWeight: 400
rounded:
  dock: "28px"
  card-anchor: "24px"
  card-content: "20px"
  subcard: "16px"
  input: "12px"
  badge: "8px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  "2xl": "32px"
  "3xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.brown-900}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
  button-warm:
    backgroundColor: "{colors.orange-500}"
    textColor: "{colors.brown-900}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
  button-secondary:
    backgroundColor: "{colors.green-100}"
    textColor: "{colors.brown-900}"
    rounded: "{rounded.pill}"
    padding: "8px 20px"
  card-anchor:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.card-anchor}"
    padding: "24px 28px"
  card-content:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.card-content}"
    padding: "20px 24px"
  input-field:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.input}"
    height: "44px"
    padding: "0 16px"
---

# ZYBA Design Authority — The Tactile Sanctuary

> **Status: DESIGN FREEZE.** Dokumen ini adalah sumber kebenaran visual. Hex warna di frontmatter identik dengan `design-system/zyba/PALETTE_LOCK.md` dan **tidak boleh diubah**. Agent hanya boleh *polish di dalam token ini*; perubahan arah hanya atas permintaan eksplisit user.
> Satu-satunya perubahan dari versi lama: **teks di atas `orange-500` memakai `brown-900`, bukan putih** (lihat §2.2, alasannya kontras).

---

## 1. Arah Visual

**Satu kalimat:** *Ruang aman yang terasa seperti lembaran jurnal kertas linen: lapang, hangat, tenang.*

ZYBA bukan dashboard SaaS yang padat, dan bukan aplikasi kartun yang berisik. Ciri inti:

- **Kertas & tinta.** Kanvas `cream` mendominasi (~75% permukaan). Teks `brown-900` seperti tinta cetak.
- **Asimetri tenang.** Komposisi 65:35 (zona refleksi utama : zona aksi). Whitespace disengaja, bukan sisa.
- **Kedalaman taktil.** Garis kontak 1px `brown-900/10` + bayangan kontak sangat lembut. Tidak ada bayangan hitam tebal.
- **Satu titik fokus per layar.** Satu aksi utama, sisanya mundur.
- **Ritme napas.** Transisi 250–350ms, selalu menghormati `prefers-reduced-motion`.
- **Nada bicara.** Hangat, manusiawi, Bahasa Indonesia santai-santun. Tanpa jargon korporat dan tanpa hype.

### Peran skill terhadap dokumen ini
`ui-ux-pro-max` memberi referensi pola *di dalam* arah ini · `taste-skill` menjaga karakter · `impeccable` mengasah detail · `anti-slop` memveto pelanggaran · `superpowers` menjaga disiplin verifikasi. Detail di `AGENTS.md` Bagian 3.

---

## 2. Warna (Terkunci)

### 2.1 Token

| Token | Hex | Kelas Tailwind | Peruntukan |
|---|---|---|---|
| Cream | `#F7F2E7` | `bg-cream` | Kanvas halaman |
| Milk | `#FFFFFF` | `bg-white` / `bg-white/90` | Permukaan kartu |
| Brown 900 | `#3B2A20` | `text-brown-900` / `bg-brown-900` | Teks utama, tombol primer, identitas user (avatar) |
| Brown 700 | `#5A4636` | `text-brown-700` | Teks sekunder, label, meta |
| Orange 500 | `#F2884B` | `bg-orange-500` | **Aksi** (Kirim, Post, CTA utama), ikon "suka" aktif |
| Orange 100 | `#FCE3D3` | `bg-orange-100` | Latar hangat, chip, state terpilih |
| Green 500 | `#8FAE5D` | `text-green-500` | Pertumbuhan, selesai, status online |
| Green 100 | `#E4EED2` | `bg-green-100` | Latar aktivitas/napas, tombol sekunder |
| Border | `rgba(59,42,32,.10)` | `border-brown-900/10` | Garis kontak kertas |
| Focus | `rgba(242,136,75,.40)` | `ring-orange-500/40` | Fokus keyboard |
| Danger | `#D9534F` | `bg-danger` | **Hanya** hapus akun/post. Dilarang untuk konten krisis |

**Mood:** depressed `#A99BE0` · sad `#EE8A5E` · neutral `#6B5645` · happy `#E8C24A` · overjoyed `#8FAE5D`.

**Pembagian peran warna:** coklat = identitas, oranye = aksi, hijau = pertumbuhan/selesai. Jangan menukar peran.

### 2.2 Aturan kontras (hasil audit, wajib)

Perhitungan WCAG terhadap token terkunci:

| Pasangan | Rasio (≈) | Hasil |
|---|---|---|
| `brown-900` di atas `cream` | 11.2 : 1 | AAA |
| `brown-700` di atas `cream` | 7.4 : 1 | AAA |
| `brown-900` di atas `orange-500` | 5.5 : 1 | **AA, dipakai untuk teks tombol/chip oranye** |
| `#FFFFFF` di atas `orange-500` | 2.5 : 1 | **GAGAL. Dilarang** untuk teks kecil maupun tombol |
| `orange-500` sebagai teks di atas `cream`/`orange-100` | < 3.3 : 1 | **GAGAL.** Hanya boleh untuk ikon/dekorasi ≥ 24px, bukan teks |
| `green-500` sebagai teks di atas `cream` | ≈ 3 : 1 | Hanya teks besar/tebal (≥ 18.66px bold) atau ikon |

Konsekuensi praktis:
- Tombol oranye: `bg-orange-500 text-brown-900`.
- Badge "GEN Z WELLNESS SUPPORT": `bg-orange-100 text-brown-900`, bukan teks oranye.
- Kata yang di-highlight pada headline besar boleh memakai `text-green-500` / `text-orange-500` hanya pada ukuran ≥ 36px bold, dan selalu ada makna yang tidak bergantung warna.
- Jangan pernah menyampaikan informasi hanya lewat warna (selalu tambah ikon/label).

---

## 3. Tipografi

- **Manrope** (500/600/700/800) → `font-display`: judul, angka skor.
- **DM Sans** (400/500/600/700) → `font-body`: isi, kontrol, caption.

| Peran | Kelas |
|---|---|
| Hero | `font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight` |
| Judul bagian | `font-display text-xl sm:text-2xl font-bold` |
| Judul kartu | `font-display text-base sm:text-lg font-bold` |
| Paragraf | `font-body text-sm sm:text-base text-brown-700 leading-relaxed` |
| Kontrol | `font-body text-sm font-semibold` |
| Label kategori | `font-body text-[11px] font-bold uppercase tracking-widest text-brown-700/80` |
| Meta | `font-body text-xs text-brown-700/70` |

Ukuran isi tidak boleh di bawah 14px di mobile. Panjang baris paragraf maksimum ~70 karakter.

---

## 4. Layout & Navigasi

### 4.1 Desktop/Tablet (≥ 768px) — Floating Zen Dock

- `fixed left-4 top-4 bottom-4 w-[76px] z-40`, `rounded-[28px]`, `bg-white/90 backdrop-blur-md`, `border border-brown-900/10`, bayangan elevasi 2.
- Konten utama: `md:pl-[108px]` (16 margin + 76 dock + 16 ruang napas). Dock **tidak pernah** mendorong alur dokumen.
- Container konten: `max-w-[1240px]`, grid 12 kolom.
- Ikon Lucide stroke 1.8. Hover `bg-cream/80`; aktif `bg-green-100 font-bold`.
- **Tooltip** memakai React Portal ke `document.body`, `position: fixed`, posisi dari `getBoundingClientRect()` (`left = rect.right + 12`), hilang saat pointer leave/blur/scroll. Tidak boleh terpotong `overflow-y-auto`.
- **Profile popover:** menempel `left: 104px`, `max-h-[calc(100dvh-2rem)]` dengan scroll internal.

### 4.2 Mobile (< 768px)

- **Bottom Pill Nav:** tinggi 56px, melayang 12px dari bawah, `rounded-full`, `bg-white/95 backdrop-blur-md`, target sentuh ≥ 44px.
- **Popover/modal** → bottom sheet terpusat: `bottom-3 left-3 right-3 max-w-[420px] mx-auto rounded-3xl`, backdrop `bg-brown-900/30`.
- Drawer untuk sidebar kontekstual (Companion, Community) via tombol menu `md:hidden`.
- Setiap properti khusus mobile yang diubah wajib di-reset eksplisit di `md:`.

### 4.3 Sidebar Kontekstual (Companion & Community)

Ditempatkan hanya di `layout.tsx` segmen masing-masing. Teks-minimal, tanpa kartu per item. Hover/aktif: `bg-brown-900/5`, **tanpa border berwarna**. Tombol "← Kembali ke ZYBA" selalu paling atas, bergaya teks (kesan keluar, bukan aksi utama). Hanya satu tombol "Baru" dan satu kotak cari.

### 4.4 Komposisi halaman

- Dashboard dan halaman refleksi: asimetri 65:35.
- Daftar (Resources, Community, Activity): grid 2–3 kolom di desktop, 1 kolom di mobile.
- Feed Community: kolom tengah max 600px, **divider tipis**, bukan tumpukan kartu.

---

## 5. Bentuk & Kedalaman

### 5.1 Skala radius (tidak boleh keluar dari tabel)

| Komponen | Kelas |
|---|---|
| Zen Dock, shell | `rounded-[28px]` |
| Kartu jangkar (hero/banner) | `rounded-[24px]` |
| Kartu konten, widget | `rounded-[20px]` atau `rounded-[16px]` |
| Sub-kartu, baris list, input, textarea | `rounded-xl` (12px) |
| Tombol, chip, pill | `rounded-full` |
| Badge kecil | `rounded-lg` (8px) |

`rounded-[32px]` dilarang.

### 5.2 Elevasi

| Level | Pemakaian | Kelas |
|---|---|---|
| 0 | Kanvas | `bg-cream` |
| 1 | Kartu | `bg-white/90 border border-brown-900/10 shadow-[0_2px_12px_-2px_rgba(59,42,32,0.04)]` |
| 2 | Dock, panel melayang | `bg-white/95 backdrop-blur-md border border-brown-900/10 shadow-[0_4px_24px_-4px_rgba(59,42,32,0.06)]` |
| 3 | Modal, compose card, crisis | `bg-white border border-brown-900/15 shadow-[0_12px_40px_-8px_rgba(59,42,32,0.12)]` |

**Prinsip bobot visual:** selain tombol aksi utama, hampir tidak ada elemen dengan latar solid berwarna. List, header, badge memakai netral/transparan tipis. Kotak input chat tanpa outline oranye; fokus = ring netral tipis.

---

## 6. Komponen

### 6.1 Tombol

- **Primer:** `bg-brown-900 text-cream rounded-full px-5 py-2.5 font-medium hover:bg-brown-900/90 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-2`
- **Hangat (CTA aksi):** `bg-orange-500 text-brown-900 rounded-full px-5 py-2.5 font-semibold hover:bg-orange-500/90 ...`
- **Sekunder:** `bg-green-100 text-brown-900 rounded-full px-4 py-2 font-medium`
- **Garis:** `border border-brown-900/15 text-brown-900 rounded-full px-4 py-2 hover:bg-white/80`
- Disabled: `opacity-50 cursor-not-allowed`, bukan abu-abu baru.
- Semua tombol punya `cursor-pointer`, label jelas, dan target ≥ 44px.

### 6.2 Input

`h-11 px-4 rounded-xl bg-white/90 border border-brown-900/15 placeholder:text-brown-700/50 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/70`. Textarea: `rounded-xl p-3.5 leading-relaxed`; auto-grow maksimum 180px. Input numerik memakai state string (`type="tel"` + filter digit).

### 6.3 Pilihan jawaban (assessment, check-in, mood)

| State | Gaya |
|---|---|
| Default | `border border-brown-900/10 bg-white` |
| Hover | `border-orange-500/40 bg-orange-500/[0.04]` |
| Terpilih | `border-2 border-orange-500 bg-orange-100` + ikon Lucide `Check` + teks lebih tebal |

Transisi `200ms ease`. Pola yang sama di semua tipe (single-select, skala 1–5, ya/tidak, mood). Mood pebble: `w-12 h-12 rounded-2xl border-2`, warna dari token mood.

### 6.4 Sistem Krisis

- Banner di atas jendela chat / di atas hasil check-in. Latar `bg-cream`, `border-brown-900/20`, ikon Lucide `HeartHandshake`, teks tenang, tautan telepon langsung ke hotline dari `CRISIS_RESOURCES`.
- Tidak auto-dismiss; dapat ditutup manual.
- **Dilarang:** merah/alarm, animasi berdenyut, nada promosi, warna oranye CTA.
- Berlaku identik untuk semua persona Companion.

### 6.5 Chat

- Pesan user: kanan, `bg-brown-900 text-cream`, `rounded-2xl` dengan sudut kanan-bawah lebih kecil.
- Pesan AI: kiri, `bg-white border border-brown-900/10`, avatar ilustrasi persona.
- Timestamp `text-xs`, muncul saat hover/fokus atau di pesan terakhir grup (di mobile selalu bisa diakses via tap).
- Typing indicator: tiga titik berdenyut lembut, mati saat reduced-motion.
- Input: pill/rounded-2xl, `bg-white shadow-sm`, tombol kirim lingkaran `bg-orange-500` ikon `brown-900`. Model selector dan persona menempel di bawah/dekat input.
- Tombol putar TTS selalu terlihat di layar sentuh.

### 6.6 Hearth Flame

Nyala lilin SVG tenang untuk konsistensi harian. Tanpa angka streak membara, tanpa warna merah, tanpa copy bersalah. Hari terlewat = nyala meredup lembut dengan copy ramah ("Nyalakan lagi kapan pun kamu siap").

### 6.7 Ikon & ilustrasi

- Ikon: **hanya Lucide**, stroke 1.8, ukuran konsisten (16/20/24).
- Maskot ZYBA: Axolotl hijau dengan insang daun adalah aset brand resmi yang final, memakai warna aslinya, dan dikecualikan dari palet terkunci (aturan lengkap di `design-system/zyba/mascot.md`). Dilarang trace ke SVG atau upscale AI.
- Ilustrasi persona Companion (empat persona): **SVG buatan sendiri** dengan palet terkunci. Persona: Kina (kelinci), Ollie (burung hantu), Rubi (rubah), Bruno (beruang), dibedakan oleh bentuk, bukan warna baru.
- **Dilarang emoji** sebagai ikon, avatar, atau dekorasi.

---

## 7. Gerak

- Durasi 200–350ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`.
- Hanya animasikan `transform` dan `opacity`. Jangan animasikan `width/height`.
- Transisi halaman: fade + slide pendek. Skeleton/`loading.tsx` untuk segmen berat.
- `motion-reduce:transition-none motion-reduce:animate-none` pada setiap animasi. Breathing Garden tetap bisa dipakai tanpa gerak (hitung mundur teks + indikator statis).
- Dilarang bounce/ping agresif.

---

## 8. Pola Halaman (Template Mockdoc)

Setiap halaman wajib punya `design-system/zyba/pages/<nama>.md` sebelum kode, berisi:

1. **Tujuan** satu kalimat dan satu aksi utama.
2. **Referensi** (dari ui-ux-pro-max): 3–5 pola, dan mana yang dipilih beserta alasannya.
3. **Komposisi** tiga viewport (375 / 768 / 1280): zona, titik fokus, ritme whitespace.
4. **State matrix:** Default · Loading · Empty · Active · Error · Crisis (jika ada teks bebas).
5. **Kontrak data:** endpoint, bentuk request/response, DB yang dipakai.
6. **Copy** dalam Bahasa Indonesia (judul, empty state, error, tooltip).
7. **Kriteria penerimaan** yang bisa diuji (otomatis atau screenshot).
8. **Catatan impeccable** (satu putaran critique/audit/polish) dan **hasil gate anti-slop**.

Daftar mockdoc: `landing`, `onboarding-assessment`, `dashboard`, `mood-check-in`, `companion`, `activity`, `wellness-journey`, `community`, `resources`, `settings`, `guidebook`, `admin`.

---

## 9. Do & Don't

**Do**
1. Ikon Lucide 1.8px; ilustrasi SVG sendiri.
2. Palet terkunci; peran warna konsisten (coklat identitas, oranye aksi, hijau pertumbuhan).
3. Skala radius berjenjang; elevasi kertas lembut.
4. Copy hangat dan jujur ("Mulai saat kamu siap").
5. State kosong/error/loading yang jelas untuk setiap data.
6. Focus ring, target ≥ 44px, `motion-reduce`.
7. Data selalu dari sumber nyata; kalau belum ada, katakan "belum ada data".

**Don't**
1. Emoji sebagai ikon, avatar, atau dekorasi.
2. Gradient ungu-biru, glow, orb blur.
3. Kartu di dalam kartu; kotak-ikon warna-warni di atas heading.
4. Streak api merah, hitung mundur menekan, copy yang bikin bersalah.
5. Statistik, testimoni, atau nama user karangan (termasuk "Alex Rivera" sebagai fallback).
6. Teks putih di atas oranye; teks oranye/hijau kecil di atas cream.
7. Warna alarm untuk konten krisis.
8. Toolbar penuh di atas halaman Companion; sidebar atau tombol "Baru" ganda.
9. Teks Inggris tercecer di UI Indonesia.

---

## 10. Kontrak Verifikasi Desain

Halaman dianggap selesai desainnya jika, dengan bukti:

1. `pnpm build` dan `tsc --noEmit` lulus.
2. Screenshot browser nyata di **375, 768, 1280** (tambahan: 360x640, 1024x768, 1280x600, 1440x900 untuk fase audit) tanpa overflow horizontal atau layout shift.
3. Audit kontras seluruh pasangan teks/latar sesuai §2.2 (AA ≥ 4.5:1 untuk teks normal).
4. Navigasi keyboard penuh dengan fokus terlihat.
5. `prefers-reduced-motion: reduce` mematikan animasi.
6. Checklist anti-slop (`AGENTS.md` §3.1) tanpa satu pun pelanggaran.
7. Tidak ada hydration mismatch (konsol bersih); `localStorage` dibaca di `useEffect`.