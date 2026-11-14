/**
 * ZYBA Layer 4 — Duplicate Detection & URL Normalization
 * Mendeteksi duplikasi artikel menggunakan Canonical URL, GUID RSS,
 * dan Fingerprint Judul untuk mencegah satu artikel masuk berulang kali.
 */

/**
 * Normalisasi URL untuk menghilangkan parameter pelacak (UTM, fbclid, dsb.)
 * dan menyamakan format canonical URL
 */
export function normalizeCanonicalUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl.trim());

    // 1. Bersihkan query params pelacak umum
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
      "ref",
      "source",
      "from",
      "ocid",
      "cmpid",
    ];

    for (const p of trackingParams) {
      parsed.searchParams.delete(p);
    }

    // 2. Bersihkan hash / fragment
    parsed.hash = "";

    // 3. Hapus trailing slash jika ada
    let clean = parsed.toString();
    if (clean.endsWith("/") && parsed.pathname !== "/") {
      clean = clean.slice(0, -1);
    }

    return clean;
  } catch {
    return rawUrl.trim();
  }
}

/**
 * Membuat sidik jari judul (title fingerprint) untuk mendeteksi kesamaan
 */
export function getTitleFingerprint(title: string): string {
  const stopWords = new Set([
    // Indonesian stop words
    "yang",
    "dan",
    "di",
    "ke",
    "dari",
    "untuk",
    "pada",
    "adalah",
    "ini",
    "itu",
    "dengan",
    "atau",
    "oleh",
    "karena",
    "jika",
    "akan",
    "bisa",
    "cara",
    // English stop words
    "the",
    "and",
    "in",
    "on",
    "at",
    "of",
    "to",
    "a",
    "an",
    "is",
    "are",
    "for",
    "with",
    "by",
    "how",
    "what",
    "why",
  ]);

  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))
    .sort()
    .join(" ");
}

/**
 * Menghitung tingkat kemiripan teks menggunakan Jaccard Similarity (0.0 - 1.0)
 */
export function computeTitleSimilarity(titleA: string, titleB: string): number {
  const wordsA = new Set(getTitleFingerprint(titleA).split(" "));
  const wordsB = new Set(getTitleFingerprint(titleB).split(" "));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  const intersection = new Set([...wordsA].filter((x) => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);

  return intersection.size / union.size;
}

/**
 * Membuat slug URL yang bersih dan aman
 */
export function generateArticleSlug(title: string, suffix?: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 75);

  const cleanBase = base.replace(/-+$/, "");
  if (suffix) {
    return `${cleanBase}-${suffix}`;
  }
  return cleanBase || `article-${Date.now()}`;
}
