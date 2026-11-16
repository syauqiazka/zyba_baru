"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function LandingFinalCta() {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden bg-[#14261C] text-white">
      {/* Cinematic Nature Background Image with Overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <Image
          src="/images/landing/hero_sanctuary_bg.webp"
          alt="Lanskap Suaka Hening ZYBA"
          fill
          className="object-cover object-center opacity-30 mix-blend-overlay"
        />
        {/* Deep Forest Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14261C] via-[#1A3324]/85 to-[#14261C]" />
        <div className="absolute inset-0 bg-radial from-[#3E7B54]/20 via-transparent to-[#14261C]/90" />
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-12 text-center space-y-8">
        
        {/* Sanctuary Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-emerald-300 text-xs font-bold uppercase tracking-widest shadow-2xs">
          <span>Your Sanctuary Awaits</span>
        </div>

        {/* Headline & Description */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
            Your Journey. Your Pace.
          </h2>
          <p className="text-xs sm:text-base lg:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
            Take a small step toward understanding yourself and building a healthier everyday life. Ruang pemulihan batin yang hadir tanpa biaya, tanpa tuntutan, dan selalu terbuka untukmu.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-brown-900 font-bold text-xs sm:text-sm shadow-lg transition-all"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md transition-all"
          >
            <span>Masuk ke Akun</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
