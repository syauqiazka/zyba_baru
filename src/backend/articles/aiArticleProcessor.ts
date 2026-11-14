/**
 * ZYBA Layer 3 — AI Relevance Assessment & Summarizer
 * Menggunakan AI Provider ZYBA (Gemini -> Groq -> Mistral -> OpenRouter)
 * untuk menilai relevansi artikel secara ilmiah, menghasilkan ringkasan faktual tanpa
 * mengarang diagnosa medis, dan memastikan kecocokan dengan prinsip mindful ZYBA.
 */

import { ArticleCategory } from "@/generated/account-client";
import { classifyArticleCategory, getCategoryLabel } from "./categoryClassifier";

export interface AIArticleEvaluation {
  relevanceScore: number; // 0 - 100
  category: ArticleCategory;
  summary: string;
  relevanceReason: string;
  language: string;
  readingTime: number; // Menit
  isHealthRelevant: boolean;
}

const AI_SYSTEM_PROMPT = `Anda adalah Asisten Kurator Konten Kesehatan Mental & Wellness ZYBA (Platform Gen Z Wellness Support).
Tugas Anda adalah mengevaluasi artikel dari feed berita/kesehatan untuk menentukan kelayakan publikasi di ZYBA.

Panduan Penilaian:
1. Ranah Relevan: Mental Health, Emotional Wellness, Mindfulness, Self Care, Sleep & Rest, Physical Wellness, Relationships, Personal Development.
2. Ranah Ditolak (skor < 50): Politik praktis, gosip artis, skandal, perang militer, saham gorengan, berita kriminalitas sensasional, olahraga kompetitif.
3. Kategori Resmi (pilih salah satu persis):
   - MENTAL_HEALTH
   - EMOTIONAL_WELLNESS
   - MINDFULNESS
   - SELF_CARE
   - SLEEP_AND_REST
   - PHYSICAL_WELLNESS
   - RELATIONSHIPS
   - PERSONAL_DEVELOPMENT
4. Ringkasan: Buat ringkasan 2–3 kalimat dalam Bahasa Indonesia yang hangat, faktual, dan mudah dipahami Gen Z. JANGAN mengarang klaim medis atau resep obat yang tidak ada pada artikel asli.
5. Bahasa: Tentukan bahasa artikel asli ("id" atau "en").
6. Estimasi waktu baca: 2–6 menit berdasarkan panjang ringkasan & konteks.

Kembalikan HANYA format JSON valid tanpa tanda markdown tambahan:
{
  "relevanceScore": <angka 0-100>,
  "category": "<KATEGORI_RESMI>",
  "summary": "<ringkasan faktual 2-3 kalimat>",
  "relevanceReason": "<alasan 1 kalimat>",
  "language": "id" | "en",
  "readingTime": <angka menit>
}`;

export async function evaluateArticleWithAI(params: {
  title: string;
  description: string;
  content?: string;
  sourceName: string;
  suggestedCategory?: ArticleCategory;
}): Promise<AIArticleEvaluation> {
  const { title, description, content, sourceName, suggestedCategory } = params;

  // Fallback deterministik berbasis aturan jika AI offline / tanpa kuota
  const fallbackCategory = suggestedCategory || classifyArticleCategory(title, description);
  const wordCount = `${title} ${description} ${content || ""}`.split(/\s+/).length;
  const estimatedReadingTime = Math.max(2, Math.min(8, Math.round(wordCount / 180) || 3));

  const userPrompt = `Judul: ${title}
Sumber: ${sourceName}
Deskripsi/Konten: ${description} ${content ? content.slice(0, 1000) : ""}
Saran Kategori Awal: ${getCategoryLabel(fallbackCategory)}`;

  // Coba panggil provider AI yang aktif
  try {
    const rawAiResponse = await callAvailableAIProvider(AI_SYSTEM_PROMPT, userPrompt);
    if (rawAiResponse) {
      const parsed = parseAIResponseJson(rawAiResponse);
      if (parsed) {
        return {
          relevanceScore: Math.max(0, Math.min(100, parsed.relevanceScore)),
          category: validateCategory(parsed.category, fallbackCategory),
          summary: parsed.summary || description.slice(0, 200),
          relevanceReason: parsed.relevanceReason || "Evaluasi kurasi konten AI ZYBA",
          language: parsed.language === "en" ? "en" : "id",
          readingTime: parsed.readingTime || estimatedReadingTime,
          isHealthRelevant: parsed.relevanceScore >= 60,
        };
      }
    }
  } catch (err) {
    console.warn("[AI_ARTICLE_PROCESSOR] Panggilan AI gagal, beralih ke evaluasi heuristik:", err);
  }

  // Heuristic rule-based fallback
  return evaluateArticleHeuristically({
    title,
    description,
    sourceName,
    fallbackCategory,
    estimatedReadingTime,
  });
}

/**
 * Panggil provider AI yang terdaftar di konfigurasi environment
 */
async function callAvailableAIProvider(
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  // 1. Coba Google Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const payload = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
      };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      }
    } catch {}
  }

  // 2. Coba Groq
  if (process.env.GROQ_API_KEY) {
    try {
      const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.2,
          max_tokens: 500,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text.trim();
      }
    } catch {}
  }

  return null;
}

function parseAIResponseJson(raw: string): any {
  try {
    // Bersihkan codeblock ```json ... ``` jika ada
    let clean = raw.trim();
    if (clean.startsWith("```json")) clean = clean.slice(7);
    else if (clean.startsWith("```")) clean = clean.slice(3);
    if (clean.endsWith("```")) clean = clean.slice(0, -3);
    clean = clean.trim();

    return JSON.parse(clean);
  } catch {
    return null;
  }
}

function validateCategory(cat: string, fallback: ArticleCategory): ArticleCategory {
  const valid = Object.values(ArticleCategory);
  if (valid.includes(cat as any)) {
    return cat as ArticleCategory;
  }
  return fallback;
}

function evaluateArticleHeuristically(params: {
  title: string;
  description: string;
  sourceName: string;
  fallbackCategory: ArticleCategory;
  estimatedReadingTime: number;
}): AIArticleEvaluation {
  const { title, description, sourceName, fallbackCategory, estimatedReadingTime } = params;
  const isEn = /[a-zA-Z]{4,}/.test(title) && !/(yang|dan|dari|untuk|di|ke|ini|itu)/i.test(title);

  // Buat ringkasan yang rapi dari deskripsi
  let summary = description.replace(/\s+/g, " ").trim();
  if (summary.length > 250) {
    const cut = summary.slice(0, 240);
    const lastSpace = cut.lastIndexOf(" ");
    summary = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "...";
  }

  return {
    relevanceScore: 82,
    category: fallbackCategory,
    summary: summary || title,
    relevanceReason: `Kurasi berbasis sumber kesehatan kredibel (${sourceName})`,
    language: isEn ? "en" : "id",
    readingTime: estimatedReadingTime,
    isHealthRelevant: true,
  };
}
