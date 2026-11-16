"use client";

import React, { useEffect } from "react";
import { Sparkles, X, Clock, Wind, BookOpen, Coffee } from "lucide-react";
import { Mascot } from "@/components/ui/Mascot";

interface QuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  cooldownRemainingSec?: number;
}

export function QuotaModal({
  isOpen,
  onClose,
  cooldownRemainingSec = 18000,
}: QuotaModalProps) {
  // Close on Escape key (antislop-human R-26)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hours = Math.floor(cooldownRemainingSec / 3600);
  const minutes = Math.floor((cooldownRemainingSec % 3600) / 60);
  const seconds = cooldownRemainingSec % 60;

  const formatPad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quota-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-xs animate-in fade-in duration-200 motion-reduce:transition-none"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-botanical-500/15 text-center">
        {/* Close Button with keyboard focus indicator */}
        <button
          onClick={onClose}
          aria-label="Tutup dialog kuota dan jeda batin"
          className="absolute top-4 right-4 p-2 text-charcoal-900/50 hover:text-charcoal-900 rounded-full hover:bg-cream transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
        >
          <X className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Mascot in Sleep Pose */}
        <div className="mb-3 flex justify-center">
          <Mascot pose="sleep" size={110} animate={false} decorative={true} />
        </div>

        {/* Badge: High contrast brown text on peach-100 per DESIGN.md §2.2 */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-100 text-charcoal-900 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-botanical-600" /> Jeda Batin Mindful ZYBA
        </span>

        <h3
          id="quota-modal-title"
          className="text-xl sm:text-2xl font-display font-bold text-charcoal-900 mb-2 tabular-nums"
        >
          Batas 15.000 Token Sesi Tercapai
        </h3>

        <p className="text-xs sm:text-sm text-charcoal-900/70 leading-relaxed mb-5 max-w-md mx-auto">
          Kamu telah meluapkan banyak pikiran dalam sesi ini. Agar pikiranmu tidak terus bergantung pada AI, ZYBA memberi ruang istirahat selama <strong>5 jam</strong> agar batinmu bisa mengendap di dunia nyata.
        </p>

        {/* Live Countdown Timer Box */}
        <div className="p-4 rounded-2xl bg-cream border border-botanical-500/15 mb-5 flex flex-col items-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-900/60 mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-botanical-600" /> Waktu Jeda Tersisa
          </span>
          <div className="flex items-center gap-2 font-mono text-2xl sm:text-3xl font-extrabold text-botanical-700">
            <div className="bg-white px-3 py-1.5 rounded-xl border border-botanical-500/20 shadow-2xs">
              {formatPad(hours)}
              <span className="block text-[9px] font-sans font-normal text-charcoal-900/60">Jam</span>
            </div>
            <span aria-hidden="true">:</span>
            <div className="bg-white px-3 py-1.5 rounded-xl border border-botanical-500/20 shadow-2xs">
              {formatPad(minutes)}
              <span className="block text-[9px] font-sans font-normal text-charcoal-900/60">Menit</span>
            </div>
            <span aria-hidden="true">:</span>
            <div className="bg-white px-3 py-1.5 rounded-xl border border-botanical-500/20 shadow-2xs">
              {formatPad(seconds)}
              <span className="block text-[9px] font-sans font-normal text-charcoal-900/60">Detik</span>
            </div>
          </div>
          <span className="text-[10px] text-charcoal-900/50 mt-2">
            Setelah jeda 5 jam selesai, kuota 15.000 token akan ter-reset penuh otomatis.
          </span>
        </div>

        {/* Mindful Offline Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 text-left">
          <div className="p-3 rounded-xl bg-white border border-botanical-500/10 shadow-2xs">
            <Wind className="w-4 h-4 text-botanical-600 mb-1" />
            <p className="text-xs font-bold text-charcoal-900">Latihan 4-7-8</p>
            <p className="text-[10px] text-charcoal-900/70 leading-tight mt-0.5">
              Ambil nafas 4 detik, tahan 7, hembuskan 8.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-botanical-500/10 shadow-2xs">
            <BookOpen className="w-4 h-4 text-botanical-600 mb-1" />
            <p className="text-xs font-bold text-charcoal-900">Jurnal Kertas</p>
            <p className="text-[10px] text-charcoal-900/70 leading-tight mt-0.5">
              Tulis 1 hal yang kamu syukuri hari ini.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-botanical-500/10 shadow-2xs">
            <Coffee className="w-4 h-4 text-botanical-600 mb-1" />
            <p className="text-xs font-bold text-charcoal-900">Air Hangat & Jeda</p>
            <p className="text-[10px] text-charcoal-900/70 leading-tight mt-0.5">
              Regangkan leher dan istirahatkan matamu.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-full bg-botanical-500 hover:bg-botanical-600 text-white font-medium text-xs sm:text-sm transition-colors shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500 focus-visible:ring-offset-2"
        >
          Baik, Aku Siap Beristirahat Sejenak
        </button>
      </div>
    </div>
  );
}
