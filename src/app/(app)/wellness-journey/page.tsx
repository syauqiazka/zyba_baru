"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ScoreTrendChart } from "@/components/wellness/ScoreTrendChart";
import { Mascot } from "@/components/ui/Mascot";
import {
  TrendingUp,
  Brain,
  Activity,
  Users,
  BookOpen,
  Calendar,
  Plus,
  Send,
  HeartHandshake,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Feather,
  Smile,
  X,
} from "lucide-react";

interface WellnessData {
  hasData?: boolean;
  currentScore: number | null;
  scoreBreakdown: {
    mental: number | null;
    physical: number | null;
    social: number | null;
  };
  history: any[];
}

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string | null;
  createdAt: string;
}

const JOURNAL_PROMPTS = [
  "Apa hal kecil yang melegakan napasmu hari ini?",
  "Batas diri apa yang berhasil kamu jaga dengan tenang?",
  "Apa beban atau overthinking yang ingin kamu lepaskan malam ini?",
  "Satu hal baik tentang dirimu yang patut disyukuri hari ini...",
];

const MOOD_OPTIONS = [
  { id: "OVERJOYED", label: "Sangat Bahagia", color: "bg-[#3E7B54] text-white" },
  { id: "HAPPY", label: "Tenang & Senang", color: "bg-[#E8C24A] text-brown-900" },
  { id: "NEUTRAL", label: "Biasa Saja", color: "bg-[#708075] text-white" },
  { id: "SAD", label: "Sendu / Lelah", color: "bg-[#F28C6E] text-brown-900" },
  { id: "DEPRESSED", label: "Sangat Berat", color: "bg-[#A99BE0] text-brown-900" },
];

