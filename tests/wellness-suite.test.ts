import fs from "fs";

// Load .env.local and .env
for (const envFile of [".env.local", ".env"]) {
  if (fs.existsSync(envFile)) {
    const lines = fs.readFileSync(envFile, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const k = trimmed.slice(0, eqIdx).trim();
        const v = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[k]) {
          process.env[k] = v;
        }
      }
    }
  }
}

import { activityRepo } from "../src/backend/db/activityRepo";
import { wellnessRepo } from "../src/backend/db/wellnessRepo";
import { SEED_RESOURCES, RELAXATION_AUDIO_TRACKS } from "../src/backend/db/resourceRepo";
import { ActivityType } from "../src/generated/account-client";
import { accountDb } from "../src/backend/db/accountClient";

async function runWellnessSuiteTests() {
  console.log("=== Menjalankan Unit Test Wellness Suite: P5 (Activity, Ruang Sehat, Resources) ===");

  const testUserId = "user-test-p5-" + Date.now();

  // Pastikan user ada di database
  await accountDb.user.upsert({
    where: { id: testUserId },
    create: {
      id: testUserId,
      email: `${testUserId}@zyba.id`,
      name: "Penguji Wellness P5",
      passwordHash: "dummy-hash",
      onboardingCompleted: true,
      zybaScore: 75,
    },
    update: {},
  }).catch(() => {});

  // 1. Test Smart Activity
  console.log("[Test 1] Mengambil daftar aktivitas dan rekomendasi mikro...");
  const actList = await activityRepo.listActivities(testUserId);
  if (!actList.templates || actList.templates.length < 4) {
    throw new Error("Template aktivitas mikro tidak lengkap (minimal 4)");
  }
  console.log(`✔ Test 1: Template aktivitas mikro terisi ${actList.templates.length} opsi.`);

  console.log("[Test 2] Mencatat log aktivitas selesai & menghitung ulang skor...");
  const logResult = await activityRepo.logActivity(testUserId, {
    type: ActivityType.BREATHING,
    durationMin: 3,
    completed: true,
  });
  if (!logResult.log || logResult.log.type !== ActivityType.BREATHING) {
    throw new Error("Gagal menyimpan log aktivitas bernapas");
  }
  if (typeof logResult.newZybaScore !== "number" || logResult.newZybaScore < 0 || logResult.newZybaScore > 100) {
    throw new Error("Skor Zyba hasil pembaruan tidak valid");
  }
  console.log(`✔ Test 2: Log aktivitas bernapas tersimpan dan memperbarui Zyba Score ke: ${logResult.newZybaScore}.`);

  // 2. Test Ruang Sehat / Wellness Journey
  console.log("[Test 3] Mengambil data statistik & tren kurva Ruang Sehat...");
  const stats = await wellnessRepo.getStats(testUserId);
  if (!stats.scoreBreakdown || typeof stats.scoreBreakdown.mental !== "number") {
    throw new Error("Breakdown domain mental/fisik/sosial tidak valid");
  }
  if (!Array.isArray(stats.history) || stats.history.length === 0) {
    throw new Error("Riwayat kurva kebugaran batin kosong");
  }
  console.log(`✔ Test 3: Statistik dan riwayat kurva berhasil dimuat (${stats.history.length} data point).`);

  console.log("[Test 4] Menulis Jurnal Reflektif netral & deteksi risiko krisis...");
  const normalJournal = await wellnessRepo.createJournalEntry(testUserId, {
    title: "Momen Tenang Hari Ini",
    content: "Hari ini aku berhasil menyelesaikan tugas kuliah tepat waktu dan merasa bersyukur.",
    mood: "HAPPY",
  });
  if (normalJournal.riskDetected) {
    throw new Error("Jurnal netral salah terdeteksi sebagai krisis");
  }
  console.log("✔ Test 4.a: Jurnal reflektif netral tersimpan aman tanpa false alarm.");

  const crisisJournal = await wellnessRepo.createJournalEntry(testUserId, {
    title: "Sangat Putus Asa",
    content: "Aku capek hidup dan ingin mengakhiri segalanya malam ini.",
    mood: "DEPRESSED",
  });
  if (!crisisJournal.riskDetected) {
    throw new Error("Sensor krisis gagal mendeteksi sinyal bahaya diri pada jurnal");
  }
  console.log("✔ Test 4.b: Sensor krisis mendeteksi sinyal bahaya diri pada jurnal dengan presisi.");

  const journalList = await wellnessRepo.listJournalEntries(testUserId);
  if (journalList.length < 2) {
    throw new Error("Entri jurnal yang tersimpan tidak ditemukan");
  }
  console.log(`✔ Test 4.c: Entri jurnal berhasil diambil (${journalList.length} catatan tersimpan).`);

  // 3. Test Resources / Wawasan Sehat
  console.log("[Test 5] Memverifikasi integritas 6 artikel wawasan edukasi mindful...");
  if (SEED_RESOURCES.length < 6) {
    throw new Error("Artikel wawasan edukasi kurang dari 6");
  }
  for (const art of SEED_RESOURCES) {
    if (!art.title || !art.body || art.body.length < 300) {
      throw new Error(`Artikel "${art.title}" terlalu pendek atau tidak lengkap`);
    }
  }
  console.log(`✔ Test 5.a: 6 Artikel kurasi mindful berbahasa Indonesia terverifikasi utuh.`);

  if (RELAXATION_AUDIO_TRACKS.length < 3) {
    throw new Error("Trek audio relaksasi kurang dari 3");
  }
  console.log(`✔ Test 5.b: ${RELAXATION_AUDIO_TRACKS.length} Trek generator audio relaksasi terverifikasi.`);

  console.log("\n=== SELURUH UNIT TEST FASE P5 (WELLNESS SUITE) BERHASIL LULUS! 🎉 ===");
}

runWellnessSuiteTests().catch((err) => {
  console.error("Test gagal:", err);
  process.exit(1);
});
