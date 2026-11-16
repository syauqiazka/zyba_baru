import { accountDb } from "../src/backend/db/accountClient";
import { wellnessRepo } from "../src/backend/db/wellnessRepo";
import { calculateZybaScore } from "../src/backend/scoring/zybaScore";
import { MoodLevel } from "../src/generated/account-client";

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

async function testCheckInFlow() {
  console.log("=== DIAGNOSTIC CHECK-IN FLOW ===");
  const todayDate = getTodayWIB();
  console.log("todayDate WIB:", todayDate);

  // Find or create test user
  let user = await accountDb.user.findFirst({
    where: { email: "syauqi@zyba.id" },
  });

  if (!user) {
    console.log("Creating test user syauqi@zyba.id...");
    user = await accountDb.user.create({
      data: {
        id: "user-test-syauqi-flow",
        email: "syauqi@zyba.id",
        name: "Syauqi",
        passwordHash: "hash",
        onboardingCompleted: true,
      },
    });
  }

  const userId = user.id;
  console.log("User ID:", userId, "name:", user.name);

  // Check before check-in
  const beforeCheckIn = await accountDb.dailyAssessment.findUnique({
    where: {
      userId_date: {
        userId,
        date: todayDate,
      },
    },
  });
  console.log("Before check-in record:", beforeCheckIn ? "FOUND" : "NULL");

  // Perform Upsert exactly as in POST /api/check-in
  const validMood = MoodLevel.HAPPY;
  const stressVal = 2;
  const sleepVal = 4;
  const energyTags = ["Segar", "Fokus"];
  const reflection = "Hari ini tenang dan produktif.";
  const answers = { anxiety: 2, connection: 4 };

  console.log("Attempting upsert...");
  try {
    const daily = await accountDb.dailyAssessment.upsert({
      where: {
        userId_date: {
          userId,
          date: todayDate,
        },
      },
      create: {
        userId,
        date: todayDate,
        mood: validMood,
        stressLevel: stressVal,
        sleepRating: sleepVal,
        energyTags,
        reflection,
        answers,
        flaggedForRisk: false,
      },
      update: {
        mood: validMood,
        stressLevel: stressVal,
        sleepRating: sleepVal,
        energyTags,
        reflection,
        answers,
        flaggedForRisk: false,
      },
    });
    console.log("Upsert succeeded! Daily ID:", daily.id, "date:", daily.date, "mood:", daily.mood);
  } catch (err) {
    console.error("UPSERT FAILED WITH ERROR:", err);
  }

  // Now check GET /api/check-in logic
  const checkCheckIn = await accountDb.dailyAssessment.findUnique({
    where: {
      userId_date: {
        userId,
        date: todayDate,
      },
    },
  });
  console.log("After check-in query (alreadyCheckedIn):", !!checkCheckIn);

  // Now check Wellness Journey stats logic
  console.log("Calling wellnessRepo.getStats(userId)...");
  const stats = await wellnessRepo.getStats(userId);
  console.log("Wellness stats hasData:", stats.hasData);
  console.log("Wellness stats currentScore:", stats.currentScore);
  console.log("Wellness stats scoreBreakdown:", stats.scoreBreakdown);
  console.log("Wellness stats history count:", stats.history.length);
  console.log("Wellness stats history items:", stats.history);
}

testCheckInFlow().then(() => process.exit(0)).catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
