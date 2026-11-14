import {
  extractLearnedInsights,
  learnFromUserInteraction,
  getZibiMemory,
  buildAdaptiveZibiPrompt,
} from "../src/backend/ai/zibiMemory";

async function runZibiMemoryTests() {
  console.log("=== Menjalankan Unit Test Zibi Adaptive Memory & Persona ===");

  // 1. Test Insight Extraction
  const prompt1 = "Aku lagi stres banget mikirin skripsi dan overthinking masa depan karir";
  const insights1 = extractLearnedInsights(prompt1);
  console.log("[TEST 1] Ekstraksi insight:", insights1);
  if (
    !insights1.topics.includes("Tekanan Akademik & Skripsi") ||
    !insights1.topics.includes("Overthinking Masa Depan") ||
    !insights1.topics.includes("Tuntutan Kerja & Karir")
  ) {
    throw new Error("Gagal mengekstrak topik skripsi/overthinking/karir");
  }
  console.log("[PASS] Ekstraksi topik dan emosi akurat");

  // 2. Test Learning from User Interaction
  const testUserId = "test-user-adaptive-" + Date.now();
  await learnFromUserInteraction(
    testUserId,
    "Aku susah tidur dan insomnia tiap malam karena cemas",
    "Tarik napas perlahan ya. Coba teknik 4-7-8 untuk meredakan cemas sebelum tidur."
  );

  const memory = await getZibiMemory(testUserId);
  console.log("[TEST 2] Memori Zibi tersimpan:", memory);
  if (!memory) {
    throw new Error("Memori Zibi tidak ditemukan setelah interaksi pertama");
  }
  if (!memory.learnedTopics.includes("Pola Tidur & Istirahat")) {
    throw new Error("Topik Pola Tidur & Istirahat tidak tersimpan di memori");
  }
  if (!memory.emotionalTrends.includes("Kecemasan / Anxietas")) {
    throw new Error("Tren emosional Kecemasan / Anxietas tidak tersimpan di memori");
  }
  if (memory.interactionCount < 1) {
    throw new Error("Interaction count tidak bertambah");
  }
  console.log("[PASS] Memori Zibi berhasil diperbarui dan bertambah pintar");

  // 3. Test Adaptive Prompt Construction
  const adaptivePrompt = await buildAdaptiveZibiPrompt(testUserId);
  console.log("[TEST 3] Cuplikan prompt adaptif Zibi:\n", adaptivePrompt.slice(-350));
  if (!adaptivePrompt.includes("MEMORI ADAPTIF PEMBELAJARAN ZIBI TENTANG PENGGUNA INI")) {
    throw new Error("Prompt sistem tidak menyertakan modul memori adaptif");
  }
  if (!adaptivePrompt.includes("Pola Tidur & Istirahat") || !adaptivePrompt.includes("Kecemasan / Anxietas")) {
    throw new Error("Prompt sistem tidak memuat data personal yang dipelajari");
  }
  console.log("[PASS] Prompt adaptif berhasil menyuntikkan memori unik user ke persona Zibi");

  console.log("\n=== HASIL UNIT TEST ZIBI MEMORY: SEMUA PASS ===");
}

runZibiMemoryTests().catch((err) => {
  console.error("Test gagal:", err);
  process.exit(1);
});
