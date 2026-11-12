/**
 * Automated Verification Script for Fase P1 (Auth, Middleware, & Onboarding)
 * Sesuai kriteria selesai AGENTS.md Bagian 9 & Protokol Kejujuran Bagian 0
 */

const http = require("http");

const BASE_URL = "http://localhost:3005";

async function request(path, options = {}) {
  const url = new URL(path, BASE_URL);
  const headers = options.headers || {};
  let body = options.body;

  if (body && typeof body === "object") {
    body = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url.toString(), {
    method: options.method || "GET",
    headers,
    body,
    redirect: "manual", // Do not follow redirects so we can inspect middleware 307/302
  });

  let json = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      json = await res.json();
    } catch {}
  }

  const setCookie = res.headers.get("set-cookie") || "";
  const location = res.headers.get("location") || "";

  return {
    status: res.status,
    headers: res.headers,
    location,
    setCookie,
    json,
  };
}

async function runTests() {
  console.log("=== MEMULAI PENGUJIAN OTOMATIS FASE P1 (AUTH & ONBOARDING) ===\n");
  let testCount = 0;
  let passCount = 0;

  function assert(name, condition, extraInfo = "") {
    testCount++;
    if (condition) {
      passCount++;
      console.log(`[PASS] ${name}`);
    } else {
      console.error(`[FAIL] ${name} ${extraInfo}`);
      process.exitCode = 1;
    }
  }

  // 1. Uji Middleware: Akses /dashboard tanpa token harus dialihkan ke /login
  const noAuthRes = await request("/dashboard");
  assert(
    "1. Middleware: Akses /dashboard tanpa auth dialihkan (307/302) ke /login",
    (noAuthRes.status === 307 || noAuthRes.status === 302) &&
      noAuthRes.location.includes("/login")
  );

  // 2. Uji Middleware: Akses /assessment tanpa auth dialihkan ke /login
  const noAuthAssessmentRes = await request("/assessment");
  assert(
    "2. Middleware: Akses /assessment tanpa auth dialihkan ke /login",
    (noAuthAssessmentRes.status === 307 || noAuthAssessmentRes.status === 302) &&
      noAuthAssessmentRes.location.includes("/login")
  );

  // 3. Uji Registrasi: POST /api/auth/register
  const testEmail = `test_user_${Date.now()}@example.com`;
  const registerRes = await request("/api/auth/register", {
    method: "POST",
    body: {
      name: "User Uji",
      email: testEmail,
      password: "PasswordRahasia123!",
    },
  });

  assert(
    "3. API Register: Berhasil merespons 200 OK dengan status sukses",
    registerRes.status === 200 && registerRes.json?.success === true
  );

  // 4. PROTOKOL KEAMANAN: Pastikan OTP TIDAK PERNAH bocor di response JSON
  const bodyString = JSON.stringify(registerRes.json || {});
  assert(
    "4. Keamanan: Kode OTP TIDAK PERNAH ada di response register",
    registerRes.json?.otp === undefined && !bodyString.includes('"otp":')
  );

  // Ambil OTP dari in-memory store untuk simulasi verifikasi
  const { otpCache } = require("../src/backend/auth/otpStore");
  const otpRecord = globalThis.otpCache?.get(testEmail.toLowerCase());
  const actualOtp = otpRecord?.otp;

  assert(
    "5. OtpStore: Kode OTP 6 digit berhasil di-generate di server",
    actualOtp && actualOtp.length === 6
  );

  // 5. Uji Verifikasi OTP salah
  const wrongOtpRes = await request("/api/auth/verify-otp", {
    method: "POST",
    body: { email: testEmail, otp: "000000" },
  });
  assert(
    "6. API Verify OTP: Kode salah ditolak dengan status 400",
    wrongOtpRes.status === 400 && wrongOtpRes.json?.error
  );

  // 6. Uji Verifikasi OTP benar
  const correctOtpRes = await request("/api/auth/verify-otp", {
    method: "POST",
    body: { email: testEmail, otp: actualOtp },
  });
  assert(
    "7. API Verify OTP: Kode benar diterima 200 OK dan menetapkan cookie zyba_token",
    correctOtpRes.status === 200 &&
      correctOtpRes.setCookie.includes("zyba_token=") &&
      correctOtpRes.json?.user?.onboardingCompleted === false
  );

  const authCookie = correctOtpRes.setCookie.split(";")[0];

  // 7. Uji Middleware: Pengguna login tapi onboardingCompleted = false mencoba akses /dashboard
  const incompleteDashboardRes = await request("/dashboard", {
    headers: { Cookie: authCookie },
  });
  assert(
    "8. Middleware Gate: Pengguna belum selesai asesmen dialihkan dari /dashboard ke /assessment",
    (incompleteDashboardRes.status === 307 || incompleteDashboardRes.status === 302) &&
      incompleteDashboardRes.location.includes("/assessment")
  );

  // 8. Uji Asesmen Lengkap: POST /api/assessment/complete dengan Expression Analysis
  const completeRes = await request("/api/assessment/complete", {
    method: "POST",
    headers: { Cookie: authCookie },
    body: {
      username: `user_${Date.now()}`,
      companionPersona: "RUBI",
      notifications: {
        companionNotif: true,
        wellnessNotif: true,
        communityNotif: false,
      },
      questionnaire: {
        goal: "Mengurangi stres",
        gender: "Perempuan",
        age: "21",
        weightKg: "52",
        initialMood: "HAPPY",
        helpHistory: "Belum pernah",
        physicalSymptoms: "Kelelahan",
        sleepQuality: "4",
        stressLevel: "5",
        medication: "Tidak ada",
        mentalSymptoms: "Stabil",
        expressionText: "Hari ini saya merasa lebih tenang setelah istirahat sejenak.",
      },
    },
  });

  assert(
    "9. API Complete Assessment: Berhasil menyimpan data asesmen dan menghitung Zyba Score awal",
    completeRes.status === 200 &&
      completeRes.json?.success === true &&
      typeof completeRes.json?.zybaScore === "number"
  );

  const updatedCookie = completeRes.setCookie.split(";")[0] || authCookie;

  // 9. Uji Middleware: Setelah onboarding selesai, akses /dashboard harus tembus (200 OK)
  const completedDashboardRes = await request("/dashboard", {
    headers: { Cookie: updatedCookie },
  });
  assert(
    "10. Middleware Gate: Pengguna yang selesai asesmen berhasil mengakses /dashboard (200 OK)",
    completedDashboardRes.status === 200
  );

  // 10. Uji Middleware: Pengguna yang sudah selesai asesmen mencoba buka /assessment lagi dialihkan ke /dashboard
  const completedAssessmentRes = await request("/assessment", {
    headers: { Cookie: updatedCookie },
  });
  assert(
    "11. Middleware Gate: Pengguna yang selesai asesmen dicegah kembali ke /assessment (dialihkan ke /dashboard)",
    (completedAssessmentRes.status === 307 || completedAssessmentRes.status === 302) &&
      completedAssessmentRes.location.includes("/dashboard")
  );

  // 11. Uji Login: Password salah
  const wrongLoginRes = await request("/api/auth/login", {
    method: "POST",
    body: { email: testEmail, password: "PasswordSalah" },
  });
  assert(
    "12. API Login: Password salah ditolak 401 Unauthorized",
    wrongLoginRes.status === 401
  );

  // 12. Uji Login: Password benar
  const correctLoginRes = await request("/api/auth/login", {
    method: "POST",
    body: { email: testEmail, password: "PasswordRahasia123!" },
  });
  assert(
    "13. API Login: Password benar berhasil masuk 200 OK dengan cookie zyba_token",
    correctLoginRes.status === 200 &&
      correctLoginRes.setCookie.includes("zyba_token=") &&
      correctLoginRes.json?.user?.onboardingCompleted === true
  );

  console.log(`\nHASIL: ${passCount} dari ${testCount} pengujian berhasil lulus 100%!`);
  if (passCount === testCount) {
    console.log("SELURUH SYARAT FASE P1 TERPENUHI SECARA PENUH & AMAN.\n");
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

