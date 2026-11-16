"use client";

import React from "react";
import Link from "next/link";
import {
  Brain,
  Wind,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function LandingShowcase() {
  const showcaseItems = [
    {
      badge: "Pendamping AI",
      title: "Zyba Companion (Zibi)",
      subtitle: "Sahabat batin yang menyimak tanpa lelah",
      desc: "Didukung rantai 4 provider AI bebas biaya dengan transkripsi suara nyata (STT), suara ramah (TTS), batas jeda batin 5 jam, serta sensor krisis otomatis.",
      route: "/companion",
      icon: Brain,
      tagColor: "bg-emerald-100 text-[#3E7B54]",
      accentBg: "from-emerald-50/60 to-white",
      features: [
        "Transkripsi audio STT & suara TTS",
        "Sensor krisis otomatis terhubung hotline 119",
        "Jeda batin 5 jam saat batas token tercapai",
      ],
    },
    {
      badge: "Latihan Pernapasan",
      title: "Smart Activity & Breathing Garden",
      subtitle: "Jeda napas 4-7-8 untuk menenangkan detak jantung",
      desc: "Dirancang secara sains untuk menurunkan stimulasi saraf simpatik. Dilengkapi panduan visual ritme napas yang lembut dan musik latar relaksasi.",
      route: "/activity",
      icon: Wind,
      tagColor: "bg-orange-100 text-orange-600",
      accentBg: "from-orange-50/60 to-white",
      features: [
        "Timer napas 4-7-8 ramah motion-reduce",
        "Audio relaksasi royalty-free",
        "Aktivitas mikro penenang overthinking",
      ],
    },
    {
      badge: "Komunitas & Edukasi",
      title: "Wawasan Sehat & Komunitas Suaka",
      subtitle: "Edukasi kesehatan mental & ruang berbagi empati",
      desc: "Kumpulan artikel tervalidasi dari WHO, Kemenkes, dan NHS yang disaring filter kesehatan bertingkat, serta ruang komunitas aman dengan opsi unggahan anonim.",
      route: "/resources",
      icon: BookOpen,
      tagColor: "bg-blue-100 text-blue-700",
      accentBg: "from-blue-50/60 to-white",
      features: [
        "Kurasi artikel otomatis anti-hoax",
        "Komunitas anonim anti-perundungan",
        "Realtime Direct Message via Ably",
      ],
    },
  ];

  return (
    <section id="ekosistem" className="py-14 sm:py-18 bg-[#F5F8F5]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14">
        {/* Section Header (Sesuai Foto 3) */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#3E7B54] uppercase tracking-widest bg-emerald-100 px-3.5 py-1 rounded-full">
            Fitur Unggulan
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-brown-900 tracking-tight">
            Lihat Apa yang Ada di Dalam Suaka ZYBA
          </h2>
          <p className="text-xs sm:text-sm text-brown-700/70 leading-relaxed">
            Tiga pilar holistik yang saling melengkapi untuk merawat kesehatan mental, fisik, dan koneksi sosialmu.
          </p>
        </div>

        {/* 3 Showcase Cards Grid (Sesuai Foto 3: Selalu tampil dan tidak pernah kosong) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {showcaseItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`rounded-[28px] border border-brown-900/10 bg-gradient-to-b ${item.accentBg} p-7 sm:p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group`}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${item.tagColor}`}
                    >
                      {item.badge}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-brown-900/10 flex items-center justify-center text-brown-900 shadow-2xs group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900 mb-1 group-hover:text-[#3E7B54] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#3E7B54]">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-brown-700 leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Bullet perks */}
                  <div className="space-y-2 pt-2 border-t border-brown-900/8">
                    {item.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-brown-700/85">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3E7B54] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6">
                  <Link
                    href={item.route}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-white hover:bg-brown-900 hover:text-white border border-brown-900/10 text-xs font-bold text-brown-900 shadow-2xs transition-all active:scale-98"
                  >
                    <span>Jelajahi Fitur</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
