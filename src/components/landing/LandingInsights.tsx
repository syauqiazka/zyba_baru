"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Activity, Flame, ShieldCheck, Heart, ArrowRight } from "lucide-react";

export function LandingInsights() {
  return (
    <section id="insights" className="py-24 sm:py-32 bg-[#F5F8F5] relative overflow-hidden border-t border-brown-900/6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#3E7B54] uppercase tracking-widest bg-emerald-100/80 px-3.5 py-1 rounded-full shadow-2xs">
            <span>Evidence-Based Measurement</span>
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-900 tracking-tight leading-[1.15]">
            Pahami Bagaimana Keseimbangan Batinmu Bertumbuh.
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-brown-700 leading-relaxed">
            ZYBA tidak menggunakan angka karangan atau metrik gamifikasi yang membuat cemas. Seluruh analisis dibangun di atas data nyata dari Check-In Harianmu melalui pembobotan 3 pilar terukur.
          </p>
        </div>

        {/* 3 Value Cards: The Real Mathematical & Behavioral Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Pillar 1: Rumus Terbuka Skor ZYBA */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#3E7B54] flex items-center justify-center shadow-2xs">
                <Activity className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-brown-900">
                  Rumus Terbuka Skor ZYBA
                </h3>
                <p className="text-xs text-brown-700/80 leading-relaxed">
                  Skor 0–100 dihitung adil berdasarkan jendela bergulir 7 hari tanpa asumsi algoritma tersembunyi.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F8F5] border border-brown-900/8 font-mono text-[11px] text-[#28583B] space-y-1">
                <div className="font-bold">Skor = M*0.5 + F*0.25 + S*0.25</div>
                <div className="text-[10px] text-brown-700/70 font-sans">
                  Data belum cukup → Tampil jujur &ldquo;Belum Cukup Data&rdquo;, bukan angka palsu.
                </div>
              </div>
            </div>

            <span className="text-[10px] font-bold text-[#3E7B54] uppercase tracking-wider block">
              100% Transparan & Ilmiah
            </span>
          </div>

          {/* Pillar 2: 3 Sumbu Keseimbangan */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shadow-2xs">
                <Heart className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-brown-900">
                  Tiga Sumbu Pemulihan
                </h3>
                <p className="text-xs text-brown-700/80 leading-relaxed">
                  Kesehatan jiwa tidak berdiri sendiri. ZYBA menyeimbangkan 3 aspek vital setiap hari.
                </p>
              </div>

              <div className="space-y-2 text-xs text-brown-800 font-semibold pt-1">
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span>Mental (Mood & Regulasi Stres)</span>
                  <span className="text-[#3E7B54] font-bold">50%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-orange-50/60 border border-orange-100">
                  <span>Fisik (Kualitas Tidur & Energi)</span>
                  <span className="text-orange-700 font-bold">25%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-teal-50/60 border border-teal-100">
                  <span>Sosial (Dukungan & Koneksi)</span>
                  <span className="text-teal-700 font-bold">25%</span>
                </div>
              </div>
            </div>

            <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
              Holistik & Seimbang
            </span>
          </div>

          {/* Pillar 3: Lilin Jiwa (Hearth Flame) */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-2xs">
                <Flame className="w-5 h-5 fill-orange-500" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-brown-900">
                  Lilin Jiwa (Hearth Flame)
                </h3>
                <p className="text-xs text-brown-700/80 leading-relaxed">
                  Konsistensi batin yang dirawat dengan kelembutan. Kami menolak streak api merah menyala yang menekan secara psikologis.
                </p>
              </div>

              <p className="text-xs text-brown-700/80 leading-relaxed p-3.5 rounded-2xl bg-[#F5F8F5] border border-brown-900/8">
                Saat kamu melewatkan satu hari, lilinmu tetap hangat. Tidak ada notifikasi bersalah, tidak ada hitung mundur panik.
              </p>
            </div>

            <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider block">
              Tanpa Toxic Streak
            </span>
          </div>

        </div>

        {/* Real Product Interface Showcase: Wellness Journey */}
        <div className="rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E7B54] block">
                Tangkapan Layar Langsung
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900">
                Antarmuka Ruang Sehat & Riwayat Kesejahteraan
              </h3>
            </div>

            <Link
              href="/wellness-journey"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3E7B54] text-white text-xs font-bold hover:bg-[#346B48] transition-all self-start sm:self-auto"
            >
              <span>Buka Ruang Sehat</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          <div className="rounded-2xl overflow-hidden border border-brown-900/10 shadow-md relative aspect-[16/9] w-full bg-[#F5F8F5]">
            <Image
              src="/images/previews/wellness.png"
              alt="Tangkapan Layar Asli Fitur Ruang Sehat ZYBA"
              fill
              className="object-cover object-top"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
