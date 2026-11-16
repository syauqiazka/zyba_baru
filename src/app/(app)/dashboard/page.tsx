"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { CrisisGateBanner } from "@/components/wellness/CrisisGateBanner";
import { SketchHeaderCard } from "@/components/wellness/SketchHeaderCard";
import { DailyChecklistCard } from "@/components/wellness/DailyChecklistCard";
import { MonthlyTrackerCard } from "@/components/wellness/MonthlyTrackerCard";
import { RecommendedCarousel } from "@/components/wellness/RecommendedCarousel";
import { BreathingOrb } from "@/components/wellness/BreathingOrb";
import { HearthFlame } from "@/components/wellness/HearthFlame";
import { MoodLevel } from "@/generated/account-client";

interface DashboardData {
  user: {
    name: string;
    username?: string | null;
    avatarUrl?: string | null;
    companionPersona?: string;
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
  trackerData?: {
    monthly: Array<{ month: string; val: number; checkInsCount?: number; active: boolean }>;
    weekly: Array<{ day: string; date: string; val: number; active: boolean }>;
    weeklyCheckedCount: number;
    currentMonthRate: number;
    currentMonthName?: string;
    year?: string;
  };
  recentCheckIns: Array<{
    date: string;
    mood: MoodLevel;
    score?: number | null;
    flaggedForRisk?: boolean;
  }>;
  crisisAlert: boolean;
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

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 rounded-3xl bg-brown-900/10" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 rounded-3xl bg-brown-900/5" />
          <div className="h-80 rounded-3xl bg-brown-900/5" />
        </div>
        <div className="h-32 rounded-3xl bg-brown-900/5" />
      </div>
    );
  }

  const user = data?.user || { name: "Teman ZYBA", companionPersona: "ZIBI" };
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
  const crisisAlert = data?.crisisAlert || false;

  return (
    <div className="space-y-7 pb-10">
      {/* Banner Krisis Tenang jika terdeteksi */}
      {crisisAlert && <CrisisGateBanner />}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-brown-900/15 bg-white p-4 text-xs text-brown-900">
          <AlertCircle className="h-4 w-4 text-orange-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. TOP HEADER BANNER (Persis Sketsa User: Avatar Sapaan + Kehadiran Streak + Check-in Mood Harian + 4 Metrik) */}
      <SketchHeaderCard
        userName={user.name}
        avatarUrl={user.avatarUrl}
        companionPersona={user.companionPersona}
        zybaScore={scoreData.zybaScore}
        sleepScore={scoreData.physicalScore}
        stressLevel={scoreData.stressLevel || 2}
        streakDays={hearthFlame.streakDays || 0}
        litToday={hearthFlame.litToday}
        onQuickBreathe={() => setShowQuickBreathe(!showQuickBreathe)}
      />

      {/* Quick Mindful Breathing Modal */}
      {showQuickBreathe && (
        <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-b from-orange-50/80 to-white/95 p-6 md:p-8 shadow-sm text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brown-700/70 block mb-2">
            Latihan Nafas Cepat (4-4-6)
          </span>
          <BreathingOrb size="md" />
        </div>
      )}

      {/* Hearth Flame Konsistensi Batin (Tampil di desktop/tablet; di mobile sudah terwakili di SketchHeader) */}
      <div className="hidden md:block">
        <HearthFlame
          litToday={hearthFlame.litToday}
          streakDays={hearthFlame.streakDays || 0}
        />
      </div>

      {/* 2. MIDDLE SECTION: 2 Kolom (Checklist Harian di kiri, Monthly Tracker di kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Kolom Kiri: Checklist Harian Riil & Interaktif */}
        <div className="lg:col-span-6">
          <DailyChecklistCard
            initialCheckInDone={todayChecklist.checkInDone}
            activityDone={todayChecklist.activityDone}
            journalDone={todayChecklist.journalDone}
          />
        </div>

        {/* Kolom Kanan: Monthly / Weekly Tracker Riil */}
        <div className="lg:col-span-6">
          <MonthlyTrackerCard trackerData={data?.trackerData} />
        </div>
      </div>

      {/* 3. BOTTOM SECTION: Recommended for you (Persis Sketsa User: Baris kartu berpanah ->) */}
      <div className="pt-2">
        <RecommendedCarousel />
      </div>
    </div>
  );
}
