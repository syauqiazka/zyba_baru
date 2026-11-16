"use client";

import React from "react";
import { Compass, Wind, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export function LandingIntro() {
  return (
    <section id="about" className="py-24 sm:py-32 bg-[#F5F8F5] relative overflow-hidden border-t border-brown-900/6">
      {/* Subtle organic light behind container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[50vh] bg-radial from-[#EBF3ED]/60 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full space-y-16">
        
        {/* Section Header: Editorial & Restrained */}
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#3E7B54] uppercase tracking-widest bg-emerald-100/80 px-3.5 py-1 rounded-full shadow-2xs">
            <span>The ZYBA Sanctuary Philosophy</span>
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-900 tracking-tight leading-[1.15]">
            Three Pillars of Everyday Wellbeing.
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-brown-700 leading-relaxed">
            ZYBA dirancang khusus untuk generasi yang kerap kelelahan menghadapi bisingnya ekspektasi linimasa. Kami mengganti hitungan streak yang menekan dengan keheningan, ritme alami tubuh, dan ruang aman untuk kembali mengenal dirimu sendiri.
          </p>
        </div>

        {/* 3 Value Columns: Balanced Asymmetric Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Pillar 1: Understand Yourself (4 Columns) */}
          <div className="lg:col-span-4 rounded-3xl border border-brown-900/10 bg-white p-7 sm:p-9 shadow-xs hover:border-[#3E7B54]/40 transition-all flex flex-col justify-between group space-y-8">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#3E7B54] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Compass className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E7B54] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                  Pilar 01
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900">
                  Understand Yourself.
                </h3>
                <p className="text-xs sm:text-sm text-brown-700/80 leading-relaxed">
                  Kenali gejolak emosi dan sumber stres harian tanpa rasa bersalah. Melalui 15 indikator terstruktur serta refleksi bahasa batin bebas penghakiman, kamu belajar memahami pola emosi dirimu sendiri.
                </p>
              </div>

              <div className="pt-2 border-t border-brown-900/6 space-y-1.5 text-xs text-brown-800/90 font-medium">
                <p>Check-In Harian 15 Indikator Sadar</p>
                <p>Expression Analysis Tanpa Vonis</p>
                <p>Privasi 100% Terenkripsi Penuh</p>
              </div>
            </div>

            <Link
              href="/mood-check-in"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#3E7B54] group-hover:text-emerald-800 transition-colors pt-4"
            >
              <span>Mulai Pahami Dirimu</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Pillar 2: Build Healthy Habits (4 Columns) */}
          <div className="lg:col-span-4 rounded-3xl border border-brown-900/10 bg-white p-7 sm:p-9 shadow-xs hover:border-orange-500/40 transition-all flex flex-col justify-between group space-y-8">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Wind className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/60">
                  Pilar 02
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900">
                  Build Healthy Habits.
                </h3>
                <p className="text-xs sm:text-sm text-brown-700/80 leading-relaxed">
                  Susun kebiasaan harian secara manusiawi dalam 4 fase waktu (Pagi, Siang, Sore, Malam). Aktifkan sistem saraf parasimpatis lewat Taman Pernapasan 4-7-8 untuk menenangkan detak jantung dalam 3 menit.
                </p>
              </div>

              <div className="pt-2 border-t border-brown-900/6 space-y-1.5 text-xs text-brown-800/90 font-medium">
                <p>Smart Activity 4 Blok Ritme Harian</p>
                <p>Taman Pernapasan Sadar 4-7-8</p>
                <p>Tanpa Streak Menghukum Saat Lupa</p>
              </div>
            </div>

            <Link
              href="/activity"
              className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 group-hover:text-orange-800 transition-colors pt-4"
            >
              <span>Jelajahi Ritme Sehat</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Pillar 3: Connect With Others (4 Columns) */}
          <div className="lg:col-span-4 rounded-3xl border border-brown-900/10 bg-white p-7 sm:p-9 shadow-xs hover:border-teal-600/40 transition-all flex flex-col justify-between group space-y-8">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
                  Pilar 03
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900">
                  Connect With Others.
                </h3>
                <p className="text-xs sm:text-sm text-brown-700/80 leading-relaxed">
                  Ruang komunitas suportif tempat harga dirimu tidak diukur dari jumlah pengikut atau likes. Berbagi cerita secara anonim atau saling menguatkan lewat pesan langsung realtime tanpa iklan.
                </p>
              </div>

              <div className="pt-2 border-t border-brown-900/6 space-y-1.5 text-xs text-brown-800/90 font-medium">
                <p>Komunitas Berbagi Cerita & Anonim</p>
                <p>Pesan Langsung Privat via Ably</p>
                <p>Nol Iklan & Bebas Metrik Toksik</p>
              </div>
            </div>

            <Link
              href="/community"
              className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 group-hover:text-teal-900 transition-colors pt-4"
            >
              <span>Bergabung Bersama Teman</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
