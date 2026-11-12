"use client";

import React, { useState } from "react";
import { Check, Sparkles, Plus } from "lucide-react";

interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  done: boolean;
}

interface DailyChecklistCardProps {
  initialCheckInDone?: boolean;
}

export function DailyChecklistCard({ initialCheckInDone = false }: DailyChecklistCardProps) {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "c-1",
      title: "Check-in mood & kondisi batin harian",
      category: "Batin",
      done: initialCheckInDone,
    },
    {
      id: "c-2",
      title: "Minum air putih 2000 ml",
      category: "Hidrasi",
      done: true,
    },
    {
      id: "c-3",
      title: "Tarik nafas hening 1 menit",
      category: "Nafas",
      done: true,
    },
    {
      id: "c-4",
      title: "Peregangan tubuh & leher 5 menit",
      category: "Raga",
      done: false,
    },
    {
      id: "c-5",
      title: "Makan siang sadar tanpa menatap layar",
      category: "Fokus",
      done: true,
    },
    {
      id: "c-6",
      title: "Jalan santai / gerak fisik 15 menit",
      category: "Aktivitas",
      done: false,
    },
    {
      id: "c-7",
      title: "Curhat singkat ke Companion AI",
      category: "Refleksi",
      done: false,
    },
    {
      id: "c-8",
      title: "Tuliskan 1 hal kecil yang disyukuri",
      category: "Syukur",
      done: false,
    },
  ]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedCount = items.filter((i) => i.done).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-5 sm:p-6 shadow-[0_4px_20px_rgba(44,34,30,0.03)] flex flex-col justify-between h-full">
      {/* Top Header (Sesuai Sketsa: "Checklist Harian") */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/70">
              Rutinitas Harian
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-brown-900">
              Checklist Harian
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/20 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
            <Sparkles className="h-3 w-3 text-emerald-600" />
            {completedCount} / {items.length} Selesai
          </span>
        </div>

        <p className="text-xs text-brown-700 leading-relaxed mb-4">
          Langkah kecil untuk merawat keseimbangan diri. Tanpa tekanan, sesuaikan dengan kapasitasmu.
        </p>

        {/* Visual Progress Bar */}
        <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-brown-900/8 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 8 Checklist Items (Sesuai Sketsa Bulatan 'o') */}
        <div className="space-y-2.5">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-all duration-200 ${
                item.done
                  ? "border-emerald-600/30 bg-emerald-50/40"
                  : "border-brown-900/8 bg-cream/30 hover:border-orange-500/30 hover:bg-cream/60"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Circular Checkbox (Sesuai Sketsa Bulat 'o') */}
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    item.done
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-brown-900/30 bg-white hover:border-orange-500"
                  }`}
                >
                  {item.done && <Check className="h-3 w-3 stroke-[3]" />}
                </div>

                <span
                  className={`text-xs leading-tight ${
                    item.done
                      ? "line-through text-brown-700/60 font-normal"
                      : "font-semibold text-brown-900"
                  }`}
                >
                  {item.title}
                </span>
              </div>

              <span
                className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  item.done
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-brown-900/5 text-brown-700/70"
                }`}
              >
                {item.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-brown-900/8 flex items-center justify-between text-[11px] text-brown-700/70">
        <span>Setiap centang bernilai untuk ketenanganmu.</span>
        <span className="font-bold text-brown-900">{progressPercent}% tercapai</span>
      </div>
    </div>
  );
}

