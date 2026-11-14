"use client";

import React, { useEffect, useRef } from "react";
import { MessageSquareHeart, LineChart, Sparkles, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function LandingSteps() {
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
          stagger: 0.2,
          ease: "power2.out",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      step: "01",
      icon: MessageSquareHeart,
      color: "bg-emerald-100 text-[#3E7B54]",
      title: "Curhat Tanpa Penghakiman",
      desc: "Tumpahkan segala kecemasan, rasa lelah, dan overthinking kepada Zibi Companion AI kapan pun kamu butuh ruang aman lewat suara atau teks.",
    },
    {
      step: "02",
      icon: LineChart,
      color: "bg-orange-100 text-orange-600",
      title: "Petakan Akar & Refleksi Batin",
      desc: "Sistem memetakan ritme emosi, tingkat stres, dan kualitas tidur ke dalam kurva Zyba Score harian secara dinamis dan transparan.",
    },
    {
      step: "03",
      icon: Sparkles,
      color: "bg-blue-100 text-blue-700",
      title: "Latihan Aksi Mikro yang Lembut",
      desc: "Ikuti breathing garden 4-7-8, jurnal reflektif suaka, dan rekomendasi kebiasaan harian tanpa streak api yang membebani mental.",
    },
  ];

  return (
    <section id="alur" ref={containerRef} className="py-24 bg-white border-y border-brown-900/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#3E7B54] uppercase tracking-widest bg-emerald-100 px-3.5 py-1 rounded-full">
            Alur Terpadu ZYBA
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-brown-900 tracking-tight">
            3 Langkah Menuju Ruang Batin yang Tenang
          </h2>
          <p className="text-xs sm:text-sm text-brown-700/70 leading-relaxed">
            Metodologi pendampingan mindful yang mengalir ramah: Curhat $\rightarrow$ Solusi & Refleksi $\rightarrow$ Program Aksi Nyata.
          </p>
        </div>

        {/* 3 Step Cards Grid (Sesuai Foto 3) */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl border border-brown-900/10 bg-[#F5F8F5] p-7 sm:p-8 shadow-2xs hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Step Pill & Icon */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-black text-brown-700/50 tracking-wider">
                      LANGKAH {item.step}
                    </span>
                    <div
                      className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-brown-900 mb-3 group-hover:text-[#3E7B54] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-brown-900/8 mt-6 flex items-center gap-2 text-xs font-bold text-[#3E7B54] group-hover:translate-x-1 transition-transform">
                  <span>Pelajari langkah ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
