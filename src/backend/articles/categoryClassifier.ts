/**
 * ZYBA Layer 2 — Category Classifier
 * Mengelompokkan artikel secara otomatis ke dalam 8 kategori resmi ZYBA.
 */

import { ArticleCategory } from "@/generated/account-client";

export interface CategoryInfo {
  category: ArticleCategory;
  label: string;
  description: string;
  keywords: string[];
}

export const CATEGORY_DEFINITIONS: Record<ArticleCategory, CategoryInfo> = {
  [ArticleCategory.MENTAL_HEALTH]: {
    category: ArticleCategory.MENTAL_HEALTH,
    label: "Mental Health",
    description: "Kesehatan jiwa, psikologi klinis, depresi, terapi, dan konseling.",
    keywords: [
      "mental health",
      "kesehatan mental",
      "kesehatan jiwa",
      "depression",
      "depresi",
      "psychology",
      "psikologi",
      "terapi",
      "therapy",
      "counseling",
      "konseling",
      "bipolar",
      "psikolog",
      "kejiwaan",
    ],
  },
  [ArticleCategory.EMOTIONAL_WELLNESS]: {
    category: ArticleCategory.EMOTIONAL_WELLNESS,
    label: "Emotional Wellness",
    description: "Regulasi emosi, kecemasan, panic attack, dan manajemen stres.",
    keywords: [
      "emotional wellness",
      "regulasi emosi",
      "emotional regulation",
      "anxiety",
      "kecemasan",
      "cemas",
      "stress",
      "stres",
      "overthinking",
      "burnout",
      "panik",
      "kemarahan",
      "mood swing",
      "ketakutan",
    ],
  },
  [ArticleCategory.MINDFULNESS]: {
    category: ArticleCategory.MINDFULNESS,
    label: "Mindfulness",
    description: "Latihan kesadaran penuh, meditasi, olah napas, dan grounding.",
    keywords: [
      "mindfulness",
      "perhatian penuh",
      "meditasi",
      "meditation",
      "grounding",
      "olah napas",
      "breathing exercise",
      "kesadaran saat ini",
      "zen",
      "ketenangan batin",
      "inner peace",
      "hening",
    ],
  },
  [ArticleCategory.SELF_CARE]: {
    category: ArticleCategory.SELF_CARE,
    label: "Self Care",
    description: "Perawatan diri holistik, welas asih diri, dan me-time sadar.",
    keywords: [
      "self care",
      "perawatan diri",
      "self-compassion",
      "welas asih",
      "me time",
      "menghargai diri",
      "kebaikan diri",
      "dekompresi",
      "self love",
      "merawat diri",
    ],
  },
  [ArticleCategory.SLEEP_AND_REST]: {
    category: ArticleCategory.SLEEP_AND_REST,
    label: "Sleep & Rest",
    description: "Higiene tidur, ritme sirkadian, mengatasi insomnia, dan istirahat pulih.",
    keywords: [
      "sleep",
      "tidur",
      "insomnia",
      "sleep hygiene",
      "higiene tidur",
      "circadian rhythm",
      "ritme sirkadian",
      "istirahat",
      "lelap",
      "night routine",
      "ritual malam",
      "tidur nyenyak",
    ],
  },
  [ArticleCategory.PHYSICAL_WELLNESS]: {
    category: ArticleCategory.PHYSICAL_WELLNESS,
    label: "Physical Wellness",
    description: "Nutrisi seimbang, olahraga ringan, hidrasi, dan kebugaran tubuh.",
    keywords: [
      "physical wellness",
      "kebugaran fisik",
      "healthy lifestyle",
      "pola makan sehat",
      "nutrisi",
      "nutrition",
      "olahraga",
      "exercise",
      "walking",
      "jalan kaki",
      "imunitas",
      "immune",
      "kesehatan fisik",
      "tubuh",
    ],
  },
  [ArticleCategory.RELATIONSHIPS]: {
    category: ArticleCategory.RELATIONSHIPS,
    label: "Relationships",
    description: "Hubungan interpersonal, batasan diri sehat, empati, dan komunikasi hangat.",
    keywords: [
      "relationships",
      "hubungan",
      "social",
      "sosial",
      "boundaries",
      "batasan diri",
      "kesepian",
      "loneliness",
      "komunikasi",
      "pertemanan",
      "keluarga",
      "koneksi",
      "empati",
      "empathy",
    ],
  },
  [ArticleCategory.PERSONAL_DEVELOPMENT]: {
    category: ArticleCategory.PERSONAL_DEVELOPMENT,
    label: "Personal Development",
    description: "Pertumbuhan pribadi, ketahanan batin (resilience), kebiasaan positif, dan tujuan hidup.",
    keywords: [
      "personal growth",
      "personal development",
      "pengembangan diri",
      "resilience",
      "ketahanan batin",
      "kebiasaan",
      "habit",
      "tujuan hidup",
      "makna hidup",
      "produktivitas sehat",
      "growth mindset",
      "potensi diri",
    ],
  },
};

/**
 * Klasifikasi kategori otomatis berdasarkan teks artikel
 */
export function classifyArticleCategory(
  title: string,
  description: string,
  defaultCategory?: ArticleCategory | null
): ArticleCategory {
  const fullText = `${title} ${description}`.toLowerCase();
  const titleLower = title.toLowerCase();

  const scores: Record<ArticleCategory, number> = {
    [ArticleCategory.MENTAL_HEALTH]: 0,
    [ArticleCategory.EMOTIONAL_WELLNESS]: 0,
    [ArticleCategory.MINDFULNESS]: 0,
    [ArticleCategory.SELF_CARE]: 0,
    [ArticleCategory.SLEEP_AND_REST]: 0,
    [ArticleCategory.PHYSICAL_WELLNESS]: 0,
    [ArticleCategory.RELATIONSHIPS]: 0,
    [ArticleCategory.PERSONAL_DEVELOPMENT]: 0,
  };

  for (const [catKey, def] of Object.entries(CATEGORY_DEFINITIONS)) {
    const cat = catKey as ArticleCategory;
    for (const kw of def.keywords) {
      if (titleLower.includes(kw)) {
        scores[cat] += 4; // Bobot lebih tinggi jika kata kunci muncul di judul
      } else if (fullText.includes(kw)) {
        scores[cat] += 1;
      }
    }
  }

  // Jika ada default category dari sumbernya, beri modal skor awal
  if (defaultCategory && scores[defaultCategory] !== undefined) {
    scores[defaultCategory] += 2;
  }

  // Cari kategori dengan skor tertinggi
  let bestCategory: ArticleCategory = defaultCategory || ArticleCategory.MENTAL_HEALTH;
  let maxScore = -1;

  for (const [catKey, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = catKey as ArticleCategory;
    }
  }

  return bestCategory;
}

/**
 * Mengembalikan label manusiawi untuk enum ArticleCategory
 */
export function getCategoryLabel(category: ArticleCategory): string {
  return CATEGORY_DEFINITIONS[category]?.label || "Mental Health";
}
