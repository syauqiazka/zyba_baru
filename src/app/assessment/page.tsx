"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Heart,
  Smile,
  Moon,
  Zap,
} from "lucide-react";
import { Mascot } from "@/components/ui/Mascot";
import { MoodLevel } from "@/generated/account-client";
import { ChoiceCard, ScaleRating } from "@/components/wellness/ChoiceCard";
import { MoodPebble } from "@/components/wellness/MoodPebble";

const GOAL_OPTIONS = [
  { value: "Mengurangi Stres & Overthinking", label: "Mengurangi Stres & Overthinking" },
  { value: "Meningkatkan Kualitas Tidur", label: "Meningkatkan Kualitas Tidur" },
  { value: "Membangun Kebiasaan Hidup Sadar", label: "Membangun Kebiasaan Hidup Sadar" },
  { value: "Mencari Teman Cerita Aman", label: "Mencari Teman Cerita Aman" },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Dimension States
  const [persona] = useState<string>("ZIBI");
  const [username, setUsername] = useState("");
  const [goal, setGoal] = useState("Mengurangi Stres & Overthinking");
  const [initialMood, setInitialMood] = useState<MoodLevel>(MoodLevel.NEUTRAL);
  const [stressLevel, setStressLevel] = useState(3);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [expressionText, setExpressionText] = useState("");

  const totalSteps = 5;

  const handleNext = () => {
    if (step === 2 && !username.trim()) {
      setErrorMsg("Nama panggilan wajib diisi.");
      return;
    }
    setErrorMsg("");
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        username: username.toLowerCase().replace(/[^a-z0-9_]/g, ""),
        companionPersona: persona,
        questionnaire: {
          goal,
          initialMood,
          stressLevel,
          sleepQuality,
          expressionText,
        },
      };

      const res = await fetch("/api/assessment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyelesaikan asesmen.");

      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-brown-900 selection:bg-orange-200">
      {/* Top Organic Progress Bar */}
      <header className="px-6 py-4 border-b border-brown-900/10 bg-cream/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-brown-900">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-serif text-sm font-bold text-brown-900">
              Ritual Awal ZYBA
            </span>
          </div>

          <span className="text-xs font-bold text-brown-700 uppercase tracking-wider">
            Dimensi {step} dari {totalSteps}
          </span>
        </div>

        {/* Progress Line */}
        <div className="max-w-3xl mx-auto mt-3 h-1.5 w-full overflow-hidden rounded-full bg-brown-900/10">
          <div
            className="h-full bg-orange-500 transition-all duration-300 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Single-Focus Card Container */}
      <main className="max-w-3xl mx-auto px-4 py-8 md:py-14 pb-28">
        {errorMsg && (
          <div className="mb-6 rounded-2xl border border-brown-900/20 bg-orange-50 p-4 text-xs text-brown-900">
            {errorMsg}
          </div>
        )}

        <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-6 md:p-10 shadow-[0_8px_32px_rgba(44,34,30,0.06)] backdrop-blur-xl">
          {/* DIMENSI 1: Maskot Pendamping */}
          {step === 1 && (
            <div className="space-y-6 text-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brown-700/70 block mb-1">
                  Dimensi 1: Sahabat Pendamping
                </span>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-brown-900">
                  Temui Zibi, Sahabat Mindful-mu
                </h1>
                <p className="mt-1 text-xs md:text-sm text-brown-700 leading-relaxed max-w-lg mx-auto">
                  Zibi adalah maskot suaka ZYBA yang akan selalu ada menemanimu curhat, mendengar keluh kesahmu tanpa penghakiman, dan mendampingi harimu.
                </p>
              </div>

              <div className="py-2 flex flex-col items-center">
                <Mascot pose="happy" size={160} animate={true} decorative={false} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="rounded-2xl border border-brown-900/10 bg-cream/60 p-4">
                  <span className="text-xs font-bold text-brown-900 block mb-1">
                    Pendengar Setia
                  </span>
                  <p className="text-[11px] text-brown-700 leading-relaxed">
                    Mendengarkan apa pun perasaanmu dengan empati dan kelembutan.
                  </p>
                </div>
                <div className="rounded-2xl border border-brown-900/10 bg-cream/60 p-4">
                  <span className="text-xs font-bold text-brown-900 block mb-1">
                    Bebas Penghakiman
                  </span>
                  <p className="text-[11px] text-brown-700 leading-relaxed">
                    Ruang aman 100% privat untuk meluapkan lelah tanpa takut dinilai.
                  </p>
                </div>
                <div className="rounded-2xl border border-brown-900/10 bg-cream/60 p-4">
                  <span className="text-xs font-bold text-brown-900 block mb-1">
                    Selalu Hadir 24/7
                  </span>
                  <p className="text-[11px] text-brown-700 leading-relaxed">
                    Kapan pun kamu butuh ruang bernafas, Zibi siap menyambutmu.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DIMENSI 2: Profil & Tujuan */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brown-700/70 block mb-1">
                  Dimensi 2: Identitas & Niat
                </span>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-brown-900">
                  Bagaimana Kami Memanggilmu?
                </h1>
                <p className="mt-1 text-xs md:text-sm text-brown-700 leading-relaxed">
                  Ruang ini dirancang khusus untuk kenyamanan dan kehangatan personalmu.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-brown-900 mb-1.5">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Contoh: Syauqi"
                    className="h-12 w-full rounded-xl border border-brown-900/15 bg-white/90 px-4 text-sm text-brown-900 placeholder:text-brown-700/50 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brown-900 mb-2">
                    Niat atau Fokus Utamamu Saat Ini
                  </label>
                  <div className="space-y-2">
                    {GOAL_OPTIONS.map((g) => (
                      <ChoiceCard
                        key={g.value}
                        label={g.label}
                        selected={goal === g.value}
                        onSelect={() => setGoal(g.value)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DIMENSI 3: Suasana Batin & Stres */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brown-700/70 block mb-1">
                  Dimensi 3: Ritme Batin
                </span>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-brown-900">
                  Bagaimana Suasana Hatimu Akhir-akhir Ini?
                </h1>
                <p className="mt-1 text-xs md:text-sm text-brown-700 leading-relaxed">
                  Tidak ada jawaban salah. Kami mendengar tanpa penghakiman.
                </p>
              </div>

              {/* Mood Pebbles */}
              <div>
                <label className="block text-xs font-bold text-brown-900 mb-3">
                  Suasana Hati yang Paling Sering Muncul
                </label>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {Object.values(MoodLevel).map((lvl) => (
                    <MoodPebble
                      key={lvl}
                      mood={lvl}
                      selected={initialMood === lvl}
                      onSelect={(m) => setInitialMood(m)}
                    />
                  ))}
                </div>
              </div>

              {/* Stres Scale */}
              <div className="border-t border-brown-900/10 pt-5">
                <label className="block text-xs font-bold text-brown-900 mb-2">
                  Tingkat Beban Pikiran / Tekanan Stres (1–5)
                </label>
                <ScaleRating
                  value={stressLevel}
                  onChange={setStressLevel}
                  min={1}
                  max={5}
                  lowLabel="1 - Sangat Tenang"
                  highLabel="5 - Beban Berat"
                />
              </div>
            </div>
          )}

          {/* DIMENSI 4: Raga & Istirahat */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brown-700/70 block mb-1">
                  Dimensi 4: Raga & Istirahat
                </span>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-brown-900">
                  Bagaimana Kualitas Tidurmu?
                </h1>
                <p className="mt-1 text-xs md:text-sm text-brown-700 leading-relaxed">
                  Kesehatan raga adalah pondasi utama ketenangan pikiran.
                </p>
              </div>

              <div className="space-y-5 pt-2">
                <div>
                  <label className="block text-xs font-bold text-brown-900 mb-2">
                    Kualitas Tidur Umum
                  </label>
                  <ScaleRating
                    value={sleepQuality}
                    onChange={setSleepQuality}
                    min={1}
                    max={5}
                    lowLabel="1 - Sering Terjaga / Gelisah"
                    highLabel="5 - Lelap & Segar"
                  />
                </div>
              </div>
            </div>
          )}

          {/* DIMENSI 5: Expression Analysis */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brown-700/70 block mb-1">
                  Dimensi 5: Curahan Bebas
                </span>
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-brown-900">
                  Ceritakan Apa Saja yang Sedang Kamu Rasakan
                </h1>
                <p className="mt-1 text-xs md:text-sm text-brown-700 leading-relaxed">
                  Tuliskan isi pikiranmu tanpa sensor. Jawabanmu dievaluasi secara privat untuk menyesuaikan nada empati pendampingmu.
                </p>
              </div>

              <div className="pt-2">
                <textarea
                  value={expressionText}
                  onChange={(e) => setExpressionText(e.target.value)}
                  placeholder="Ceritakan dengan bebas... (Contoh: Akhir-akhir ini aku merasa kewalahan dengan tugas dan butuh tempat rehat sejenak.)"
                  rows={4}
                  className="w-full rounded-2xl border border-brown-900/15 bg-white/90 p-4 text-xs md:text-sm text-brown-900 placeholder:text-brown-700/50 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/30"
                />
              </div>

              <div className="rounded-2xl border border-brown-900/10 bg-cream/70 p-4 text-xs text-brown-700">
                <div className="flex items-center gap-2 font-bold text-brown-900 mb-1">
                  <ShieldCheck className="h-4 w-4 text-orange-600" />
                  Jaminan Keselamatan & Privasi
                </div>
                Data ekspresi ini diproses secara aman untuk menjaga kesejahteraanmu dan tidak pernah dibagikan kepada pihak ketiga.
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-brown-900/10 pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={loading}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-brown-900/15 bg-white px-5 text-xs font-bold text-brown-900 hover:bg-brown-900/5 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Sebelumnya
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-orange-500 px-7 text-xs font-bold text-brown-900 shadow-sm hover:bg-orange-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 disabled:opacity-50"
            >
              {loading
                ? "Menyimpan Asesmen..."
                : step === totalSteps
                ? "Selesaikan & Buka Dashboard"
                : "Lanjutkan"}
              <ArrowRight className="h-4 w-4 stroke-[2]" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
