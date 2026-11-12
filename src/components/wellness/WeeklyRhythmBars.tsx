"use client";

import React from "react";
import { BarChart3, TrendingUp } from "lucide-react";

interface DayRhythm {
  dayName: string;
  dayNumber: number;
  score: number; // 0 - 100
  isToday: boolean;
  hasCheckIn: boolean;
}

export function WeeklyRhythmBars() {
  const days: DayRhythm[] = [
    { dayName: "Sen", dayNumber: 10, score: 72, isToday: false, hasCheckIn: true },
    { dayName: "Sel", dayNumber: 11, score: 65, isToday: false, hasCheckIn: true },
    { dayName: "Rab", dayNumber: 12, score: 80, isToday: true, hasCheckIn: true },
    { dayName: "Kam", dayNumber: 13, score: 70, isToday: false, hasCheckIn: false },
    { dayName: "Jum", dayNumber: 14, score: 85, isToday: false, hasCheckIn: false },
    { dayName: "Sab", dayNumber: 15, score: 75, isToday: false, hasCheckIn: false },
    { dayName: "Min", dayNumber: 16, score: 60, isToday: false, hasCheckIn: false },
  ];

  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-5 sm:p-6 shadow-[0_4px_20px_rgba(44,34,30,0.03)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/70">
            Ritme Mingguan
          </span>
          <h2 className="text-base font-bold text-brown-900">
            Konsistensi Ketenangan
          </h2>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-800 bg-orange-50 border border-orange-200/60 px-2.5 py-1 rounded-full">
          <TrendingUp className="h-3 w-3 text-orange-600" />
          Rata-rata 74
        </span>
      </div>

      <p className="text-xs text-brown-700 leading-relaxed mb-6">
        Setiap kurva mencerminkan dinamika batinmu. Naik turun adalah bagian wajar dari manusia yang hidup.
      </p>

      {/* Visual Bar Chart */}
      <div className="flex items-end justify-between gap-2 sm:gap-3 pt-4 pb-2 h-44">
        {days.map((d) => {
          const heightPercent = d.hasCheckIn ? Math.max(15, d.score) : 8;
          return (
            <div
              key={d.dayName}
              className={`flex flex-1 flex-col items-center gap-2 transition-all ${
                d.isToday ? "scale-105" : "opacity-90"
              }`}
            >
              {/* Bar Column */}
              <div className="relative flex h-32 w-full max-w-[36px] flex-col justify-end rounded-2xl bg-brown-900/5 p-1">
                <div
                  className={`w-full rounded-xl transition-all duration-500 ${
                    d.isToday
                      ? "bg-gradient-to-t from-orange-500 to-amber-400 shadow-xs"
                      : d.hasCheckIn
                      ? "bg-gradient-to-t from-emerald-500/80 to-teal-400/80"
                      : "bg-brown-900/10"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Day Labels */}
              <div className="text-center">
                <span
                  className={`block text-[11px] leading-tight ${
                    d.isToday
                      ? "font-bold text-orange-600"
                      : "font-semibold text-brown-800"
                  }`}
                >
                  {d.dayName}
                </span>
                <span
                  className={`block text-[10px] ${
                    d.isToday
                      ? "font-extrabold text-brown-900"
                      : "text-brown-700/60"
                  }`}
                >
                  {d.dayNumber}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Legend */}
      <div className="mt-4 flex items-center justify-between border-t border-brown-900/8 pt-3 text-[11px] text-brown-700/70">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Tercatat
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Hari Ini
          </span>
        </div>
        <span className="text-[10px] font-medium text-brown-700/60">
          7 Hari Terakhir
        </span>
      </div>
    </div>
  );
}

