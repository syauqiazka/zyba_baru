"use client";

import React, { useEffect, useRef } from "react";
import { MessageSquareQuote, Heart } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function LandingTestimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
          },
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power2.out",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const stories = [
    {
      name: "Nadya A.",
      role: "Mahasiswi Akhir, 22 tahun",
      quote:
        "Tiap malam sering overthinking mikirin skripsi dan ekspektasi keluarga. Curhat ke Zibi bikin plong karena jawabannya hangat dan nggak terkesan robot kaku.",
      tag: "Pengguna Companion",
    },
    {
      name: "Rizky F.",
      role: "Junior Software Engineer, 24 tahun",
      quote:
        "Yang paling saya suka dari ZYBA: Nggak ada streak api yang bikin cemas kalau bolong sehari. Desainnya tenang banget, beda sama aplikasi kesehatan lain yang penuh notif memaksa.",
      tag: "Pengguna Ruang Sehat",
    },
    {
      name: "Clara S.",
      role: "Content Creator, 23 tahun",
      quote:
        "Fitur breathing 4-7-8 beneran nolong waktu panik sebelum presentasi kerjaan. Terima kasih ZYBA karena bener-bener 100% gratis tanpa batasan paywall.",
      tag: "Pengguna Smart Activity",
    },
  ];

  return (
    <section ref={containerRef} className="py-24 bg-white border-b border-brown-900/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#3E7B54] uppercase tracking-widest bg-emerald-100 px-3.5 py-1 rounded-full">
            Suara Teman Seperjalanan
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-brown-900 tracking-tight">
            Cerita Mereka yang Menemukan Ruang Hening
          </h2>
          <p className="text-xs sm:text-sm text-brown-700/70 leading-relaxed">
            Refleksi tulus dari teman-teman generasi muda yang memilih merawat kesehatan batinnya secara sadar.
          </p>
        </div>

        {/* 3 Story Cards Grid (Sesuai Foto 3) */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {stories.map((s, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-brown-900/10 bg-[#F5F8F5] p-7 sm:p-8 shadow-2xs hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#3E7B54] flex items-center justify-center">
                    <MessageSquareQuote className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-brown-700/60 uppercase tracking-wider bg-white px-2.5 py-0.5 rounded-full border border-brown-900/8">
                    {s.tag}
                  </span>
                </div>

                <p className="font-serif text-sm sm:text-base text-brown-900 leading-relaxed italic">
                  &ldquo;{s.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-brown-900/8 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-brown-900">{s.name}</h4>
                  <span className="text-[10px] text-brown-700/60 block">{s.role}</span>
                </div>
                <Heart className="w-4 h-4 text-orange-500 fill-orange-500/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
