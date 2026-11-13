# Mockdoc Spesifikasi: Onboarding & Assessment (`/onboarding`, `/login`, `/assessment`)

> **STATUS:** KONTRAK TERKUNCI (Fase P1)  
> Dokumen ini mengatur spesifikasi antarmuka, kontrak data, alur multi-step, dan kriteria penerimaan untuk alur kedatangan pengguna baru (*Arrival Ritual*).

---

## 1. Tujuan & Aksi Utama
- **Tujuan:** Mengantarkan pengguna baru ke dalam ruang aman ZYBA melalui pengenalan nilai, pembuatan akun aman, verifikasi identitas tenang (OTP Brevo), dan pemetaan awal kondisi kesejahteraan (*Initial Assessment* 8-step).
- **Aksi Utama:** 
  - `/onboarding`: Membaca esensi ZYBA, registrasi akun, verifikasi email via kode 6-digit.
  - `/login`: Masuk akun secara cepat dan aman (JWT httpOnly).
  - `/assessment`: Menyelesaikan 8 langkah penyesuaian profil dan asesmen holistik tanpa tekanan.

---

## 2. Referensi Pola Antarmuka (ui-ux-pro-max & taste-skill)
- **Desktop (≥ 768px):** Pola *Split Step-Panel*. Sisi kiri (30% lebar) menampilkan ringkasan tahap stepper bernuansa tenang dengan indikator aktif `bg-orange-500 text-brown-900` atau `bg-green-100 text-brown-900` untuk tahap selesai. Sisi kanan (70% lebar) adalah area kartu aksi utama yang lapang.
- **Mobile (< 768px):** Pola *Top Progress Pill Bar*. Garis progres tipis 4px di atas layar dengan teks ringkas *"Langkah X dari 8"*, form responsif vertikal dengan tombol navigasi melayang di bawah.
- **Selection Chips/Tiles:** Kotak kartu ergonomis, tinggi minimal 52px, transisi border 200ms:
  - Default: `border border-brown-900/10 bg-white`
  - Hover: `border-orange-500/40 bg-orange-500/[0.04]`
  - Selected: `border-2 border-orange-500 bg-orange-100 text-brown-900 font-semibold` + Lucide `Check`

---

## 3. Matriks Alur 8 Tahap `/assessment`

| Step | Nama Tahap | Konten / Input | Validasi & Keamanan |
|---|---|---|---|
| **1** | Profil & Maskot | Username (opsional unik), nama panggilan, sambutan Maskot Zibi | Nama min 2 karakter |
| **2** | Kata Sandi | Input password dengan strength meter | Hanya jika registrasi via OAuth tanpa password |
| **3** | Verifikasi OTP | Masukkan 6 digit kode OTP jika belum diverifikasi | Dibatasi percobaan (max 5 kali), timer cooldown 60s |
| **4** | Proteksi Biometrik | Aktivasi Fingerprint/WebAuthn opsional | Tombol "Lewati untuk sekarang" jelas |
| **5** | Preferensi Notifikasi | Toggle `companionNotif`, `wellnessNotif`, `communityNotif` | Default: Companion & Wellness aktif |
| **6** | Kuisioner Holistik | Goal, gender, usia, berat badan, mood awal, riwayat bantuan, gejala fisik, kualitas tidur, tingkat stres, obat, gejala mental, **Expression Analysis** | Expression analysis wajib melewati `detectRisk()` |
| **7** | Kompilasi Batin | Layar animasi denyut napas (*"Menyiapkan ruang tenangmu..."*) | Hitung Zyba Score baseline |
| **8** | Sambutan Hangat | Konfirmasi kesiapan dan tombol menuju Dashboard | Mengubah `onboardingCompleted = true` di DB |

---

## 4. Kontrak API & Keamanan

### A. Endpoint Otentikasi
1. `POST /api/auth/register`:
   - Request: `{ name, email, password }`
   - Response: `{ success: true, message: "Kode OTP telah dikirim" }` (OTP **TIDAK PERNAH** dikembalikan ke client).
   - Rate limit: 5 permintaan per jam per IP.
2. `POST /api/auth/verify-otp`:
   - Request: `{ email, otp }`
   - Response: `{ success: true, user: { id, email, name, onboardingCompleted } }` + Cookie JWT `httpOnly` (30 hari).
3. `POST /api/auth/login`:
   - Request: `{ email, password }`
   - Response: `{ success: true, user: { id, email, name, onboardingCompleted } }` + Cookie JWT `httpOnly`.
4. `POST /api/auth/logout`:
   - Clear cookie JWT `httpOnly`.
5. `GET /api/auth/me`:
   - Verifikasi sesi JWT dan status `onboardingCompleted`.

### B. Endpoint Asesmen
1. `POST /api/assessment/save-step`:
   - Menyimpan progres kuesioner ke DB secara parsial.
2. `POST /api/assessment/complete`:
   - Menyimpan hasil akhir kuesioner ke `Assessment` DB.
   - Menghitung baseline Zyba Score.
   - Mengubah `User.onboardingCompleted = true`.

---

## 5. Salinan Teks Bahasa Indonesia (Microcopy)
- Title `/onboarding`: "Selamat datang di ZYBA — Ruang Teman Tenangmu."
- Title Asesmen Step 6: "Bagaimana kondisimu akhir-akhir ini?"
- Placeholder Expression Analysis: "Tuliskan apa pun yang sedang membebani pikiranmu secara bebas... kami mendengarkan."
- Alert Krisis (Jika terdeteksi): "Jika kamu sedang merasa sangat berat atau membutuhkan bantuan darurat, bantuan profesional siap mendengarkanmu kapan saja."

---

## 6. Kriteria Penerimaan (Acceptance Criteria)
1. Tidak dapat mengakses rute `(app)` (seperti `/dashboard`) jika cookie JWT tidak ada (dialihkan ke `/login`).
2. Tidak dapat mengakses rute `(app)` jika `onboardingCompleted = false` (dialihkan ke `/assessment`).
3. Pengguna yang sudah menyelesaikan onboarding tidak dapat kembali ke `/assessment` (dialihkan ke `/dashboard`).
4. Kode OTP tidak pernah bocor di response body atau network payload JSON.
5. Password tersimpan dalam database menggunakan `bcrypt` dengan cost 12.
6. Seluruh halaman lulus gate anti-slop: tanpa emoji, tanpa gradien ungu-biru, kontras teks tombol AA.

