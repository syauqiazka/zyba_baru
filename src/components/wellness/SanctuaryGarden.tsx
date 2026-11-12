"use client";

import React from "react";
import { Droplets, Sprout, Sparkles } from "lucide-react";

interface SanctuaryGardenProps {
  daysWatered?: number;
  totalGoal?: number;
  isWateredToday?: boolean;
  onWater?: () => void;
}

export function SanctuaryGarden({
  daysWatered = 4,
  totalGoal = 7,
  isWateredToday = false,
  onWater,
}: SanctuaryGardenProps) {
  const percent = Math.min(100, Math.round((daysWatered / totalGoal) * 100));

  return (
    <div className="relative overflow-hidden rounded-3xl border border-brown-900/10 bg-white/95 p-5 sm:p-6 shadow-[0_4px_20px_rgba(44,34,30,0.03)] flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Sprout className="h-4 w-4 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/70">
                Taman Batin
              </span>
              <h2 className="text-sm font-bold text-brown-900 leading-tight">
                Tunas Kedamaian
              </h2>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/20 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
            <Sparkles className="h-2.5 w-2.5 text-emerald-600" />
            Tingkat 2
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-brown-700">
          Rawat tanaman batinmu dengan jeda harian. Tumbuh alami tanpa paksaan atau rasa bersalah.
        </p>
      </div>

      {/* Visual Plant SVG Illustration (Inspired by Ref 1 "Plant Your Progress") */}
      <div className="my-4 flex items-center justify-center py-2">
        <div className="relative flex flex-col items-center">
          <svg
            className="h-28 w-28 text-emerald-600 transition-transform duration-500 hover:scale-105"
            viewBox="0 0 120 120"
            fill="none"
            aria-hidden="true"
          >
            {/* Soft background aura glow */}
            <circle cx="60" cy="55" r="42" fill="#EBF4EC" />

            {/* Plant Pot */}
            <path
              d="M42 80 L46 102 C46.5 104.5 48.5 106 51 106 L69 106 C71.5 106 73.5 104.5 74 102 L78 80 Z"
              fill="#E5D3BD"
              stroke="#B3987E"
              strokeWidth="2"
            />
            {/* Pot Rim */}
            <rect
              x="39"
              y="75"
              width="42"
              height="6"
              rx="3"
              fill="#D6C0A6"
              stroke="#B3987E"
              strokeWidth="1.5"
            />

            {/* Soil */}
            <ellipse cx="60" cy="76" rx="18" ry="3" fill="#6A5343" />

            {/* Main Plant Stem */}
            <path
              d="M60 76 Q60 55 58 40"
              stroke="#407A4B"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Left Leaf (Large) */}
            <path
              d="M59 62 C45 60 38 48 42 38 C48 38 56 48 59 62 Z"
              fill="#529960"
              stroke="#386E42"
              strokeWidth="1.5"
            />
            {/* Left Leaf Vein */}
            <path d="M57 58 Q48 48 44 41" stroke="#386E42" strokeWidth="1" />

            {/* Right Leaf (Large) */}
            <path
              d="M59 52 C73 50 82 40 76 30 C70 30 62 40 59 52 Z"
              fill="#60B070"
              stroke="#386E42"
              strokeWidth="1.5"
            />
            {/* Right Leaf Vein */}
            <path d="M60 49 Q69 41 73 33" stroke="#386E42" strokeWidth="1" />

            {/* Top Fresh Sprout Leaf */}
            <path
              d="M58 40 C55 30 58 20 62 18 C65 22 64 32 58 40 Z"
              fill="#83D293"
              stroke="#407A4B"
              strokeWidth="1.5"
            />

            {/* Little Water Drops */}
            <g className={isWateredToday ? "opacity-100" : "opacity-40"}>
              <path
                d="M48 28 C48 26 50 24 50 24 C50 24 52 26 52 28 C52 29.1 51.1 30 50 30 C48.9 30 48 29.1 48 28 Z"
                fill="#5EA8D6"
              />
              <path
                d="M72 24 C72 22 74 20 74 20 C74 20 76 22 76 24 C76 25.1 75.1 26 74 26 C72.9 26 72 25.1 72 24 Z"
                fill="#5EA8D6"
              />
            </g>
          </svg>
        </div>
      </div>

      {/* Progress & Watering Action */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-brown-800 flex items-center gap-1">
              <Droplets className="h-3.5 w-3.5 text-sky-600" />
              Penyiraman Mingguan
            </span>
            <span className="font-bold text-brown-900">
              {daysWatered} / {totalGoal} Hari
            </span>
          </div>

          {/* Rounded tactile progress track */}
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-emerald-100/70 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onWater}
          className={`flex h-9 w-full items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all focus:outline-none ${
            isWateredToday
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs active:scale-[0.98]"
          }`}
        >
          <Droplets className="h-3.5 w-3.5" />
          <span>{isWateredToday ? "Telah Disiram Hari Ini" : "Siram Tanaman Hari Ini"}</span>
        </button>
      </div>
    </div>
  );
}

