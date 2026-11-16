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
              Gen Z Wellness Support
            </span>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-brown-700">
          <a href="#fitur" className="hover:text-brown-900 transition-colors">
            Fitur Suaka
          </a>
          <a href="#alur" className="hover:text-brown-900 transition-colors">
            Alur 3 Langkah
          </a>
          <a href="#ekosistem" className="hover:text-brown-900 transition-colors">
            Ekosistem
          </a>
          <a href="#nilai" className="hover:text-brown-900 transition-colors">
            Nilai Kami
          </a>
          <a href="#faq" className="hover:text-brown-900 transition-colors">
            Tanya Jawab
          </a>
        </nav>

        {/* Right Action Buttons (Sesuai Foto 4: Sign In & Sign Up) */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/guidebook"
            className="text-xs font-semibold text-brown-700/80 hover:text-brown-900 transition-colors flex items-center gap-1.5 px-3 py-1.5"
          >
            <ShieldCheck className="h-4 w-4 text-[#3E7B54]" />
            <span>Bantuan Krisis</span>
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
            <span>Daftar Akun</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </Link>
        </div>

        {/* Mobile Action Buttons: Masuk & Daftar Akun Langsung */}
        <div className="flex sm:hidden items-center gap-1.5">
          <Link
            href="/login"
            className="text-xs font-bold text-brown-800 px-2.5 py-1.5 rounded-full hover:bg-brown-900/5 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-500 text-xs font-bold text-brown-900 shadow-2xs hover:bg-orange-600 transition-all active:scale-95"
          >
            <span>Daftar</span>
            <ArrowRight className="w-3 h-3 stroke-[2.5]" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl text-brown-900 hover:bg-brown-900/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-brown-900/10 bg-[#F5F8F5]/98 px-6 py-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-3 text-sm font-bold text-brown-900">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-brown-700 hover:text-brown-900"
            >
              Fitur Suaka
            </a>
            <a
              href="#alur"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-brown-700 hover:text-brown-900"
            >
              Alur 3 Langkah
            </a>
            <a
              href="#ekosistem"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-brown-700 hover:text-brown-900"
            >
              Ekosistem
            </a>
            <a
              href="#nilai"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-brown-700 hover:text-brown-900"
            >
              Nilai Kami
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-brown-700 hover:text-brown-900"
            >
              Tanya Jawab
            </a>
          </nav>
          <div className="pt-3 border-t border-brown-900/10 flex flex-col gap-2.5">
            <Link
              href="/onboarding"
              className="w-full flex items-center justify-center gap-2 rounded-full bg-orange-500 py-3 text-xs font-bold text-brown-900 shadow-xs"
            >
              <span>Daftar Akun Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/guidebook"
              className="w-full flex items-center justify-center gap-2 rounded-full border border-brown-900/15 py-2.5 text-xs font-semibold text-brown-900"
            >
              <ShieldCheck className="w-4 h-4 text-[#3E7B54]" />
              <span>Direktori Bantuan Krisis 24/7</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
