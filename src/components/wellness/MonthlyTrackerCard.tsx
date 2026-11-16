"use client";

import React, { useState } from "react";
import { TrendingUp, Calendar } from "lucide-react";

export interface TrackerData {
  monthly: Array<{ month: string; val: number; checkInsCount?: number; active: boolean }>;
  weekly: Array<{ day: string; date: string; val: number; active: boolean }>;
  weeklyCheckedCount: number;
  currentMonthRate: number;
  currentMonthName?: string;
  year?: string;
}

interface MonthlyTrackerCardProps {
  trackerData?: TrackerData;
}

export function MonthlyTrackerCard({ trackerData }: MonthlyTrackerCardProps) {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("monthly");

  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  // Fallback riil berbasis 0 (bukan dummy statis)
  const monthlyData = trackerData?.monthly || monthNames.map((m, idx) => ({
    month: m,
    val: 0,
    checkInsCount: 0,
    active: idx === currentMonthIdx,
  }));

  const weeklyData = trackerData?.weekly || ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d, idx) => ({
    day: d,
    date: String(idx + 1),
    val: 0,
    active: false,
  }));

  const weeklyCheckedCount = trackerData?.weeklyCheckedCount ?? 0;
  const currentMonthRate = trackerData?.currentMonthRate ?? 0;
  const yearStr = trackerData?.year || String(now.getFullYear());

  // Hitung puncak kehadiran riil di bulan berjalan
  const peakMonth = [...monthlyData].sort((a, b) => b.val - a.val)[0];
  const hasAnyCheckIn = monthlyData.some((m) => m.val > 0) || weeklyCheckedCount > 0;

  // Status Taman Batin Riil
  const plantLevel = weeklyCheckedCount >= 5 ? 2 : weeklyCheckedCount >= 1 ? 1 : 0;
  const plantBadge =
    weeklyCheckedCount >= 5
      ? "Mekar Subur"
      : weeklyCheckedCount >= 1
      ? "Tunas Bertumbuh"
      : "Menanti Disiram";
  const plantTitle =
    weeklyCheckedCount === 0
      ? "Taman Batin • Mulai Minggu Ini"
      : `Taman Batin • Tingkat ${plantLevel}`;
  const plantDesc =
    weeklyCheckedCount === 0
      ? "Belum ada siraman minggu ini. Hadir sejenak untuk menumbuhkan tunas batin."
      : `Disiram ${weeklyCheckedCount} dari 7 hari minggu ini`;

  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white/95 p-5 sm:p-6 shadow-[0_4px_20px_rgba(44,34,30,0.03)] flex flex-col justify-between h-full">
      {/* Top Header */}
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
          Melihat konsistensi kehadiran sadarmu sepanjang waktu. Tidak ada grafik yang harus selalu naik, yang terpenting adalah kembali hadir.
        </p>

        {/* Bar Chart Area */}
        <div className="mt-4 rounded-2xl border border-brown-900/8 bg-[#F5F8F5] p-4">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="font-bold text-brown-900 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-[#3E7B54]" />
              {activeTab === "monthly"
                ? `Tingkat Kehadiran Bulanan (${yearStr})`
                : "Ritme 7 Hari Ini"}
            </span>
            <span className="text-[11px] font-semibold text-[#28583B] bg-[#EAF4EC] px-2.5 py-0.5 rounded-full border border-[#C8E4CD]">
              {activeTab === "monthly"
                ? peakMonth && peakMonth.val > 0
                  ? `Puncak: ${peakMonth.month} (${peakMonth.val}%)`
                  : "Belum Ada Data"
                : `Kehadiran: ${weeklyCheckedCount}/7 Hari`}
            </span>
          </div>

          {/* The Visual Bars (Nilai Riil) */}
          <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-36 pt-4 pb-1">
            {activeTab === "monthly"
              ? monthlyData.map((d, idx) => (
                  <div
                    key={d.month}
                    className={`flex-1 flex-col items-center gap-1.5 group relative ${
                      idx < 6 ? "hidden sm:flex" : "flex"
                    }`}
                  >
                    <div
                      className={`relative flex h-28 w-full max-w-[28px] flex-col justify-end rounded-lg p-0.5 transition-all ${
                        d.active ? "bg-emerald-100/60 ring-2 ring-[#3E7B54]/20" : "bg-brown-900/5"
                      }`}
                      title={`${d.month}: ${d.val}% kehadiran (${d.checkInsCount || 0} check-in)`}
                    >
                      <div
                        className={`w-full rounded-md transition-all duration-500 ${
                          d.val > 0
                            ? d.active
                              ? "bg-[#3E7B54] shadow-2xs"
                              : "bg-[#80C294]"
                            : d.active
                            ? "h-1.5 bg-[#3E7B54]/40"
                            : "bg-transparent"
                        }`}
                        style={{ height: d.val > 0 ? `${Math.max(8, d.val)}%` : d.active ? "6px" : "0%" }}
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
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5 group relative">
                    <div
                      className={`relative flex h-28 w-full max-w-[32px] flex-col justify-end rounded-lg p-0.5 transition-all ${
                        d.active ? "bg-emerald-100/60 ring-2 ring-[#3E7B54]/20" : "bg-brown-900/5"
                      }`}
                      title={`${d.day} (Tgl ${d.date}): ${d.val > 0 ? "Hadir Sadar" : "Belum Check-In"}`}
                    >
                      <div
                        className={`w-full rounded-md transition-all duration-500 ${
                          d.val > 0
                            ? d.active
                              ? "bg-[#3E7B54] shadow-2xs"
                              : "bg-[#80C294]"
                            : d.active
                            ? "h-1.5 bg-[#3E7B54]/40"
                            : "bg-transparent"
                        }`}
                        style={{ height: d.val > 0 ? "100%" : d.active ? "6px" : "0%" }}
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

          {!hasAnyCheckIn && (
            <div className="mt-2 text-center text-[11px] text-brown-700/60 italic">
              Belum ada check-in tercatat. Data kehadiran akan terisi otomatis seiring check-in harianmu.
            </div>
          )}
        </div>

        {/* Mini Plant Nurture Widget (Riil) */}
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#C8E4CD] bg-[#EAF4EC] p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#28583B] shadow-2xs">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 22v-8" />
                <path d="M9 14c-3-2-5-6-2-9 4 1 5 5 5 9z" fill={plantLevel > 0 ? "#A3D9A5" : "#DCECE0"} />
                <path d="M15 11c3-2 5-6 2-9-4 1-5 5-5 9z" fill={plantLevel >= 2 ? "#3E7B54" : plantLevel === 1 ? "#80C294" : "#DCECE0"} />
              </svg>
            </div>
            <div>
              <span className="text-xs font-bold text-[#1B241E] block">
                {plantTitle}
              </span>
              <span className="text-[11px] text-[#28583B] block">
                {plantDesc}
              </span>
            </div>
          </div>

          <span className="text-xs font-bold text-[#28583B] bg-white px-2.5 py-1 rounded-xl shadow-2xs border border-[#C8E4CD]">
            {plantBadge}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-brown-900/8 flex items-center justify-between text-[11px] text-brown-700/70">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-brown-700" />
          Konsistensi Bulan Ini: {currentMonthRate}%
        </span>
        <span className="font-bold text-emerald-700">
          {currentMonthRate === 0
            ? "Mulai Langkah Pertama"
            : currentMonthRate >= 50
            ? "Stabil & Tenang"
            : "Bertumbuh Sadar"}
        </span>
      </div>
    </div>
  );
}

