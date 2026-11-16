"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Volume2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import gsap from "gsap";

export function LandingHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const phoneCardRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const audioCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Headline Entrance
      if (headlineRef.current) {
        gsap.from(headlineRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 1.1,
          stagger: 0.15,
          ease: "power3.out",
        });
      }

      // 2. Phone Card Slide & Tilt In
      if (phoneCardRef.current) {
        gsap.from(phoneCardRef.current, {
          x: -60,
          opacity: 0,
          duration: 1.2,
          delay: 0.2,
          ease: "power3.out",
        });
      }

      // 3. Mascot Float Breathing Effect (Gentle organic bobbing)
      if (mascotRef.current) {
        gsap.from(mascotRef.current, {
          scale: 0.88,
          opacity: 0,
          duration: 1.3,
          delay: 0.3,
          ease: "back.out(1.4)",
        });

        gsap.to(mascotRef.current, {
          y: -12,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.3,
        });
      }

      // 4. Floating Audio Card Pulse
      if (audioCardRef.current) {
        gsap.from(audioCardRef.current, {
          scale: 0.7,
          opacity: 0,
          duration: 0.9,
          delay: 0.7,
          ease: "back.out(1.6)",
        });

        gsap.to(audioCardRef.current, {
          y: 6,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.6,
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Interactive 3D tilt on phone card mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!phoneCardRef.current) return;
    const rect = phoneCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    phoneCardRef.current.style.transform = `perspective(1000px) rotateY(${x / 30}deg) rotateX(${-y / 30}deg) translateY(-2px)`;
  };

  const handleMouseLeave = () => {
    if (!phoneCardRef.current) return;
    phoneCardRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)`;
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen pt-28 pb-20 flex items-center overflow-hidden bg-[#F5F8F5]"
    >
      {/* ========================================================
          BACKGROUND SCENE CONTAINER
          Wadah panorama langit/alam berkabut (Foto 2 BirdPulse Reference)
          ======================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Real Photographic Scenic Sanctuary Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/landing/hero_sanctuary_bg.webp"
            alt="Lanskap Suaka ZYBA"
            fill
            priority
            className="object-cover object-top opacity-30 sm:opacity-35"
          />
          {/* Smooth Natural Fade to Background Color #F5F8F5 */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F5F8F5]/35 via-[#F5F8F5]/70 to-[#F5F8F5]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F8F5]/70 via-transparent to-[#F5F8F5]/70" />
        </div>

        {/* Soft Ambient Radial Lights (Living Sanctuary Tones) */}
        <div className="absolute top-0 right-0 w-[55vw] h-[65vh] bg-gradient-to-bl from-[#DCECE0]/50 via-[#EAF4EC]/30 to-transparent blur-3xl opacity-70" />
        <div className="absolute bottom-0 left-0 w-[45vw] h-[45vh] bg-gradient-to-tr from-[#FDF1EB]/50 via-[#F5F8F5]/40 to-transparent blur-3xl opacity-60" />

        {/* Subtle Zen Grid Matrix */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#1B241E 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full">
        {/* HERO 2-COLUMN SPLIT (SESUAI FOTO 2: BIRDPULSE REFERENCE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ====================================================
              SISI KIRI (5 Kolom): 3D Perspective Phone Showcase
              (Sesuai Referensi Gambar 2 & 3: Phone Tilted in 3D Perspective)
              ==================================================== */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[440px] flex flex-col items-center justify-center">
              {/* Subtle 3D Perspective Grid Background (Inspired by Reference Gambar 2) */}
              <div className="absolute -inset-4 rounded-[40px] overflow-hidden border border-[#3E7B54]/15 bg-gradient-to-b from-[#EBF3ED]/90 via-[#F3F7F4]/60 to-[#EBF3ED]/90 shadow-[0_20px_50px_-15px_rgba(27,36,30,0.08)] backdrop-blur-md pointer-events-none -z-10">
                {/* Coordinate Grid Lines */}
                <div
                  className="absolute inset-0 opacity-[0.22]"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(62, 123, 84, 0.25) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(62, 123, 84, 0.25) 1px, transparent 1px)
                    `,
                    backgroundSize: "36px 36px",
                  }}
                />
                {/* Soft Radial Center Highlight */}
                <div className="absolute inset-0 bg-radial from-white/70 via-transparent to-transparent" />
              </div>

              {/* Top Floating Badge */}
              <div className="self-end mr-3 mb-1 z-20 rounded-full border border-white/90 bg-white/95 backdrop-blur-md px-3.5 py-1 shadow-[0_8px_20px_rgba(27,36,30,0.08)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3E7B54]" />
                <span className="text-[10px] font-bold text-brown-900 tracking-tight">
                  Didukung AI Suaka • Bebas Biaya
                </span>
              </div>

              {/* 3D Perspective Phone Mockup with Parallax Tilt */}
              <div
                ref={phoneCardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative z-10 w-full flex flex-col items-center transition-transform duration-200 ease-out cursor-pointer py-1"
              >
                <Image
                  src="/images/landing/hero_phone_3d_mockup.png"
                  alt="Tampilan Antarmuka Aplikasi ZYBA Mobile dalam Mockup 3D"
                  width={686}
                  height={830}
                  priority
                  className="w-[330px] sm:w-[370px] h-auto object-contain drop-shadow-[0_28px_45px_rgba(27,36,30,0.18)] select-none hover:scale-[1.015] transition-transform duration-300"
                />
              </div>

              {/* Bottom Quick Action Floating Banner */}
              <div className="w-[92%] mx-auto -mt-2 z-20 rounded-2xl border border-brown-900/10 bg-white/95 backdrop-blur-md p-3.5 shadow-[0_12px_28px_rgba(27,36,30,0.08)] space-y-2.5">
                <div className="flex items-center justify-between text-left">
                  <div>
                    <span className="text-[11px] font-bold text-brown-900 block">
                      Pemulih Batin di Sakumu
                    </span>
                    <span className="text-[10px] text-brown-700/70">
                      Ruang aman instan tanpa janji temu atau biaya
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#3E7B54] bg-emerald-100/90 px-2.5 py-0.5 rounded-full">
                    Aktif 24/7
                  </span>
                </div>

                <Link
                  href="/onboarding"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-98 text-brown-900 font-bold text-xs shadow-xs transition-all"
                >
                  <span>Coba Ruang Batin Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </div>

          {/* ====================================================
              SISI KANAN (7 Kolom): Giant Headline & Maskot Zibi
              (Sesuai Referensi Foto 2: Headline Besar + Maskot di Alam)
              ==================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 text-center lg:text-left relative">
            
            {/* GIANT EDITORIAL HEADLINE */}
            <div ref={headlineRef} className="space-y-3">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#3E7B54] uppercase tracking-widest bg-emerald-100/90 border border-emerald-500/20 px-3.5 py-1 rounded-full shadow-2xs">
                <span>Ruang Pemulihan Batin Gen Z</span>
              </span>

              <h1 className="font-display text-3xl sm:text-6xl xl:text-7xl font-black text-brown-900 tracking-tight leading-[1.08]">
                <span className="block">SUAKA BATIN</span>
                <span className="text-[#3E7B54] block">JEDA HENINGMU.</span>
              </h1>

              <p className="text-xs sm:text-base lg:text-lg text-brown-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Ketika tuntutan sosial dan dunia di luar terlalu bising, ZYBA hadir sebagai ruang aman untuk mengurai overthinking, bernapas lega, dan memulihkan ritme jiwamu secara alami.
              </p>

              {/* Primary Mobile/Desktop Hero CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full">
                <Link
                  href="/onboarding"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-brown-900 font-bold text-xs sm:text-sm shadow-xs transition-all"
                >
                  <span>Mulai Perjalanan Tenangmu (Gratis)</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-brown-900/15 bg-white/80 hover:bg-white text-brown-900 font-semibold text-xs sm:text-sm transition-all shadow-2xs"
                >
                  <span>Masuk ke Akun</span>
                </Link>
              </div>
            </div>

            {/* ========================================================
                MASCOT SCENE CONTAINER (Foto 2 BirdPulse Reference)
                Zibi Bertengger di Dahan Suaka Alami (Aset Nyata User)
                ======================================================== */}
            <div className="relative w-full max-w-[680px] mx-auto lg:mx-0 min-h-[250px] sm:min-h-[440px] flex items-center justify-center overflow-hidden sm:overflow-visible">
              
              {/* Latar Belakang Lingkaran Halo Suaka Halus */}
              <div className="absolute w-[260px] sm:w-[460px] h-[260px] sm:h-[460px] rounded-full bg-gradient-to-tr from-[#C8E4CD]/35 via-[#EAF4EC]/50 to-white/70 blur-2xl -z-10" />

              {/* Maskot Zibi di Atas Dahan Alami */}
              <div ref={mascotRef} className="relative z-10 w-full flex flex-col items-center">
                <Image
                  src="/images/landing/hero_mascot_perch.png"
                  alt="Zibi Maskot ZYBA di Dahan Suaka"
                  width={560}
                  height={456}
                  priority
                  className="w-[240px] sm:w-[440px] lg:w-[500px] h-auto object-contain drop-shadow-[0_20px_35px_rgba(27,36,30,0.12)] transition-transform duration-300"
                />

                {/* Bayangan Kontak Realistis di Bawah Dahan */}
                <div className="w-48 sm:w-80 h-3 sm:h-4 rounded-full bg-brown-900/10 blur-lg -mt-2" />
              </div>

              {/* Floating Glassmorphic Audio Player Badge (Tampil di sm: ke atas agar tidak ofside di mobile) */}
              <div
                ref={audioCardRef}
                className="hidden sm:flex absolute top-2 sm:top-6 right-1 sm:right-6 z-20 rounded-2xl border border-white/90 bg-white/90 backdrop-blur-md px-4 py-3 shadow-[0_12px_30px_rgba(27,36,30,0.08)] items-center gap-3.5 max-w-[240px]"
              >
                <div className="w-9 h-9 rounded-xl bg-[#3E7B54] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-bold text-brown-900 truncate">
                    Zibi • Siap Menyimak
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3E7B54]" />
                    <span className="text-[10px] text-brown-700/60 font-medium">
                      Mendengarkan curhatmu
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Pill Assurance (Tampil di sm: ke atas) */}
              <div className="hidden sm:flex absolute -bottom-2 sm:bottom-2 left-1 sm:left-4 z-20 rounded-2xl border border-brown-900/10 bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-2xs items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3E7B54]" />
                <span className="text-[11px] font-bold text-brown-900">
                  100% Bebas Biaya Selamanya
                </span>
              </div>
            </div>

            {/* Bottom Value Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-brown-700/80 font-semibold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3E7B54]" />
                Tanpa Beban Streak
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3E7B54]" />
                Privasi Terenkripsi Penuh
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#3E7B54]" />
                Direktori Bantuan Krisis Cepat
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
