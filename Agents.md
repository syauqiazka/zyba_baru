# AGENTS.md — ZYBA v2 (Rebuild)

> **Aturan prioritas dokumen**
> 1. `DESIGN.md` = sumber kebenaran visual. Kalau bertentangan dengan dokumen ini soal tampilan, **DESIGN.md menang**.
> 2. `AGENTS.md` (ini) = sumber kebenaran fitur, arsitektur, keamanan, dan proses kerja.
> 3. Schema Prisma di `prisma/*/schema.prisma` = sumber kebenaran data. Jangan mengarang field di luar schema tanpa update schema dulu.

Dokumen ini ditulis ulang untuk **rebuild dari nol**. Fitur dipertahankan, kode UI lama dibuang. Alasan rebuild: redesign berulang di atas kode lama menghasilkan UI yang makin tidak konsisten. Jadi aturan terpenting di dokumen ini ada di Bagian 2 (proses) dan Bagian 3 (peran skill).

---

## 0. Protokol Kejujuran (WAJIB)

Riwayat proyek ini punya pola agent melapor "selesai" padahal komponen tidak ter-wire, modal tidak dirender, atau styling tidak berubah. Aturan baru:

1. **Tidak boleh melapor "selesai" tanpa bukti.** Bukti = output perintah (`pnpm build`, `pnpm test`, `tsc --noEmit`) + screenshot browser nyata di 3 viewport (375 / 768 / 1280) yang ditempel/disebut path-nya.
2. Setiap laporan menyebut tiga hal: **apa yang berubah**, **bagaimana diverifikasi**, **apa yang belum/tidak bisa diverifikasi**.
3. Sebelum membuat komponen baru: `grep` dulu apakah sudah ada. Sebelum menghapus: `grep` referensi. Komponen yang dibuat tapi tidak pernah di-import = dead code = dianggap belum selesai.
4. Jangan mengerjakan lebih dari **satu fase** (Bagian 9) per batch.
5. Jika ada konflik antar dokumen atau instruksi ambigu: **berhenti dan tanya**, jangan menebak lalu membangun.

---

## 1. Produk

**ZYBA — Gen Z Wellness Support.** Pendamping kesehatan mental, fisik, dan sosial berbasis AI. Alur inti: **Curhat → Solusi → Program → Aksi**.

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma 3 database PostgreSQL (account / companion / community), `jose` JWT, `bcrypt`, Ably (realtime DM), Brevo (email OTP, HTTPS API), ElevenLabs + Web Speech (TTS), Groq Whisper (STT), 4 provider LLM gratis.

**Hosting:** self-hosted Webuzo, domain `jhic.zyba.my.id` / `zyba.my.id`, Node 21, `pnpm` (satu-satunya package manager; hapus `package-lock.json`).

### 1.1 Nama resmi fitur

| Nama resmi | Route |
|---|---|
| Zyba Companion | `/companion` |
| Check-In Harian (Mood Check-In) | `/mood-check-in` |
| Smart Activity Planner | `/activity` |
| Wellness Journey ("Ruang Sehat") | `/wellness-journey` |
| Zyba Community | `/community` |
| Resources (Wawasan) | `/resources` |
| Guidebook & Bantuan Krisis | `/guidebook` |

*Catatan: Fitur Achievement/Badge dan Zyba Plus/Pembayaran telah resmi dihapus sesuai instruksi pengguna. Seluruh layanan ZYBA gratis 100%.*

Dilarang ada sisa nama brand lain di kode/copy: "Doctor Freud.AI", "Discord", "Claude", "Threads" sebagai nama komponen/label.

---

## 2. Proses Kerja Per Fase (Pipeline Wajib)

Setiap halaman/fitur melewati pipeline yang sama, dalam urutan ini:

```
[A] RISET & ARAH   → ui-ux-pro-max
[B] KARAKTER       → taste-skill
[C] SPEK           → tulis design-system/zyba/pages/<halaman>.md  (superpowers: brainstorm + plan)
[D] BANGUN         → superpowers (TDD, kontrak API, state matrix)
[E] TAJAMKAN       → impeccable (critique → audit → polish, SATU putaran)
[F] GERBANG        → anti-slop (lolos/gagal, tidak ada "hampir")
[G] BUKTI          → Protokol Kejujuran (Bagian 0)
```

