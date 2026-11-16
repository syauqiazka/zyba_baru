"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowUpRight } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#18261E] text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full space-y-12">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Brand & Emergency Notice (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3E7B54] text-white shadow-xs">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-3.5H7.5l7-8.5v4.5h3.5l-7 7.5z" />
                </svg>
              </div>
              <div>
                <span className="font-serif text-2xl font-black tracking-tight text-white block">
                  ZYBA
                </span>
                <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block -mt-1">
                  Digital Sanctuary Experience
                </span>
              </div>
            </Link>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              Suaka pendampingan kesehatan mental, fisik, dan sosial berbasis AI. Tenang, hangat, tanpa streak api yang menekan, dan 100% bebas biaya selamanya untuk setiap insan muda.
            </p>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 space-y-1.5 max-w-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-300">
                <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Pemberitahuan Keselamatan Darurat</span>
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed">
                ZYBA adalah pendamping kesejahteraan, bukan pengganti tenaga medis. Jika kamu dalam krisis berat, hubungi <strong>Hotline Jiwa 119</strong> segera.
              </p>
            </div>
          </div>

          {/* Column 2: Navigasi Suaka (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-sm font-bold text-white tracking-wide uppercase">
              Fitur Suaka
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/companion" className="hover:text-emerald-300 transition-colors">
                  Zyba Companion (Zibi)
                </Link>
              </li>
              <li>
                <Link href="/mood-check-in" className="hover:text-emerald-300 transition-colors">
                  Check-In Harian
                </Link>
              </li>
              <li>
                <Link href="/activity" className="hover:text-emerald-300 transition-colors">
                  Smart Activity Planner
                </Link>
              </li>
              <li>
                <Link href="/activity?tab=breathing" className="hover:text-emerald-300 transition-colors">
                  Taman Pernapasan 4-7-8
                </Link>
              </li>
              <li>
                <Link href="/wellness-journey" className="hover:text-emerald-300 transition-colors">
                  Ruang Sehat & Skor ZYBA
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Ekosistem & Wawasan (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-sm font-bold text-white tracking-wide uppercase">
              Wawasan & Ruang
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/resources" className="hover:text-emerald-300 transition-colors">
                  Health Articles
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-emerald-300 transition-colors">
                  Audio Relaksasi
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-emerald-300 transition-colors">
                  Zyba Community
                </Link>
              </li>
              <li>
                <Link href="/guidebook" className="hover:text-emerald-300 transition-colors">
                  Direktori Krisis 119
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-emerald-300 transition-colors">
                  Mulai Pendaftaran
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Keamanan & Kontak (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-sm font-bold text-white tracking-wide uppercase">
              Keamanan & Privasi
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/settings" className="hover:text-emerald-300 transition-colors">
                  Pengaturan Privasi & Data
                </Link>
              </li>
              <li>
                <span className="text-white/50 block">Ekspor JSON Mandiri</span>
              </li>
              <li>
                <span className="text-white/50 block">Penghapusan Akun 3 Database</span>
              </li>
              <li>
                <span className="text-white/50 block">Kontak: suaka@zyba.my.id</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 font-medium">
          <p>© 2026 ZYBA Sanctuary. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="/guidebook" className="hover:text-white transition-colors">
              Bantuan Krisis
            </Link>
            <Link href="/settings" className="hover:text-white transition-colors">
              Privasi
            </Link>
            <Link href="/settings" className="hover:text-white transition-colors">
              Ketentuan
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
