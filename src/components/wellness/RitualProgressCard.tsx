"use client";

import React, { useState } from "react";
import {
  Droplets,
  Wind,
  Eye,
  Check,
  Plus,
  Clock,
  Sparkles,
} from "lucide-react";

interface RitualItem {
  id: string;
  title: string;
  target: string;
  current: number;
  max: number;
  unit: string;
  iconType: "water" | "breathe" | "stretch";
  colorBg: string;
  colorIcon: string;
  colorBar: string;
}

export function RitualProgressCard() {
  const [rituals, setRituals] = useState<RitualItem[]>([
    {
      id: "water",
      title: "Hidrasi Tubuh",
      target: "2000 ml",
      current: 1250,
      max: 2000,
      unit: "ml",
      iconType: "water",
      colorBg: "bg-sky-100",
      colorIcon: "text-sky-700",
      colorBar: "from-sky-400 to-sky-600",
    },
    {
      id: "breathe",
      title: "Jeda Nafas Sadar",
      target: "3 kali",
      current: 2,
      max: 3,
      unit: "sesi",
      iconType: "breathe",
      colorBg: "bg-orange-100",
      colorIcon: "text-orange-700",
      colorBar: "from-orange-400 to-orange-600",
    },
    {
      id: "stretch",
      title: "Peregangan Raga",
      target: "2 kali",
      current: 1,
      max: 2,
      unit: "sesi",
      iconType: "stretch",
      colorBg: "bg-emerald-100",
      colorIcon: "text-emerald-700",
      colorBar: "from-emerald-400 to-emerald-600",
    },
  ]);

  const [scheduledHabits, setScheduledHabits] = useState([
    {
      id: "hab-1",
      title: "Buka Jendela & Hirup Udara Segar",
      time: "08:00 WIB",
      done: true,
      tag: "Pagi",
    },
    {
      id: "hab-2",
      title: "Makan Siang Tanpa Menatap Layar",
      time: "12:30 WIB",
      done: true,
      tag: "Siang",
    },
    {
      id: "hab-3",
      title: "Curhat Singkat & Menata Pikiran",
      time: "20:00 WIB",
      done: false,
      tag: "Malam",
    },
  ]);

  const handleIncrement = (id: string, stepVal: number) => {
    setRituals((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = Math.min(r.max, r.current + stepVal);
          return { ...r, current: next };
        }
        return r;
      })
    );
  };

  const toggleSchedule = (id: string) => {
    setScheduledHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h))
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Goals & Habit Progress (Inspired by Ref 1 & 2) */}
      <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-5 sm:p-6 shadow-[0_4px_20px_rgba(44,34,30,0.03)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/70">
              Langkah Sadar
            </span>
            <h2 className="text-base font-bold text-brown-900">
              Ritual Kesehatan Raga
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
            Harmonis
          </span>
        </div>

        <div className="space-y-4">
          {rituals.map((ritual) => {
            const percent = Math.min(
              100,
              Math.round((ritual.current / ritual.max) * 100)
            );
            return (
              <div
                key={ritual.id}
                className="rounded-2xl border border-brown-900/8 bg-cream/30 p-3.5 sm:p-4 transition-all hover:bg-cream/60"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${ritual.colorBg} ${ritual.colorIcon}`}
                    >
                      {ritual.iconType === "water" && (
                        <Droplets className="h-5 w-5 stroke-[2]" />
                      )}
                      {ritual.iconType === "breathe" && (
                        <Wind className="h-5 w-5 stroke-[2]" />
                      )}
                      {ritual.iconType === "stretch" && (
                        <Eye className="h-5 w-5 stroke-[2]" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-brown-900">
                        {ritual.title}
                      </h3>
                      <p className="text-[11px] text-brown-700/70">
                        {ritual.current} dari {ritual.target} ({percent}%)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleIncrement(
                        ritual.id,
                        ritual.id === "water" ? 250 : 1
                      )
                    }
                    disabled={ritual.current >= ritual.max}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-brown-900/10 bg-white px-2.5 text-[11px] font-bold text-brown-900 shadow-xs hover:bg-brown-900/5 active:scale-95 disabled:opacity-40 transition-all"
                  >
                    <Plus className="h-3 w-3 stroke-[3]" />
                    <span>
                      {ritual.id === "water" ? "+250ml" : "+1 Sesi"}
                    </span>
                  </button>
                </div>

                {/* Visual Progress Bar */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-brown-900/8 p-0.5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${ritual.colorBar} transition-all duration-300`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Scheduled Habits (Inspired by Ref 1 "Scheduled Habits") */}
      <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-5 sm:p-6 shadow-[0_4px_20px_rgba(44,34,30,0.03)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/70">
              Ritme Jam
            </span>
            <h2 className="text-base font-bold text-brown-900">
              Jadwal Waktu Tenang
            </h2>
          </div>
          <span className="text-xs text-brown-700/70 flex items-center gap-1 font-medium">
            <Clock className="h-3.5 w-3.5" />
            Hari Ini
          </span>
        </div>

        <div className="space-y-2.5">
          {scheduledHabits.map((habit) => (
            <button
              key={habit.id}
              type="button"
              onClick={() => toggleSchedule(habit.id)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3 sm:p-3.5 text-left transition-all ${
                habit.done
                  ? "border-emerald-600/30 bg-emerald-50/40 text-brown-900"
                  : "border-brown-900/10 bg-cream/20 text-brown-800 hover:bg-cream/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all ${
                    habit.done
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-brown-900/30 bg-white"
                  }`}
                >
                  {habit.done && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>
                <div>
                  <span
                    className={`text-xs font-semibold leading-tight block ${
                      habit.done
                        ? "line-through text-brown-700/70 font-normal"
                        : "text-brown-900"
                    }`}
                  >
                    {habit.title}
                  </span>
                  <span className="text-[10px] text-brown-700/60 font-medium">
                    {habit.time} • Sesi {habit.tag}
                  </span>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  habit.done
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-brown-900/5 text-brown-700"
                }`}
              >
                {habit.done ? "Selesai" : "Nanti"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