export default function WellnessJourneyPage() {
  const [activeTab, setActiveTab] = useState<"journal" | "history">("journal");
  const [wellnessData, setWellnessData] = useState<WellnessData | null>(null);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Journal form state
  const [isComposing, setIsComposing] = useState(false);
  const [jTitle, setJTitle] = useState("");
  const [jContent, setJContent] = useState("");
  const [jMood, setJMood] = useState("NEUTRAL");
  const [savingJournal, setSavingJournal] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);

  const fetchWellnessData = async () => {
    try {
      const [statsRes, journalRes] = await Promise.all([
        fetch("/api/wellness-journey/stats"),
        fetch("/api/wellness-journey/journal"),
      ]);

      if (statsRes.ok) {
        const stats = await statsRes.json();
        setWellnessData(stats);
      }
      if (journalRes.ok) {
        const jData = await journalRes.json();
        setJournals(jData.entries || []);
      }
    } catch (err) {
      console.warn("Gagal memuat data wellness journey:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWellnessData();
  }, []);

  const handleApplyPrompt = (promptText: string) => {
    setJTitle(promptText);
    setIsComposing(true);
  };

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jTitle.trim() || !jContent.trim() || savingJournal) return;

    setSavingJournal(true);
    try {
      const res = await fetch("/api/wellness-journey/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: jTitle.trim(),
          content: jContent.trim(),
          mood: jMood,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setJournals((prev) => [data.entry, ...prev]);
        setCrisisAlert(Boolean(data.riskDetected));
        setJTitle("");
        setJContent("");
        setIsComposing(false);
      }
    } catch (err) {
      console.error("Gagal menyimpan jurnal:", err);
    } finally {
      setSavingJournal(false);
    }
  };

  const getScoreVerdict = (score: number) => {
    if (score >= 80) return "Sangat Selaras & Bertumbuh";
    if (score >= 60) return "Cukup Seimbang & Tenang";
    return "Butuh Istirahat & Ruang Bernapas";
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Gentle Crisis Care Banner if triggered in reflection */}
      {crisisAlert && (
        <div className="rounded-3xl border border-orange-500/30 bg-orange-100/70 p-5 text-xs text-brown-900 flex items-start justify-between gap-3.5 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-start gap-3.5">
            <HeartHandshake className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-sm text-brown-900">
                Kami menyimak isi hatimu dengan penuh rasa peduli.
              </h4>
              <p className="text-brown-700 leading-relaxed text-xs">
                Refleksimu menunjukkan beban emosional yang berat. Ingatlah bahwa kamu tidak sendirian. Hubungi hotline darurat <strong>119</strong> atau akses{" "}
                <Link href="/guidebook" className="font-bold underline text-orange-950">
                  Panduan Bantuan Krisis ZYBA
                </Link>{" "}
                kapan pun kamu membutuhkan ruang aman.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCrisisAlert(false)}
            className="p-1 rounded-lg text-brown-700/60 hover:text-brown-900 hover:bg-orange-200/50"
            aria-label="Tutup pesan bantuan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header: Impeccable Craft (No eyebrow, balanced typography) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown-900">
            Ruang Sehat (Wellness Journey)
          </h1>
          <p className="text-xs sm:text-sm text-brown-700/70 max-w-xl">
            Pantau ritme pemulihan batin, konsistensi kebiasaan, dan catatan perjalanan jiwamu dalam ruang suaka yang tenang.
          </p>
        </div>

        <Link
          href="/mood-check-in"
          className="px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-brown-900 font-bold text-xs flex items-center gap-2 self-start sm:self-auto shadow-xs transition-all active:scale-95"
        >
          <span>Check-In Hari Ini</span>
          <ChevronRight className="w-4 h-4 stroke-[2.4]" />
        </Link>
      </div>

      {/* 1. Score Overview Grid: 12-column layout (Hero Score Card 4 cols, 3 Domain Cards 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Main Zyba Score Hero Card (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-brown-900/10 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brown-700/60">
                Skor ZYBA
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#3E7B54] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="font-mono text-4xl sm:text-5xl font-black text-brown-900 tracking-tight">
              {wellnessData?.currentScore !== null && wellnessData?.currentScore !== undefined ? (
                <>
                  {wellnessData.currentScore}
                  <span className="text-lg text-brown-700/40 font-normal">/100</span>
                </>
              ) : (
                <span className="text-3xl text-brown-700/40 font-normal">—</span>
              )}
            </div>
          </div>
          <div className="pt-4 border-t border-brown-900/8 mt-4 space-y-1">
            <span className="text-sm font-serif font-bold text-[#3E7B54] block">
              {wellnessData?.currentScore !== null && wellnessData?.currentScore !== undefined
                ? getScoreVerdict(wellnessData.currentScore)
                : "Belum Ada Evaluasi"}
            </span>
            <span className="text-xs text-brown-700/60 block">
              {wellnessData?.hasData
                ? "Rerata rolling 7 hari terakhir"
                : "Lakukan check-in harian untuk menghitung skormu"}
            </span>
          </div>
        </div>

        {/* 3 Domain Breakdown Cards (8 cols -> grid-cols-1 sm:grid-cols-3) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Mental */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#3E7B54] flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-brown-900 truncate">Mental</h4>
                <span className="text-[10px] text-brown-700/60">Bobot 50%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-brown-700/80 truncate">
                  Skor Batin
                </span>
                <span className="font-mono text-xs font-bold text-brown-900 shrink-0">
                  {wellnessData?.scoreBreakdown?.mental !== null && wellnessData?.scoreBreakdown?.mental !== undefined
                    ? `${wellnessData.scoreBreakdown.mental}/100`
                    : "—"}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-cream overflow-hidden">
                <div
                  className="h-full bg-[#3E7B54] rounded-full transition-all duration-500"
                  style={{
                    width: `${wellnessData?.scoreBreakdown?.mental !== null && wellnessData?.scoreBreakdown?.mental !== undefined ? wellnessData.scoreBreakdown.mental : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Fisik */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-brown-900 truncate">Fisik</h4>
                <span className="text-[10px] text-brown-700/60">Bobot 25%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-brown-700/80 truncate">
                  Tidur & Energi
                </span>
                <span className="font-mono text-xs font-bold text-brown-900 shrink-0">
                  {wellnessData?.scoreBreakdown?.physical !== null && wellnessData?.scoreBreakdown?.physical !== undefined
                    ? `${wellnessData.scoreBreakdown.physical}/100`
                    : "—"}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-cream overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${wellnessData?.scoreBreakdown?.physical !== null && wellnessData?.scoreBreakdown?.physical !== undefined ? wellnessData.scoreBreakdown.physical : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sosial */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-brown-900 truncate">Sosial</h4>
                <span className="text-[10px] text-brown-700/60">Bobot 25%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-brown-700/80 truncate">
                  Koneksi Komunitas
                </span>
                <span className="font-mono text-xs font-bold text-brown-900 shrink-0">
                  {wellnessData?.scoreBreakdown?.social !== null && wellnessData?.scoreBreakdown?.social !== undefined
                    ? `${wellnessData.scoreBreakdown.social}/100`
                    : "—"}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-cream overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${wellnessData?.scoreBreakdown?.social !== null && wellnessData?.scoreBreakdown?.social !== undefined ? wellnessData.scoreBreakdown.social : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Curve Chart Container */}
      <div className="rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-7 shadow-2xs space-y-4">
        <ScoreTrendChart data={wellnessData?.history || []} />
      </div>

      {/* 3. Tab Section: Jurnal Reflektif Suaka & Riwayat Check-In */}
      <div className="space-y-4">
        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-brown-900/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("journal")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "journal"
                ? "bg-[#3E7B54] text-white shadow-2xs"
                : "bg-white text-brown-700 hover:text-brown-900 border border-brown-900/10"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Jurnal Reflektif Suaka ({journals.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "history"
                ? "bg-[#3E7B54] text-white shadow-2xs"
                : "bg-white text-brown-700 hover:text-brown-900 border border-brown-900/10"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Riwayat Check-In Harian</span>
          </button>
        </div>

        {/* Tab 1: Jurnal Reflektif */}
        {activeTab === "journal" && (
          <div className="space-y-4">
            {/* Writing Prompt Chips for Inspiration */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-brown-700/60 uppercase tracking-wider flex items-center gap-1.5">
                <Feather className="w-3.5 h-3.5 text-[#3E7B54]" />
                Inspirasi Pemantik Refleksi
              </span>
              <div className="flex flex-wrap gap-2">
                {JOURNAL_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPrompt(prompt)}
                    className="px-3.5 py-1.5 rounded-full bg-cream/70 hover:bg-cream border border-brown-900/10 text-left text-xs text-brown-900 transition-all hover:border-[#3E7B54]/40"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Compose Toggle / Form */}
            {!isComposing ? (
              <button
                type="button"
                onClick={() => setIsComposing(true)}
                className="w-full p-4 rounded-3xl border-2 border-dashed border-brown-900/15 hover:border-[#3E7B54] bg-white text-center text-xs font-bold text-brown-900 flex items-center justify-center gap-2 transition-all hover:bg-cream/40 shadow-2xs"
              >
                <Plus className="w-4 h-4 text-[#3E7B54]" />
                <span>Tulis Catatan / Refleksi Baru</span>
              </button>
            ) : (
              <form
                onSubmit={handleSaveJournal}
                className="rounded-3xl border border-brown-900/10 bg-white p-5 sm:p-6 shadow-xs space-y-4 animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between pb-2 border-b border-brown-900/8">
                  <h4 className="font-serif text-sm font-bold text-brown-900">
                    Refleksi Batin Pribadi
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsComposing(false)}
                    className="text-xs text-brown-700/60 hover:text-brown-900 font-semibold"
                  >
                    Batal
                  </button>
                </div>

                <input
                  type="text"
                  value={jTitle}
                  onChange={(e) => setJTitle(e.target.value)}
                  placeholder="Judul refleksi (misal: Melepas lelah setelah kerja)..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-cream/40 border border-brown-900/10 text-xs sm:text-sm font-bold text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:border-[#3E7B54] focus:bg-white transition-all"
                  required
                />

                <textarea
                  value={jContent}
                  onChange={(e) => setJContent(e.target.value)}
                  placeholder="Tuliskan apa pun yang ingin kamu luapkan hari ini. Ruang ini sepenuhnya privat untukmu..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl bg-cream/40 border border-brown-900/10 text-xs sm:text-sm text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:border-[#3E7B54] focus:bg-white transition-all resize-none leading-relaxed"
                  required
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  {/* Mood Selector Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-brown-700/60 mr-1">Suasana:</span>
                    {MOOD_OPTIONS.map((m) => {
                      const isSelected = jMood === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setJMood(m.id)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                            isSelected
                              ? `${m.color} shadow-2xs ring-2 ring-brown-900/20`
                              : "bg-cream text-brown-700/70 hover:bg-cream/90"
                          }`}
                        >
                          {m.label}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="submit"
                    disabled={savingJournal || !jTitle.trim() || !jContent.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#3E7B54] hover:bg-[#346B48] disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 self-end sm:self-auto"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{savingJournal ? "Menyimpan..." : "Simpan Refleksi"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* List of past journal entries */}
            <div className="space-y-3">
              {journals.length === 0 ? (
                <div className="rounded-3xl border border-brown-900/10 bg-white p-8 text-center text-xs text-brown-700/60 space-y-2">
                  <BookOpen className="w-8 h-8 text-[#3E7B54] mx-auto opacity-70" />
                  <p className="font-serif font-bold text-brown-900">
                    Belum ada catatan refleksi
                  </p>
                  <p className="max-w-xs mx-auto">
                    Menuliskan apa yang ada di pikiran dapat membantu meredakan overthinking dan memetakan emosimu.
                  </p>
                </div>
              ) : (
                journals.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-3xl border border-brown-900/10 bg-white p-5 shadow-2xs space-y-2.5 hover:border-[#3E7B54]/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-sm font-bold text-brown-900">
                          {entry.title}
                        </h4>
                        {entry.mood && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cream text-brown-800">
                            {entry.mood}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-brown-700/50">
                        {new Date(entry.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-brown-700 leading-relaxed whitespace-pre-line">
                      {entry.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Riwayat Check-In */}
        {activeTab === "history" && (
          <div className="space-y-3">
            <div className="rounded-3xl border border-brown-900/10 bg-white p-6 shadow-2xs space-y-4">
              <h4 className="font-serif text-sm font-bold text-brown-900">
                Log Catatan Suasana Hati Sepekan
              </h4>
              {(!wellnessData?.history || wellnessData.history.length === 0) ? (
                <div className="py-8 text-center text-xs text-brown-700/60 space-y-2">
                  <Calendar className="w-8 h-8 text-[#3E7B54] mx-auto opacity-70" />
                  <p className="font-serif font-bold text-brown-900">
                    Belum ada riwayat check-in tercatat
                  </p>
                  <p className="max-w-xs mx-auto">
                    Mulai lakukan check-in harian untuk mencatat tingkat stres, kualitas tidur, dan dinamika emosimu.
                  </p>
                  <Link
                    href="/mood-check-in"
                    className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 rounded-full bg-orange-500 hover:bg-orange-600 text-brown-900 font-bold text-xs shadow-2xs transition-all"
                  >
                    <span>Check-In Sekarang</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-brown-900/8">
                  {wellnessData.history.map((h, i) => (
                    <div key={i} className="py-3.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#3E7B54] flex items-center justify-center font-bold text-xs">
                          {h.date.slice(0, 3)}
                        </div>
                        <div>
                          <p className="font-bold text-brown-900">Suasana: {h.mood}</p>
                          <span className="text-[10px] text-brown-700/60">
                            Tingkat Stres: {h.stressLevel}/5
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Skor {h.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
