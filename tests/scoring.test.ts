import assert from "assert";
import { calculateZybaScore, moodToPoints, scaleToPoints } from "../src/backend/scoring/zybaScore";
import { MoodLevel } from "../src/generated/account-client";

console.log("--- Menjalankan Unit Test Zyba Score ---");

// Test 1: Empty input returns 50 neutral with hasEnoughData: false
{
  const res = calculateZybaScore({ dailyAssessments: [] });
  assert.strictEqual(res.zybaScore, 50, "Empty input should return neutral score 50");
  assert.strictEqual(res.hasEnoughData, false, "Empty input should report hasEnoughData = false");
  console.log("✔ Test 1: Empty input returns neutral 50 and hasEnoughData: false passed.");
}

// Test 2: Initial assessment baseline only
{
  const res = calculateZybaScore({
    dailyAssessments: [],
    initialAssessment: {
      initialMood: MoodLevel.HAPPY, // 80
      stressLevel: 2,              // (6-2)*20 = 80 -> mental = 80
      sleepQualityRating: 4,       // 4 * 20 = 80 -> physical = 80
    },
  });
  assert.strictEqual(res.hasEnoughData, false, "Initial baseline alone is not yet 7-day daily data");
  assert.ok(res.zybaScore >= 60 && res.zybaScore <= 85, "Initial baseline score should be calculated");
  console.log(`✔ Test 2: Initial baseline score (${res.zybaScore}) passed.`);
}

// Test 3: High positive check-in produces high score
{
  const res = calculateZybaScore({
    dailyAssessments: [
      {
        date: "2026-11-12",
        mood: MoodLevel.OVERJOYED, // 100
        stressLevel: 1,            // low stress -> 100
        sleepRating: 5,            // 100
        energyTags: ["Segar", "Bugar"],
        answers: {
          anxiety: 1,
          satisfaction: 5,
          productivity: 5,
          selfTime: 5,
          sleepHours: "7-8",
          regularMeals: "Sangat Teratur",
          physicalActivity: "Olahraga",
          connection: 5,
          supported: 5,
          communityInteraction: 5,
        },
      },
    ],
  });

  assert.strictEqual(res.hasEnoughData, true);
  assert.ok(res.zybaScore >= 90, `Score should be >= 90 for optimal day, got ${res.zybaScore}`);
  assert.ok(res.mentalScore >= 90, `Mental score should be >= 90, got ${res.mentalScore}`);
  assert.ok(res.physicalScore >= 90, `Physical score should be >= 90, got ${res.physicalScore}`);
  assert.ok(res.socialScore >= 90, `Social score should be >= 90, got ${res.socialScore}`);
  console.log(`✔ Test 3: High positive check-in (${res.zybaScore}) passed.`);
}

// Test 4: Low check-in produces low score
{
  const res = calculateZybaScore({
    dailyAssessments: [
      {
        date: "2026-11-12",
        mood: MoodLevel.DEPRESSED, // 20
        stressLevel: 5,            // max stress -> 20
        sleepRating: 1,            // 20
        energyTags: ["Lemas", "Lelah"],
        answers: {
          anxiety: 5,
          satisfaction: 1,
          productivity: 1,
          selfTime: 1,
          sleepHours: "<5",
          regularMeals: "Belum",
          physicalActivity: "Diam di Tempat",
          connection: 1,
          supported: 1,
          communityInteraction: 1,
        },
      },
    ],
  });

  assert.strictEqual(res.hasEnoughData, true);
  assert.ok(res.zybaScore <= 35, `Score should be <= 35 for low day, got ${res.zybaScore}`);
  console.log(`✔ Test 4: Low check-in score (${res.zybaScore}) passed.`);
}

// Test 5: Score clamping strictly within 0-100
{
  const extremeLow = calculateZybaScore({
    dailyAssessments: [
      {
        date: "2026-11-12",
        mood: MoodLevel.DEPRESSED,
        stressLevel: 5,
        sleepRating: 1,
        answers: { anxiety: 5, satisfaction: 1, productivity: 1, selfTime: 1 },
      },
    ],
  });
  assert.ok(extremeLow.zybaScore >= 0 && extremeLow.zybaScore <= 100);

  const extremeHigh = calculateZybaScore({
    dailyAssessments: [
      {
        date: "2026-11-12",
        mood: MoodLevel.OVERJOYED,
        stressLevel: 1,
        sleepRating: 5,
        answers: { connection: 5, supported: 5 },
      },
    ],
    completedActivitiesCount: 10,
    communityContributionsCount: 10,
  });
  assert.ok(extremeHigh.zybaScore >= 0 && extremeHigh.zybaScore <= 100);
  console.log("✔ Test 5: Strict clamping within 0-100 passed.");
}

// Test 6: Rolling window capped to 7 days
{
  const days = Array.from({ length: 12 }, (_, i) => ({
    date: `2026-11-${String(i + 1).padStart(2, "0")}`,
    mood: MoodLevel.HAPPY,
    stressLevel: 2,
    sleepRating: 4,
  }));
  const res = calculateZybaScore({ dailyAssessments: days });
  assert.strictEqual(res.sampleDaysCount, 7, "Sample window should be capped at 7 days");
  console.log("✔ Test 6: 7-day rolling window limit passed.");
}

console.log("ALL SCORING UNIT TESTS PASSED SUCCESSFULLY! 🎉");

