"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";

export function LandingCtaFooter() {
  return (
    <footer className="bg-[#1B241E] text-white pt-20 pb-12 overflow-hidden relative">
      {/* Subtle Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16 relative z-10">
        
        {/* FINAL HERO CTA BANNER (Sesuai Foto 3 Bagian Bawah) */}
        <div className="rounded-3xl sm:rounded-[36px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5 sm:p-12 lg:p-16 text-center max-w-4xl mx-auto space-y-6 shadow-2xl backdrop-blur-md">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-1 rounded-full">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Suaka Ketenangan Batin</span>
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Napas yang Lega Dimulai dari Langkah Kecil Hari Ini
          </h2>

          <p className="text-xs sm:text-sm text-white/75 leading-relaxed max-w-xl mx-auto">
            Tidak ada tuntutan kesempurnaan. Masuklah ke ruang suaka yang hangat, temukan kembali kedamaian batinmu, dan rasakan kehadiran tanpa tekanan.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-brown-900 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <span>Daftar Akun Gratis Sekarang</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/20 hover:bg-white/10 text-white font-bold text-xs transition-all"
            >
              <span>Sudah Punya Akun? Masuk</span>
            </Link>
          </div>
        </div>

        {/* BOTTOM SITEMAP & BRANDING */}
        <div className="pt-12 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-10 text-xs">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3E7B54] text-white">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-3.5H7.5l7-8.5v4.5h3.5l-7 7.5z" />
                </svg>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                ZYBA
              </span>
            </div>
            <p className="text-white/60 leading-relaxed">
              Gen Z Wellness Support. Suaka pendampingan kesehatan mental, fisik, dan sosial berbasis AI yang ramah, hangat, dan tanpa beban.
            </p>
            <span className="text-[11px] text-white/40 block font-mono">
              © {new Date().getFullYear()} ZYBA Sanctuary. All rights reserved.
            </span>
          </div>

          {/* Col 2: Navigasi Suaka */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">
              Navigasi Suaka
            </h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link href="/companion" className="hover:text-white transition-colors">
                  Zyba Companion AI
                </Link>
              </li>
              <li>
                <Link href="/activity" className="hover:text-white transition-colors">
                  Breathing Garden 4-7-8
                </Link>
              </li>
              <li>
                <Link href="/wellness-journey" className="hover:text-white transition-colors">
                  Ruang Sehat & Skor
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Wawasan Sehat Terkurasi
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-white transition-colors">
                  Komunitas Suaka
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Keamanan & Etika */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">
              Keamanan & Etika
            </h4>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link href="/guidebook" className="hover:text-white transition-colors">
                  Panduan Bantuan Krisis 24/7
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-white transition-colors">
                  Kendali Privasi & Ekspor Data
                </Link>
              </li>
              <li>
                <span className="text-white/50 block">Hotline Darurat Kemenkes: 119</span>
              </li>
              <li>
                <span className="text-white/50 block">Bebas Biaya 100% Selamanya</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Disclaimer Medis Resmi */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#3E7B54]" />
              <span>Pernyataan Keselamatan</span>
            </h4>
            <p className="text-[11px] text-white/60 leading-relaxed">
              ZYBA adalah suaka pendampingan reflektif dan mindfulness untuk gaya hidup sehat generasi muda. ZYBA <strong>bukan pengganti</strong> tenaga medis profesional, diagnosis klinis, atau resep psikiatri. Jika Anda berada dalam situasi krisis atau membutuhkan bantuan darurat, segera hubungi layanan <strong>119</strong>.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
