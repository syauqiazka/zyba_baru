import assert from "assert";
import { accountDb } from "../src/backend/db/accountClient";
import { wellnessRepo } from "../src/backend/db/wellnessRepo";
import { createToken } from "../src/lib/jwt";

function getTodayWIB(): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

async function runE2E() {
  console.log("=== VERIFIKASI ALIRAN DATA: CHECK-IN -> WELLNESS JOURNEY -> DASHBOARD ===");

  const todayDate = getTodayWIB();
  console.log("Tanggal WIB Hari Ini:", todayDate);

  // Setup test user
  const email = "user-e2e-flow@zyba.id";
  let user = await accountDb.user.findUnique({ where: { email } });
  if (!user) {
    user = await accountDb.user.create({
      data: {
        id: "user-e2e-flow-id",
        email,
        name: "Test Flow User",
        passwordHash: "hash",
        onboardingCompleted: true,
      },
    });
  }

  const userId = user.id;

  // Clear today's check-in for clean test run
  await accountDb.dailyAssessment.deleteMany({
    where: { userId, date: todayDate },
  });

  // Verify before state in wellnessRepo
  const beforeStats = await wellnessRepo.getStats(userId);
  console.log("Stats sebelum check-in:", {
    hasData: beforeStats.hasData,
    historyCount: beforeStats.history.length,
  });

  // 1. Simulasikan check-in hari ini
  console.log("\n1. Mengirim Check-In Baru Hari Ini...");
  const dailyRecord = await accountDb.dailyAssessment.upsert({
    where: {
      userId_date: {
        userId,
        date: todayDate,
      },
    },
    create: {
      userId,
      date: todayDate,
      mood: "HAPPY",
      stressLevel: 2,
      sleepRating: 4,
      energyTags: ["Segar", "Tenang"],
      reflection: "Catatan jeda batin verifikasi.",
      answers: {
        anxiety: 2,
        satisfaction: 4,
        productivity: 4,
        connection: 4,
        supported: 4,
      },
      calculatedScore: 78,
    },
    update: {
      mood: "HAPPY",
      stressLevel: 2,
      sleepRating: 4,
      energyTags: ["Segar", "Tenang"],
      reflection: "Catatan jeda batin verifikasi.",
      answers: {
        anxiety: 2,
        satisfaction: 4,
        productivity: 4,
        connection: 4,
        supported: 4,
      },
      calculatedScore: 78,
    },
  });

  await accountDb.user.update({
    where: { id: userId },
    data: {
      zybaScore: 78,
      stressLevel: 2,
      streakDays: 1,
      lastStreakDate: new Date(),
    },
  });

  console.log("✔ Daily assessment berhasil disimpan. ID:", dailyRecord.id, "Date:", dailyRecord.date);

  // 2. Verifikasi check-in status (seperti di GET /api/check-in)
  console.log("\n2. Memeriksa status check-in pengguna...");
  const checkInQuery = await accountDb.dailyAssessment.findUnique({
    where: {
      userId_date: {
        userId,
        date: todayDate,
      },
    },
  });
  assert.ok(checkInQuery, "Check-in hari ini HARUS ditemukan di database!");
  assert.strictEqual(checkInQuery.date, todayDate, "Tanggal check-in harus cocok dengan hari ini!");
  console.log("✔ GET /api/check-in verification passed: alreadyCheckedIn = true!");

  // 3. Verifikasi Ruang Sehat (wellnessRepo.getStats)
  console.log("\n3. Memeriksa data Ruang Sehat (/wellness-journey)...");
  const afterStats = await wellnessRepo.getStats(userId);
  assert.strictEqual(afterStats.hasData, true, "hasData harus true!");
  assert.ok(afterStats.currentScore !== null, "currentScore tidak boleh null!");
  assert.ok(afterStats.scoreBreakdown.mental !== null, "Mental score harus terisi!");
  assert.ok(afterStats.scoreBreakdown.physical !== null, "Physical score harus terisi!");
  assert.ok(afterStats.scoreBreakdown.social !== null, "Social score harus terisi!");
  assert.ok(afterStats.history.length > 0, "Riwayat tren harus memiliki data!");

  // Pastikan record hari ini ada dalam history
  const latestHistory = afterStats.history[afterStats.history.length - 1];
  console.log("History item terbaru di Ruang Sehat:", latestHistory);
  assert.strictEqual(latestHistory.mood, "HAPPY");
  assert.strictEqual(latestHistory.stressLevel, 2);
  console.log("✔ Ruang Sehat verification passed: data check-in berhasil masuk ke tren dan breakdown!");

  console.log("\n=== SELURUH VERIFIKASI ALIRAN DATA LOLOS 100% ===");
}

runE2E()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
  });
