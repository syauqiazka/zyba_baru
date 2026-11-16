"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  Wind,
  Smile,
  Activity,
  BookOpen,
  Users,
  ArrowRight,
  ShieldCheck,
  Sparkle,
} from "lucide-react";

export function LandingEcosystem() {
  return (
    <section id="ecosystem" className="py-24 sm:py-32 bg-[#F5F8F5] relative overflow-hidden border-t border-brown-900/6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full space-y-20">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#3E7B54] uppercase tracking-widest bg-emerald-100/80 px-3.5 py-1 rounded-full shadow-2xs">
            <span>Authentic Product Capabilities</span>
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-900 tracking-tight leading-[1.15]">
            Everything You Need to Restore Your Everyday Pace.
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-brown-700 leading-relaxed">
            Bukan sekadar mockup statis. Setiap modul di bawah ini beroperasi penuh dengan basis data nyata, model bahasa empatik, serta protokol keselamatan yang melindungi ruang privasimu.
          </p>
        </div>

        {/* ========================================================
            FEATURE 1: ZYBA COMPANION (ZIBI AI) — ASYMMETRIC HERO SPLIT
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-10 lg:p-12 shadow-xs">
          {/* Left Column (7 Cols): Real Companion Screen Mockup */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-brown-900/10 shadow-md group relative">
            {/* Top Browser Bar */}
            <div className="h-8 bg-[#F3F6F3] border-b border-brown-900/8 px-4 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
              <span className="ml-2 text-[10px] text-brown-700/60 font-mono">
                zyba.my.id/companion
              </span>
            </div>

            <div className="relative aspect-[16/10] w-full bg-[#1B241E]">
              <Image
                src="/images/previews/companion.png"
                alt="Antarmuka Nyata Zyba Companion AI"
                fill
                className="object-cover object-top group-hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Column (5 Cols): Editorial Copy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#3E7B54] text-xs font-bold">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Pendamping Empatik 24/7</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brown-900 leading-tight">
              Curhat Tanpa Batas, Didampingi dengan Keheningan Sadar.
            </h3>

            <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
              Zibi AI siap mendengarkan cerita, kecemasan, atau kekusutan pikiranmu kapan saja. Dilengkapi kuota 15.000 token per siklus dan <strong>Jeda Batin 5 Jam</strong> untuk mencegah ketergantungan digital dan mendorong pemulihan di dunia nyata.
            </p>

            <div className="space-y-2.5 text-xs text-brown-800 font-semibold pt-2 border-t border-brown-900/6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E7B54]" />
                <span>Rantai AI Cerdas Bebas Biaya (Multi-Provider Fallback)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E7B54]" />
                <span>Dukungan Suara Realtime & Transkrip Groq Whisper</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3E7B54]" />
                <span>Deteksi Krisis Tenang (Hotline 119 Selalu Siaga)</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/companion"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3E7B54] hover:bg-[#346B48] active:scale-98 text-white font-bold text-xs shadow-xs transition-all"
              >
                <span>Buka Percakapan Bersama Zibi</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================
            FEATURE 2 & 3: SMART ACTIVITY & MOOD CHECK-IN (2-COL BALANCED)
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Feature 2: Smart Activity & Breathing Garden */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 hover:border-orange-500/30 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Ritme Harian & Pernapasan</span>
                </div>
                <span className="text-[10px] text-brown-700/60 font-semibold uppercase">Modul 02</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900">
                Smart Activity Planner & Breathing Garden 4-7-8
              </h3>

              <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
                Agenda sadar yang dikelompokkan ke dalam 4 fase waktu alami: Pagi, Siang, Sore, dan Malam. Disertai panduan ritme pernapasan hening 4-7-8 untuk menurunkan hormon stres secara fisiologis.
              </p>

              {/* Preview image */}
              <div className="rounded-2xl overflow-hidden border border-brown-900/10 shadow-2xs relative aspect-[16/10] bg-[#F5F8F5]">
                <Image
                  src="/images/previews/activity.png"
                  alt="Tampilan Fitur Smart Activity Planner"
                  fill
                  className="object-cover object-top group-hover:scale-[1.01] transition-transform duration-500"
                />
              </div>
            </div>

            <Link
              href="/activity"
              className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 group-hover:text-orange-800 transition-colors pt-2"
            >
              <span>Jelajahi Agenda Sehat & Napas</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature 3: Daily Assessment & Mood Check-In */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 hover:border-[#3E7B54]/30 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#3E7B54] text-xs font-bold">
                  <Smile className="w-3.5 h-3.5" />
                  <span>Refleksi Jiwa Harian</span>
                </div>
                <span className="text-[10px] text-brown-700/60 font-semibold uppercase">Modul 03</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900">
                Daily Assessment & 15 Indikator Mood Check
              </h3>

              <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
                Evaluasi terstruktur 15 pertanyaan terpadu yang memetakan aspek mental, fisik, dan sosialmu dalam waktu kurang dari 2 menit. Menghasilkan skor keseimbangan tanpa penghakiman.
              </p>

              {/* Preview image */}
              <div className="rounded-2xl overflow-hidden border border-brown-900/10 shadow-2xs relative aspect-[16/10] bg-[#F5F8F5]">
                <Image
                  src="/images/previews/mood-check.png"
                  alt="Tampilan Fitur Mood Check-In Harian"
                  fill
                  className="object-cover object-top group-hover:scale-[1.01] transition-transform duration-500"
                />
              </div>
            </div>

            <Link
              href="/mood-check-in"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#3E7B54] group-hover:text-emerald-800 transition-colors pt-2"
            >
              <span>Mulai Check-In Harian</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

        {/* ========================================================
            FEATURE 4: WELLNESS JOURNEY & ZYBA SCORE (WIDE EDITORIAL)
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-10 lg:p-12 shadow-xs">
          {/* Left Column (5 Cols): Editorial Copy */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>Pelacakan Komprehensif</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brown-900 leading-tight">
              Ruang Sehat & Zyba Score: Pahami Ritme Pertumbuhanmu.
            </h3>

            <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
              Skor ZYBA (0–100) dihitung dinamis dari rolling window 7 hari dengan rumus terukur: <strong>Mental (50%)</strong>, <strong>Fisik (25%)</strong>, dan <strong>Sosial (25%)</strong>. Dilengkapi grafik kurva pemulihan, riwayat check-in, serta Lilin Jiwa yang menjaga konsistensi tanpa beban.
            </p>

            <div className="space-y-2 text-xs text-brown-800 font-semibold pt-2 border-t border-brown-900/6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                <span>Analisis 3 Aspek Hidup Tanpa Angka Palsu</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                <span>Jurnal Refleksi dengan Deteksi Risiko Mandiri</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                <span>100% Gratis dan Terbuka Penuh Tanpa Paywall</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/wellness-journey"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-700 hover:bg-teal-800 active:scale-98 text-white font-bold text-xs shadow-xs transition-all"
              >
                <span>Lihat Analisis Ruang Sehat</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Right Column (7 Cols): Real Wellness Journey Screen Mockup */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-brown-900/10 shadow-md group relative order-1 lg:order-2">
            <div className="h-8 bg-[#F3F6F3] border-b border-brown-900/8 px-4 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
              <span className="ml-2 text-[10px] text-brown-700/60 font-mono">
                zyba.my.id/wellness-journey
              </span>
            </div>

            <div className="relative aspect-[16/10] w-full bg-white">
              <Image
                src="/images/previews/wellness.png"
                alt="Antarmuka Nyata Wellness Journey & Zyba Score"
                fill
                className="object-cover object-top group-hover:scale-[1.01] transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            FEATURE 5 & 6: HEALTH ARTICLES & COMMUNITY (2-COL BALANCED)
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Feature 5: Health Articles (Resources) */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 hover:border-[#3E7B54]/30 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#3E7B54] text-xs font-bold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Wawasan Berbasis Bukti</span>
                </div>
                <span className="text-[10px] text-brown-700/60 font-semibold uppercase">Modul 05</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900">
                Health Articles & Audio Relaksasi Suaka
              </h3>

              <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
                Koleksi artikel kesehatan mental, manajemen stres, dan ritme sirkadian yang dikurasi khusus dalam bahasa Indonesia bersahabat untuk Gen Z. Dilengkapi generator audio frekuensi penenang.
              </p>

              <div className="rounded-2xl overflow-hidden border border-brown-900/10 shadow-2xs relative aspect-[16/10] bg-[#F5F8F5]">
                <Image
                  src="/images/previews/resources.png"
                  alt="Tampilan Fitur Resources ZYBA"
                  fill
                  className="object-cover object-top group-hover:scale-[1.01] transition-transform duration-500"
                />
              </div>
            </div>

            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#3E7B54] group-hover:text-emerald-800 transition-colors pt-2"
            >
              <span>Baca Wawasan Lengkap</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Feature 6: Community & Peer Messages */}
          <div className="rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 hover:border-teal-600/30 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                  <Users className="w-3.5 h-3.5" />
                  <span>Lingkaran Aman & Terbuka</span>
                </div>
                <span className="text-[10px] text-brown-700/60 font-semibold uppercase">Modul 06</span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900">
                Zyba Community & Pesan Langsung Realtime
              </h3>

              <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
                Feed terkurasi tanpa tombol viralitas toksik. Berbagi cerita secara jujur lewat opsi anonim, mengomentari postingan teman, atau berdialog dua arah via pesan terenkripsi realtime Ably.
              </p>

              <div className="rounded-2xl overflow-hidden border border-brown-900/10 shadow-2xs relative aspect-[16/10] bg-[#F5F8F5]">
                <Image
                  src="/images/previews/community.png"
                  alt="Tampilan Fitur Community ZYBA"
                  fill
                  className="object-cover object-top group-hover:scale-[1.01] transition-transform duration-500"
                />
              </div>
            </div>

            <Link
              href="/community"
              className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 group-hover:text-teal-900 transition-colors pt-2"
            >
              <span>Kunjungi Komunitas Teman</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
