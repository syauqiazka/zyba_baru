/**
 * ZYBA Crisis & Self-Harm Detection Engine
 * Wajib dijalankan pada semua input teks bebas pengguna sesuai AGENTS.md Bagian 8
 */

export interface RiskAnalysisResult {
  flagged: boolean;
  level: "CRISIS" | "HIGH" | "NONE";
  matchedTerms: string[];
}

const CRISIS_KEYWORDS = [
  "bunuh diri",
  "suicide",
  "akhiri hidup",
  "mengakhiri hidup",
  "mati saja",
  "ingin mati",
  "mau mati",
  "tidak ingin hidup lagi",
  "capek hidup",
  "gantung diri",
  "sayat tangan",
  "melukai diri",
  "menyakiti diri",
  "overdosis",
  "lompat dari gedung",
  "tenggelamkan diri",
  "self harm",
  "cutting myself",
];

export function detectRisk(text?: string | null): RiskAnalysisResult {
  if (!text || typeof text !== "string") {
    return { flagged: false, level: "NONE", matchedTerms: [] };
  }

  const normalized = text.toLowerCase().trim();
  const matchedTerms: string[] = [];

  for (const keyword of CRISIS_KEYWORDS) {
    if (normalized.includes(keyword)) {
      matchedTerms.push(keyword);
    }
  }

  if (matchedTerms.length > 0) {
    return {
      flagged: true,
      level: "CRISIS",
      matchedTerms,
    };
  }

  return {
    flagged: false,
    level: "NONE",
    matchedTerms: [],
  };
}

