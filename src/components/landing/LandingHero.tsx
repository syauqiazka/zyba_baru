"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Volume2,
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
              SISI KIRI (5 Kolom): Standalone 3D Phone Mockup
              (Clean, tanpa card wrapper, tanpa badge berlebih)
              ==================================================== */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center relative">
            <div
              ref={phoneCardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative z-10 w-full flex flex-col items-center justify-center transition-transform duration-200 ease-out cursor-pointer"
            >
              <Image
                src="/images/landing/hero_phone_3d_mockup.png"
                alt="Tampilan Antarmuka Aplikasi ZYBA Mobile dalam Mockup 3D"
                width={686}
                height={830}
                priority
                className="w-[360px] xl:w-[400px] h-auto object-contain drop-shadow-[0_32px_60px_rgba(27,36,30,0.20)] select-none hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          </div>

          {/* ====================================================
              SISI KANAN (7 Kolom): Giant Headline & Maskot Zibi
              (Sesuai Referensi Foto 2: Headline Besar + Maskot di Alam)
              ==================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 text-center lg:text-left relative">
            
            {/* GIANT EDITORIAL HEADLINE */}
            <div ref={headlineRef} className="space-y-4">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#3E7B54] uppercase tracking-widest bg-emerald-100/90 border border-emerald-500/20 px-3.5 py-1 rounded-full shadow-2xs">
                <span>Digital Sanctuary Experience</span>
              </span>

              <h1 className="font-serif text-3xl sm:text-5xl xl:text-6xl font-black text-brown-900 tracking-tight leading-[1.1]">
                <span className="block">Find Your Balance.</span>
                <span className="text-[#3E7B54] block">At Your Own Pace.</span>
              </h1>

              <p className="text-xs sm:text-base lg:text-lg text-brown-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A digital space to understand yourself, build healthier habits, and reconnect with your everyday wellbeing. Ruang suaka mindful tanpa tekanan streak, aman, dan 100% bebas biaya.
              </p>

              {/* Primary Mobile/Desktop Hero CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 w-full">
                <Link
                  href="/onboarding"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-brown-900 font-bold text-xs sm:text-sm shadow-xs transition-all"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
                <a
                  href="#ecosystem"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-brown-900/15 bg-white/80 hover:bg-white text-brown-900 font-semibold text-xs sm:text-sm transition-all shadow-2xs"
                >
                  <span>Explore ZYBA</span>
                </a>
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
                  <div className="mt-1">
                    <span className="text-[10px] text-brown-700/60 font-medium">
                      Mendengarkan curhatmu
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
