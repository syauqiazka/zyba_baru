/**
 * ZYBA Zibi Adaptive Memory & Learning Engine
 * Mengingat riwayat curhat pengguna, mengekstraksi topik & pemicu stres,
 * serta mempelajari preferensi relaksasi agar Zibi semakin cerdas dan peka.
 */

import { companionDb } from "@/backend/db/companionClient";

export interface ZibiMemoryProfile {
  userId: string;
  summary: string;
  learnedTopics: string[];
  emotionalTrends: string[];
  helpfulMethods: string[];
  interactionCount: number;
}

// Memory in-memory cache for fast injection & dev fallback
const memoryCache = new Map<string, ZibiMemoryProfile>();

/**
 * Mengambil profil memori pembelajaran Zibi untuk pengguna tertentu
 */
export async function getZibiMemory(userId: string): Promise<ZibiMemoryProfile> {
  if (memoryCache.has(userId)) {
    return memoryCache.get(userId)!;
  }

  try {
    const record = await companionDb.userCompanionMemory.findUnique({
      where: { userId },
    });

    if (record) {
      const profile: ZibiMemoryProfile = {
        userId: record.userId,
        summary: record.summary || "Baru memulai perjalanan suaka bersama Zibi.",
        learnedTopics: record.learnedTopics || [],
        emotionalTrends: record.emotionalTrends || [],
        helpfulMethods: record.helpfulMethods || [],
        interactionCount: record.interactionCount || 0,
      };
      memoryCache.set(userId, profile);
      return profile;
    }
  } catch (err) {
    console.warn("[Zibi-Memory] Gagal membaca memori dari database, menggunakan cache:", err);
  }

  const defaultProfile: ZibiMemoryProfile = {
    userId,
    summary: "Pengguna baru yang sedang mengeksplorasi ruang suaka batin.",
    learnedTopics: ["Pikiran Tenang"],
    emotionalTrends: ["Reflektif"],
    helpfulMethods: ["Pernapasan 4-7-8"],
    interactionCount: 0,
  };
  memoryCache.set(userId, defaultProfile);
  return defaultProfile;
}

/**
 * Mengekstrak pola topik & pembelajaran dari pesan pengguna secara heuristik cerdas
 */
export function extractLearnedInsights(text: string): {
  topics: string[];
  emotions: string[];
  methods: string[];
} {
  const lower = text.toLowerCase();
  const topics: string[] = [];
  const emotions: string[] = [];
  const methods: string[] = [];

  // 1. Ekstraksi Topik Pergumulan
  if (lower.includes("skripsi") || lower.includes("tugas") || lower.includes("kuliah") || lower.includes("ujian")) {
    topics.push("Tekanan Akademik & Skripsi");
  }
  if (lower.includes("kerja") || lower.includes("kantor") || lower.includes("atasan") || lower.includes("karir") || lower.includes("magang")) {
    topics.push("Tuntutan Kerja & Karir");
  }
  if (lower.includes("tidur") || lower.includes("insomnia") || lower.includes("begadang") || lower.includes("mimpi")) {
    topics.push("Pola Tidur & Istirahat");
  }
  if (lower.includes("keluarga") || lower.includes("orang tua") || lower.includes("ibu") || lower.includes("ayah") || lower.includes("rumah")) {
    topics.push("Dinamika Keluarga");
  }
  if (lower.includes("teman") || lower.includes("pacar") || lower.includes("putus") || lower.includes("kesepian") || lower.includes("sendiri")) {
    topics.push("Hubungan Sosial & Kesepian");
  }
  if (lower.includes("masa depan") || lower.includes("ekspektasi") || lower.includes("takut gagal") || lower.includes("overthinking")) {
    topics.push("Overthinking Masa Depan");
  }

  // 2. Ekstraksi Nada Emosi
  if (lower.includes("cemas") || lower.includes("panik") || lower.includes("gemetar") || lower.includes("deg-degan")) {
    emotions.push("Kecemasan / Anxietas");
  }
  if (lower.includes("sedih") || lower.includes("nangis") || lower.includes("hampa") || lower.includes("kecewa")) {
    emotions.push("Kesedihan / Keletihan Jiwa");
  }
  if (lower.includes("marah") || lower.includes("kesal") || lower.includes("benci") || lower.includes("muak")) {
    emotions.push("Frustrasi & Amarah Batin");
  }
  if (lower.includes("lega") || lower.includes("tenang") || lower.includes("terima kasih") || lower.includes("syukur")) {
    emotions.push("Momen Pulih & Bersyukur");
  }

  // 3. Ekstraksi Metode yang Membantu
  if (lower.includes("nafas") || lower.includes("bernapas") || lower.includes("4-7-8")) {
    methods.push("Latihan Pernapasan 4-7-8");
  }
  if (lower.includes("jurnal") || lower.includes("nulis") || lower.includes("catatan")) {
    methods.push("Menulis Jurnal Reflektif");
  }
  if (lower.includes("jalan") || lower.includes("keluar") || lower.includes("sore")) {
    methods.push("Jalan Santai Mindful");
  }
  if (lower.includes("dengar") || lower.includes("curhat") || lower.includes("validasi")) {
    methods.push("Mendengarkan Penuh Empati");
  }

  return { topics, emotions, methods };
}

