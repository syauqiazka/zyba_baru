"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { MessageSquare, Wind, TrendingUp, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function LandingDeepDives() {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      [card1Ref, card2Ref].forEach((ref) => {
        if (ref.current) {
          gsap.from(ref.current, {
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="fitur" ref={containerRef} className="py-24 bg-[#F5F8F5] space-y-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#3E7B54] uppercase tracking-widest bg-emerald-100 px-3.5 py-1 rounded-full">
            Eksplorasi Antarmuka
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-brown-900 tracking-tight">
            Antarmuka Taktil Kertas Linen yang Tenang
          </h2>
          <p className="text-xs sm:text-sm text-brown-700/70 leading-relaxed">
            Setiap elemen dirancang untuk mereduksi stimulus berlebih (*sensory overload*) dengan palet warna natural yang ramah di mata.
          </p>
        </div>

        {/* Feature Deep Dive 1: Large Featured Showcase (Sesuai Foto 3 Laptop Banner) */}
        <div
          ref={card1Ref}
          className="rounded-[36px] border border-brown-900/10 bg-white p-7 sm:p-10 lg:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Sisi Kiri (6 Kolom): Copy */}
          <div className="lg:col-span-6 space-y-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zyba Companion AI</span>
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-brown-900 leading-tight">
              Percakapan Hangat yang Memulihkan, Kapan Pun Dibutuhkan
            </h3>

            <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
              Bebas luapkan segala hal yang mengganjal di pikiran tanpa takut dihakimi. Dilengkapi input audio cerdas, respon audio yang ramah, dan sistem penenang yang selalu memprioritaskan keselamatan emosionalmu.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-brown-800">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#3E7B54] flex items-center justify-center font-bold text-[10px]">
                  ✓
                </div>
                <span>Tersedia transkripsi suara nyata (Live STT via Web Speech & Groq Whisper)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brown-800">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#3E7B54] flex items-center justify-center font-bold text-[10px]">
                  ✓
                </div>
                <span>Batas kuota 15.000 token dengan jeda batin 5 jam yang transparan</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brown-800">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-[#3E7B54] flex items-center justify-center font-bold text-[10px]">
                  ✓
                </div>
                <span>Tanpa klaim diagnosis medis — suaka murni pendamping batin</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/companion"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3E7B54] hover:bg-[#346B48] text-white font-bold text-xs shadow-xs transition-all active:scale-95"
              >
                <span>Buka Zyba Companion</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Sisi Kanan (6 Kolom): Mockup UI Chat Realistis */}
          <div className="lg:col-span-6 rounded-3xl border border-brown-900/10 bg-[#F5F8F5] p-5 sm:p-6 shadow-inner space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-brown-900/8">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-brown-900">Teman Zibi AI</span>
              </div>
              <span className="text-[10px] text-brown-700/60 font-mono">Status: Aktif</span>
            </div>

            {/* Simulated Chat Message Bubbles */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white border border-brown-900/8 max-w-[85%] text-xs text-brown-900 space-y-1 shadow-2xs">
                <span className="text-[10px] font-bold text-[#3E7B54]">Zibi</span>
                <p className="leading-relaxed">
                  Halo! Tarik napas perlahan... Aku di sini untuk mendengarkan. Apa yang paling membebani pikiranmu hari ini?
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-orange-100/90 border border-orange-500/20 max-w-[85%] ml-auto text-xs text-brown-900 space-y-1 shadow-2xs">
                <span className="text-[10px] font-bold text-orange-950">Kamu</span>
                <p className="leading-relaxed">
                  Rasanya lelah sekali memikirkan ekspektasi kerjaan dan overthinking soal masa depan...
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-brown-900/8 max-w-[85%] text-xs text-brown-900 space-y-1 shadow-2xs">
                <span className="text-[10px] font-bold text-[#3E7B54]">Zibi</span>
                <p className="leading-relaxed">
                  Wajar sekali merasa seperti itu. Kamu sudah berjuang sebaik mungkin hari ini. Mari kita urai perlahan satu per satu...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Deep Dive 2: 2-Card Row (Sesuai Foto 3 Bagian Bawah Laptop) */}
        <div ref={card2Ref} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card A: Breathing Garden */}
          <div className="rounded-[36px] border border-brown-900/10 bg-white p-7 sm:p-9 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#3E7B54] flex items-center justify-center">
                <Wind className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-brown-900">
                Breathing Garden 4-7-8
              </h3>
              <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
                Ritme pernapasan 4 detik tarik, 7 detik tahan, dan 8 detik hembuskan yang terbukti meredakan kecemasan akut secara instan.
              </p>
            </div>

            {/* Visual Mini Breathing Circle */}
            <div className="p-6 rounded-3xl bg-[#F5F8F5] border border-brown-900/8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-[#3E7B54]/40 flex items-center justify-center bg-white shadow-2xs animate-spin-slow">
                <Wind className="w-8 h-8 text-[#3E7B54]" />
              </div>
              <span className="text-xs font-bold text-brown-900">
                Tarik 4s • Tahan 7s • Hembuskan 8s
              </span>
            </div>

            <Link
              href="/activity"
              className="text-xs font-bold text-[#3E7B54] hover:underline flex items-center gap-1.5"
            >
              <span>Mulai Latihan Bernapas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card B: Kurva Kebugaran Batin */}
          <div className="rounded-[36px] border border-brown-900/10 bg-white p-7 sm:p-9 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-brown-900">
                Ruang Sehat & Zyba Score
              </h3>
              <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
                Lacak kurva kebugaran batin secara jujur berdasarkan check-in harianmu. Tanpa manipulasi data dummy dan tanpa tekanan kompetisi.
              </p>
            </div>

            {/* Visual Mini Metric Breakdown */}
            <div className="p-6 rounded-3xl bg-[#F5F8F5] border border-brown-900/8 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-brown-900">
                <span>Domain Keseimbangan</span>
                <span className="text-[#3E7B54]">Rerata 7 Hari</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-brown-700">
                  <span>Mental (Bobot 50%)</span>
                  <span className="font-mono font-bold">Selaras</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-cream overflow-hidden">
                  <div className="h-full bg-[#3E7B54] w-[75%] rounded-full" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-brown-700">
                  <span>Fisik: Tidur & Energi (25%)</span>
                  <span className="font-mono font-bold">Optimal</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-cream overflow-hidden">
                  <div className="h-full bg-orange-500 w-[70%] rounded-full" />
                </div>
              </div>
            </div>

            <Link
              href="/wellness-journey"
              className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1.5"
            >
              <span>Buka Ruang Sehat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
