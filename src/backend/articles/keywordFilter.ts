/**
 * ZYBA Layer 1 Health Filter — Bilingual Keyword Filtering
 * Menyaring artikel agar sesuai dengan ranah kesehatan mental, kebugaran fisik,
 * dan mindful wellness, sekaligus menolak berita umum, gosip, politik, dan sensasionalisme.
 */

export const POSITIVE_HEALTH_KEYWORDS = [
  // Mental & Emotional Health (EN & ID)
  "mental health",
  "kesehatan mental",
  "kesehatan jiwa",
  "emotional wellness",
  "kesejahteraan emosional",
  "emotional regulation",
  "regulasi emosi",
  "anxiety",
  "kecemasan",
  "cemas",
  "stress management",
  "manajemen stres",
  "kelola stres",
  "depression",
  "depresi",
  "burnout",
  "kelelahan mental",
  "overthinking",
  "resilience",
  "ketahanan batin",
  "psychology",
  "psikologi",
  "terapi",
  "therapy",
  "counseling",
  "konseling",

  // Mindfulness & Self Care (EN & ID)
  "mindfulness",
  "perhatian penuh",
  "meditation",
  "meditasi",
  "self care",
  "perawatan diri",
  "self-compassion",
  "welas asih",
  "grounding",
  "olah napas",
  "breathing exercise",
  "inner peace",
  "kedamaian batin",
  "gratitude",
  "rasa syukur",

  // Sleep & Rest (EN & ID)
  "sleep health",
  "kualitas tidur",
  "sleep hygiene",
  "higiene tidur",
  "insomnia",
  "istirahat",
  "circadian rhythm",
  "ritme sirkadian",
  "rest",

  // Physical Wellness & Healthy Lifestyle (EN & ID)
  "healthy lifestyle",
  "gaya hidup sehat",
  "physical wellness",
  "kebugaran fisik",
  "pola makan sehat",
  "nutrisi",
  "nutrition",
  "kebugaran",
  "aktivitas fisik",
  "physical activity",
  "olahraga ringan",
  "walking",
  "jalan santai",
  "imunitas",
  "immune system",

  // Relationships & Personal Development (EN & ID)
  "personal growth",
  "pengembangan diri",
  "social relationships",
  "hubungan sosial",
  "boundaries",
  "batasan diri",
  "loneliness",
  "kesepian",
  "empathy",
  "empati",
  "komunikasi interpersonal",
  "connection",
  "koneksi sosial",
];

export const NEGATIVE_GENERAL_NEWS_KEYWORDS = [
  // Politik & Pemerintahan Sensasional
  "pemilu",
  "pilpres",
  "pilkada",
  "partai politik",
  "koalisi",
  "dpr",
  "kpu",
  "bawaslu",
  "parlemen",
  "election",
  "campaign rally",
  "politik identitas",
  "reshuffle kabinet",

  // Gosip & Hiburan Pop
  "gosip selebritis",
  "gossip",
  "perselingkuhan artis",
  "skandal video",
  "selebgram viral",
  "hujatan netizen",
  "box office ranking",
  "red carpet fashion",

  // Keuangan Spekulatif
  "saham gorengan",
  "crypto pump",
  "bitcoin rally",
  "forex signal",
  "trading harian",
  "pinjaman online ilegal",
  "investasi bodong",

  // Konflik & Kriminalitas Sensasional
  "perang senjata",
  "rudal balistik",
  "serangan militer",
  "terorisme",
  "pembunuhan berantai",
  "mutilasi",
  "perampokan bersenjata",

  // Olahraga Kompetitif
  "liga champions",
  "skor pertandingan",
  "bursa transfer pemain",
  "klasemen sementara liga",
  "formula 1 race",

  // Review Komersial Gadget / Otomotif
  "review spesifikasi hp",
  "unboxing gadget",
  "harga mobil baru",
  "diskon flash sale belanja",
];

export interface KeywordFilterResult {
  passed: boolean;
  matchedPositive: string[];
  matchedNegative: string[];
  score: number; // 0 - 100
  reason: string;
}

/**
 * Evaluasi kata kunci pada teks artikel (Judul, Ringkasan, Konten)
 */
export function evaluateKeywords(
  title: string,
  description: string,
  content?: string
): KeywordFilterResult {
  const fullText = `${title} ${description} ${content || ""}`.toLowerCase();

  const matchedPositive: string[] = [];
  const matchedNegative: string[] = [];

  // Hitung kecocokan kata kunci positif
  for (const kw of POSITIVE_HEALTH_KEYWORDS) {
    if (fullText.includes(kw.toLowerCase())) {
      matchedPositive.push(kw);
    }
  }

  // Hitung kecocokan kata kunci negatif
  for (const kw of NEGATIVE_GENERAL_NEWS_KEYWORDS) {
    if (fullText.includes(kw.toLowerCase())) {
      matchedNegative.push(kw);
    }
  }

  // Judul memiliki bobot 2x lipat
  const titleLower = title.toLowerCase();
  let titlePositiveBoost = 0;
  for (const kw of POSITIVE_HEALTH_KEYWORDS) {
    if (titleLower.includes(kw.toLowerCase())) {
      titlePositiveBoost += 2;
    }
  }

  // Hitung skor dasar relevansi kata kunci (0 - 100)
  const rawScore =
    Math.min(100, (matchedPositive.length + titlePositiveBoost) * 15) -
    matchedNegative.length * 25;
  const score = Math.max(0, Math.min(100, rawScore));

  // Keputusan kelulusan Layer 1:
  // 1. Ditolak jika terdeteksi kata kunci negatif kuat dan positif minim
  if (matchedNegative.length >= 2 && matchedPositive.length <= 1) {
    return {
      passed: false,
      matchedPositive,
      matchedNegative,
      score: 10,
      reason: `Artikel ditolak karena mengandung topik berita umum/non-kesehatan (${matchedNegative.join(", ")}).`,
    };
  }

  // 2. Ditolak jika tidak ada satu pun kata kunci kesehatan
  if (matchedPositive.length === 0) {
    return {
      passed: false,
      matchedPositive,
      matchedNegative,
      score: 0,
      reason: "Tidak ditemukan keterkaitan kata kunci dengan kesehatan mental atau kebugaran diri.",
    };
  }

  // 3. Lolos jika memenuhi ambang batas minimal
  const passed = score >= 20;

  return {
    passed,
    matchedPositive,
    matchedNegative,
    score,
    reason: passed
      ? `Lolos penyaringan kata kunci kesehatan (${matchedPositive.slice(0, 4).join(", ")})`
      : "Skor kata kunci belum mencapai ambang batas kesehatan wellness.",
  };
}
