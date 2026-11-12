import assert from "assert";
import { createToken } from "../src/lib/jwt";

async function runTests() {
  console.log("=== Testing P2 Endpoints: Dashboard & Check-In ===");

  const token = await createToken({
    sub: "user-test-p2",
    userId: "user-test-p2",
    email: "syauqi@zyba.id",
    name: "Syauqi",
    role: "USER",
    onboardingCompleted: true,
  });

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 1. Test Dashboard initial state
  console.log("\n1. Testing GET /api/dashboard...");
  const dashRes = await fetch("http://localhost:3005/api/dashboard", { headers });
  assert.strictEqual(dashRes.status, 200, "Dashboard should return 200");
  const dashData = await dashRes.json();
  console.log("Dashboard response user:", dashData.user.name);
  assert.strictEqual(dashData.user.name, "Syauqi");
  assert.strictEqual(dashData.scoreData.zybaScore, 50);
  assert.strictEqual(dashData.hearthFlame.litToday, false);
  console.log("✔ GET /api/dashboard passed successfully!");

  // 2. Test Check-In Submission
  console.log("\n2. Testing POST /api/check-in with positive check-in...");
  const checkInPayload = {
    mood: "HAPPY",
    stressLevel: 2,
    sleepRating: 4,
    energyTags: ["Segar", "Bugar", "Fokus"],
    reflection: "Hari ini berjalan sangat tenang dan menyenangkan.",
    answers: {
      anxiety: 2,
      satisfaction: 4,
      productivity: 4,
      selfTime: 4,
      sleepHours: "7-8",
      regularMeals: "Sangat Teratur",
      physicalActivity: "Jalan Santai",
      connection: 4,
      supported: 4,
      communityInteraction: 4,
      gratitude: "Menikmati secangkir teh hangat di sore hari.",
    },
  };

  const checkInRes = await fetch("http://localhost:3005/api/check-in", {
    method: "POST",
    headers,
    body: JSON.stringify(checkInPayload),
  });

  assert.strictEqual(checkInRes.status, 200, "Check-in should return 200");
  const checkInData = await checkInRes.json();
  console.log("Check-in Result Score:", checkInData.scoreResult?.zybaScore);
  console.log("Flagged For Risk:", checkInData.flaggedForRisk);
  console.log("Streak Days:", checkInData.streakDays);

  assert.strictEqual(checkInData.success, true);
  assert.ok(checkInData.scoreResult.zybaScore >= 75, "Score should increase dynamically >= 75");
  assert.strictEqual(checkInData.flaggedForRisk, false);
  console.log("✔ Normal Check-in passed successfully! Score updated dynamically.");

  // 3. Test Crisis Detection Gate in Check-In
  console.log("\n3. Testing POST /api/check-in with crisis signal...");
  const crisisPayload = {
    mood: "DEPRESSED",
    stressLevel: 5,
    sleepRating: 1,
    energyTags: ["Lemas", "Lelah"],
    reflection: "Aku merasa capek hidup dan ingin mati saja.",
    answers: {
      anxiety: 5,
      gratitude: "Tidak ada yang aku syukuri.",
    },
  };

  const crisisRes = await fetch("http://localhost:3005/api/check-in", {
    method: "POST",
    headers,
    body: JSON.stringify(crisisPayload),
  });

  assert.strictEqual(crisisRes.status, 200);
  const crisisData = await crisisRes.json();
  console.log("Crisis Flagged:", crisisData.flaggedForRisk);
  assert.strictEqual(crisisData.flaggedForRisk, true, "Should be flagged for crisis risk");
  assert.ok(Array.isArray(crisisData.crisisResources), "Crisis resources hotline must be returned");
  console.log("Crisis Hotline Count:", crisisData.crisisResources.length);
  console.log("✔ Crisis Gate detection passed successfully!");

  console.log("\n=== ALL P2 ENDPOINT TESTS PASSED! ===");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
