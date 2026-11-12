"use client";

import React from "react";
import { Moon, Sparkles, X, Heart } from "lucide-react";

interface QuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuotaModal({ isOpen, onClose }: QuotaModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-botanical-500/15 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup dialog"
          className="absolute top-4 right-4 p-2 text-charcoal-900/40 hover:text-charcoal-900 rounded-full hover:bg-cream transition-colors"
        >
          <X className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Calm Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-botanical-100 flex items-center justify-center text-botanical-600">
          <Moon className="w-8 h-8 stroke-[1.8]" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach-100 text-peach-600 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Ruang Istirahat Hari Ini
        </span>

        <h3 className="text-xl font-serif font-bold text-charcoal-900 mb-2">
          Kuota Curhat Harian Selesai (20/20)
        </h3>

        <p className="text-sm text-charcoal-900/70 leading-relaxed mb-6">
          Kamu sudah mencurahkan banyak hal hari ini. Memberi jeda bagi pikiran dan perasaan untuk
          mengendap sama pentingnya dengan bercerita. Sesi curhat barumu akan segar kembali besok pukul 00:00 WIB.
        </p>

        <div className="p-4 rounded-2xl bg-cream border border-botanical-500/10 mb-6 text-left">
          <p className="text-xs font-medium text-charcoal-900 mb-1 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-botanical-600" /> Saran Mindful Saat Jeda:
          </p>
          <ul className="text-xs text-charcoal-900/70 space-y-1 list-disc list-inside">
            <li>Coba latihan pernapasan sejenak di Smart Activity Planner</li>
            <li>Tulis jurnal bebas tentang satu hal yang kamu syukuri hari ini</li>
            <li>Minum segelas air putih hangat dan istirahatkan mata</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-botanical-500 hover:bg-botanical-600 text-white font-medium text-sm transition-colors shadow-sm"
        >
          Baik, Aku Mengerti & Ingin Istirahat
        </button>
      </div>
    </div>
  );
}

