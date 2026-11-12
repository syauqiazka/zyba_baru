"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
  Wind,
  BookOpen,
  MessageCircle,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Heart,
  Smile,
} from "lucide-react";
import { HearthFlame } from "@/components/wellness/HearthFlame";
import { ZybaBloom } from "@/components/wellness/ZybaBloom";
import { BreathingOrb } from "@/components/wellness/BreathingOrb";
import { CrisisGateBanner } from "@/components/wellness/CrisisGateBanner";
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

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return "Selamat pagi";
  if (hour >= 11 && hour < 15) return "Selamat siang";
  if (hour >= 15 && hour < 18) return "Selamat sore";
  return "Selamat malam";
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

  const greeting = getTimeGreeting();

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 animate-pulse">
        <div className="h-9 w-72 rounded-2xl bg-brown-900/10 mb-3" />
        <div className="h-4 w-96 rounded-lg bg-brown-900/5 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-64 rounded-3xl bg-brown-900/5" />
            <div className="h-52 rounded-3xl bg-brown-900/5" />
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
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Banner Krisis Tenang jika terdeteksi */}
      {crisisAlert && <CrisisGateBanner />}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-brown-900/15 bg-white p-4 text-xs text-brown-900">
          <AlertCircle className="h-4 w-4 text-orange-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Top Ambient Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brown-900/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-100/60 px-3 py-1 text-xs font-bold text-orange-950 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-orange-600" />
            Ruang Kendali Diri
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-brown-900">
            {greeting}, {user.name}
          </h1>
          <p className="mt-1 text-xs md:text-sm text-brown-700 leading-relaxed max-w-xl">
            Selamat datang kembali di tempat perlindungan batinmu. Luangkan waktu untuk merasakan ritme hari ini.
          </p>
        </div>

        {/* Quick Mindful Breathing Toggle */}
        <button
          type="button"
          onClick={() => setShowQuickBreathe(!showQuickBreathe)}
          className="inline-flex items-center gap-2 rounded-xl border border-brown-900/15 bg-white/90 px-4 py-2.5 text-xs font-bold text-brown-900 shadow-xs hover:border-orange-500/40 hover:bg-white transition-all self-start md:self-auto"
        >
          <Wind className="h-4 w-4 text-orange-600" />
          {showQuickBreathe ? "Tutup Latihan Nafas" : "Tarik Nafas 1 Menit"}
        </button>
      </div>

      {/* Quick Breathing Orb Overlay Card */}
      {showQuickBreathe && (
        <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-50/80 to-white/95 p-6 md:p-8 shadow-sm text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brown-700/70 block mb-2">
            Latihan Nafas Cepat
          </span>
          <BreathingOrb size="md" />
        </div>
      )}

      {/* Main Sanctuary Grid (65:35 Asimetris) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: 65% (8/12 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card The Living Zyba Bloom */}
          <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-6 md:p-8 shadow-[0_4px_24px_rgba(44,34,30,0.04)]">
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

          {/* Daily Tactile Mindful Rituals */}
          <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-6 md:p-8 shadow-[0_4px_24px_rgba(44,34,30,0.04)]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brown-700/70">
                  Ritual Sadar Hari Ini
                </span>
                <h3 className="font-serif text-lg font-bold text-brown-900">
                  Langkah Kecil Pemulihan
                </h3>
              </div>
              <span className="text-xs text-brown-700/70 font-medium">Tanpa tekanan</span>
            </div>

            <div className="space-y-3">
              {/* Item 1: Check-In */}
              <Link
                href="/mood-check-in"
                className={`flex items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${
                  todayChecklist.checkInDone
                    ? "border-orange-500/30 bg-orange-50/60"
                    : "border-brown-900/10 bg-white hover:border-orange-500/40 hover:bg-orange-500/[0.03]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      todayChecklist.checkInDone
                        ? "bg-orange-500 text-brown-900 shadow-xs"
                        : "bg-brown-900/5 text-brown-700"
                    }`}
                  >
                    {todayChecklist.checkInDone ? (
                      <CheckCircle2 className="h-5 w-5 stroke-[2]" />
                    ) : (
                      <Smile className="h-5 w-5 stroke-[1.8]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brown-900">
                      Check-In Harian (15 Pertanyaan)
                    </h4>
                    <p className="text-xs text-brown-700">
                      {todayChecklist.checkInDone
                        ? "Sudah diisi hari ini. Lilin kehangatanmu menyala."
                        : "Luangkan 2 menit untuk mendengar kabar dirimu."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-brown-900">
                  {todayChecklist.checkInDone ? "Lihat Catatan" : "Mulai"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>

              {/* Item 2: Breathing Garden */}
              <Link
                href="/activity"
                className={`flex items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${
                  todayChecklist.activityDone
                    ? "border-orange-500/30 bg-orange-50/60"
                    : "border-brown-900/10 bg-white hover:border-orange-500/40 hover:bg-orange-500/[0.03]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      todayChecklist.activityDone
                        ? "bg-orange-500 text-brown-900 shadow-xs"
                        : "bg-brown-900/5 text-brown-700"
                    }`}
                  >
                    {todayChecklist.activityDone ? (
                      <CheckCircle2 className="h-5 w-5 stroke-[2]" />
                    ) : (
                      <Wind className="h-5 w-5 stroke-[1.8]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brown-900">
                      Breathing Garden (Ritme 4-7-8)
                    </h4>
                    <p className="text-xs text-brown-700">
                      Tarik nafas 4 detik, tahan 7 detik, hembuskan perlahan 8 detik.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-brown-900">
                  {todayChecklist.activityDone ? "Ulangi" : "Bernafas"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>

              {/* Item 3: Ruang Sehat */}
              <Link
                href="/wellness-journey"
                className={`flex items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${
                  todayChecklist.journalDone
                    ? "border-orange-500/30 bg-orange-50/60"
                    : "border-brown-900/10 bg-white hover:border-orange-500/40 hover:bg-orange-500/[0.03]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      todayChecklist.journalDone
                        ? "bg-orange-500 text-brown-900 shadow-xs"
                        : "bg-brown-900/5 text-brown-700"
                    }`}
                  >
                    {todayChecklist.journalDone ? (
                      <CheckCircle2 className="h-5 w-5 stroke-[2]" />
                    ) : (
                      <BookOpen className="h-5 w-5 stroke-[1.8]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brown-900">
                      Jurnal Ruang Sehat
                    </h4>
                    <p className="text-xs text-brown-700">
                      Tuliskan pikiran bebas tanpa takut dihakimi siapa pun.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-brown-900">
                  {todayChecklist.journalDone ? "Buka Jurnal" : "Tulis"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </div>
          </div>

          {/* Jejak Emosi 7 Hari Terakhir */}
          {recentCheckIns.length > 0 && (
            <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-brown-700" />
                  <h3 className="font-serif text-base font-bold text-brown-900">
                    Jejak Emosi Terakhir
                  </h3>
                </div>
                <Link
                  href="/wellness-journey"
                  className="text-xs font-bold text-brown-700 hover:text-brown-900"
                >
                  Lihat Selengkapnya →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {recentCheckIns.map((ci) => (
                  <div
                    key={ci.date}
                    className="rounded-2xl border border-brown-900/10 bg-cream/40 p-3 text-center"
                  >
                    <span className="text-[11px] text-brown-700 block font-medium">
                      {ci.date}
                    </span>
                    <span className="mt-1 inline-block text-xs font-bold text-brown-900">
                      {ci.mood}
                    </span>
                    {ci.score && (
                      <span className="mt-0.5 block text-[10px] text-brown-700/70">
                        Skor: {ci.score}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan: 35% (4/12 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Hearth Flame Sanctuary Card */}
          <HearthFlame
            litToday={hearthFlame.litToday}
            streakDays={hearthFlame.streakDays}
          />

          {/* Zyba Companion Conversational Card */}
          <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-6 shadow-[0_4px_24px_rgba(44,34,30,0.04)]">
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
              Ada pikiran yang membebani? Companion AI hadir 24/7 mendampingimu dengan empati penuh.
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
                "Bantu aku mengurai prioritasku..."
              </Link>
            </div>

            <Link
              href="/companion"
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-xs font-bold text-brown-900 shadow-sm hover:bg-orange-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
            >
              <MessageCircle className="h-4 w-4" />
              Buka Percakapan
            </Link>
          </div>

          {/* Wawasan Sehat Shortcut */}
          <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-6 shadow-sm">
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
