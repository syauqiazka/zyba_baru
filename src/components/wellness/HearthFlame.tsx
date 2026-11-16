"use client";

import React from "react";

interface HearthFlameProps {
  litToday?: boolean;
  streakDays?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function HearthFlame({
  litToday = false,
  streakDays = 0,
  size = "md",
  className = "",
}: HearthFlameProps) {
  const isLit = litToday;

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  }[size];

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-200 ${
        isLit
          ? "bg-gradient-to-b from-orange-50/60 to-white border-orange-500/20 shadow-sm"
          : "bg-white/80 border-brown-900/10"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* SVG Lilin Tenang */}
          <div
            className={`relative flex items-center justify-center rounded-2xl p-2.5 transition-colors ${
              isLit ? "bg-orange-100/80" : "bg-brown-900/5"
            }`}
          >
            <svg
              className={`${sizeClasses} transition-all duration-300`}
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Tempat lilin / candlestick base */}
              <ellipse cx="24" cy="42" rx="14" ry="3.5" fill="#e5dec9" />
              <path
                d="M17 40C17 38 31 38 31 40L30 42H18L17 40Z"
                fill="#d2c5a7"
              />
              {/* Batang lilin linen */}
              <rect
                x="19"
                y="24"
                width="10"
                height="17"
                rx="2"
                fill="#f7f5ed"
                stroke="#d2c5a7"
                strokeWidth="1.2"
              />
              {/* Sumbu lilin */}
              <line
                x1="24"
                y1="24"
                x2="24"
                y2="20"
                stroke="#4a3728"
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Api lilin */}
              {isLit ? (
                <>
                  {/* Aura hangat lembut */}
                  <circle
                    cx="24"
                    cy="14"
                    r="9"
                    fill="#f97316"
                    fillOpacity="0.12"
                  />
                  {/* Nyala luar */}
                  <path
                    d="M24 6C24 6 29 11 29 15C29 17.7614 26.7614 20 24 20C21.2386 20 19 17.7614 19 15C19 11 24 6 24 6Z"
                    fill="#f59e0b"
                  />
                  {/* Inti api dalam */}
                  <path
                    d="M24 10C24 10 26.5 13 26.5 15.5C26.5 16.8807 25.3807 18 24 18C22.6193 18 21.5 16.8807 21.5 15.5C21.5 13 24 10 24 10Z"
                    fill="#fed7aa"
                  />
                </>
              ) : (
                <>
                  {/* Api meredup santai / istirahat */}
                  <path
                    d="M24 13C24 13 26.5 16 26.5 17.5C26.5 18.8807 25.3807 20 24 20C22.6193 20 21.5 18.8807 21.5 17.5C21.5 16 24 13 24 13Z"
                    fill="#a88d77"
                    fillOpacity="0.5"
                  />
                  <circle cx="24" cy="18" r="1.5" fill="#78604b" />
                </>
              )}
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-brown-700/70">
                Hearth Flame
              </span>
              {isLit && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-950">
                  Aktif
                </span>
              )}
            </div>
            <h3 className="font-display text-lg font-bold text-brown-900 tabular-nums">
              {isLit
                ? `${streakDays} Hari Konsisten`
                : "Kehangatan Diri"}
            </h3>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-brown-700">
        {isLit
          ? "Nyala lilinmu terjaga hari ini. Setiap refleksi kecil adalah langkah berharga merawat batinmu."
          : "Nyalakan kehangatan hari ini kapan pun kamu siap. Tanpa terburu-buru, tanpa rasa bersalah."}
      </p>
    </div>
  );
}