**Design freeze:** begitu `DESIGN.md` dan mockdoc halaman disetujui user, agent **dilarang mengubah arah visual** (warna, radius, layout dasar, font). Yang boleh hanya polish di dalam token yang ada. Perubahan arah hanya jika user memintanya eksplisit. Ini mencegah siklus "redesign makin ngawur".

---

## 3. Peran Lima Skill (Tidak Boleh Tumpang Tindih)

| Skill | Peran | Dipakai di tahap | Output yang diharapkan | Yang TIDAK boleh dilakukan |
|---|---|---|---|---|
| **ui-ux-pro-max-skill** | **Pencari referensi & penentu arah.** Menyarankan pola layout, hierarki, pola interaksi per jenis halaman, pertimbangan multi-viewport. | A (sebelum halaman dibuat) | Ringkasan 3–5 pola referensi + rekomendasi arah, dicatat di bagian "Referensi" mockdoc | Mengubah palet terkunci; mengganti font; menambah style baru di luar DESIGN.md |
| **taste-skill** | **Pengasah karakter.** Art direction, kejelasan komposisi, cek browser nyata, menghindari halaman generik ala AI. | B dan G | Catatan komposisi (ritme whitespace, titik fokus, asimetri 65:35) + screenshot cek browser | Menambah dekorasi; membuat gaya baru |
| **impeccable** | **Pengasah detail.** `critique` (kritik terstruktur), `audit` (a11y/kontras/konsistensi), `polish` (spacing, state, microcopy). | E | Daftar temuan berprioritas + perbaikan; satu putaran saja | Redesign; mengubah struktur halaman |
| **superpowers** | **Metodologi rekayasa.** Brainstorm → rencana → TDD → verifikasi → review. Kontrak API, matriks state. | C dan D | Rencana tertulis, test, kontrak data, kriteria penerimaan | Melewati test; melapor selesai tanpa verifikasi |
| **anti-slop** | **Filter akhir (gate).** Biner: lolos / gagal. | F | Checklist anti-slop terisi (Bagian 3.1) | Dikompromikan "karena sudah mepet waktu" |

Urutan wewenang saat konflik: **DESIGN.md > anti-slop > impeccable > taste > ui-ux-pro-max.** Skill riset memberi saran; skill filter punya hak veto.

### 3.1 Checklist Anti-Slop (gate F)

Halaman gagal jika salah satu terjadi:

- [ ] Emoji dipakai sebagai ikon, avatar persona, atau pengganti ilustrasi (wajib Lucide 1.8px atau SVG ilustrasi sendiri)
- [ ] Gradient ungu-biru, glow/orb blur
- [ ] Kartu di dalam kartu tanpa fungsi
- [ ] Ikon dalam kotak rounded warna-warni di atas heading/list
- [ ] Streak api merah, hitung mundur menekan, copy bersalah
- [ ] Angka/statistik/testimoni karangan, atau data dummy tampil sebagai data user
- [ ] `rounded-[32px]` diseragamkan; radius di luar skala DESIGN.md
- [ ] Teks putih di atas `orange-500` (gagal kontras; lihat DESIGN.md §2.2)
- [ ] Animasi tanpa `motion-reduce`
- [ ] Teks bahasa Inggris nyelip di UI berbahasa Indonesia
- [ ] Warna alarm merah untuk konten krisis pengguna
- [ ] Sidebar/nav ganda, tombol "Baru" ganda, search ganda

---

## 4. Keputusan Terkunci (Menyelesaikan Konflik Dokumen Lama)

Dokumen lama saling bertentangan di beberapa titik. Untuk rebuild, keputusan berikut berlaku. **Bagian bertanda (KONFIRMASI) diambil dari bukti terbaru (schema/.env) dan harus dikonfirmasi user sebelum Fase terkait.**

