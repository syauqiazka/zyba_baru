"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, HeartHandshake, Sparkles, CheckCircle2 } from "lucide-react";
import { MoodLevel } from "@/generated/account-client";
import { MoodPebble } from "@/components/wellness/MoodPebble";
import { ChoiceCard, ScaleRating } from "@/components/wellness/ChoiceCard";
import { CrisisGateBanner } from "@/components/wellness/CrisisGateBanner";
import { detectRisk } from "@/lib/crisisDetection";
import { Mascot } from "@/components/ui/Mascot";

const ENERGY_OPTIONS = [
  "Segar",
  "Bugar",
  "Fokus",
  "Tenang",
  "Lemas",
  "Lelah",
  "Butuh Rebahan",
  "Mengantuk",
];

const SLEEP_HOURS_OPTIONS = [
  { value: "<5", label: "Kurang dari 5 jam" },
  { value: "5-6", label: "5 - 6 jam" },
  { value: "7-8", label: "7 - 8 jam (Optimal)" },
  { value: ">8", label: "Lebih dari 8 jam" },
];

const MEALS_OPTIONS = [
  { value: "Belum", label: "Belum teratur / sering terlewat" },
  { value: "Cukup", label: "Cukup teratur (1-2 kali bernutrisi)" },
  { value: "Sangat Teratur", label: "Sangat teratur (3 kali seimbang)" },
];

const ACTIVITY_OPTIONS = [
  { value: "Diam di Tempat", label: "Banyak rebahan / duduk seharian" },
  { value: "Jalan Santai", label: "Jalan santai / peregangan ringan" },
  { value: "Olahraga", label: "Olahraga bertenaga (lari, gym, sepedaan)" },
];

