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
  Check,
} from "lucide-react";
import { Mascot } from "@/components/ui/Mascot";

interface SketchHeaderCardProps {
  userName: string;
  avatarUrl?: string | null;
  companionPersona?: string;
  zybaScore: number;
  sleepScore?: number;
  stressLevel?: number;
  streakDays: number;
  litToday: boolean;
  onQuickBreathe?: () => void;
}

function PersonaMiniAvatar({ persona }: { persona?: string } = {}) {
  return <Mascot pose="default" size={24} animate={false} decorative={true} />;
}

export function SketchHeaderCard({
  userName,
  companionPersona,
  zybaScore,
  sleepScore = 85,
  stressLevel = 2,
  streakDays,
  litToday,
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

  const personaName = "Zibi";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-brown-900/8 bg-white p-4 sm:p-7 shadow-[0_4px_24px_rgba(27,36,30,0.03)]">
      {/* Subtle Botanical Leaf Accent */}
      <svg
        className="pointer-events-none absolute -right-4 -top-8 h-40 w-60 sm:h-56 sm:w-80 text-[#3E7B54]/10 overflow-hidden"
        viewBox="0 0 300 200"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M300,0 C220,30 200,100 220,160 C240,110 270,50 300,0 Z" />
        <path d="M260,0 C190,40 170,110 180,180 C200,120 230,60 260,0 Z" opacity="0.7" />
        <ellipse cx="160" cy="140" rx="28" ry="12" transform="rotate(-30 160 140)" opacity="0.6" />
      </svg>

      <div className="relative z-10 space-y-5 sm:space-y-6">
        {/* ROW 1: Sapaan Avatar + Kehadiran Streak + Tombol Check-in Mood Harian */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Avatar + Sapaan */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF4EC] border border-[#C8E4CD] text-[#28583B] font-display text-lg sm:text-2xl font-black shadow-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-brown-900">
                  {greeting}, <span className="text-[#3E7B54]">{userName}</span>!
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs text-brown-700 leading-snug mt-0.5">
                Luangkan sejenak waktu untuk merasakan ritme batinmu hari ini.
              </p>
            </div>
          </div>

          {/* Kehadiran & Tombol CTA Check-in Mood Harian */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            {/* Kehadiran Box */}
            <div className="flex items-center gap-2.5 rounded-2xl border border-brown-900/8 bg-[#F5F8F5] px-3.5 py-2 sm:px-4 sm:py-2.5 shadow-2xs">
              <div
                className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl ${
                  litToday ? "bg-amber-100 text-amber-800" : "bg-brown-900/5 text-brown-700"
                }`}
              >
                <Flame className={`h-4 w-4 stroke-[2.2] ${litToday ? "fill-amber-500 text-amber-600" : ""}`} />
              </div>
              <div>
                <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-brown-700/80">
                  Kehadiran Batin
                </span>
                <span className="block text-xs font-bold text-brown-900">
                  {streakDays > 0 ? `${streakDays} Hari Terjaga` : "Nyalakan Hari Ini"}
                </span>
              </div>
            </div>

            {/* Tombol Check-in Mood Harian */}
            <Link
              href="/mood-check-in"
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-xs font-bold shadow-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 w-full sm:w-auto ${
                litToday
                  ? "bg-[#EAF4EC] border border-[#C8E4CD] text-[#28583B] hover:bg-[#d8eedd]"
                  : "bg-[#3E7B54] text-white hover:bg-[#346B48] active:scale-[0.98]"
              }`}
            >
              {litToday ? (
                <>
                  <Check className="h-4 w-4 stroke-[2.5]" />
                  <span>Sudah Check-In Hari Ini</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 stroke-[2]" />
                  <span>Check-in Mood Harian</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </>
              )}
            </Link>
          </div>
        </div>

        {/* ROW 2: Baris Kartu Metrik (Di mobile tampil 2 kartu utama ringkas agar tidak berdesakan) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-1 border-t border-brown-900/8">
          {/* 1. Skor Kesejahteraan (Zyba Score) */}
          <div className="rounded-2xl border border-brown-900/8 bg-[#F5F8F5] p-3 sm:p-4 shadow-2xs transition-all hover:bg-white hover:border-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-bold text-brown-700/85 uppercase tracking-wide">
                Skor ZYBA
              </span>
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-[#EAF4EC] text-[#28583B]">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-1.5 sm:mt-2 flex items-baseline gap-1.5">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-brown-900 tabular-nums">
                {zybaScore}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-800 bg-[#EAF4EC] px-1.5 py-0.2 rounded-md">
                Harmonis
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-brown-700 block mt-0.5 truncate">
              Kesejahteraan batin
            </span>
          </div>

          {/* 2. Skor Kualitas Tidur */}
          <div className="rounded-2xl border border-brown-900/8 bg-[#F5F8F5] p-3 sm:p-4 shadow-2xs transition-all hover:bg-white hover:border-sky-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-bold text-brown-700/85 uppercase tracking-wide">
                Kualitas Tidur
              </span>
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-[#EDF4F8] text-[#3B7494]">
                <Moon className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-1.5 sm:mt-2 flex items-baseline gap-1.5">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-brown-900 tabular-nums">
                {sleepScore}%
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-sky-800 bg-[#EDF4F8] px-1.5 py-0.2 rounded-md">
                {sleepScore >= 75 ? "Optimal" : sleepScore >= 50 ? "Cukup" : "Rehat"}
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-brown-700 block mt-0.5 truncate">
              Istirahat malam
            </span>
          </div>

          {/* 3. Tingkat Stress (Hidden on small mobile to avoid cramped 4-card pileup) */}
          <div className="hidden sm:block rounded-2xl border border-brown-900/8 bg-[#F5F8F5] p-3.5 sm:p-4 shadow-2xs transition-all hover:bg-white hover:border-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-brown-700/85 uppercase tracking-wide">
                Tingkat Stres
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAF4EC] text-[#28583B]">
                <ShieldCheck className="h-3.5 w-3.5 stroke-[2]" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold tracking-tight text-brown-900 tabular-nums">
                Level {stressLevel}
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 bg-[#EAF4EC] px-1.5 py-0.2 rounded-md">
                Terkendali
              </span>
            </div>
            <span className="text-[10px] text-brown-700 block mt-0.5">
              Beban pikiran ringan
            </span>
          </div>

          {/* 4. Curhat ke Zibi -> (Hidden on small mobile since Companion is right in the bottom dock) */}
          <Link
            href="/companion"
            className="hidden sm:flex group rounded-2xl border border-[#F9D5C5] bg-[#FDF1EB] p-3.5 sm:p-4 shadow-2xs transition-all hover:bg-[#FCEAE2] flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-brown-900 uppercase tracking-wide">
                Curhat ke {personaName}
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#C85A3B] shadow-2xs group-hover:scale-105 transition-transform">
                <PersonaMiniAvatar persona={companionPersona} />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-brown-900">
                Teman Mendengar
              </span>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3E7B54] text-white shadow-2xs group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
            </div>
            <span className="text-[10px] text-brown-700 block mt-0.5">
              Hadir 24/7 tanpa menghakimi
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
