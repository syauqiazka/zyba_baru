# ZYBA Master Design System — "The Tactile Sanctuary"

> **STATUS: DESIGN FREEZE.** Sumber kebenaran visual tertinggi adalah `DESIGN.md`. Dokumen ini mencatat sintesis sistem desain untuk ZYBA v2 (Rebuild). Spesifikasi setiap halaman akan disusun di `design-system/zyba/pages/<halaman>.md` pada saat tahap fase halaman tersebut dibuka (Pipeline C).

---

## 1. Filosofi & Arah Visual

**Satu kalimat:** *Ruang aman yang terasa seperti lembaran jurnal kertas linen: lapang, hangat, tenang.*

- **Kertas & Tinta**: Kanvas `cream` mendominasi (~75% permukaan). Teks `brown-900` menyerupai tinta cetak di atas serat kertas.
- **Asimetri Tenang**: Proporsi 65:35 (zona refleksi utama : zona aksi). Whitespace disengaja untuk memberi ruang napas.
- **Kedalaman Taktil**: Garis kontak 1px `border-brown-900/10` + bayangan kontak sangat lembut (`shadow-[0_2px_12px_-2px_rgba(59,42,32,0.04)]`). Tanpa bayangan hitam pekat atau glow berwarna.
- **Satu Titik Fokus**: Satu aksi utama per layar, aksi sekunder mundur dengan tenang.
- **Ritme Napas**: Transisi 200–350ms (`ease-[cubic-bezier(0.16,1,0.3,1)]`), selalu menghormati `prefers-reduced-motion`.
- **Nada Bicara**: Bahasa Indonesia yang santai, santun, hangat, dan tanpa rasa bersalah.

---

## 2. Tipografi Resmi

- **Manrope** (`font-display`): Judul, angka skor Zyba, headline hero.
- **DM Sans** (`font-body`): Paragraf, label kontrol, caption, teks antarmuka.

| Peran | Kelas Tailwind |
|---|---|
| Hero | `font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight` |
| Judul Bagian | `font-display text-xl sm:text-2xl font-bold` |
| Judul Kartu | `font-display text-base sm:text-lg font-bold` |
| Paragraf | `font-body text-sm sm:text-base text-brown-700 leading-relaxed` |
| Kontrol / Tombol | `font-body text-sm font-semibold` |
| Label Kategori | `font-body text-[11px] font-bold uppercase tracking-widest text-brown-700/80` |
| Meta / Caption | `font-body text-xs text-brown-700/70` |

*Batas keterbacaan: Teks isi minimal 14px di mobile. Panjang baris paragraf maksimum ~70 karakter.*

---

## 3. Geometri & Skala Radius

| Elemen Antarmuka | Skala Radius |
|---|---|
| Zen Dock (Desktop), Shell | `rounded-[28px]` |
| Kartu Jangkar (Hero, Banner Sambutan) | `rounded-[24px]` |
| Kartu Konten, Widget Utama | `rounded-[20px]` atau `rounded-[16px]` |
| Sub-kartu, Item Baris, Input, Textarea | `rounded-xl` (12px) |
| Tombol, Chip, Pill Navigasi | `rounded-full` |
| Badge kecil, Tag | `rounded-lg` (8px) |

*Dilarang keras memakai `rounded-[32px]`.*

---

## 4. Elevasi Permukaan Kertas

| Tingkat | Peruntukan | Kelas Tailwind |
|---|---|---|
| **0 (Dasar)** | Kanvas Halaman | `bg-cream` |
| **1 (Kartu)** | Kartu Konten, Widget | `bg-white/90 border border-brown-900/10 shadow-[0_2px_12px_-2px_rgba(59,42,32,0.04)]` |
| **2 (Panel)** | Floating Zen Dock, Bottom Pill | `bg-white/95 backdrop-blur-md border border-brown-900/10 shadow-[0_4px_24px_-4px_rgba(59,42,32,0.06)]` |
| **3 (Modal)** | Dialog, Compose Card, Banner Krisis | `bg-white border border-brown-900/15 shadow-[0_12px_40px_-8px_rgba(59,42,32,0.12)]` |

---

## 5. Tata Letak Navigasi

- **Desktop (≥ 768px) — Floating Zen Dock**:
  - `fixed left-4 top-4 bottom-4 w-[76px] z-40 rounded-[28px] bg-white/90 backdrop-blur-md border border-brown-900/10`.
  - Konten utama memiliki padding kiri `md:pl-[108px]`. Dock tidak mendorong aliran dokumen normal.
  - Tooltip navigasi menggunakan React Portal (`document.body`) dengan posisi `fixed`, koordinat `rect.right + 12px`, agar tidak terpotong `overflow-y-auto`.
  - Profile popover menempel di `left: 104px` dengan scroll internal `max-h-[calc(100dvh-2rem)]`.
- **Mobile (< 768px) — Bottom Pill Nav**:
  - Tinggi 56px, mengambang 12px dari tepi bawah, `rounded-full bg-white/95 backdrop-blur-md border border-brown-900/10`.
  - Target sentuh item navigasi minimal 44px.
  - Dialog dan sheet muncul sebagai bottom sheet terpusat `max-w-[420px] mx-auto rounded-3xl`.

---

## 6. Standar Matriks Status (State Matrix)

Setiap modul antarmuka wajib menangani status:
1. **Default**: Komposisi lapang dengan data riil.
2. **Loading**: Denyut halus tanpa getaran layout, skeleton berlatar hangat.
3. **Empty**: Ilustrasi garis SVG tenang, teks ramah jujur ("Belum ada data"), satu aksi yang jelas.
4. **Active**: Border kontak jelas (`border-2 border-orange-500 bg-orange-100` + ikon Lucide `Check`).
5. **Error**: Penjelasan manusiawi, tanpa kode error membingungkan, dilengkapi tombol coba lagi.
6. **Crisis**: Banner proteksi tenang berlatar `cream` dengan tautan telepon langsung (tanpa animasi panik atau warna merah).

