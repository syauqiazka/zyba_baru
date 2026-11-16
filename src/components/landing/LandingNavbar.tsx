"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Menu, X } from "lucide-react";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F5F8F5]/90 backdrop-blur-md border-b border-brown-900/10 shadow-2xs py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3E7B54] text-white shadow-xs group-hover:scale-105 transition-transform">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-3.5H7.5l7-8.5v4.5h3.5l-7 7.5z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl font-black tracking-tight text-brown-900">
                ZYBA
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#3E7B54] tracking-wider uppercase">
                Sanctuary
              </span>
            </div>
            <span className="text-[10px] text-brown-700/60 block font-medium -mt-0.5">
              Digital Wellness Experience
            </span>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-brown-700">
          <a href="#about" className="hover:text-brown-900 transition-colors">
            Filosofi
          </a>
          <a href="#ecosystem" className="hover:text-brown-900 transition-colors">
            Ekosistem
          </a>
          <a href="#zibi" className="hover:text-brown-900 transition-colors">
            Sahabat Zibi
          </a>
          <a href="#insights" className="hover:text-brown-900 transition-colors">
            Skor & Wawasan
          </a>
          <a href="#articles" className="hover:text-brown-900 transition-colors">
            Bacaan
          </a>
          <a href="#safety" className="hover:text-brown-900 transition-colors">
            Keamanan & Privasi
          </a>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/guidebook"
            className="text-xs font-semibold text-brown-700/80 hover:text-brown-900 transition-colors flex items-center gap-1.5 px-3 py-1.5"
          >
            <ShieldCheck className="h-4 w-4 text-[#3E7B54]" />
            <span>Krisis 119</span>
          </Link>

          {/* Tombol Sign In */}
          <Link
            href="/login"
            className="text-xs font-bold text-brown-900 hover:text-[#3E7B54] transition-colors px-4 py-2 rounded-full hover:bg-brown-900/5"
          >
            Masuk
          </Link>

          {/* Tombol Sign Up (Primary Warm CTA) */}
          <Link
            href="/onboarding"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-5 text-xs font-bold text-brown-900 shadow-xs transition-all active:scale-95"
          >
            <span>Mulai Suaka</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </Link>
        </div>

        {/* Mobile Action Buttons: Masuk & Daftar Akun Langsung */}
        <div className="flex sm:hidden items-center gap-1.5">
          <Link
            href="/login"
            className="text-xs font-bold text-brown-900 hover:text-[#3E7B54] px-2.5 py-1.5 rounded-lg"
          >
            Masuk
          </Link>

          <Link
            href="/onboarding"
            className="inline-flex h-8 items-center gap-1 rounded-full bg-orange-500 hover:bg-orange-600 px-3 text-[11px] font-bold text-brown-900 shadow-2xs active:scale-95 whitespace-nowrap"
          >
            <span>Daftar</span>
            <ArrowRight className="h-3 w-3 stroke-[2.5]" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl text-brown-800 hover:bg-brown-900/5 transition-colors ml-0.5"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-brown-900/10 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-bold text-brown-800">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-brown-900/5 hover:text-[#3E7B54] transition-colors"
            >
              Filosofi Suaka
            </a>
            <a
              href="#ecosystem"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-brown-900/5 hover:text-[#3E7B54] transition-colors"
            >
              Ekosistem Fitur
            </a>
            <a
              href="#zibi"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-brown-900/5 hover:text-[#3E7B54] transition-colors"
            >
              Sahabat Zibi
            </a>
            <a
              href="#insights"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-brown-900/5 hover:text-[#3E7B54] transition-colors"
            >
              Skor & Wawasan
            </a>
            <a
              href="#articles"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-brown-900/5 hover:text-[#3E7B54] transition-colors"
            >
              Bacaan Mindful
            </a>
            <a
              href="#safety"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-brown-900/5 hover:text-[#3E7B54] transition-colors"
            >
              Keamanan & Privasi
            </a>
            <Link
              href="/guidebook"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 flex items-center gap-2 text-orange-900 hover:text-orange-950 font-bold"
            >
              <ShieldCheck className="h-4 w-4 text-orange-600" />
              <span>Direktori Bantuan Krisis 119</span>
            </Link>
          </nav>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/onboarding"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-brown-900 font-bold text-xs shadow-xs"
            >
              <span>Mulai Perjalanan Tenangmu</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center py-2.5 rounded-2xl border border-brown-900/10 text-brown-900 font-semibold text-xs hover:bg-brown-900/5"
            >
              Masuk ke Akun
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
