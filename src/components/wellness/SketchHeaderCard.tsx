"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Sparkles,
  Moon,
  ShieldCheck,
  MessageCircle,
  Wind,
} from "lucide-react";
import {
  KinaIllustration,
  OllieIllustration,
  RubiIllustration,
  BrunoIllustration,
} from "@/components/illustrations/PersonaIllustrations";

interface SketchHeaderCardProps {
  userName: string;
  avatarUrl?: string | null;
  companionPersona: "KINA" | "OLLIE" | "RUBI" | "BRUNO";
  zybaScore: number;
  sleepScore?: number;
  stressLevel?: number;
  streakDays: number;
  litToday: boolean;
  onQuickBreathe?: () => void;
}

function PersonaMiniAvatar({ persona }: { persona: string }) {
  switch (persona) {
    case "OLLIE":
      return <OllieIllustration className="h-6 w-6" />;
    case "RUBI":
      return <RubiIllustration className="h-6 w-6" />;
    case "BRUNO":
      return <BrunoIllustration className="h-6 w-6" />;
    case "KINA":
    default:
      return <KinaIllustration className="h-6 w-6" />;
  }
}

export function SketchHeaderCard({
  userName,
  avatarUrl,
  companionPersona,
  zybaScore,
  sleepScore = 85,
  stressLevel = 2,
  streakDays,
  litToday,
  onQuickBreathe,
}: SketchHeaderCardProps) {
  const hour = new Date().getHours();
  const greeting =
    hour >= 4 && hour < 11
      ? "Selamat pagi"
      : hour >= 11 && hour < 15
      ? "Selamat siang"
      : hour >= 15 && hour < 18
      ? "Selamat sore"
      : "Selamat malam";

  const personaName =
    companionPersona === "OLLIE"
      ? "Ollie"
      : companionPersona === "RUBI"
      ? "Rubi"
      : companionPersona === "BRUNO"
      ? "Bruno"
      : "Kina";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-brown-900/10 bg-gradient-to-br from-[#F5F8F4] via-cream to-[#FDF8F3] p-5 sm:p-7 shadow-[0_4px_24px_rgba(44,34,30,0.04)]">
      {/* Subtle Botanical Leaf Accent (Inspired by Habitdo & Ref 1) */}
      <svg
        className="pointer-events-none absolute -right-4 -top-8 h-48 w-72 text-[#8EA888]/15 sm:h-56 sm:w-80"
        viewBox="0 0 300 200"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M300,0 C220,30 200,100 220,160 C240,110 270,50 300,0 Z" />
        <path d="M260,0 C190,40 170,110 180,180 C200,120 230,60 260,0 Z" opacity="0.7" />
        <ellipse cx="160" cy="140" rx="28" ry="12" transform="rotate(-30 160 140)" opacity="0.6" />
      </svg>

      <div className="relative z-10 space-y-6">
        {/* ROW 1: Sapaan Avatar + Kehadiran Streak + Tombol Check-in Mood Harian (Sesuai Sketsa User) */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Avatar + Sapaan */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 border border-orange-200 text-orange-950 font-serif text-xl sm:text-2xl font-black shadow-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-brown-900">
                  {greeting}, <span className="text-orange-600">{userName}</span>!
                </h1>
              </div>
              <p className="text-xs text-brown-700/80 leading-snug mt-0.5">
                Luangkan sejenak waktu untuk merasakan ritme batinmu hari ini.
              </p>
            </div>
          </div>

          {/* Kehadiran & Tombol CTA Check-in Mood Harian */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Kehadiran Box (Sesuai Tulisan Sketsa: "Kehadiran Streak") */}
            <div className="flex items-center gap-2.5 rounded-2xl border border-brown-900/10 bg-white/85 px-4 py-2.5 shadow-2xs backdrop-blur-xs">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  litToday ? "bg-amber-100 text-amber-800" : "bg-brown-900/5 text-brown-700"
                }`}
              >
                <Flame className={`h-4 w-4 stroke-[2.2] ${litToday ? "fill-amber-500 text-amber-600" : ""}`} />
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-brown-700/70">
                  Kehadiran Batin
                </span>
                <span className="block text-xs font-bold text-brown-900">
                  {streakDays > 0 ? `${streakDays} Hari Terjaga` : "Nyalakan Hari Ini"}
                </span>
              </div>
            </div>

            {/* Tombol "Check-in Mood Harian ->" (Sesuai Sketsa User) */}
            <Link
              href="/mood-check-in"
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-orange-500 px-5 text-xs font-bold text-brown-900 shadow-xs hover:bg-orange-600 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
            >
              <Sparkles className="h-4 w-4 stroke-[2]" />
              <span>Check-in Mood Harian</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* ROW 2: Baris 4 Kartu Metrik (Skor Kesejahteraan, Kualitas Tidur, Tingkat Stres, Curhat ke Kina ->) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-1 border-t border-brown-900/8">
          {/* 1. Skor Kesejahteraan (Zyba Score) */}
          <div className="rounded-2xl border border-brown-900/10 bg-white/90 p-3.5 sm:p-4 shadow-2xs transition-all hover:bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-brown-700/75 uppercase tracking-wide">
                Skor Kesejahteraan
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-700">
                <Sparkles className="h-3.5 w-3.5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-extrabold text-brown-900">
                {zybaScore}
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                Harmonis
              </span>
            </div>
            <span className="text-[10px] text-brown-700/60 block mt-0.5">
              Skor menyeluruh ZYBA
            </span>
          </div>

          {/* 2. Skor Kualitas Tidur */}
          <div className="rounded-2xl border border-brown-900/10 bg-white/90 p-3.5 sm:p-4 shadow-2xs transition-all hover:bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-brown-700/75 uppercase tracking-wide">
                Kualitas Tidur
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                <Moon className="h-3.5 w-3.5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-extrabold text-brown-900">
                {sleepScore}%
              </span>
              <span className="text-[10px] font-semibold text-sky-800 bg-sky-50 px-1.5 py-0.2 rounded-md">
                7.5 Jam
              </span>
            </div>
            <span className="text-[10px] text-brown-700/60 block mt-0.5">
              Istirahat malam pulih
            </span>
          </div>

          {/* 3. Tingkat Stress */}
          <div className="rounded-2xl border border-brown-900/10 bg-white/90 p-3.5 sm:p-4 shadow-2xs transition-all hover:bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-brown-700/75 uppercase tracking-wide">
                Tingkat Stres
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-extrabold text-brown-900">
                Level {stressLevel}
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                Terkendali
              </span>
            </div>
            <span className="text-[10px] text-brown-700/60 block mt-0.5">
              Beban pikiran ringan
            </span>
          </div>

          {/* 4. Curhat ke Kina -> (Sesuai Sketsa User) */}
          <Link
            href="/companion"
            className="group rounded-2xl border border-orange-500/30 bg-[#FDF2EC] p-3.5 sm:p-4 shadow-2xs transition-all hover:bg-orange-100/70 hover:border-orange-500/50 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-orange-950 uppercase tracking-wide">
                Curhat ke {personaName}
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/80 text-orange-600 shadow-2xs group-hover:scale-105 transition-transform">
                <PersonaMiniAvatar persona={companionPersona} />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-orange-900">
                Teman Mendengar
              </span>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-brown-900 shadow-2xs group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
            </div>
            <span className="text-[10px] text-orange-950/70 block mt-0.5">
              Hadir 24/7 tanpa menghakimi
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

