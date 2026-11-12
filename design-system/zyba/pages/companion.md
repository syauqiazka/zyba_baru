# Spesifikasi Halaman: Zyba Companion (`/companion`, `/companion/[id]`)

> **Fase P3 — Zyba Companion**
> Dokumen ini adalah spesifikasi arsitektur, UI, kontrak data, dan kriteria penerimaan untuk fitur pendamping AI empatik ZYBA.

---

## 1. Tujuan Halaman

Menyediakan ruang curhat dan refleksi interaktif berbasis AI yang aman, empatik, hangat, dan tanpa penghakiman. Pengguna dapat memilih 4 persona pendamping (Kina, Ollie, Rubi, Bruno), berbicara secara teks atau suara (STT), mendengarkan respons via suara (TTS ElevenLabs / Web Speech), dan menjelajahi riwayat percakapan sebelumnya.

---

## 2. Referensi Pola & Arah Visual

- **Karakter Visual:** *Fresh Botanical Sanctuary* (Kanvas `#F5F8F5`, kartu putih `#FFFFFF`, hijau botani `#3E7B54`, aksen peach `#FDF1EB` / `#F28C6E`, teks deep forest charcoal `#1B241E`).
- **ui-ux-pro-max Styles:**
  - `ai-native-ui`: Layout percakapan minimal chrome, typing indicator 3-dot pulse, context chip starters, sticky bottom auto-grow input bar.
  - `voice-first-multimodal`: Tombol mikrofon Web Speech API `id-ID` & Groq Whisper STT, visualisasi status mendengarkan, tombol pemutar audio TTS.

---

## 3. Komposisi Halaman

Layout percakapan terbagi menjadi 2 area:

```
+------------------------------------------------------------------------------------+
| SIDEBAR PERCAKAPAN (w-72 desktop, drawer mobile) | JENDELA CHAT AKTIF / EMPTY STATE |
|--------------------------------------------------|---------------------------------|
| "← Kembali ke ZYBA"                             | [Header] Persona Avatar + Status|
| "+ Percakapan Baru"                              | [Crisis Banner jika berisiko]   |
| Search Bar (debounce 300ms)                      |---------------------------------|
| LABEL: RIWAYAT PERCAKAPAN                        | Chat Messages (Scrollable)      |
| - List Item (Judul, Waktu, Titik Mood)           | - User Bubble (Peach pastel)    |
|   Hover/Active: bg-brown-900/5                   | - Companion Bubble (White/Mint) |
|   Tombol hapus percakapan                        |   (TTS button, Copy, Time)      |
|                                                  |---------------------------------|
| Kuota Info: Sisa N/20 pesan hari ini             | [Input Bar]                     |
|                                                  | - Textarea auto-grow (48-180px) |
|                                                  | - Persona Switcher & Model Info |
|                                                  | - Mic STT + Lampiran + Send CTA |
+------------------------------------------------------------------------------------+
```

---

## 4. Matriks State

| State | Kondisi | Tampilan |
|---|---|---|
| **Empty State** | Belum ada percakapan dipilih (`/companion`) atau percakapan baru | Avatar persona besar + *"Cerita apa hari ini?"* + 4 chip pemantik curhat cepat + input bar siap ketik |
| **Active Chat** | Membuka percakapan spesifik (`/companion/[id]`) | Header persona + pesan-pesan kronologis (user & assistant) + input bar di bawah |
| **Streaming / Typing** | Asisten sedang memproses jawaban | Indikator 3-dot pulse halus dengan teks *"Kina sedang merangkai kata..."* |
| **Voice Listening** | Mikrofon STT aktif | Tombol mic berdenyut hijau botani + status *"Mendengarkan suaramu..."* + tombol batal/selesai |
| **Quota Exceeded** | Pesan harian $\ge$ 20 | Modal ramah: *"Kuota curhat harian telah tercapai (20/20). Beristirahatlah sejenak dan kembali esok hari."* |
| **Crisis Detected** | `detectRisk()` bernilai `true` pada input pengguna | Banner krisis tenang di atas chat (Hotline 119 ext 8), tidak auto-dismiss, tombol hubungi langsung |
| **Error / Network Offline** | Panggilan API gagal / fallback habis | Pesan error ramah dengan tombol *"Coba Lagi"* |

---

## 5. Kontrak Data & API

### 5.1 GET `/api/companion/conversations`
- Mengambil daftar percakapan pengguna dari model `Conversation` di DB Companion.
- Mengembalikan array: `[{ id, title, emotionTag, createdAt, updatedAt, lastMessage }]`.

### 5.2 POST `/api/companion/conversations`
- Membuat percakapan baru.
- Payload: `{ initialMessage?: string, persona?: string }`.
- Mengembalikan: `{ conversationId }`.

### 5.3 DELETE `/api/companion/conversations/[id]`
- Menghapus percakapan dan seluruh relasi pesan.

### 5.4 POST `/api/companion/chat`
- Mengirim pesan baru & memicu generasi respons AI dengan multi-provider fallback.
- Header: `Authorization: Bearer <JWT>`
- Payload:
  ```json
  {
    "conversationId": "cuid...",
    "content": "Aku merasa sangat lelah akhir-akhir ini...",
    "persona": "KINA"
  }
  ```
- Validasi Kuota Server:
  - Cek `DailyMessageQuota` untuk `userId` & tanggal hari ini (WIB).
  - Jika `messageCount >= 20` &rarr; Return `403 Forbidden` (`{ error: "QUOTA_EXCEEDED" }`).
- Validasi Krisis:
  - Jalankan `detectRisk(content)` &rarr; set `Message.flaggedForRisk = true`.
- Rantai Fallback AI:
  - Provider 1: Gemini (`gemini-1.5-flash` / `gemini-2.0-flash`)
  - Provider 2: Groq (`llama-3.3-70b-versatile`)
  - Provider 3: Mistral (`mistral-small-latest`)
  - Provider 4: OpenRouter (`meta-llama/llama-3-8b-instruct:free`)
- Output: `{ message: { id, role: "assistant", content, modelUsed, flaggedForRisk }, remainingQuota: number }`.

### 5.5 POST `/api/companion/stt`
- Mentranskripsi audio rekaman suara via Groq Whisper (`whisper-large-v3-turbo`).
- Output: `{ text: "..." }`.

### 5.6 POST `/api/companion/tts`
- Menghasilkan audio TTS dari respons persona.
- Primer: ElevenLabs (disimpan ke cache `ttsAudioUrl`), Fallback: Web Speech API.

---

## 6. Kriteria Penerimaan Terverifikasi

1. `CompanionSidebar` dirender satu kali di `layout.tsx`, responsif di mobile via drawer.
2. `activeConvId` diturunkan dari URL (`/companion/[id]`), tidak ada ID hardcode `"conv-1"`.
3. Kuota 20 pesan/hari diverifikasi aktif melalui panggilan API langsung.
4. Input uji kata krisis memunculkan Crisis Banner tenang di atas chat.
5. Persona Kina, Ollie, Rubi, dan Bruno dapat diganti dengan karakter bahasa yang konsisten.
6. Build bersih (`tsc --noEmit` & `pnpm build` sukses 0 error) dan screenshot terverifikasi di 375, 768, 1280.