| # | Topik | Keputusan | Sumber bukti |
|---|---|---|---|
| D1 | Check-in harian | **Satu** flow: `/mood-check-in`. Data disimpan di model `DailyAssessment` (unik per user per tanggal, upsert), diperluas dengan 15 pertanyaan terstruktur. `MoodEntry` dihapus dari schema v2 (atau dibiarkan hanya sebagai quick-mood tanpa halaman sendiri). Folder `daily-assessment/` tidak boleh ada. | Schema account punya keduanya; spek lama minta merge |
| D2 | Achievement vs Badge | **Dihapus total.** Tidak ada model Achievement, Badge, UserAchievement, UserBadge, atau route `/achievements`. Seluruh pencapaian ditiadakan agar fokus pada mindful wellness tanpa beban gamifikasi. | Instruksi pengguna (penyederhanaan produk) |
| D3 | Pembayaran & Premium | **Dihapus total.** Tidak ada Zyba Plus, subscription, payment midtrans/manual/QRIS, maupun verifikasi admin pembayaran. Seluruh fitur ZYBA 100% gratis untuk semua pengguna. | Instruksi pengguna (bebas bayar-bayaran) |
| D4 | TTS | Primer **ElevenLabs** (hasil di-cache ke `ttsAudioUrl`), fallback **Web Speech API**. Edge TTS tidak dipakai. STT: Groq Whisper. | `.env` + kolom `tts*` di schema companion |
| D5 | Persona Companion | Kina, Ollie, Rubi, Bruno. Representasi visual = **ilustrasi SVG sendiri**, bukan emoji. | Anti-slop |
| D6 | Storage | Filesystem server: `public/uploads/` dan `public/uploads/avatars/`. Tidak ada Vercel Blob. Upload via API route (`multipart/form-data`), validasi tipe + ukuran. | Lampiran E.3 |
| D7 | Email | Brevo REST API via HTTPS (443). Tidak ada SMTP. | `.env` |
| D8 | Kuota Free | 20 pesan/hari, ditegakkan server lewat `DailyMessageQuota` (companion DB). | Schema companion |
| D9 | Rate limit | `RateLimitBucket` (companion DB), per user + per endpoint. | Schema companion |
| D10 | Data lokal fallback | **Tidak ada** fallback `data/*.json`. Jika DB gagal: tampilkan error state jujur, jangan data palsu. | Lampiran 8.5.2 |
| D11 | Auth | `bcrypt` cost 12, JWT `jose` HS256 (30 hari) di cookie `httpOnly`, `secure`, `sameSite=lax`. OTP tidak pernah ada di response. Akun Google tidak bisa login via form password. | Bagian 8 lama |
| D12 | Lampiran feature | Fitur diluar daftar ini (mis. Projects/Artifacts/Code di Companion) **dilarang** dibuat. | Scope creep lama |

---

## 5. Arsitektur

### 5.1 Struktur folder

```
prisma/
  account/schema.prisma      # User, Assessment, DailyAssessment, Journal, Activity,
                             # Resource, Subscription, Payment, Achievement, Badge, ModerationLog
  companion/schema.prisma    # Conversation, Message, DailyMessageQuota, RateLimitBucket, PremiumInsightCache
  community/schema.prisma    # Post, Comment, Like, Follow, Bookmark, Notification,
                             # DirectConversation/Participant/Message, Report
src/
  app/
    (public)/                # /, /onboarding, /login, /guidebook (publik)
    (app)/                   # semua yang butuh auth + onboardingCompleted
      layout.tsx             # ClientLayout: Zen Dock / Bottom Pill
      dashboard/ mood-check-in/ activity/ wellness-journey/
      resources/ achievements/ settings/
      companion/   (layout.tsx = CompanionSidebar, page.tsx, [id]/page.tsx)
      community/   (layout.tsx = CommunitySidebar, page.tsx, [slug]/page.tsx)
    assessment/              # gate onboarding (di luar (app))
    admin/                   # moderasi + verifikasi pembayaran (role ADMIN)
    api/
  backend/
    db/accountClient.ts companionClient.ts communityClient.ts
    auth/ ai/ billing/ scoring/ moderation/ realtime/ storage/ email/
  components/ui/ components/<domain>/
  lib/crisisDetection.ts
  generated/{account,companion,community}-client/
design-system/zyba/
  MASTER.md  PALETTE_LOCK.md  pages/<halaman>.md
```

### 5.2 Aturan database

- Tiga database terpisah. **Tidak ada `@relation` lintas DB**; `userId` di companion/community hanya `String`.
- Tidak ada JOIN/transaksi lintas DB. Gabung manual di repository (batch `in: [...]`, bukan query per item).
- `postinstall` = `pnpm run db:generate:all`. Generate **di server**, bukan salin dari Windows.
- `binaryTargets` seperti di schema; jangan dihapus.
- Semua list wajib pagination (cursor). Dilarang `findMany()` tanpa `take`.
- Hapus akun = hapus data di **ketiga** DB, dalam urutan: community → companion → account, dengan log kegagalan per DB.

