"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Wind,
  BookOpen,
  MessageCircle,
  Calendar,
  AlertCircle,
  Droplets,
  Flame,
  Heart,
  TrendingUp,
  Check,
} from "lucide-react";
import { HearthFlame } from "@/components/wellness/HearthFlame";
import { ZybaBloom } from "@/components/wellness/ZybaBloom";
import { BreathingOrb } from "@/components/wellness/BreathingOrb";
import { CrisisGateBanner } from "@/components/wellness/CrisisGateBanner";
import { BotanicalBanner } from "@/components/wellness/BotanicalBanner";
import { SanctuaryGarden } from "@/components/wellness/SanctuaryGarden";
import { RitualProgressCard } from "@/components/wellness/RitualProgressCard";
import { WeeklyRhythmBars } from "@/components/wellness/WeeklyRhythmBars";
import {
  KinaIllustration,
  OllieIllustration,
  RubiIllustration,
  BrunoIllustration,
} from "@/components/illustrations/PersonaIllustrations";
import { MoodLevel } from "@/generated/account-client";

interface DashboardData {
  user: {
    name: string;
    username?: string | null;
    avatarUrl?: string | null;
    companionPersona: "KINA" | "OLLIE" | "RUBI" | "BRUNO";
  };
  scoreData: {
    zybaScore: number;
    mentalScore: number;
    physicalScore: number;
    socialScore: number;
    stressLevel: number;
    hasEnoughData: boolean;
    sampleDaysCount: number;
  };
  hearthFlame: {
    litToday: boolean;
    streakDays: number;
    lastCheckInDate?: string | null;
  };
  todayChecklist: {
    checkInDone: boolean;
    activityDone: boolean;
    journalDone: boolean;
  };
  recentCheckIns: Array<{
    date: string;
    mood: MoodLevel;
    score?: number | null;
    flaggedForRisk?: boolean;
  }>;
  crisisAlert: boolean;
}

