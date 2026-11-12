# PALETTE_LOCK.md — ZYBA v2 (The Tactile Sanctuary)

> **STATUS: DESIGN FREEZE.** Sumber kebenaran visual tertinggi adalah `DESIGN.md`. Dokumen ini mencatat kontrak kunci mutlak palet warna dan aturan kontras yang divalidasi. Seluruh nilai hex dan kelas Tailwind di bawah ini identik dengan `DESIGN.md` dan **tidak boleh diubah**.

---

## 1. Nilai Hex Resmi Terkunci (Canonical Tokens)

| Token | Hex | Kelas Tailwind | Peruntukan Resmi |
|---|---|---|---|
| **Cream** | `#F7F2E7` | `bg-cream` | Kanvas halaman (~75% permukaan) |
| **Milk** | `#FFFFFF` | `bg-white` / `bg-white/90` | Permukaan kartu, surface kertas |
| **Brown 900** | `#3B2A20` | `text-brown-900` / `bg-brown-900` | Teks utama, tombol primer, identitas user (avatar) |
| **Brown 700** | `#5A4636` | `text-brown-700` | Teks sekunder, label, meta, caption |
| **Orange 500** | `#F2884B` | `bg-orange-500` | **Aksi** (Kirim, Post, CTA utama), ikon "suka" aktif |
| **Orange 100** | `#FCE3D3` | `bg-orange-100` | Latar hangat, chip emosi, state terpilih jawaban |
| **Green 500** | `#8FAE5D` | `text-green-500` | Pertumbuhan, selesai, status online |
| **Green 100** | `#E4EED2` | `bg-green-100` | Latar aktivitas/napas, tombol sekunder |
| **Border** | `rgba(59,42,32,0.10)` | `border-brown-900/10` | Garis kontak kertas tipis 1px |
| **Focus** | `rgba(242,136,75,0.40)` | `ring-orange-500/40` | Ring fokus keyboard yang terlihat |
| **Danger** | `#D9534F` | `bg-danger` | **Hanya** hapus akun/post. Dilarang untuk konten krisis |

### Token Mood Emosi
| Emosi | Hex | Kelas Tailwind | Nuansa |
|---|---|---|---|
| **Depressed** | `#A99BE0` | `bg-mood-depressed` | Lavender tenang untuk duka/beban berat |
| **Sad** | `#EE8A5E` | `bg-mood-sad` | Terracotta lembut untuk sedih/murung |
| **Neutral** | `#6B5645` | `bg-mood-neutral` | Earthy brown untuk datar/hening |
| **Happy** | `#E8C24A` | `bg-mood-happy` | Golden sun untuk nyaman/senang |
| **Overjoyed** | `#8FAE5D` | `bg-mood-overjoyed` | Olive green untuk gembira/bersemangat |

---

## 2. Aturan Kontras WCAG (Wajib Dipatuhi)

Sesuai audit kontras pada `DESIGN.md` §2.2:

1. **Teks di atas `orange-500` WAJIB `brown-900`** (Rasio 5.5:1, lulus WCAG AA).
2. **Teks putih di atas `orange-500` DILARANG KERAS** (Rasio 2.5:1, GAGAL WCAG).
3. **`orange-500` sebagai teks di atas `cream`/`orange-100` DILARANG** (Rasio < 3.3:1, GAGAL WCAG). Hanya boleh untuk ikon/grafis ≥ 24px.
4. **`green-500` sebagai teks di atas `cream`** hanya diizinkan pada teks besar/tebal (≥ 18.66px bold) atau ikon.
5. **Badge/Chip**: Menggunakan kombinasi `bg-orange-100 text-brown-900` atau `bg-green-100 text-brown-900`.
6. Jangan pernah menyampaikan informasi hanya melalui warna saja.

