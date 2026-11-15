/**
 * ZYBA AI Meal & Calorie Vision Analyzer
 * Mengidentifikasi komposisi makanan dari foto dan menghitung estimasi kalori & makronutrien.
 * Mendukung Google Gemini Vision dengan fallback cerdas.
 */

export interface MealAnalysisResult {
  foodName: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  healthScore: number;
  mindfulReview: string;
  recommendation: string;
  provider: "GEMINI_VISION" | "HEURISTIC_AI";
}

export async function analyzeMealPhoto(
  base64Data: string,
  mimeType: string = "image/jpeg",
  userNote?: string
): Promise<MealAnalysisResult> {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    try {
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

      // Clean base64 prefix if present
      const cleanBase64 = base64Data.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

      const systemPrompt = `Anda adalah Zibi Nutrition AI, analis nutrisi dan pola makan mindful dari ZYBA (aplikasi Gen Z Wellness).
Tugas Anda:
1. Identifikasi nama hidangan makanan dan komponen lauk/sayur utama dari foto piring makanan ini.
2. Hitung estimasi kalori total (dalam satuan kkal / kcal).
3. Hitung estimasi makronutrien: protein (g), karbohidrat (g), lemak (g), serat (g).
4. Berikan skor kesehatan piring (1-100).
5. Tuliskan ulasan mindful hangat khas maskot Zibi (maksimal 2 kalimat, nada hangat, positif, tanpa menghakimi).
6. Berikan rekomendasi hidrasi atau keseimbangan tubuh ringan.

PENTING: Jawab HANYA dalam format JSON valid tanpa tanda backtick markdown (\`\`\`json):
{
  "foodName": "Nama Makanan & Komposisi Utama",
  "calories": 480,
  "proteinGrams": 32,
  "carbsGrams": 55,
  "fatGrams": 14,
  "fiberGrams": 6,
  "healthScore": 85,
  "mindfulReview": "Ulasan ramah dari Zibi...",
  "recommendation": "Rekomendasi mindful..."
}`;

      const userPrompt = userNote
        ? `Analisis piring makanan ini. Catatan dari pengguna: "${userNote}".`
        : "Analisis piring makanan ini secara terperinci.";

      const payload = {
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: cleanBase64,
                },
              },
              {
                text: userPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
        },
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          const parsed = JSON.parse(cleanText);
          return {
            foodName: String(parsed.foodName || "Piring Seimbang"),
            calories: Number(parsed.calories || 450),
            proteinGrams: Number(parsed.proteinGrams || 25),
            carbsGrams: Number(parsed.carbsGrams || 50),
            fatGrams: Number(parsed.fatGrams || 15),
            fiberGrams: Number(parsed.fiberGrams || 5),
            healthScore: Number(parsed.healthScore || 80),
            mindfulReview: String(
              parsed.mindfulReview ||
                "Pilihan makanan yang bernutrisi untuk mendukung energi dan kejernihan pikiranmu hari ini."
            ),
            recommendation: String(
              parsed.recommendation ||
                "Minum segelas air putih hangat setelah makan untuk membantu sistem metabolisme."
            ),
            provider: "GEMINI_VISION",
          };
        }
      }
    } catch (err) {
      console.warn("[Meal-Vision] Gemini Vision gagal, beralih ke Heuristik:", err);
    }
  }

  // Fallback Heuristik Cerdas Berbasis Makanan Sehat Khas Nusantara & Gen Z
  return generateHeuristicMealEstimate(userNote);
}

function generateHeuristicMealEstimate(userNote?: string): MealAnalysisResult {
  const note = (userNote || "").toLowerCase();

  if (note.includes("salad") || note.includes("buah") || note.includes("oat")) {
    return {
      foodName: "Bowl Sehat: Buah Segar, Granola & Serat Alami",
      calories: 320,
      proteinGrams: 14,
      carbsGrams: 52,
      fatGrams: 8,
      fiberGrams: 9,
      healthScore: 92,
      mindfulReview:
        "Pilihan yang sangat segar dan kaya antioksidan! Serat tinggi membantu stabilitas mood dan pencernaan yang nyaman sepanjang hari.",
      recommendation: "Kombinasi sempurna untuk sarapan atau camilan jeda hening sore hari.",
      provider: "HEURISTIC_AI",
    };
  }

  if (note.includes("geprek") || note.includes("goreng") || note.includes("padang")) {
    return {
      foodName: "Piring Nusantara: Nasi Gurih, Protein Ayam & Sambal",
      calories: 580,
      proteinGrams: 36,
      carbsGrams: 64,
      fatGrams: 22,
      fiberGrams: 4,
      healthScore: 74,
      mindfulReview:
        "Makanan yang kaya rasa dan memuaskan rasa lapar! Nikmati setiap gigitan tanpa rasa bersalah.",
      recommendation:
        "Seimbangkan dengan menambah segelas air putih ekstra dan jalan santai 10 menit setelah jeda makan.",
      provider: "HEURISTIC_AI",
    };
  }

  // Standar Default: Piring Bergizi Seimbang
  return {
    foodName: "Piring Seimbang: Nasi, Protein Utama & Sayuran Hijau",
    calories: 460,
    proteinGrams: 32,
    carbsGrams: 54,
    fatGrams: 12,
    fiberGrams: 6,
    healthScore: 86,
    mindfulReview:
      "Komposisi piring yang harmonis! Keseimbangan antara karbohidrat kompleks dan protein membantu menjaga stamina tanpa lonjakan kantuk.",
    recommendation:
      "Kunyah secara perlahan dalam keheningan agar pencernaanmu dapat menyerap nutrisi dengan optimal.",
    provider: "HEURISTIC_AI",
  };
}
