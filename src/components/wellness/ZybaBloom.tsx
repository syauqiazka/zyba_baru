"use client";

import React from "react";

interface ZybaBloomProps {
  score: number;
  mentalScore: number;
  physicalScore: number;
  socialScore: number;
  hasEnoughData?: boolean;
  className?: string;
}

export function ZybaBloom({
  score,
  mentalScore,
  physicalScore,
  socialScore,
  hasEnoughData = true,
  className = "",
}: ZybaBloomProps) {
  // Hitung radius mekar masing-masing aspek (30 - 70)
  const mentalRadius = 38 + (mentalScore / 100) * 32;
  const physicalRadius = 38 + (physicalScore / 100) * 32;
  const socialRadius = 38 + (socialScore / 100) * 32;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex h-56 w-56 items-center justify-center">
        {/* SVG Living Organic Bloom */}
        <svg
          viewBox="0 0 200 200"
          className="h-full w-full overflow-visible transition-all duration-700"
          aria-hidden="true"
        >
          <defs>
            {/* Gradien Alami Aspek */}
            <radialGradient id="mentalBloom" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#E07A5F" stopOpacity="0.05" />
            </radialGradient>
            <radialGradient id="physicalBloom" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d5c7a5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d5c7a5" stopOpacity="0.05" />
            </radialGradient>
            <radialGradient id="socialBloom" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9fc3d6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#9fc3d6" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {/* Kelopak 1: Sosial (Biru Langit Lembut - Bawah Kanan) */}
          <circle
            cx="115"
            cy="115"
            r={socialRadius}
            fill="url(#socialBloom)"
            stroke="#9fc3d6"
            strokeWidth="1.2"
            strokeDasharray="4 3"
            className="transition-all duration-1000 ease-out"
          />

          {/* Kelopak 2: Fisik (Pasir Alami - Kiri Bawah) */}
          <circle
            cx="85"
            cy="115"
            r={physicalRadius}
            fill="url(#physicalBloom)"
            stroke="#d5c7a5"
            strokeWidth="1.2"
            strokeDasharray="4 3"
            className="transition-all duration-1000 ease-out"
          />

          {/* Kelopak 3: Mental (Oranye Hangat - Atas Tengah) */}
          <circle
            cx="100"
            cy="80"
            r={mentalRadius}
            fill="url(#mentalBloom)"
            stroke="#E07A5F"
            strokeWidth="1.5"
            className="transition-all duration-1000 ease-out"
          />

          {/* Cincin Inti Netral */}
          <circle
            cx="100"
            cy="100"
            r="44"
            fill="#FAF7F0"
            stroke="#2C221E"
            strokeOpacity="0.12"
            strokeWidth="1.5"
            className="shadow-sm"
          />
        </svg>

        {/* Inti Angka Skor */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-brown-900">
            {score}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/60">
            {hasEnoughData ? "Skor ZYBA" : "Skor Awal"}
          </span>
        </div>
      </div>

      {/* Indikator 3 Kelopak Kunci */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
          <span className="text-brown-700 font-medium">Mental ({mentalScore}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-sand-300" />
          <span className="text-brown-700 font-medium">Fisik ({physicalScore}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-300" />
          <span className="text-brown-700 font-medium">Sosial ({socialScore}%)</span>
        </div>
      </div>
    </div>
  );
}

