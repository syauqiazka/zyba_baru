"use client";

import React, { useEffect, useRef } from "react";
import {
  HeartHandshake,
  ShieldCheck,
  Flame,
  Sparkles,
  Lock,
  Users2,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function LandingValues() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 75%",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power2.out",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const values = [
    {
      icon: HeartHandshake,
      title: "100% Bebas Biaya Selamanya",
      desc: "Kesehatan mental adalah hak asasi, bukan barang mewah. Seluruh fitur ZYBA dapat diakses terbuka penuh tanpa skema langganan atau biaya tersembunyi.",
      color: "bg-emerald-100 text-[#3E7B54]",
    },
    {
      icon: Flame,
      title: "Tanpa Streak Api yang Menekan",
      desc: "Kami tidak menghukummu ketika kamu butuh waktu untuk rehat. Hearth Flame ZYBA merayakan konsistensi lembut tanpa memicu rasa bersalah yang toxic.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: Lock,
      title: "Privasi Batin Terenkripsi Penuh",
      desc: "Catatan jurnal dan curhatmu sepenuhnya privat. Dilindungi enkripsi kuat dengan kontrol penuh untuk mengekspor atau menghapus seluruh datamu kapan saja.",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: Sparkles,
      title: "AI Empatis & Beretika",
      desc: "Zibi dirancang dengan pedoman pendampingan yang hangat dan bertanggung jawab. Sistem menerapkan jeda batin sehat untuk mencegah ketergantungan berlebih.",
      color: "bg-amber-100 text-amber-700",
    },
    {
      icon: ShieldCheck,
      title: "Sensor Deteksi Krisis Cepat",
      desc: "Sensor otomatis yang mendeteksi sinyal bahaya diri dan langsung menghadirkan tautan tenang menuju Hotline Darurat 119 dan Panduan Bantuan Krisis.",
      color: "bg-rose-100 text-rose-600",
    },
    {
      icon: Users2,
      title: "Suaka Komunitas Bebas Bullying",
      desc: "Ruang berbagi cerita yang hangat dengan opsi identitas anonim, moderasi proaktif oleh admin, dan perlindungan ketat dari konten negatif.",
      color: "bg-teal-100 text-teal-700",
    },
  ];

  return (
    <section id="nilai" ref={containerRef} className="py-24 bg-white border-b border-brown-900/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#3E7B54] uppercase tracking-widest bg-emerald-100 px-3.5 py-1 rounded-full">
            Prinsip & Kepercayaan
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-brown-900 tracking-tight">
            Dirancang untuk Menenangkan, Bukan Menekan
          </h2>
          <p className="text-xs sm:text-sm text-brown-700/70 leading-relaxed">
            Standar etika dan keselamatan yang kami junjung tinggi dalam setiap baris kode ZYBA.
          </p>
        </div>

        {/* 6 Cards Grid (Sesuai Foto 3) */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="rounded-3xl border border-brown-900/10 bg-[#F5F8F5] p-7 shadow-2xs hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 space-y-4 group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${v.color} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-brown-900 group-hover:text-[#3E7B54] transition-colors">
                  {v.title}
                </h3>
                <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
