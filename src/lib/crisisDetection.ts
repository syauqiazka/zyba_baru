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

export interface CrisisResource {
  name: string;
  phone: string;
  telLink: string;
  available: string;
  description: string;
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: "Layanan Sejiwa (Kemenkes)",
    phone: "119 ext. 8",
    telLink: "tel:119",
    available: "24 Jam Setiap Hari",
    description: "Konseling kesehatan jiwa darurat nasional gratis oleh psikolog klinis Kemenkes RI.",
  },
  {
    name: "Yayasan Pulih",
    phone: "0811-8436-633",
    telLink: "tel:08118436633",
    available: "Senin – Jumat 09:00 - 17:00 WIB",
    description: "Konseling psikologis dan pemulihan trauma.",
  },
  {
    name: "LISA Helpline",
    phone: "0811-3855-472",
    telLink: "tel:08113855472",
    available: "24 Jam Setiap Hari",
    description: "Dukungan pencegahan bunuh diri dan krisis emosional.",
  },
  {
    name: "Ambulans / Medis Darurat",
    phone: "118 / 119",
    telLink: "tel:119",
    available: "24 Jam Setiap Hari",
    description: "Bantuan darurat penanganan medis fisik.",
  },
];


