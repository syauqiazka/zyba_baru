"use client";

import React, { useState } from "react";
import { BarChart2, TrendingUp, Droplets, Calendar, Sparkles } from "lucide-react";

export function MonthlyTrackerCard() {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("monthly");

  const monthlyData = [
    { month: "Jan", val: 55, active: false },
    { month: "Feb", val: 62, active: false },
    { month: "Mar", val: 70, active: false },
    { month: "Apr", val: 58, active: false },
    { month: "Mei", val: 75, active: false },
    { month: "Jun", val: 88, active: false },
    { month: "Jul", val: 80, active: false },
    { month: "Agu", val: 65, active: false },
    { month: "Sep", val: 78, active: false },
    { month: "Okt", val: 82, active: false },
    { month: "Nov", val: 92, active: true },
    { month: "Des", val: 70, active: false },
  ];

  const weeklyData = [
    { day: "Sen", date: "10", val: 70, active: false },
    { day: "Sel", date: "11", val: 65, active: false },
    { day: "Rab", date: "12", val: 88, active: false },
    { day: "Kam", date: "13", val: 94, active: true },
    { day: "Jum", date: "14", val: 80, active: false },
    { day: "Sab", date: "15", val: 75, active: false },
    { day: "Min", date: "16", val: 60, active: false },
  ];

  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-5 sm:p-6 shadow-[0_4px_20px_rgba(44,34,30,0.03)] flex flex-col justify-between h-full">
      {/* Top Header (Sesuai Sketsa: "Monthly Tracker") */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/70">
              Analitik Ritme Diri
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-brown-900">
              Monthly Tracker
            </h2>
          </div>

          {/* Tab Selector: Mingguan / Bulanan */}
          <div className="flex items-center rounded-xl bg-brown-900/5 p-1 border border-brown-900/5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("weekly")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                activeTab === "weekly"
                  ? "bg-white text-brown-900 shadow-2xs"
                  : "text-brown-700 hover:text-brown-900"
              }`}
            >
              Mingguan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("monthly")}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                activeTab === "monthly"
                  ? "bg-white text-brown-900 shadow-2xs"
                  : "text-brown-700 hover:text-brown-900"
              }`}
            >
              Bulanan
            </button>
          </div>
        </div>

        <p className="text-xs text-brown-700 leading-relaxed mb-4">
          Melihat konsistensi kehadiran sadarmu sepanjang waktu. Tidak ada grafik yang selalu naik, yang terpenting adalah kembali hadir.
        </p>

        {/* Bar Chart Area (Inspired by Habitdo & Ref 1) */}
        <div className="mt-4 rounded-2xl border border-brown-900/8 bg-[#F5F8F5] p-4">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="font-bold text-brown-900 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-[#3E7B54]" />
              {activeTab === "monthly" ? "Tingkat Kehadiran Bulanan (2026)" : "Ritme 7 Hari Ini"}
            </span>
            <span className="text-[11px] font-semibold text-[#28583B] bg-[#EAF4EC] px-2 py-0.5 rounded-full border border-[#C8E4CD]">
              {activeTab === "monthly" ? "Puncak: November (92%)" : "Rata-rata: 76%"}
            </span>
          </div>

          {/* The Visual Bars */}
          <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-36 pt-4 pb-1">
            {activeTab === "monthly"
              ? monthlyData.map((d) => (
                  <div key={d.month} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="relative flex h-28 w-full max-w-[28px] flex-col justify-end rounded-lg bg-brown-900/5 p-0.5">
                      <div
                        className={`w-full rounded-md transition-all duration-500 ${
                          d.active
                            ? "bg-[#3E7B54] shadow-2xs"
                            : "bg-[#C8E4CD] hover:bg-[#A3D9A5]"
                        }`}
                        style={{ height: `${d.val}%` }}
                      />
                    </div>
                    <span
                      className={`text-[10px] leading-tight ${
                        d.active ? "font-bold text-[#28583B]" : "font-medium text-brown-700/70"
                      }`}
                    >
                      {d.month}
                    </span>
                  </div>
                ))
              : weeklyData.map((d) => (
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="relative flex h-28 w-full max-w-[32px] flex-col justify-end rounded-lg bg-brown-900/5 p-0.5">
                      <div
                        className={`w-full rounded-md transition-all duration-500 ${
                          d.active
                            ? "bg-[#3E7B54] shadow-2xs"
                            : "bg-[#C8E4CD] hover:bg-[#A3D9A5]"
                        }`}
                        style={{ height: `${d.val}%` }}
                      />
                    </div>
                    <span
                      className={`text-[10px] leading-tight ${
                        d.active ? "font-bold text-[#28583B]" : "font-medium text-brown-700/70"
                      }`}
                    >
                      {d.day}
                    </span>
                  </div>
                ))}
          </div>
        </div>

        {/* Mini Plant Nurture Widget (Inspired by Habitdo "Plant Your Progress") */}
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#C8E4CD] bg-[#EAF4EC] p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#28583B] shadow-2xs">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 22v-8" />
                <path d="M9 14c-3-2-5-6-2-9 4 1 5 5 5 9z" fill="#A3D9A5" />
                <path d="M15 11c3-2 5-6 2-9-4 1-5 5-5 9z" fill="#3E7B54" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-[#1B241E] block">
                Taman Batin • Tingkat 2
              </span>
              <span className="text-[11px] text-[#28583B] block">
                Disiram 5 dari 7 hari minggu ini
              </span>
            </div>
          </div>

          <span className="text-xs font-bold text-[#28583B] bg-white px-2.5 py-1 rounded-xl shadow-2xs border border-[#C8E4CD]">
            Mekar Subur
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-brown-900/8 flex items-center justify-between text-[11px] text-brown-700/70">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-brown-700" />
          Konsistensi Bulan Ini: 82%
        </span>
        <span className="font-bold text-emerald-700">Stabil & Tenang</span>
      </div>
    </div>
  );
}

