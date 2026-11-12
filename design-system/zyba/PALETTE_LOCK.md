# PALETTE_LOCK.md — ZYBA v2 (Fresh Botanical Sanctuary)

> **STATUS: TERKUNCI (Disetujui User).** Berdasarkan konfirmasi pengguna pada perombakan visual dan referensi resmi Habitdo, palet warna ZYBA menggunakan **Palet Botani Segar (*Fresh Botanical Sanctuary*)** untuk menghadirkan kenyamanan visual maksimal, kejelasan hierarki, dan keterbacaan tinggi.

---

## 1. Nilai Hex Resmi Terkunci (Canonical Tokens)

| Token | Hex | Kelas Tailwind | Peruntukan Resmi |
|---|---|---|---|
| **Canvas Botanical** | `#F5F8F5` | `bg-cream` / `bg-canvas-botanical` | Kanvas halaman utama (segar, bersih, menenangkan) |
| **Milk White** | `#FFFFFF` | `bg-white` / `bg-white/95` | Permukaan kartu, background widget, modal |
| **Charcoal 900** | `#1B241E` | `text-brown-900` / `text-charcoal-900` | Teks utama, judul serif/sans, angka skor, kontras tajam |
| **Charcoal 700** | `#526056` | `text-brown-700` / `text-charcoal-700` | Teks sekunder, deskripsi, caption, meta |
| **Botanical 500** | `#3E7B54` | `bg-botanical-500` / `bg-green-500` | **Warna Utama:** Tombol aktif sidebar (Habitdo style), CTA utama, centang selesai, progress bar utama |
| **Botanical 100** | `#EAF4EC` | `bg-botanical-100` / `bg-green-100` | Latar kartu mint pastel, badge langkah selesai |
| **Peach 500** | `#F28C6E` | `bg-peach-500` / `bg-orange-500` | **Aksen Kehangatan:** Sorotan mood, tombol sekunder, lilin kehangatan, aksen interaktif |
| **Peach 100** | `#FDF1EB` | `bg-peach-100` / `bg-orange-100` | Latar kartu peach pastel, avatar aksen |
| **Border Soft** | `rgba(27,36,30,0.08)` | `border-brown-900/8` / `border-charcoal-900/8` | Garis batas kartu & divider sangat lembut |
| **Focus** | `rgba(62,123,84,0.35)` | `ring-botanical-500/35` | Ring fokus keyboard yang terlihat & rapi |
| **Danger** | `#D9534F` | `bg-danger` | **Hanya** hapus akun/post. Dilarang untuk konten krisis |

### 2. Kartu Pastel Pendukung (Bento Accents)
| Varian Kartu | Background | Border | Ikon / Badge |
|---|---|---|---|
| **Mint / Pertumbuhan** | `#EAF4EC` | `#C8E4CD` | `#2D6A4F` |
| **Peach / Kehangatan** | `#FDF1EB` | `#F9D5C5` | `#C85A3B` |
| **Sky / Ketenangan** | `#EDF4F8` | `#CDE0EC` | `#3B7494` |
| **Butter / Refleksi** | `#FBF6EA` | `#F2E4BE` | `#8C6E32` |
| **Lavender / Nafas** | `#F3EFF8` | `#DDD2EA` | `#6A5296` |

---

## 3. Aturan Kontras WCAG (Wajib Dipatuhi)

1. **Teks di atas `botanical-500` (`#3E7B54`) WAJIB `#FFFFFF`** (Rasio 5.2 : 1, lulus WCAG AA).
2. **Teks di atas `peach-500` (`#F28C6E`) WAJIB `charcoal-900` (`#1B241E`)** (Rasio 5.6 : 1, lulus WCAG AA).
3. **Teks di atas `canvas-botanical` (`#F5F8F5`) menggunakan `charcoal-900` (`#1B241E`)** (Rasio 13.5 : 1, lulus WCAG AAA).
4. **Teks sekunder di atas kanvas menggunakan `charcoal-700` (`#526056`)** (Rasio 6.2 : 1, lulus WCAG AA).