/**
 * Memperbarui memori pembelajaran Zibi setelah interaksi chat baru
 */
export async function learnFromUserInteraction(
  userId: string,
  userMessage: string,
  _aiResponse?: string
): Promise<ZibiMemoryProfile> {
  const current = await getZibiMemory(userId);
  const insights = extractLearnedInsights(userMessage);

  // Gabungkan topik unik
  const updatedTopics = Array.from(new Set([...current.learnedTopics, ...insights.topics])).slice(0, 6);
  const updatedEmotions = Array.from(new Set([...current.emotionalTrends, ...insights.emotions])).slice(0, 5);
  const updatedMethods = Array.from(new Set([...current.helpfulMethods, ...insights.methods])).slice(0, 5);
  const newCount = current.interactionCount + 1;

  // Bangun ringkasan baru
  let summary = current.summary;
  if (updatedTopics.length > 0) {
    summary = `Teman ZYBA yang kerap memikirkan ${updatedTopics.slice(0, 3).join(", ")}. Membutuhkan pendekatan ${
      updatedEmotions[0] || "hangat"
    } dan responsif terhadap ${updatedMethods[0] || "ruang tenang"}.`;
  }

  const updatedProfile: ZibiMemoryProfile = {
    userId,
    summary,
    learnedTopics: updatedTopics,
    emotionalTrends: updatedEmotions,
    helpfulMethods: updatedMethods,
    interactionCount: newCount,
  };

  memoryCache.set(userId, updatedProfile);

  // Simpan ke database jika memungkinkan
  try {
    await companionDb.userCompanionMemory.upsert({
      where: { userId },
      create: {
        userId,
        summary,
        learnedTopics: updatedTopics,
        emotionalTrends: updatedEmotions,
        helpfulMethods: updatedMethods,
        interactionCount: newCount,
      },
      update: {
        summary,
        learnedTopics: updatedTopics,
        emotionalTrends: updatedEmotions,
        helpfulMethods: updatedMethods,
        interactionCount: newCount,
      },
    });
  } catch (err) {
    console.warn("[Zibi-Memory] Gagal menyimpan pembaruan memori ke DB:", err);
  }

  return updatedProfile;
}

/**
 * Menyusun prompt sistem adaptif personal berbasis memori Zibi
 */
export async function buildAdaptiveZibiPrompt(userId?: string): Promise<string> {
  if (!userId) return "";

  const mem = await getZibiMemory(userId);

  return `
[MEMORI ADAPTIF PEMBELAJARAN ZIBI TENTANG PENGGUNA INI]
Level Keakraban: Telah berbincang ${mem.interactionCount} kali bersama kamu.
Ringkasan Karakter Pengguna: ${mem.summary}
${mem.learnedTopics.length > 0 ? `- Hal/topik yang sering dihadapi pengguna: ${mem.learnedTopics.join(", ")}` : ""}
${mem.emotionalTrends.length > 0 ? `- Pola suasana batin yang sering muncul: ${mem.emotionalTrends.join(", ")}` : ""}
${mem.helpfulMethods.length > 0 ? `- Cara menenangkan yang dirasa membantu: ${mem.helpfulMethods.join(", ")}` : ""}

INSTRUKSI KECERDASAN ADAPTIF:
1. Kamu mengenal pengguna ini dengan baik karena sudah belajar dari percakapan sebelumnya. JANGAN memperkenalkan diri seperti orang asing atau mengulang salam formal yang kaku.
2. Tunjukkan pemahaman yang berkelanjutan (misal: "Bagaimana kelanjutan yang kemarin sempat kita bicarakan?", atau menyentuh tema yang ia sukai tanpa terkesan mengintimidasi).
3. Semakin sering pengguna bercerita kepadamu, semakin peka, ringkas, dan relevan responsmu, seolah sahabat karib yang mengerti tanpa banyak kata bertele-tele.
`;
}
