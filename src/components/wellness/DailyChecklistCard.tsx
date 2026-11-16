"use client";

import React, { useState, useEffect } from "react";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  link?: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "c-1",
    title: "Check-in mood & kondisi batin harian",
    category: "Batin",
    link: "/mood-check-in",
  },
  {
    id: "c-2",
    title: "Minum air putih 2000 ml",
    category: "Hidrasi",
  },
  {
    id: "c-3",
    title: "Tarik nafas hening 1 menit (Breathing Garden)",
    category: "Nafas",
    link: "/activity",
  },
  {
    id: "c-4",
    title: "Peregangan tubuh & leher 5 menit",
    category: "Raga",
  },
  {
    id: "c-5",
    title: "Makan siang sadar tanpa menatap layar",
    category: "Fokus",
  },
  {
    id: "c-6",
    title: "Jalan santai / gerak fisik 15 menit",
    category: "Aktivitas",
  },
  {
    id: "c-7",
    title: "Curhat singkat ke Companion AI",
    category: "Refleksi",
    link: "/companion",
  },
  {
    id: "c-8",
    title: "Tuliskan 1 hal kecil yang disyukuri",
    category: "Syukur",
    link: "/wellness-journey",
  },
];

interface DailyChecklistCardProps {
  initialCheckInDone?: boolean;
  activityDone?: boolean;
  journalDone?: boolean;
}

export function DailyChecklistCard({
  initialCheckInDone = false,
  activityDone = false,
  journalDone = false,
}: DailyChecklistCardProps) {
  const [customDone, setCustomDone] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state riil checklist hari ini dari localStorage (aman SSR, reset tiap hari berganti)
  useEffect(() => {
    try {
      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
      const storageKey = `zyba_daily_checklist_${today}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCustomDone(JSON.parse(saved));
      }
    } catch {}
    setIsLoaded(true);
  }, []);

  const isItemDone = (id: string): boolean => {
    if (id === "c-1") return initialCheckInDone || Boolean(customDone[id]);
    if (id === "c-3") return activityDone || Boolean(customDone[id]);
    if (id === "c-8") return journalDone || Boolean(customDone[id]);
    return Boolean(customDone[id]);
  };

  const toggleItem = (id: string) => {
    setCustomDone((prev) => {
      const nextVal = !isItemDone(id);
      const updated = { ...prev, [id]: nextVal };
      try {
        const today = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Jakarta",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date());
        localStorage.setItem(`zyba_daily_checklist_${today}`, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const completedCount = CHECKLIST_ITEMS.filter((i) => isItemDone(i.id)).length;
  const progressPercent = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-5 sm:p-6 shadow-[0_4px_20px_rgba(44,34,30,0.03)] flex flex-col justify-between h-full">
      {/* Top Header */}
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
            {completedCount} / {CHECKLIST_ITEMS.length} Selesai
          </span>
        </div>

        <p className="text-xs text-brown-700 leading-relaxed mb-4">
          Langkah kecil untuk merawat keseimbangan diri. Tanpa tekanan, sesuaikan dengan kapasitasmu hari ini.
        </p>

        {/* Visual Progress Bar */}
        <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-brown-900/8 p-0.5">
          <div
            className="h-full rounded-full bg-[#3E7B54] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 8 Checklist Items (Interaktif & Riil) */}
        <div className="space-y-2.5">
          {CHECKLIST_ITEMS.map((item) => {
            const done = isItemDone(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-all duration-200 ${
                  done
                    ? "border-[#C8E4CD] bg-[#EAF4EC]"
                    : "border-brown-900/8 bg-[#F5F8F5] hover:border-emerald-500/30 hover:bg-[#EAF4EC]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Modern Squircle Checkbox (Tanpa buletan radio) */}
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all ${
                      done
                        ? "border-[#3E7B54] bg-[#3E7B54] text-white shadow-2xs"
                        : "border-brown-900/25 bg-white hover:border-[#3E7B54]"
                    }`}
                  >
                    {done && <Check className="h-3.5 w-3.5 stroke-[2.8]" />}
                  </div>

                  <span
                    className={`text-xs leading-tight ${
                      done
                        ? "line-through text-brown-700/60 font-normal"
                        : "font-semibold text-brown-900"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>

                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    done
                      ? "bg-white text-[#28583B] shadow-2xs"
                      : "bg-white/80 text-brown-700 shadow-2xs"
                  }`}
                >
                  {item.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-brown-900/8 flex items-center justify-between text-[11px] text-brown-700/70">
        <span>Setiap centang bernilai untuk ketenanganmu.</span>
        <span className="font-bold text-brown-900">{progressPercent}% tercapai</span>
      </div>
    </div>
  );
}

