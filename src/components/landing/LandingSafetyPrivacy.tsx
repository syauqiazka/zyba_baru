"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Heart, PhoneCall, ArrowRight } from "lucide-react";

export function LandingSafetyPrivacy() {
  return (
    <section id="safety" className="py-24 sm:py-32 bg-[#F5F8F5] relative overflow-hidden border-t border-brown-900/6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#3E7B54] uppercase tracking-widest bg-emerald-100/80 px-3.5 py-1 rounded-full shadow-2xs">
            <span>Transparency & Responsible Care</span>
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-900 tracking-tight leading-[1.15]">
            Ruang Suaka yang Dijaga dengan Integritas.
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-brown-700 leading-relaxed">
            Kesehatan mental membutuhkan rasa aman yang mutlak. Kami tidak menjual datamu, tidak menyamarkan keterbatasan AI, dan selalu menempatkan keselamatan jiwa di atas segalanya.
          </p>
        </div>

        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Pillar 1: Privasi Penuh */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-7 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#3E7B54] flex items-center justify-center shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-brown-900">
                Privasi Penuh & Nol Iklan
              </h3>
              <p className="text-xs text-brown-700/80 leading-relaxed">
                Seluruh curhat, jurnal, dan penilaian batinmu disimpan secara privat di server terlindungi. Kami tidak menjual data pengguna kepada broker iklan apa pun.
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#3E7B54] uppercase tracking-wider block pt-2 border-t border-brown-900/6">
              Cookie JWT httpOnly Aman
            </span>
          </div>

          {/* Pillar 2: Kendali Akun Mutlak */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-7 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shadow-2xs">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-brown-900">
                Kendali Akun Sepenuhnya
              </h3>
              <p className="text-xs text-brown-700/80 leading-relaxed">
                Kamu memiliki hak mutlak atas datamu. Ekspor seluruh riwayat ke format JSON kapan saja atau hapus akun permanen yang membersihkan 3 database secara tuntas.
              </p>
            </div>
            <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block pt-2 border-t border-brown-900/6">
              Ekspor & Hapus 3 DB
            </span>
          </div>

          {/* Pillar 3: AI Bertanggung Jawab */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-7 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-2xs">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-brown-900">
                Batasan AI & Anti-Adiksi
              </h3>
              <p className="text-xs text-brown-700/80 leading-relaxed">
                Zibi adalah pendamping empatik, bukan pengganti tenaga medis atau diagnosis klinis. Batas 15.000 token dan Jeda Batin 5 Jam menjaga interaksi tetap sehat.
              </p>
            </div>
            <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider block pt-2 border-t border-brown-900/6">
              Etika AI Transparan
            </span>
          </div>

          {/* Pillar 4: Dukungan Krisis 24/7 */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-7 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shadow-2xs">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-brown-900">
                Direktori Bantuan Krisis
              </h3>
              <p className="text-xs text-brown-700/80 leading-relaxed">
                Jika sistem mendeteksi sinyal keputusasaan berat, ZYBA langsung menampilkan saluran bantuan hotline profesional 119 tanpa nada menghakimi atau warna panik.
              </p>
            </div>
            <Link
              href="/guidebook"
              className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block pt-2 border-t border-brown-900/6 hover:underline"
            >
              Lihat Hotline Krisis 119 →
            </Link>
          </div>

        </div>

        {/* Responsible Care Banner */}
        <div className="rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-base font-bold text-brown-900">
              Butuh panduan pertolongan pertama emosional saat ini?
            </h4>
            <p className="text-xs text-brown-700/80">
              Direktori krisis dan panduan napas darurat ZYBA terbuka untuk umum tanpa perlu membuat akun atau login.
            </p>
          </div>

          <Link
            href="/guidebook"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-orange-500/40 bg-orange-100/70 hover:bg-orange-100 text-orange-950 text-xs font-bold transition-all shrink-0 shadow-2xs"
          >
            <PhoneCall className="w-4 h-4 text-orange-700" />
            <span>Buka Direktori Krisis & Guidebook</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
