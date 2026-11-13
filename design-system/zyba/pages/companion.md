# Spesifikasi Halaman: Zyba Companion (`/companion`, `/companion/[id]`)

> **Fase P3 — Zyba Companion**
> Dokumen ini adalah spesifikasi arsitektur, UI, kontrak data, dan kriteria penerimaan untuk fitur pendamping AI empatik ZYBA.

---

## 1. Tujuan Halaman

Menyediakan ruang curhat dan refleksi interaktif berbasis AI yang aman, empatik, hangat, dan tanpa penghakiman. Pengguna didampingi oleh **Maskot Resmi ZYBA (Zibi)** sebagai persona tunggal AI Companion. Pengguna dapat berbicara secara teks atau suara (STT), mendengarkan respons via suara (TTS ElevenLabs / Web Speech), dan menjelajahi riwayat percakapan sebelumnya. 

Untuk menjaga keseimbangan mental pengguna dan **mencegah ketergantungan berlebih terhadap AI**, ZYBA menerapkan batas mindful **15.000 token per sesi chat**. Begitu kuota 15.000 token tercapai, pengguna diajak mengambil **Jeda Batin (Cooldown) selama 5 jam** untuk beristirahat di dunia nyata sebelum token disegarkan kembali.

---

## 2. Referensi Pola & Arah Visual (Aetheris AI Chat Pattern)

- **Karakter Visual:** *Tactile Sanctuary & Ethereal Botanical* (Kanvas `#F5F8F5` dengan gradien lembut, kartu melayang putih transparan `#FFFFFF`, aksen hijau botani `#3E7B54`, aksen peach `#FDF1EB` / `#F28C6E`, teks deep charcoal `#1B241E`).
- **Pola Tata Letak (Sesuai Referensi Gambar Utama):**
  - **Sidebar Kiri (Floating Panel):**
    - Logo & Brand ZYBA Companion di sudut kiri atas.
    - Tombol "+ Percakapan Baru" berupa kartu rounded putih dengan border halus dan elevasi lembut.
    - Menu navigasi cepat: Cari Percakapan (Search), Ruang Refleksi (Library).
    - Bagian Folder/Kategori Topik: *Kecemasan & Stres*, *Pengembangan Diri*, *Refleksi Malam*.
    - Kartu Profil Pengguna di kiri bawah: avatar initial, nama pengguna, sisa saldo token (*mis. 15.000 Token / Mindful Plan*).
  - **Area Utama Terpusat (Central Hero & Input):**
    - Header atas: Label breadcrumb *"Zyba Companion • Zibi ∨"*.
    - Elemen Fokus Tengah: **Maskot Zibi** bernyawa (animasi napas tenang) di atas halo radial lembut.
    - Sapaan Ramah Pengguna: *"Selamat Pagi/Siang/Sore/Malam, {Nama}"* & *"Ada yang ingin kamu ceritakan pada Zibi hari ini?"*.
    - **Floating Center Input Card (Kartu Input Utama Melayang):**
      - Textarea lapang dengan placeholder: *"Tuliskan apa pun yang sedang kamu rasakan..."*.
      - Toolbar bawah di dalam kartu input: Tombol `+` (lampiran/opsi), Ikon Mikrofon (STT id-ID), Tombol Pill *"Fokus Refleksi ∨"*, dan di ujung kanan terdapat tombol lingkaran panah atas `↑` untuk kirim.
    - **Baris Pil Pemantik Refleksi Cepat (Quick Action Pills):** Barisan pil horizontal dengan ikon: *Urai Pikiran*, *Jeda Bernafas 4-7-8*, *Afirmasi Tenang*, *Rencana Hari Ini*, *Refleksi Malam*.
    - **Bagian "Percakapan Terakhirmu" (Recent Chats Grid):** Grid 3 kartu bento yang menampilkan judul, cuplikan pesan terakhir, dan tanggal percakapan.

---

## 3. Komposisi Halaman

```
+---------------------------------------------------------------------------------------------------------+
| SIDEBAR (w-72, Floating Glass Card)            | AREA UTAMA PERCAKAPAN (Aetheris Style)                 |
|------------------------------------------------|--------------------------------------------------------|
| [Logo Zibi] ZYBA Companion                     | Header: Zyba Companion • Zibi ∨                        |
|                                                |                                                        |
| [+ Percakapan Baru]                            |                [ Maskot Zibi (Hero) ]                  |
|                                                |             Selamat Pagi, {Nama Pengguna}              |
| 🔍 Cari percakapan...                          |        Ada yang ingin kamu ceritakan hari ini?         |
| 🗂️ Ruang Refleksi                             |                                                        |
|                                                | +----------------------------------------------------+ |
| KATEGORI TOPIK                                 | | Tuliskan apa pun yang kamu rasakan...             | |
| 📁 Kecemasan & Stres                           | |                                                    | |
| 📁 Rutinitas & Istirahat                       | | [+] [🎙️ Mic] [Fokus Refleksi ∨]              [ ↑ ] | |
| 📁 Refleksi Diri                               | +----------------------------------------------------+ |
|                                                |                                                        |
| [Avatar] {Nama Pengguna}                       | [🌿 Urai Pikiran] [🌬️ Jeda Nafas] [✨ Afirmasi]        |
|          Sisa: 14.850 / 15.000 Token           |                                                        |
|                                                | PERCAKAPAN TERAKHIRMU (3 Bento Cards)                  |
|                                                | [ Card 1: Judul ]  [ Card 2: Judul ]  [ Card 3: Judul] |
+---------------------------------------------------------------------------------------------------------+
```

