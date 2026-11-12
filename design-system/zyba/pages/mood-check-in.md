# Mockdoc: Check-In Harian (`/mood-check-in`)

## 1. Tujuan
Menyediakan ruang refleksi harian 15 pertanyaan terstruktur yang tenang, bebas tekanan, dan menyumbang data langsung ke Zyba Score tanpa beban gamifikasi toksik. Alur inti: **Curhat → Solusi → Program → Aksi**.

## 2. Referensi & Arah (ui-ux-pro-max)
- **Pola Multi-Step Terpola:** 15 pertanyaan dipecah menjadi 5 langkah terfokus (3 pertanyaan per layar) untuk mencegah *cognitive fatigue* pada pengguna yang sedang rentan atau lelah.
- **Hierarki Jawaban Taktil:** Skala 1–5, pebble mood, dan toggle pilihan dengan transisi `200ms ease`.
- **A11y & Kontras:** Semua opsi terpilih menggunakan border `border-2 border-orange-500`, background `bg-orange-100`, dan teks kontras tinggi `text-brown-900` dengan ikon Lucide `Check`.
- **Multi-viewport:**
  - Mobile (<768px): Sticky navigation bawah dengan tombol Lanjut/Kembali touch target ≥44px.
  - Desktop (≥768px): Card lebar `max-w-2xl` di tengah kanvas linen `bg-cream`, progress bar lembut di atas.

## 3. Karakter & Komposisi (taste-skill)
- **Sentuhan Kertas & Tinta:** Elemen kartu berlatar `bg-white/90` di atas kanvas `bg-cream`. Tipografi Manrope untuk heading, DM Sans untuk opsi dan teks bantu.
- **Bebas Slop:** Zero emoji (mood menggunakan pebble SVG bergaris lembut dengan warna token: depressed `sage-100/brown-700`, sad `sky-100/sky-900`, neutral `sand-200/brown-900`, happy `orange-100/orange-900`, overjoyed `orange-200/orange-950`).
- **Gerak Santai:** Transisi langkah fade & slide halus dengan dukungan penuh `motion-reduce:transition-none`.

## 4. Pemetaan 15 Pertanyaan & Domain
| Langkah | Pertanyaan | Tipe Input | Domain | Bobot Skor |
|---|---|---|---|---|
| **Langkah 1: Suasana Batin** | 1. Suasana hati umum | 5 Mood Pebbles (DEPRESSED..OVERJOYED) | Mental | Primer |
| | 2. Tingkat stres | Skala 1–5 (Sangat Rendah - Sangat Tinggi) | Mental | Terbalik |
| | 3. Rasa cemas / overthinking | Skala 1–5 (Tenang - Sangat Cemas) | Mental | Terbalik |
| **Langkah 2: Kepuasan & Diri** | 4. Kepuasan hari ini | Skala 1–5 (Tidak Puas - Sangat Puas) | Mental | Positif |
| | 13. Produktivitas bermakna | Skala 1–5 (Terhenti - Sangat Mengalir) | Mental | Positif |
| | 14. Waktu untuk diri sendiri | Skala 1–5 (Nol - Sangat Cukup) | Mental | Positif |
| **Langkah 3: Raga & Istirahat** | 5. Kualitas tidur semalam | Skala 1–5 (Buruk - Nyenyak Sekali) | Fisik | Positif |
| | 6. Durasi tidur | Opsi jam (<5 jam, 5-6 jam, 7-8 jam, >8 jam) | Fisik | Positif |
| | 7. Tingkat energi raga | Opsi Tag Energi (Segar, Lemas, Butuh Rebahan, Bugar, dll) | Fisik | Positif |
| **Langkah 4: Rutinitas & Koneksi** | 8. Makan teratur & bernutrisi | Pilihan (Belum, Cukup, Sangat Teratur) | Fisik | Positif |
| | 9. Aktivitas fisik / gerak | Pilihan (Diam di Tempat, Jalan Santai, Olahraga) | Fisik | Positif |
| | 10. Rasa terhubung dengan sekitar | Skala 1–5 (Terisolasi - Sangat Terhubung) | Sosial | Positif |
| | 11. Merasa didukung orang terdekat | Skala 1–5 (Sendirian - Penuh Dukungan) | Sosial | Positif |
| | 12. Interaksi bermakna hari ini | Skala 1–5 (Tidak Ada - Hangat & Bermakna) | Sosial | Positif |
| **Langkah 5: Syukur & Refleksi** | 15. Hal positif / syukur hari ini | Textarea bebas (opsional, `detectRisk()`) | Syukur | Reflektif |
| | Catatan tambahan | Textarea bebas (opsional, `detectRisk()`) | Refleksi | Reflektif |

## 5. Matriks State
- **Default:** Menampilkan langkah saat ini (1–5) dengan tombol "Lanjut" (disabled jika pertanyaan wajib belum terisi).
- **Loading:** Spinner santai / pulsing skeleton pada pengiriman.
- **Crisis Gate:** Jika catatan atau refleksi memicu sinyal risiko via `detectRisk()`, sistem menampilkan banner/modal krisis santai (LISA, Pulih, 119) dengan nada tenang sebelum ringkasan check-in.
- **Complete:** Animasi penyelesaian lembut, ringkasan skor terbarui, CTA kembali ke Dashboard.

## 6. Kontrak API
- **Endpoint:** `POST /api/check-in`
- **Payload:**
```json
{
  "date": "YYYY-MM-DD",
  "mood": "HAPPY",
  "stressLevel": 2,
  "sleepRating": 4,
  "energyTags": ["Segar", "Fokus"],
  "reflection": "Hari ini saya berjalan santai sore hari...",
  "answers": {
    "anxiety": 2,
    "satisfaction": 4,
    "productivity": 3,
    "selfTime": 4,
    "sleepHours": "7-8",
    "regularMeals": "Cukup",
    "physicalActivity": "Jalan Santai",
    "connection": 4,
    "supported": 4,
    "communityInteraction": 3,
    "gratitude": "Menikmati secangkir teh hangat"
  }
}
```
- **Response:**
```json
{
  "success": true,
  "dailyAssessment": { ... },
  "newZybaScore": 78,
  "breakdown": { "mental": 80, "fisik": 76, "sosial": 78 },
  "flaggedForRisk": false
}
```

