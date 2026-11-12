# Mockdoc: Dashboard Utama (`/dashboard`)

## 1. Tujuan
Pusat refleksi harian pengguna: menyajikan kondisi kesehatan mental, fisik, dan sosial pengguna secara jujur, transparan, dan tenang, tanpa sensasi mendesak atau gamifikasi toksik.

## 2. Referensi & Arah Layout (ui-ux-pro-max)
- **Komposisi Asimetris 65:35:**
  - **Kolom Utama Kiri (65%):**
    - Sapaan waktu & nama asli pengguna ("Selamat pagi/sore/malam, {name}").
    - Kartu Zyba Score Utama (Skor 0–100, visual progress lingkar/batang tenang, breakdown 3 aspek: Mental 50%, Fisik 25%, Sosial 25%).
    - Checklist Lembut Hari Ini (Check-in harian, Relaksasi 4-7-8, Jurnal/Langkah mindful).
    - Refleksi singkat & tren 7 hari terakhir.
  - **Kolom Kanan / Samping (35%):**
    - **Hearth Flame Sanctuary:** Lilin SVG yang menyala tenang. Menampilkan konsistensi harian dengan kehangatan ramah.
    - **Zyba Companion Quick Callout:** Kartu dialog ringkas persona (Kina, Ollie, Rubi, Bruno) dengan chip pemantik refleksi langsung menuju `/companion`.
    - **Wawasan & Sumber Daya:** Rekomendasi bacaan atau audio santai langsung menuju `/resources`.
- **Adaptasi Mobile (<768px):** Kolom bertumpuk secara alami (Sapaan → Hearth Flame mini → Zyba Score → CTA Check-In → Checklist → Companion Widget).

## 3. Karakter & Anti-Slop (taste-skill & anti-slop)
- **Hearth Flame:** Lilin SVG artistik berwarna hangat (`amber-400`/`orange-400`). Bila check-in hari ini belum dilakukan, api lilin ditampilkan lembut/kuncup dengan teks: *"Nyalakan kehangatan hari ini kapan pun kamu siap."* Jika sudah check-in, api mekar dengan cahaya lembut.
- **Dilarang Slop:**
  - TIDAK ADA streak api merah yang membara atau menakut-nakuti.
  - TIDAK ADA hitung mundur (countdown) waktu kedaluwarsa.
  - TIDAK ADA copy yang menyalahkan ("Kamu lupa kemarin!", "Streakmu hilang!").
  - TIDAK ADA emoji sebagai icon atau avatar; gunakan Lucide stroke 1.8 dan SVG persona.
  - Teks di atas tombol oranye wajib `text-brown-900` (WCAG AA 5.46:1).

## 4. Matriks State
- **Default (Sudah Ada Data):** Menampilkan skor dinamis hasil rolling window 7 hari, breakdown aspek, dan status lilin.
- **Empty / Pengguna Baru (Belum Cukup Data):** Menampilkan skor netral 50 dengan label eksplisit *"Belum cukup data — lakukan check-in harian untuk membentuk kurva mekar pertamamu"*. Tidak menampilkan angka fiktif seolah data lama ada.
- **Loading:** Skeleton card dengan warna `bg-brown-900/5` halus.
- **Hydration Safe:** Tidak membaca `localStorage` pada initial state; state awal ter-render konsisten antara server dan client.

## 5. Kontrak API
- **Endpoint:** `GET /api/dashboard`
- **Response:**
```json
{
  "user": {
    "name": "Syauqi",
    "avatarUrl": null,
    "companionPersona": "KINA"
  },
  "scoreData": {
    "zybaScore": 76,
    "mentalScore": 80,
    "physicalScore": 72,
    "socialScore": 75,
    "stressLevel": 2,
    "hasEnoughData": true
  },
  "hearthFlame": {
    "litToday": true,
    "streakDays": 3,
    "lastCheckInDate": "2026-11-12"
  },
  "todayChecklist": {
    "checkInDone": true,
    "activityDone": false,
    "journalDone": false
  },
  "recentCheckIns": [
    { "date": "2026-11-12", "mood": "HAPPY", "score": 76 }
  ]
}
```