---

## 4. Matriks State

| State | Kondisi | Tampilan |
|---|---|---|
| **Empty / Hero State** | Belum ada percakapan aktif (`/companion`) | Maskot Zibi di tengah + Sapaan Personal + Kartu Input Melayang + Pil Pemantik + 3 Kartu Percakapan Terakhir |
| **Active Chat Thread** | Percakapan aktif (`/companion/[id]`) | Header Zibi + Riwayat Bubble Pesan (User Peach / Zibi Mint-White) + Floating Input Bar di bawah |
| **Streaming / Typing** | Asisten Zibi sedang merangkai respons | Indikator 3-dot pulse dengan teks *"Zibi sedang merangkai kata..."* |
| **Voice Listening** | Mikrofon STT aktif | Tombol mic berdenyut merah/hijau + status *"Mendengarkan suaramu... Bicara sekarang"* |
| **Mindful Cooldown (5 Jam)** | Penggunaan token $\ge$ 15.000 | Modal / Tampilan Jeda Batin ramah: *"Batas 15.000 token tercapai. Istirahatlah sejenak dari AI dan layar."* + **Live Countdown Timer (04:59:30)** + Rekomendasi aktivitas mindful offline |
| **Crisis Detected** | `detectRisk()` bernilai `true` pada input | Banner krisis tenang di atas chat (Hotline 119 ext 8), tombol hubungi darurat langsung |
| **Error / Network Offline** | Panggilan API gagal / koneksi putus | Pesan error ramah dengan tombol *"Coba Lagi"* |

---

## 5. Kontrak Data & API

### 5.1 GET `/api/companion/conversations`
- Mengambil daftar percakapan pengguna dan status kuota token.
- Mengembalikan:
  ```json
  {
    "conversations": [{ "id": "...", "title": "...", "updatedAt": "..." }],
    "tokenQuota": {
      "tokensUsed": 150,
      "tokenLimit": 15000,
      "remainingTokens": 14850,
      "isCooldown": false,
      "cooldownUntil": null,
      "cooldownRemainingSec": 0
    }
  }
  ```

### 5.2 POST `/api/companion/conversations`
- Membuat percakapan baru.
- Payload: `{ initialMessage?: string }`.
- Mengembalikan: `{ conversationId: "..." }`.

### 5.3 POST `/api/companion/chat`
- Mengirim pesan baru & memvalidasi token serta masa cooldown 5 jam.
- Payload:
  ```json
  {
    "conversationId": "cuid...",
    "content": "Aku merasa sedikit lelah dan overthinking..."
  }
  ```
- **Validasi Server-Side:**
  - Jika `isCooldown` masih aktif (`now < cooldownUntil`) &rarr; Return `403 Forbidden` (`{ error: "COOLDOWN_ACTIVE", cooldownUntil, cooldownRemainingSec }`).
  - Hitung perkiraan token pesan input dan respons asisten.
  - Tambahkan ke `tokensUsed`. Jika total `tokensUsed >= 15000`:
    - Aktifkan `cooldownUntil = now + 5 hours`.
    - Tandai status `isCooldown = true`.
- Output:
  ```json
  {
    "message": { "id": "...", "role": "assistant", "content": "...", "modelUsed": "..." },
    "tokenQuota": {
      "tokensUsed": 14850,
      "tokenLimit": 15000,
      "remainingTokens": 150,
      "isCooldown": false,
      "cooldownUntil": null
    }
  }
  ```

---

## 6. Kriteria Penerimaan Terverifikasi

1. Layout Companion mengadopsi struktur estetika Aetheris AI Chat (sidebar lapang dengan tombol "+ Percakapan Baru", maskot Zibi di tengah, kartu input mengambang, baris pil aksi cepat, dan grid 3 kartu riwayat).
2. Kuota berbasis token 15.000 ditegakkan di server side.
3. Saat token mencapai 15.000, sistem memberlakukan cooldown 5 jam secara otomatis dengan hitung mundur langsung (*countdown timer*).
4. Tidak ada persona Kina, Ollie, Rubi, atau Bruno; hanya Maskot Zibi.
5. `tsc --noEmit` dan `pnpm build` lulus 100%.