### 5.3 Fallback AI

`AIProvider` interface; implementasi Gemini, Groq, Mistral, OpenRouter. Rantai fallback saat `429`/timeout. Nama model dibaca dari config, bukan hardcode di komponen. Model selector UI hanya menampilkan provider yang punya API key terisi. Model yang tidak ada di rencana (Claude, GPT) tidak ditampilkan kecuali `OPENAI_API_KEY` diisi dan fitur diaktifkan eksplisit.

---

## 6. Sitemap & Akses

| Route | Akses | Catatan |
|---|---|---|
| `/` | Publik | Landing |
| `/onboarding` | Publik | Welcome carousel + signup/signin + OTP. Berakhir saat akun dibuat |
| `/login` | Publik | |
| `/guidebook` | Publik | Direktori krisis, boleh diakses tanpa login |
| `/assessment` | Auth, `onboardingCompleted=false` | Gate wajib, 8 step |
| `/welcome` | Auth | Tur singkat **setelah** assessment (bukan carousel pra-signup) |
| `/dashboard` | Auth + onboarding selesai | |
| `/mood-check-in` | Sama | Satu-satunya check-in harian |
| `/companion`, `/companion/[id]` | Sama | `[id]` = conversationId |
| `/activity`, `/wellness-journey`, `/resources` | Sama | |
| `/community`, `/community/[slug]` | Sama | slug: search, messages, activity, profile, insights |
| `/settings` + sub (`privacy`, `notifications`, `persona`) | Sama | Satu halaman akun terpusat |
| `/admin/*` | Role `ADMIN` | Moderasi laporan |

**Middleware:** (1) tanpa JWT valid → redirect ke `/login` untuk route `(app)`; (2) `onboardingCompleted=false` → redirect ke `/assessment`; (3) `isBanned`/`isSuspended` → halaman status khusus; (4) `/admin` hanya ADMIN. Middleware hanya memverifikasi JWT (edge-safe); pengecekan DB ada di server component/API.

---

## 7. Spesifikasi Fitur (Ringkas; Detail di Mockdoc)

Setiap fitur punya mockdoc di `design-system/zyba/pages/` yang **harus ditulis sebelum kode** (Pipeline C). Mockdoc berisi: tujuan, referensi (dari ui-ux-pro-max), komposisi, state matrix (Default / Loading / Empty / Active / Error / Crisis), kontrak API, kriteria penerimaan terverifikasi.

### 7.1 Onboarding & Assessment

- `/onboarding`: carousel 5 slide → sign up (email, password dengan strength meter, Google) → OTP 6 digit via Brevo (cooldown + batas percobaan).
- `/assessment` (satu flow, progress bar, panel stepper kiri di desktop): 1 avatar + profil · 2 password (jika belum) · 3 verifikasi OTP · 4 fingerprint (opsional, skip jika tak didukung) · 5 notifikasi (`NotificationPref`) · 6 kuisioner (goal, gender, usia, berat, mood, riwayat bantuan, gejala fisik, kualitas tidur, stres, obat, gejala mental, **Expression Analysis**) · 7 compiling · 8 selesai → set `onboardingCompleted=true`.
- Expression Analysis: placeholder **netral**, teks bebas wajib lewat `detectRisk()` → `Assessment.flaggedForRisk`.
- Input numerik: state string, bukan number (hindari bug "017").
- State terpilih jawaban (semua tipe): default `border-brown-900/10` → hover `orange-500/40` → selected `border-2 orange-500` + `bg-orange-100` + ikon `Check`, transisi 200ms.
- Dashboard **tidak boleh** mengarah ke `/assessment` untuk aksi harian.

### 7.2 Check-In Harian (`/mood-check-in`)

15 pertanyaan, multi-step (2–3 per layar, bukan 15 sekaligus), plus catatan bebas opsional. Pemetaan aspek:

| Aspek | Pertanyaan |
|---|---|
| Mental | 1 mood · 2 stres · 3 cemas · 4 kepuasan · 13 produktif · 14 waktu untuk diri |
| Fisik | 5 kualitas tidur · 6 jam tidur · 7 energi · 8 makan teratur · 9 aktivitas fisik |
| Sosial | 10 keterhubungan · 11 merasa didukung · 12 interaksi komunitas |
| Syukur | 15 hal positif (opsional, tidak masuk skor) |

Catatan bebas & Q15 wajib lewat `detectRisk()`. Satu record per tanggal (upsert). Jika crisis terdeteksi: tampilkan Crisis Gate (DESIGN.md §6.4) sebelum hasil.

### 7.3 Zyba Score (dinamis)

Dihitung ulang setiap check-in/aktivitas/post baru dan disimpan ke `User.zybaScore`. Rolling window 7 hari.
`score = mental*0.5 + fisik*0.25 + sosial*0.25`, dibatasi 0–100.
Fisik = gabungan `DailyAssessment` (tidur, energi, aktivitas) + `ActivityLog`. Sosial = gabungan `DailyAssessment` (koneksi, dukungan) + post/komentar (cross-DB, dua query). Skor assessment awal hanya baseline. Tidak ada data → 50 (netral), dan UI menampilkan "belum cukup data", bukan angka seolah nyata. Wajib ada unit test untuk fungsi hitung.

### 7.4 Dashboard

Ringkasan: sapaan (nama dari user nyata), Zyba Score + breakdown 3 aspek, stres, Hearth Flame (konsistensi harian), checklist lembut hari ini, widget Companion, shortcut Resources. Semua angka dari query agregat. CTA harian → `/mood-check-in`. Akun/avatar → `/settings`. Dilarang hydration mismatch: tidak membaca `localStorage` di initializer `useState`; pakai `useEffect` setelah mount, state awal identik server/client.

### 7.5 Zyba Companion

- `layout.tsx` merender `CompanionSidebar` **sekali**. `page.tsx` dan `[id]/page.tsx` hanya `ChatHeader` + `ChatMessages` + `ChatInput`.
- Sidebar: "← Kembali ke ZYBA", satu tombol "+ Percakapan Baru", satu search (debounce 300ms), label "RIWAYAT PERCAKAPAN", item teks-minimal (judul, waktu relatif, titik mood). Aktif/hover = `bg-brown-900/5`, tanpa border berwarna.
- `activeConvId` diturunkan dari URL (`useParams`), bukan state mandiri. Daftar percakapan fetch dari companion DB; tidak ada `"conv-1"`.
- Empty state: ilustrasi SVG + "Cerita apa hari ini?" + 3–4 chip starter.
- Input: textarea auto-grow (max 180px), Enter kirim / Shift+Enter baris baru / IME aman. Model selector + persona menempel dekat input, bukan toolbar penuh di atas halaman. Hanya badge plan di pojok kanan atas.
- STT: Web Speech API `id-ID` via `useSTT` (live) dan/atau unggah audio → Groq Whisper; status jujur ("Mendengarkan…", error izin mic). Voice note **wajib ditranskrip dulu** lalu `detectRisk()`.
- Lampiran: aktif hanya jika backend upload sudah ada; kalau belum, tombol `aria-disabled` + tooltip jujur.
- TTS: tombol putar selalu terlihat di mobile; ElevenLabs di-cache, fallback Web Speech.
- Persona: system prompt di `src/backend/ai/personas.ts`. **Semua persona** tunduk pada aturan krisis yang sama; persona tidak boleh melunakkan respons terhadap sinyal bahaya diri.
- Kuota: `checkMessageQuota` server-side sebelum memanggil provider → error `QUOTA_EXCEEDED` (403) → modal "Kuota chat harian habis". Sisa kuota ditampilkan halus untuk Free.
- Banner krisis: di atas jendela chat, tenang, tidak auto-dismiss, dapat ditutup manual.

### 7.6 Zyba Community