function PersonaAvatar({ persona, className = "h-12 w-12" }: { persona: string; className?: string }) {
  switch (persona) {
    case "OLLIE":
      return <OllieIllustration className={className} />;
    case "RUBI":
      return <RubiIllustration className={className} />;
    case "BRUNO":
      return <BrunoIllustration className={className} />;
    case "KINA":
    default:
      return <KinaIllustration className={className} />;
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showQuickBreathe, setShowQuickBreathe] = useState(false);
  const [gardenWatered, setGardenWatered] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const res = await fetch("/api/dashboard", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Gagal mengambil ringkasan dashboard");
        }
        const json = await res.json();
        if (isMounted) {
          setData(json);
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorMsg(err.message || "Koneksi terganggu.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 animate-pulse space-y-6">
        <div className="h-44 rounded-3xl bg-brown-900/10" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-24 rounded-2xl bg-brown-900/5" />
          <div className="h-24 rounded-2xl bg-brown-900/5" />
          <div className="h-24 rounded-2xl bg-brown-900/5" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-64 rounded-3xl bg-brown-900/5" />
            <div className="h-64 rounded-3xl bg-brown-900/5" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-44 rounded-3xl bg-brown-900/5" />
            <div className="h-44 rounded-3xl bg-brown-900/5" />
          </div>
        </div>
      </div>
    );
  }

  const user = data?.user || { name: "Teman ZYBA", companionPersona: "KINA" as const };
  const scoreData = data?.scoreData || {
    zybaScore: 50,
    mentalScore: 50,
    physicalScore: 50,
    socialScore: 50,
    stressLevel: 2,
    hasEnoughData: false,
    sampleDaysCount: 0,
  };
  const hearthFlame = data?.hearthFlame || { litToday: false, streakDays: 0 };
  const todayChecklist = data?.todayChecklist || {
    checkInDone: false,
    activityDone: false,
    journalDone: false,
  };
  const recentCheckIns = data?.recentCheckIns || [];
  const crisisAlert = data?.crisisAlert || false;

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-10">
      {/* Banner Krisis Tenang jika terdeteksi */}
      {crisisAlert && <CrisisGateBanner />}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-brown-900/15 bg-white p-4 text-xs text-brown-900">
          <AlertCircle className="h-4 w-4 text-orange-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Botanical Sanctuary Banner (Inspired by Ref 1) */}
      <BotanicalBanner
        userName={user.name}
        onQuickBreathe={() => setShowQuickBreathe(!showQuickBreathe)}
      />

      {/* Quick Mindful Breathing Modal / Card */}
      {showQuickBreathe && (
        <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-50/80 to-white/95 p-6 md:p-8 shadow-sm text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brown-700/70 block mb-2">
            Latihan Nafas Cepat (4-4-6)
          </span>
          <BreathingOrb size="md" />
        </div>
      )}

      {/* 2. Top 3 Quick-Stat Pastel Cards (Inspired by Ref 1 & 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Ritual Selesai */}
        <div className="relative overflow-hidden rounded-2xl border border-brown-900/10 bg-[#EBF3EC] p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/80">
                Langkah Selesai
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-emerald-950">
                  {todayChecklist.checkInDone ? "3" : "2"}
                </span>
                <span className="text-xs font-semibold text-emerald-800/70">
                  dari 5 ritual hari ini
                </span>
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-emerald-700 shadow-xs">
              <Check className="h-5 w-5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Card 2: Keseimbangan Batin (Zyba Score) */}
        <div className="relative overflow-hidden rounded-2xl border border-brown-900/10 bg-[#FDF2EC] p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-800/80">
                Skor Harmoni
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-orange-950">
                  {scoreData.zybaScore}
                </span>
                <span className="text-xs font-semibold text-orange-800/70">
                  {scoreData.hasEnoughData ? "Kondisi Stabil" : "Nilai Awal"}
                </span>
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-orange-600 shadow-xs">
              <Sparkles className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
        </div>

        {/* Card 3: Kehangatan Diri (Hearth Flame) */}
        <div className="relative overflow-hidden rounded-2xl border border-brown-900/10 bg-[#F7F3EB] p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800/80">
                Kehangatan Diri
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-950">
                  {hearthFlame.litToday ? "Menyala" : "Teduh"}
                </span>
                <span className="text-xs font-semibold text-amber-800/70">
                  {hearthFlame.streakDays > 0 ? `${hearthFlame.streakDays} hari hadir` : "Siap dinyalakan"}
                </span>
              </div>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-amber-700 shadow-xs">
              <Flame className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Bento Sanctuary Grid (65:35 Asymmetrical Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Kolom Kiri: 65% (8/12 cols) */}
        <div className="lg:col-span-8 space-y-7">
          {/* Card The Living Zyba Bloom */}
          <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-6 md:p-8 shadow-[0_4px_24px_rgba(44,34,30,0.03)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brown-900/10 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brown-700/70">
                  Keseimbangan Menyeluruh
                </span>
                <h2 className="font-serif text-xl md:text-2xl font-bold text-brown-900">
                  The Living Zyba Bloom
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-sand-200/80 px-2.5 py-1 text-[11px] font-bold text-brown-900">
                  {scoreData.hasEnoughData ? "7 Hari Terakhir" : "Data Awal"}
                </span>
              </div>
            </div>

            {/* Living Radial Blossom Visual */}
            <div className="py-2">
              <ZybaBloom
                score={scoreData.zybaScore}
                mentalScore={scoreData.mentalScore}
                physicalScore={scoreData.physicalScore}
                socialScore={scoreData.socialScore}
                hasEnoughData={scoreData.hasEnoughData}
              />
            </div>

            {!scoreData.hasEnoughData ? (
              <div className="mt-6 rounded-2xl border border-brown-900/10 bg-cream/70 p-4 text-xs text-brown-700 leading-relaxed text-center sm:text-left">
                <span className="font-bold text-brown-900">Belum cukup data — </span>
                Skor di atas adalah nilai awal netral. Lakukan check-in harian beberapa hari ke depan untuk membentuk kurva mekar yang akurat bagi dirimu.
              </div>
            ) : (
              <p className="mt-6 text-xs text-brown-700/80 text-center leading-relaxed">
                Kelopak mekar secara dinamis dari perpaduan kondisi mental (50%), kebugaran fisik (25%), dan keterhubungan sosial (25%).
              </p>
            )}
          </div>

          {/* Ritual & Kebiasaan Sadar Hari Ini (Goals & Scheduled Habits - Ref 1 & 3) */}
          <RitualProgressCard />

          {/* Weekly Rhythm Bars (Ref 1 & 3) */}
          <WeeklyRhythmBars />
        </div>

        {/* Kolom Kanan: 35% (4/12 cols) */}
        <div className="lg:col-span-4 space-y-7">
          {/* Taman Batin (Plant Your Progress - Ref 1) */}
          <SanctuaryGarden
            daysWatered={todayChecklist.checkInDone || gardenWatered ? 5 : 4}
            totalGoal={7}
            isWateredToday={todayChecklist.checkInDone || gardenWatered}
            onWater={() => setGardenWatered(true)}
          />

          {/* Hearth Flame Sanctuary Card */}
          <HearthFlame
            litToday={hearthFlame.litToday}
            streakDays={hearthFlame.streakDays}
          />

          {/* Zyba Companion Conversational Card */}
          <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-6 shadow-[0_4px_24px_rgba(44,34,30,0.03)]">
            <div className="flex items-center gap-3.5 mb-4">
              <PersonaAvatar
                persona={user.companionPersona}
                className="h-12 w-12"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brown-700/70">
                  Zyba Companion
                </span>
                <h3 className="font-serif text-base font-bold text-brown-900">
                  {user.companionPersona === "KINA"
                    ? "Kina Siap Mendengar"
                    : user.companionPersona === "OLLIE"
                    ? "Ollie Siap Berdiskusi"
                    : user.companionPersona === "RUBI"
                    ? "Rubi Teman Ceritamu"
                    : "Bruno Bersamamu"}
                </h3>
              </div>
            </div>

            <p className="text-xs text-brown-700 leading-relaxed mb-4">
              Ada pikiran yang membebani? Companion AI hadir 24/7 mendampingimu dengan empati penuh tanpa menghakimi.
            </p>

            {/* Conversational Prompt Chips */}
            <div className="flex flex-col gap-2">
              <Link
                href="/companion"
                className="rounded-xl border border-brown-900/10 bg-cream/50 p-2.5 text-xs text-brown-900 hover:border-orange-500/40 hover:bg-orange-500/[0.04] transition-all"
              >
                "Aku merasa agak cemas hari ini..."
              </Link>
              <Link
                href="/companion"
                className="rounded-xl border border-brown-900/10 bg-cream/50 p-2.5 text-xs text-brown-900 hover:border-orange-500/40 hover:bg-orange-500/[0.04] transition-all"
              >
                "Bantu aku mengurai benang kusut prioritasku..."
              </Link>
            </div>

            <Link
              href="/companion"
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-xs font-bold text-brown-900 shadow-xs hover:bg-orange-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
            >
              <MessageCircle className="h-4 w-4" />
              Buka Percakapan
            </Link>
          </div>

          {/* Wawasan Sehat Shortcut */}
          <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-6 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-brown-700/70">
              Wawasan Sehat
            </span>
            <h3 className="mt-0.5 font-serif text-base font-bold text-brown-900">
              Mengenali Burnout & Batasan Diri
            </h3>
            <p className="mt-2 text-xs text-brown-700 leading-relaxed">
              Artikel ilmiah yang dikemas ringan untuk Gen Z Indonesia. Bebas dari istilah rumit.
            </p>

            <Link
              href="/resources"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-brown-900 hover:text-orange-600 transition-colors"
            >
              Jelajahi Wawasan Gratis
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
