# Spek Desain & Kontrak API: Fase P5 (Wellness Suite)

> Mengacu pada `DESIGN.md` (Living Sanctuary Palette), `AGENTS.md` (§7.7, §7.8, §7.9, §8, §9), dan aturan Maskot Bebas Kotak (`mascot.md`).

---

## 1. Arsitektur Halaman & Ruang Lingkup

Fase P5 mencakup 3 pilar aksi dan pemulihan kesehatan mental/fisik pengguna:
1. **Smart Activity Planner (`/activity`)**: Rekomendasi aktivitas mikro menenangkan tanpa beban & **Breathing Garden (Taman Bernapas 4-7-8)**.
2. **Ruang Sehat / Wellness Journey (`/wellness-journey`)**: Kurva tren Zyba Score (Mental, Fisik, Sosial) & stres 7/30 hari, riwayat check-in, dan **Jurnal Reflektif Suaka** dengan deteksi keselamatan emosional (`detectRisk`).
3. **Wawasan Sehat / Resources (`/resources`)**: 6 artikel kurasi konkret bebas generic-slop untuk Gen Z Indonesia, pemutar audio relaksasi (ambient rain, ombak laut tenang), 100% gratis tanpa paywall.

---

## 2. Riset & Arah Visual (ui-ux-pro-max & taste-skill)

- **Palet Terkunci (Living Sanctuary)**:
  - Background kanvas: `#F5F8F5` (Fresh Pale Meadow) dan `#F7F2E7` (Cream).
  - Aksen primer: `#3E7B54` (Forest Green) & `#2D5A3D` (Deep Green hover/active).
  - Aksen sekunder: `#F2884B` (Warm Sunny Orange) untuk tombol aksi hangat.
  - Teks: `#1B241E` (Dark Charcoal Green) dengan hierarki teks jelas (`text-brown-700/60`, `text-brown-700`).
- **Komposisi & Hirarki (65:35 Asimetri)**:
  - Di `/activity`: Kolom kiri (65%) berisi timer interaktif *Breathing Garden*, kolom kanan (35%) berisi checklist aktivitas harian ringan.
  - Di `/wellness-journey`: Header kurva grafik dinamis & ringkasan skor, diikuti tab Riwayat Check-In & Jurnal Reflektif.
  - Di `/resources`: Grid artikel 2 kolom dengan filter topik mudah dibaca (Stres, Pola Tidur, Overthinking, Hubungan).
- **Anti-Slop Compliance**:
  - Tidak ada streak api merah yang menekan (menggunakan konsistensi lembut *Hearth Flame*).
  - Tidak ada emoji sebagai ikon (wajib Lucide Outline stroke 1.8px-2.2px).
  - Tidak ada border/kotak pembungkus pada Maskot Zibi (*box-free*).
  - Breathing Garden mendukung `prefers-reduced-motion` (indikator angka & teks tetap aktif jika animasi dinonaktifkan).

---

## 3. Matriks State & Kontrak API

### 3.1 Smart Activity (`/activity`)
- **API `GET /api/activity`**:
  - Response: `{ activities: ActivityLogItem[], todaySummary: { completed: number, target: number } }`
- **API `POST /api/activity/log`**:
  - Request: `{ type: "BREATHING" | "WALKING" | "WORKOUT" | "SLEEP", durationMin: number, completed: boolean }`
  - Response: `{ activityLog: ActivityLog, newZybaScore: number }` (otomatis memicu hitung ulang skor).
- **State Matrix**:
  - *Default*: Kartu aktivitas tampil dengan checklist lembut.
  - *Active (Breathing)*: Lingkaran bernapas mengembang (Inhale 4s), menahan (Hold 7s), mengempis (Exhale 8s).
  - *Reduced-Motion*: Lingkaran statis lembut, transisi fase melalui perubahan teks dan hitungan detik.
  - *Completed*: Suara chime lembut / umpan balik visual hangat `bg-emerald-100 text-emerald-800`.

### 3.2 Ruang Sehat / Wellness Journey (`/wellness-journey`)
- **API `GET /api/wellness-journey/stats`**:
  - Response: `{ currentScore: number, scoreBreakdown: { mental: number, physical: number, social: number }, history: { date: string, score: number, stress: number, mood: string }[] }`
- **API `GET /api/wellness-journey/journal`**:
  - Response: `{ entries: JournalEntryItem[] }`
- **API `POST /api/wellness-journey/journal`**:
  - Request: `{ title: string, content: string, mood?: string }`
  - Validasi: `detectRisk(content)` &rarr; jika terdeteksi krisis, simpan dengan flag dan tampilkan banner bantuan lembut.
  - Response: `{ entry: JournalEntry, riskDetected: boolean }`

### 3.3 Resources (`/resources`)
- **API `GET /api/resources`**:
  - Filter: `?type=ARTICLE | AUDIO &topic=...`
  - Response: `{ resources: ResourceItem[] }`
- **Audio Player State**:
  - *Idle / Playing / Paused* dengan slider durasi dan pengaturan volume lembut.

---

## 4. Kriteria Penerimaan Terverifikasi (Definition of Done)
1. Halaman `/activity` dapat menyelesaikan sesi bernapas dan mencatat log yang memperbarui skor.
2. Halaman `/wellness-journey` menampilkan kurva tren riwayat check-in dan form jurnal reflektif yang aman dari risiko krisis.
3. Halaman `/resources` menyajikan minimal 6 artikel edukasi mindful Gen Z berbahasa Indonesia dan audio relaksasi.
4. Semua komponen memakai Lucide ikon outline, tanpa emoji, dan maskot Zibi tampil bebas kotak (*box-free*).
5. Build `next build` dan `tsc --noEmit` lulus tanpa error, diuji dengan screenshot 3 viewport.