- `layout.tsx` merender `CommunitySidebar` **sekali**. Item nav: Untuk Kamu, Postingan Baru, Cari, Pesan, Notifikasi, Profil, Insights; section "Feed Lain": Mengikuti, Disimpan, Disukai.
- Feed: kolom tengah max 600px, divider tipis antar post (bukan tumpukan kartu), tab "Untuk Kamu / Mengikuti". Pagination cursor.
- Compose inline + tombol "+" mengambang yang membuka **floating compose card** (kanan-bawah, tanpa backdrop gelap penuh). Dua entry point berbeda fungsi. Wajib dites klik nyata di browser.
- Aksi post: suka (aktif = `orange-500`), komentar inline, bagikan, bookmark. Ikon Lucide outline.
- Anonim: toggle jelas di compose; tidak ada contoh hardcode.
- Suara/gambar/stiker: sesuai kolom schema; stiker = aset statis `public/stickers/` dengan `stickerId`.
- DM: model `Direct*`, realtime via Ably, badge unread di item "Pesan" (hitungan nyata, "9+"). Polling ringan sebagai fallback.
- Moderasi: report (`CommunityReport`), tindakan admin tercatat di `ModerationLog`. `detectRisk()` pada teks post; jika terindikasi, tawarkan sumber bantuan ke penulis (jangan memblokir diam-diam).
- Sidebar Community responsif mobile (drawer) — bukan hanya sidebar utama.
- Seed konten: 3–5 post representatif lewat `prisma/seed.ts`, bukan post testing.

### 7.7 Smart Activity Planner

Kartu kondisi harian, rekomendasi mikro tanpa tekanan, Breathing Garden (4-7-8 timer, `prefers-reduced-motion` aman), musik latar opsional (file MP3 royalty-free di `public/audio/`). Tiap `ActivityLog` selesai memicu hitung ulang skor Zyba.

### 7.8 Wellness Journey ("Ruang Sehat")

Kurva Zyba Score & stres, riwayat check-in, jurnal (`JournalEntry`, wajib `detectRisk()`), ringkasan mingguan. Seluruh insight dan grafik terbuka penuh dan gratis untuk semua pengguna.

### 7.9 Resources

Artikel (6 seed, 400–700 kata, Bahasa Indonesia, konkret untuk Gen Z Indonesia, bebas gaya generik AI) + audio relaksasi. Ikon Lucide. Seluruh resource gratis dan dapat diakses terbuka.

### 7.10 Settings & Privasi

- Profil, password & keamanan, **ekspor data (JSON)**, **hapus akun** (konfirmasi bertahap, 3 DB), persona, notifikasi (`NotificationPref` tersambung), visibilitas post, bantuan krisis, tentang & kontak. Bebas biaya dan tanpa tier berbayar.

### 7.12 Guidebook

Publik, tanpa login. Hotline dari satu sumber (`CRISIS_RESOURCES`), diverifikasi sebelum rilis (nomor berubah). Panduan pertolongan pertama emosional.

---

## 8. Keamanan & Keselamatan

**Keamanan:** password bcrypt; JWT `httpOnly`; OTP tidak pernah di response; rate limit OTP/login/chat/post; semua input divalidasi (zod); upload dibatasi tipe/ukuran + nama file di-generate; `.env` tidak masuk git; tidak ada hash/data user di repo; webhook/approval pembayaran idempoten; enforcement fitur Plus **di server**, UI hanya lapisan kedua.

**Keselamatan kesehatan mental:**
- `detectRisk()` wajib di: expression analysis, catatan check-in, jurnal, chat Companion (termasuk hasil transkrip voice), post & komentar Community.
- Respons terhadap risiko: tenang, jelas, tautan hotline langsung; tidak pernah menghakimi; tidak mengubah nada berdasarkan persona.
- Konten krisis **tidak** memakai warna alarm merah atau animasi playful.
- Data sensitif (assessment, chat) tidak dikirim ke provider AI lebih dari yang diperlukan untuk menjawab; tidak di-log mentah di server log.
- ZYBA pendamping, bukan pengganti tenaga profesional; copy tidak mengklaim diagnosis atau terapi.

---

## 9. Fase Rebuild (Urut, Satu Fase per Batch)

Setiap fase menjalankan Pipeline Bagian 2 dan ditutup dengan Protokol Bagian 0.

