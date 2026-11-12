"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Wind, Check } from "lucide-react";

interface BotanicalBannerProps {
  userName: string;
  onQuickBreathe?: () => void;
  onSelectVibe?: (vibe: string) => void;
}

const VIBES = [
  { id: "stressed", label: "Tertekan", bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
  { id: "sad", label: "Sedih", bg: "bg-sky-50", text: "text-sky-800", border: "border-sky-200" },
  { id: "neutral", label: "Biasa", bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  { id: "calm", label: "Tenang", bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  { id: "joyful", label: "Gembira", bg: "bg-orange-50", text: "text-orange-800", border: "border-orange-200" },
];

function VibeFace({ type, className = "h-5 w-5" }: { type: string; className?: string }) {
  switch (type) {
    case "stressed":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 9.5h2.5M13.5 9.5H16" />
          <path d="M8 15.5c1.5-1 3-1 4.5 0s3 1 4.5 0" />
        </svg>
      );
    case "sad":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <path d="M16 16c-1.5-1.5-3.5-1.5-5 0" />
        </svg>
      );
    case "neutral":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
          <path d="M9 15h6" />
        </svg>
      );
    case "joyful":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 10c.5-1 2-1 2.5 0M13.5 10c.5-1 2-1 2.5 0" />
          <path d="M8 14.5c1.2 2 4.8 2 6 0" />
        </svg>
      );
    case "calm":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 10.5c.5-.5 1.5-.5 2 0M13.5 10.5c.5-.5 1.5-.5 2 0" />
          <path d="M9 14.5c1.5 1.2 3 1.2 4.5 0" />
        </svg>
      );
  }
}

export function BotanicalBanner({ userName, onQuickBreathe, onSelectVibe }: BotanicalBannerProps) {
  const [selectedVibe, setSelectedVibe] = useState<string>("calm");

  const todayFormatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const hour = new Date().getHours();
  const greeting =
    hour >= 4 && hour < 11
      ? "Selamat pagi"
      : hour >= 11 && hour < 15
      ? "Selamat siang"
      : hour >= 15 && hour < 18
      ? "Selamat sore"
      : "Selamat malam";

  const handleVibeClick = (vibeId: string) => {
    setSelectedVibe(vibeId);
    if (onSelectVibe) onSelectVibe(vibeId);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-brown-900/10 bg-gradient-to-br from-[#F5F8F4] via-cream to-[#FDF8F3] p-6 sm:p-8 shadow-[0_4px_24px_rgba(44,34,30,0.04)]">
      {/* Decorative Botanical Leaf SVG Watermark in Header (Inspired by Ref 1) */}
      <svg
        className="pointer-events-none absolute -right-6 -top-10 h-56 w-80 text-[#8EA888]/20 sm:-right-4 sm:-top-8 sm:h-64 sm:w-96"
        viewBox="0 0 400 300"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M400,0 C320,30 290,110 310,180 C320,130 360,60 400,0 Z" />
        <path d="M350,0 C270,40 240,120 250,210 C270,150 310,70 350,0 Z" opacity="0.8" />
        <path d="M300,0 C220,60 190,150 200,240 C220,170 260,80 300,0 Z" opacity="0.6" />
        <path d="M260,0 C180,70 150,160 160,250 C180,180 220,90 260,0 Z" opacity="0.4" />
        <path d="M380,50 C300,90 270,180 280,270 C300,200 340,110 380,50 Z" opacity="0.7" />
        {/* Soft floating leaves */}
        <ellipse cx="220" cy="190" rx="35" ry="14" transform="rotate(-30 220 190)" opacity="0.7" />
        <ellipse cx="280" cy="140" rx="40" ry="16" transform="rotate(-40 280 140)" opacity="0.6" />
        <ellipse cx="170" cy="230" rx="30" ry="12" transform="rotate(-20 170 230)" opacity="0.5" />
      </svg>

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Column: Greeting & Date */}
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brown-900/10 bg-white/70 px-3 py-1 text-xs font-semibold text-brown-800 shadow-xs backdrop-blur-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{todayFormatted}</span>
            <span className="text-brown-700/40">•</span>
            <span className="text-brown-700/80">Ruang Suaka Batin</span>
          </div>

          <h1 className="mt-3 font-serif text-2xl font-bold tracking-tight text-brown-900 sm:text-3xl lg:text-4xl">
            {greeting}, <span className="text-orange-600">{userName}</span>!
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-brown-700 sm:text-sm">
            Luangkan sejenak waktu untuk bernafas, mendengarkan sinyal raga, dan merawat ketenangan batinmu hari ini tanpa tekanan.
          </p>

          {/* Quick Action Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onQuickBreathe}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-brown-900/10 bg-white px-3.5 text-xs font-semibold text-brown-900 shadow-xs hover:bg-orange-50 hover:border-orange-200 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
            >
              <Wind className="h-3.5 w-3.5 text-orange-600 stroke-[2]" />
              <span>Tarik Nafas 1 Menit</span>
            </button>

            <Link
              href="/mood-check-in"
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-orange-500 px-4 text-xs font-bold text-brown-900 shadow-xs hover:bg-orange-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
            >
              <Sparkles className="h-3.5 w-3.5 stroke-[2]" />
              <span>Mulai Check-In Hari Ini</span>
            </Link>
          </div>
        </div>

        {/* Right Column: "How's your vibe today?" (Inspired by Ref 1) */}
        <div className="flex flex-col items-start lg:items-end">
          <div className="rounded-2xl border border-brown-900/10 bg-white/85 p-4 shadow-xs backdrop-blur-sm sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold tracking-wide text-brown-900 uppercase">
                Suasana Hatimu Hari Ini
              </span>
              <span className="text-[10px] font-medium text-brown-700/70">
                1 Ketukan Cepat
              </span>
            </div>

            {/* Vibe Pebbles Strip */}
            <div className="mt-3 flex items-center gap-2 sm:gap-2.5">
              {VIBES.map((vibe) => {
                const isSelected = selectedVibe === vibe.id;
                return (
                  <button
                    key={vibe.id}
                    type="button"
                    onClick={() => handleVibeClick(vibe.id)}
                    className={`group relative flex flex-col items-center gap-1 rounded-xl p-2 transition-all duration-200 focus:outline-none ${
                      isSelected
                        ? `${vibe.bg} ${vibe.border} border shadow-xs scale-105`
                        : "hover:bg-brown-900/5 border border-transparent"
                    }`}
                    title={vibe.label}
                  >
                    <div
                      className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg transition-transform ${
                        isSelected ? vibe.text : "text-brown-700/70 group-hover:text-brown-900"
                      }`}
                    >
                      <VibeFace type={vibe.id} className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <span
                      className={`text-[10px] font-medium leading-none ${
                        isSelected ? "font-bold text-brown-900" : "text-brown-700/70"
                      }`}
                    >
                      {vibe.label}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-500 text-brown-900">
                        <Check className="h-2 w-2 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