export default function MoodCheckInPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [alreadyCheckedInToday, setAlreadyCheckedInToday] = useState(false);
  const [existingCheckIn, setExistingCheckIn] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completed, setCompleted] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const currentHour = new Date().getHours();
    setIsNight(currentHour >= 21 || currentHour < 5);

    const checkStatus = async () => {
      try {
        const res = await fetch("/api/check-in");
        if (res.ok) {
          const data = await res.json();
          if (data.alreadyCheckedIn && data.todayCheckIn) {
            setAlreadyCheckedInToday(true);
            setExistingCheckIn(data.todayCheckIn);
            // Pre-fill form values in case user wants to update
            const ci = data.todayCheckIn;
            if (ci.mood) setMood(ci.mood);
            if (ci.stressLevel != null) setStressLevel(ci.stressLevel);
            if (ci.sleepRating != null) setSleepRating(ci.sleepRating);
            if (Array.isArray(ci.energyTags) && ci.energyTags.length > 0) setEnergyTags(ci.energyTags);
            if (ci.reflection) setReflection(ci.reflection);
            const ans = ci.answers || {};
            if (ans.anxiety != null) setAnxiety(ans.anxiety);
            if (ans.satisfaction != null) setSatisfaction(ans.satisfaction);
            if (ans.productivity != null) setProductivity(ans.productivity);
            if (ans.selfTime != null) setSelfTime(ans.selfTime);
            if (ans.sleepHours) setSleepHours(ans.sleepHours);
            if (ans.regularMeals) setRegularMeals(ans.regularMeals);
            if (ans.physicalActivity) setPhysicalActivity(ans.physicalActivity);
            if (ans.connection != null) setConnection(ans.connection);
            if (ans.supported != null) setSupported(ans.supported);
            if (ans.communityInteraction != null) setCommunityInteraction(ans.communityInteraction);
            if (ans.gratitude) setGratitude(ans.gratitude);
          }
        }
      } catch (err) {
        console.warn("Gagal memuat status check-in hari ini:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    checkStatus();
  }, []);

  // Form states - 15 Pertanyaan Terstruktur
  // Step 1: Mental I
  const [mood, setMood] = useState<MoodLevel>(MoodLevel.HAPPY);
  const [stressLevel, setStressLevel] = useState<number>(2);
  const [anxiety, setAnxiety] = useState<number>(2);

  // Step 2: Mental II
  const [satisfaction, setSatisfaction] = useState<number>(4);
  const [productivity, setProductivity] = useState<number>(3);
  const [selfTime, setSelfTime] = useState<number>(3);

  // Step 3: Fisik
  const [sleepRating, setSleepRating] = useState<number>(4);
  const [sleepHours, setSleepHours] = useState<string>("7-8");
  const [energyTags, setEnergyTags] = useState<string[]>(["Segar"]);

  // Step 4: Fisik & Sosial
  const [regularMeals, setRegularMeals] = useState<string>("Cukup");
  const [physicalActivity, setPhysicalActivity] = useState<string>("Jalan Santai");
  const [connection, setConnection] = useState<number>(4);
  const [supported, setSupported] = useState<number>(4);
  const [communityInteraction, setCommunityInteraction] = useState<number>(3);

  // Step 5: Refleksi & Syukur
  const [gratitude, setGratitude] = useState("");
  const [reflection, setReflection] = useState("");

  const toggleEnergyTag = (tag: string) => {
    setEnergyTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        mood,
        stressLevel,
        sleepRating,
        energyTags,
        reflection,
        answers: {
          anxiety,
          satisfaction,
          productivity,
          selfTime,
          sleepHours,
          regularMeals,
          physicalActivity,
          connection,
          supported,
          communityInteraction,
          gratitude,
        },
      };

      const res = await fetch("/api/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan check-in");
      }

      setResultData(data);
      setCompleted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  // Completion Screen
  if (completed && resultData) {
    const isFlagged = resultData.flaggedForRisk;
    const score = resultData.scoreResult?.zybaScore || 75;
    const breakdown = resultData.scoreResult || {};

    return (
      <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
        {/* Banner Krisis jika terdeteksi (AGENTS.md Bagian 7.2) */}
        {isFlagged && (
          <div className="mb-6">
            <CrisisGateBanner />
          </div>
        )}

        <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-6 md:p-10 shadow-sm text-center">
          <div className="mx-auto flex items-center justify-center mb-3">
            <Mascot pose="happy" size={130} animate={true} decorative={true} />
          </div>

          <span className="mt-2 inline-block text-xs font-semibold uppercase tracking-wider text-brown-700/70">
            Check-In Selesai
          </span>
          <h1 className="mt-1 font-serif text-2xl md:text-3xl font-bold text-brown-900">
            Terima Kasih Telah Hadir untuk Dirimu
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-brown-700 max-w-md mx-auto">
            Setiap catatan kecil membantumu mengenali ritme batin. Skor Zyba kamu diperbarui secara dinamis.
          </p>

          {/* Skor Card Ringkas */}
          <div className="mt-8 rounded-2xl border border-brown-900/10 bg-cream/50 p-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-brown-700">Skor Zyba Terkini</span>
                <div className="font-display text-3xl font-bold tracking-tight text-brown-900 tabular-nums">{score}</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-brown-700">Lilin Terjaga</span>
                <div className="flex items-center justify-end gap-1 font-display text-xl font-bold tracking-tight text-orange-950 tabular-nums">
                  <Sparkles className="h-4 w-4 text-orange-500" />
                  {resultData.streakDays || 1} Hari
                </div>
              </div>
            </div>

            {/* Sub-scores */}
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-brown-900/10 pt-4">
              <div>
                <span className="text-[11px] text-brown-700">Mental (50%)</span>
                <div className="font-display text-base font-bold text-brown-900 tabular-nums">{breakdown.mentalScore ?? 75}</div>
              </div>
              <div>
                <span className="text-[11px] text-brown-700">Fisik (25%)</span>
                <div className="font-display text-base font-bold text-brown-900 tabular-nums">{breakdown.physicalScore ?? 75}</div>
              </div>
              <div>
                <span className="text-[11px] text-brown-700">Sosial (25%)</span>
                <div className="font-display text-base font-bold text-brown-900 tabular-nums">{breakdown.socialScore ?? 75}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-[#3E7B54] px-8 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#346B48] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            >
              Kembali ke Dashboard
            </Link>
            <Link
              href="/companion"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-brown-900/15 bg-white px-6 text-sm font-semibold text-brown-900 hover:bg-brown-900/5 transition-all"
            >
              Ceritakan ke Companion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 1. Loading State saat inisialisasi
  if (initialLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Mascot pose="happy" size={90} animate={true} decorative={true} />
        <p className="mt-4 text-xs font-semibold text-brown-700/70">
          Mempersiapkan ruang hening batinmu...
        </p>
      </div>
    );
  }

  // 2. Layar "Sudah Check-In Hari Ini" jika user sudah menyelesaikan check-in tanggal ini
  if (alreadyCheckedInToday && !isEditing && existingCheckIn) {
    const todayMood = existingCheckIn.mood || "HAPPY";
    const moodLabels: Record<string, string> = {
      DEPRESSED: "Tertekan / Berat",
      SAD: "Sedih / Lemah",
      NEUTRAL: "Biasa / Netral",
      HAPPY: "Tenang & Stabil",
      OVERJOYED: "Gembira & Bersyukur",
    };

    return (
      <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">
        <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-6 md:p-10 shadow-sm text-center">
          <div className="mx-auto flex items-center justify-center mb-3">
            <Mascot pose="happy" size={130} animate={true} decorative={true} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF4EC] border border-[#C8E4CD] text-[#28583B] text-xs font-bold shadow-2xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Sudah Check-In Hari Ini ({existingCheckIn.date})</span>
          </div>

          <h1 className="mt-4 font-serif text-2xl md:text-3xl font-bold text-brown-900">
            Jeda Batinmu Hari Ini Sudah Tersimpan
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-brown-700 max-w-md mx-auto">
            Kamu sudah meluangkan waktu hadir untuk dirimu sendiri hari ini. Tidak perlu khawatir terlewat, catatan ritmemu aman di suaka ZYBA.
          </p>

          {/* Rangkuman Check-In Hari Ini */}
          <div className="mt-6 rounded-2xl border border-brown-900/8 bg-[#F5F8F5] p-5 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brown-900/8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/70 block">
                  Suasana Hati Terpilih
                </span>
                <span className="text-base font-bold text-brown-900">
                  {moodLabels[todayMood] || todayMood}
                </span>
              </div>
              <span className="px-3 py-1 rounded-xl bg-white border border-[#C8E4CD] shadow-2xs text-xs font-bold text-[#28583B]">
                ✓ Terverifikasi
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white border border-brown-900/5">
                <span className="text-[10px] text-brown-700/80 block">Tingkat Stres</span>
                <span className="font-display text-sm font-bold text-brown-900 tabular-nums">
                  Level {existingCheckIn.stressLevel ?? 2} / 5
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-brown-900/5">
                <span className="text-[10px] text-brown-700/80 block">Kualitas Tidur</span>
                <span className="font-display text-sm font-bold text-brown-900 tabular-nums">
                  Bintang {existingCheckIn.sleepRating ?? 4} / 5
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-brown-900/5 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-brown-700/80 block">Energi & Raga</span>
                <span className="text-xs font-bold text-brown-900 line-clamp-1">
                  {Array.isArray(existingCheckIn.energyTags) && existingCheckIn.energyTags.length > 0
                    ? existingCheckIn.energyTags.join(", ")
                    : "Segar"}
                </span>
              </div>
            </div>

            {existingCheckIn.reflection && (
              <div className="p-3 rounded-xl bg-white border border-brown-900/5 text-xs text-brown-700 italic">
                &ldquo;{existingCheckIn.reflection}&rdquo;
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#3E7B54] px-8 text-sm font-bold text-white shadow-xs transition-all hover:bg-[#346B48]"
            >
              Kembali ke Dashboard
            </Link>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-brown-900/15 bg-white px-6 text-xs font-bold text-brown-900 hover:bg-brown-900/5 transition-all"
            >
              Perbarui / Edit Check-In Hari Ini
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 md:py-10 pb-28 md:pb-12">
      {/* Banner Mode Pembaruan */}
      {isEditing && (
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 shadow-2xs">
          <span>
            <strong>Mode Pembaruan:</strong> Kamu sedang memperbarui catatan check-in batin hari ini.
          </span>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="font-bold underline text-amber-800 hover:text-amber-950 ml-2"
          >
            Batal
          </button>
        </div>
      )}
      {/* Top Navigation & Stepper */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brown-700 hover:text-brown-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
        <span className="text-xs font-semibold uppercase tracking-wider text-brown-700/70">
          Langkah {step} dari 5
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-brown-900/10">
        <div
          className="h-full bg-[#3E7B54] transition-all duration-300 ease-out"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-xl border border-brown-900/20 bg-orange-50 p-3.5 text-xs text-brown-900">
          {errorMsg}
        </div>
      )}

      {/* Step Container Card */}
      <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-6 md:p-8 shadow-sm">
        {/* STEP 1: Suasana Batin */}
        {step === 1 && (
          <div className="space-y-7">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brown-700/70">
                  Langkah 1: Suasana Batin
                </span>
                <h1 className="mt-1 font-serif text-2xl font-bold text-brown-900">
                  Bagaimana suasana hatimu saat ini?
                </h1>
                <p className="mt-1 text-xs text-brown-700">
                  {isNight
                    ? "Waktunya mengistirahatkan pikiran. Catat harimu dengan tenang."
                    : "Pilih yang paling mendekati perasaanmu hari ini tanpa ragu."}
                </p>
              </div>
              <div className="shrink-0 mx-auto sm:mx-0 flex items-center justify-center">
                <Mascot
                  pose={isNight ? "sleep" : "default"}
                  size={96}
                  animate={true}
                  decorative={true}
                />
              </div>
            </div>

            {/* Q1: Mood Pebbles */}
            <div>
              <label className="block text-xs font-semibold text-brown-900 mb-3">
                1. Mood Utama Hari Ini
              </label>
              <div className="grid grid-cols-5 gap-1 sm:gap-3 items-start justify-items-center">
                {Object.values(MoodLevel).map((lvl) => (
                  <MoodPebble
                    key={lvl}
                    mood={lvl}
                    selected={mood === lvl}
                    onSelect={(m) => setMood(m)}
                  />
                ))}
              </div>
            </div>

            {/* Q2: Stres */}
            <div className="border-t border-brown-900/10 pt-5">
              <label className="block text-xs font-semibold text-brown-900 mb-2">
                2. Tingkat Stres atau Beban Pikiran
              </label>
              <ScaleRating
                value={stressLevel}
                onChange={setStressLevel}
                min={1}
                max={5}
                lowLabel="1 - Sangat Tenang"
                highLabel="5 - Beban Sangat Berat"
              />
            </div>

            {/* Q3: Cemas */}
            <div className="border-t border-brown-900/10 pt-5">
              <label className="block text-xs font-semibold text-brown-900 mb-2">
                3. Rasa Cemas / Gelisah / Overthinking
              </label>
              <ScaleRating
                value={anxiety}
                onChange={setAnxiety}
                min={1}
                max={5}
                lowLabel="1 - Pikiran Terkendali"
                highLabel="5 - Sangat Gelisah"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Kepuasan & Diri */}
        {step === 2 && (
          <div className="space-y-7">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brown-700/70">
                Langkah 2: Kepuasan & Waktu Diri
              </span>
              <h1 className="mt-1 font-serif text-2xl font-bold text-brown-900">
                Bagaimana harimu berjalan?
              </h1>
              <p className="mt-1 text-xs text-brown-700">
                Menilai ritme pencapaian dan waktu jeda yang kamu luangkan.
              </p>
            </div>

            {/* Q4: Kepuasan */}
            <div>
              <label className="block text-xs font-semibold text-brown-900 mb-2">
                4. Kepuasan Umum Terhadap Hari Ini
              </label>
              <ScaleRating
                value={satisfaction}
                onChange={setSatisfaction}
                min={1}
                max={5}
                lowLabel="1 - Kurang Memuaskan"
                highLabel="5 - Sangat Memuaskan"
              />
            </div>

            {/* Q13: Produktivitas */}
            <div className="border-t border-brown-900/10 pt-5">
              <label className="block text-xs font-semibold text-brown-900 mb-2">
                5. Produktivitas yang Bermakna (bukan sekadar sibuk)
              </label>
              <ScaleRating
                value={productivity}
                onChange={setProductivity}
                min={1}
                max={5}
                lowLabel="1 - Buntu / Sulit Fokus"
                highLabel="5 - Mengalir & Selesai"
              />
            </div>

            {/* Q14: Waktu untuk Diri */}
            <div className="border-t border-brown-900/10 pt-5">
              <label className="block text-xs font-semibold text-brown-900 mb-2">
                6. Waktu Jeda untuk Diri Sendiri (Me-time)
              </label>
              <ScaleRating
                value={selfTime}
                onChange={setSelfTime}
                min={1}
                max={5}
                lowLabel="1 - Hampir Tidak Ada"
                highLabel="5 - Cukup & Memulihkan"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Raga & Istirahat */}
        {step === 3 && (
          <div className="space-y-7">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brown-700/70">
                Langkah 3: Raga & Istirahat
              </span>
              <h1 className="mt-1 font-serif text-2xl font-bold text-brown-900">
                Bagaimana kondisi fisikmu?
              </h1>
              <p className="mt-1 text-xs text-brown-700">
                Tubuh dan pikiran saling terhubung erat.
              </p>
            </div>

            {/* Q5: Kualitas Tidur */}
            <div>
              <label className="block text-xs font-semibold text-brown-900 mb-2">
                7. Kualitas Tidur Semalam
              </label>
              <ScaleRating
                value={sleepRating}
                onChange={setSleepRating}
                min={1}
                max={5}
                lowLabel="1 - Sering Terbangun / Buruk"
                highLabel="5 - Sangat Nyenyak & Segar"
              />
            </div>

            {/* Q6: Durasi Tidur */}
            <div className="border-t border-brown-900/10 pt-5">
              <label className="block text-xs font-semibold text-brown-900 mb-2">
                8. Durasi Tidur
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SLEEP_HOURS_OPTIONS.map((opt) => (
                  <ChoiceCard
                    key={opt.value}
                    label={opt.label}
                    selected={sleepHours === opt.value}
                    onSelect={() => setSleepHours(opt.value)}
                  />
                ))}
              </div>
            </div>

            {/* Q7: Energi Tags */}
            <div className="border-t border-brown-900/10 pt-5">
              <label className="block text-xs font-semibold text-brown-900 mb-2">
                9. Sensasi Energi yang Dirasakan (Boleh lebih dari satu)
              </label>
              <div className="flex flex-wrap gap-2">
                {ENERGY_OPTIONS.map((tag) => {
                  const isSel = energyTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleEnergyTag(tag)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                        isSel
                          ? "border-2 border-orange-500 bg-orange-100 text-brown-900 font-semibold"
                          : "border border-brown-900/10 bg-white text-brown-700 hover:border-orange-500/40"
                      }`}
                      aria-pressed={isSel}
                    >
                      {tag}
                      {isSel && <Check className="h-3 w-3 stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Rutinitas & Hubungan */}
        {step === 4 && (
          <div className="space-y-7">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brown-700/70">
                Langkah 4: Nutrisi & Hubungan
              </span>
              <h1 className="mt-1 font-serif text-2xl font-bold text-brown-900">
                Keterhubungan dengan Sekitar
              </h1>
              <p className="mt-1 text-xs text-brown-700">
                Melihat pola makan, gerak, dan rasa terhubung dengan manusia lain.
              </p>
            </div>

            {/* Q8: Makan */}
            <div>
              <label className="block text-xs font-semibold text-brown-900 mb-2">
                10. Keteraturan Pola Makan Hari Ini
              </label>
              <div className="space-y-2">
                {MEALS_OPTIONS.map((opt) => (
                  <ChoiceCard
                    key={opt.value}
                    label={opt.label}
                    selected={regularMeals === opt.value}
                    onSelect={() => setRegularMeals(opt.value)}
                  />
                ))}
              </div>
            </div>

            {/* Q9: Gerak */}
            <div className="border-t border-brown-900/10 pt-5">
              <label className="block text-xs font-semibold text-brown-900 mb-2">
                11. Aktivitas Fisik / Bergerak
              </label>
              <div className="space-y-2">
                {ACTIVITY_OPTIONS.map((opt) => (
                  <ChoiceCard
                    key={opt.value}
                    label={opt.label}
                    selected={physicalActivity === opt.value}
                    onSelect={() => setPhysicalActivity(opt.value)}
                  />
                ))}
              </div>
            </div>

            {/* Q10: Keterhubungan */}
            <div className="border-t border-brown-900/10 pt-5">
              <label className="block text-xs font-semibold text-brown-900 mb-2">
                12. Rasa Terhubung dengan Orang Lain
              </label>
              <ScaleRating
                value={connection}
                onChange={setConnection}
                min={1}
                max={5}
                lowLabel="1 - Merasa Terisolasi"
                highLabel="5 - Terhubung Erat"
              />
            </div>

            {/* Q11: Didukung */}
            <div className="border-t border-brown-900/10 pt-5">
              <label className="block text-xs font-semibold text-brown-900 mb-2">
                13. Merasa Didukung / Diterima
              </label>
              <ScaleRating
                value={supported}
                onChange={setSupported}
                min={1}
                max={5}
                lowLabel="1 - Sendirian"
                highLabel="5 - Sangat Didukung"
              />
            </div>

            {/* Q12: Interaksi */}
            <div className="border-t border-brown-900/10 pt-5">
              <label className="block text-xs font-semibold text-brown-900 mb-2">
                14. Interaksi Sosial yang Hangat / Menyenangkan
              </label>
              <ScaleRating
                value={communityInteraction}
                onChange={setCommunityInteraction}
                min={1}
                max={5}
                lowLabel="1 - Tidak Ada"
                highLabel="5 - Penuh Kehangatan"
              />
            </div>
          </div>
        )}

        {/* STEP 5: Syukur & Refleksi */}
        {step === 5 && (
          <div className="space-y-7">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brown-700/70">
                Langkah 5: Syukur & Ruang Bebas
              </span>
              <h1 className="mt-1 font-serif text-2xl font-bold text-brown-900">
                Luangkan Momen untuk Dirimu
              </h1>
              <p className="mt-1 text-xs text-brown-700">
                Tidak wajib, tetapi menuliskan hal kecil dapat menenangkan pikiran yang riuh.
              </p>
            </div>

            {/* Q15: Syukur */}
            <div>
              <label className="block text-xs font-semibold text-brown-900 mb-1.5">
                15. Satu hal kecil yang kamu syukuri hari ini (Opsional)
              </label>
              <p className="text-[11px] text-brown-700/70 mb-2">
                Misalnya: secangkir teh hangat, hembusan angin sore, atau sapaan ramah teman.
              </p>
              <textarea
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="Tuliskan di sini..."
                rows={3}
                className="w-full rounded-xl border border-brown-900/15 bg-white/90 p-3.5 text-sm text-brown-900 placeholder:text-brown-700/50 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            {/* Catatan Bebas */}
            <div className="border-t border-brown-900/10 pt-5">
              <label className="block text-xs font-semibold text-brown-900 mb-1.5">
                Catatan Bebas / Curahan Perasaan Hari Ini (Opsional)
              </label>
              <p className="text-[11px] text-brown-700/70 mb-2">
                Ruang ini aman dan privat untukmu.
              </p>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Ada yang ingin kamu simpan hari ini?"
                rows={3}
                className="w-full rounded-xl border border-brown-900/15 bg-white/90 p-3.5 text-sm text-brown-900 placeholder:text-brown-700/50 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>
        )}

        {/* Desktop Buttons */}
        <div className="mt-8 hidden md:flex items-center justify-between border-t border-brown-900/10 pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              disabled={loading}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-brown-900/15 bg-white px-5 text-xs font-semibold text-brown-900 hover:bg-brown-900/5 transition-colors disabled:opacity-50"
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
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#3E7B54] px-7 text-xs font-bold text-white shadow-sm hover:bg-[#346B48] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 disabled:opacity-50"
          >
            {loading
              ? "Menyimpan..."
              : step === 5
              ? "Selesaikan Check-In"
              : "Lanjutkan"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Sticky Navigation Pill */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-brown-900/10 bg-white/95 backdrop-blur-md p-3 px-4 md:hidden">
        <div className="flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              disabled={loading}
              className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl border border-brown-900/15 bg-white text-xs font-semibold text-brown-900 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="flex h-12 flex-1 items-center justify-center text-xs font-semibold text-brown-700"
            >
              Batal
            </Link>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className="flex h-12 flex-[2] items-center justify-center gap-1.5 rounded-xl bg-[#3E7B54] text-xs font-bold text-white shadow-sm disabled:opacity-50"
          >
            {loading
              ? "Menyimpan..."
              : step === 5
              ? "Selesai"
              : "Lanjut"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