| Fase | Isi | Kriteria selesai (terverifikasi) |
|---|---|---|
| **P0 Fondasi** | Repo baru/branch bersih, pnpm, Tailwind token dari DESIGN.md, 3 schema + client, `db:generate:all`, `ClientLayout` (Zen Dock + Bottom Pill), komponen UI dasar, tes kontras token | `pnpm build` lulus; dock benar di 375/768/1280; token = PALETTE_LOCK |
| **P1 Auth & Onboarding** | Signup/login/OTP Brevo/Google, JWT, middleware gate, `/assessment` 8 step, landing | Tidak bisa akses `(app)` sebelum onboarding selesai (tes otomatis); OTP tak ada di response |
| **P2 Check-In, Skor, Dashboard** | 15 pertanyaan, scoring + unit test, dashboard data nyata, Hearth Flame | Skor berubah setelah check-in baru (tes); tidak ada dummy |
| **P3 Companion** | Layout+sidebar, chat, multi-provider+fallback, persona, STT/TTS, kuota, crisis banner | Kuota 20 ditegakkan lewat panggilan API langsung; crisis banner muncul pada input uji |
| **P4 Community** | Feed, compose+modal, komentar, like, bookmark, follow, DM+Ably, report, admin moderasi | Modal "+" benar-benar tampil (tes klik); DM realtime antar dua akun |
| **P5 Activity & Resources** | Planner+breathing, seed artikel wawasan, audio relaksasi, bebas kuncian bayar | Artikel Bahasa Indonesia penuh, breathing garden teruji |
| **P6 Settings & Admin** | Semua sub-settings, ekspor JSON, hapus akun 3 DB, admin moderasi laporan | Hapus akun membersihkan ketiga DB (tes otomatis) |
| **P7 Audit akhir** | Dummy-data sweep, `grep` dead code, responsif 6 viewport, kontras, reduced-motion, performa (pagination, `next/image`, debounce, dynamic import) | Checklist Bagian 10 hijau |

---

## 10. Definition of Done (Checklist Rilis)

**Repo & proses**
- [ ] Satu package manager (pnpm), `packageManager` terisi, `postinstall` benar
- [ ] Tidak ada `data/*.json`, tidak ada `.env` ter-commit, tidak ada hash password di history
- [ ] Tidak ada `daily-assessment/`, `discord/`, Projects/Artifacts/Code di Companion
- [ ] Tidak ada dead code (setiap komponen punya importer)
- [ ] Setiap halaman punya mockdoc dan lolos gate anti-slop

**Keamanan & keselamatan**
- [ ] bcrypt, JWT httpOnly, OTP tak bocor, rate limit aktif
- [ ] `detectRisk()` di semua titik teks bebas, termasuk transkrip suara
- [ ] Enforcement Plus/kuota diuji lewat API langsung, bukan hanya UI
- [ ] Hotline di Guidebook diverifikasi ulang

**Data**
- [ ] Tidak ada dummy tampil sebagai data user; error/empty state jujur
- [ ] Semua list pakai pagination cursor
- [ ] Hapus akun & ekspor data teruji di 3 DB

**Desain**
- [ ] Token = PALETTE_LOCK; radius sesuai skala; font Manrope + DM Sans
- [ ] Kontras AA terpenuhi (termasuk pasangan teks di atas orange)
- [ ] Teruji 360x640, 390x844, 768x1024, 1024x768, 1280x600, 1440x900
- [ ] `prefers-reduced-motion` mematikan semua animasi
- [ ] Semua teks UI Bahasa Indonesia; semua ikon Lucide/SVG, tanpa emoji

**Deploy (Webuzo)**
- [ ] `.env` produksi lengkap (sesuai `.env.example`), `NEXTAUTH_URL` & `ALLOWED_ORIGINS` benar
- [ ] `deploy.sh`: `git pull` → `pnpm install` → `db:generate:all` → `build` → restart via panel
- [ ] SSL aktif, OAuth callback dan Ably terkonfigurasi untuk domain produksi
- [ ] Backup terjadwal aktif
- [ ] Login, kirim pesan Companion, post Community dites langsung di domain produksi

---

## 11. Catatan untuk Agent Berikutnya

- Jangan "memperbaiki" desain di luar mockdoc. Kalau sesuatu terasa kurang, tulis temuan lewat `impeccable critique`, tunjukkan ke user, tunggu keputusan.
- Jangan menambah fitur karena "masuk akal". Fitur baru = ubah dokumen ini dulu, dengan persetujuan user.
- Re-export shim yang disengaja (mis. `components/X.tsx` → `components/ui/X.tsx`) bukan bloat; hapus hanya setelah `grep` membuktikan tidak ada importer. Di rebuild, hindari membuat shim baru.