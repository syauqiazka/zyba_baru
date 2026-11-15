import { analyzeMealPhoto } from "../src/backend/ai/aiMealVision";
import { activityRepo } from "../src/backend/db/activityRepo";
import { accountDb } from "../src/backend/db/accountClient";

async function runMealAiTests() {
  console.log("=== Menjalankan Unit Test Fitur AI Meal & Calorie Snap ===");

  // 1. Tes analisis heuristik & vision
  console.log("[Test 1] Menguji analisis nutrisi piring AI...");
  const analysis = await analyzeMealPhoto(
    "",
    "image/jpeg",
    "Nasi merah, dada ayam panggang, tumis brokoli"
  );

  if (!analysis.foodName || typeof analysis.calories !== "number") {
    throw new Error("Analisis nutrisi gagal mengembalikan data terstruktur");
  }
  console.log("✔ Test 1: Hasil analisis piring:", {
    foodName: analysis.foodName,
    calories: analysis.calories,
    protein: analysis.proteinGrams,
    carbs: analysis.carbsGrams,
    provider: analysis.provider,
  });

  // 2. Buat user dummy test jika belum ada
  let user = await accountDb.user.findFirst();
  if (!user) {
    user = await accountDb.user.create({
      data: {
        email: "mealtest@zyba.id",
        name: "Meal Tester",
        passwordHash: "hash123",
      },
    });
  }

  // 3. Simpan MealLog
  console.log("[Test 2] Menyimpan hasil analisis ke tabel MealLog...");
  const mealLog = await activityRepo.createMealLog(user.id, {
    foodName: analysis.foodName,
    calories: analysis.calories,
    proteinGrams: analysis.proteinGrams,
    carbsGrams: analysis.carbsGrams,
    fatGrams: analysis.fatGrams,
    fiberGrams: analysis.fiberGrams,
    healthScore: analysis.healthScore,
    notes: analysis.mindfulReview,
  });

  if (!mealLog.id) {
    throw new Error("Gagal menyimpan MealLog ke database");
  }
  console.log("✔ Test 2: MealLog berhasil tersimpan dengan ID:", mealLog.id);

  // 4. Uji Komplain / Koreksi Pengguna (Feedback loop)
  console.log("[Test 3] Menguji koreksi pengguna atas kalori/bahan (Feedback Loop)...");
  const updatedMeal = await activityRepo.updateMealFeedback(user.id, {
    mealLogId: mealLog.id,
    correctedFoodName: "Nasi Merah Porsi Sedang & Dada Ayam Rebus",
    correctedCalories: 380,
    complaintNotes: "Ayamnya direbus tanpa minyak, porsi lebih sedikit dari perkiraan standar",
  });

  if (!updatedMeal.isCorrected || updatedMeal.calories !== 380) {
    throw new Error("Feedback loop koreksi piring gagal memperbarui data");
  }
  console.log("✔ Test 3: Koreksi pengguna berhasil tersimpan & data piring diperbarui:", {
    isCorrected: updatedMeal.isCorrected,
    updatedCalories: updatedMeal.calories,
    complaintNotes: updatedMeal.complaintNotes,
  });

  console.log("=== SELURUH TEST AI MEAL & FEEDBACK LOOP BERHASIL LULUS! 🎉 ===");
}

runMealAiTests().catch((err) => {
  console.error("Test gagal:", err);
  process.exit(1);
});
