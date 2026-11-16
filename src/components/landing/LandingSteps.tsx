"use client";

import React from "react";
import { MessageSquareHeart, LineChart, Wind } from "lucide-react";

export function LandingSteps() {
  const steps = [
    {
      step: "01",
      icon: MessageSquareHeart,
      color: "bg-[#3E7B54] text-white",
      badge: "Langkah 1",
      title: "Curhat Tanpa Penghakiman",
      desc: "Tumpahkan segala kecemasan, rasa lelah, dan overthinking kepada Zibi Companion AI kapan pun kamu butuh ruang aman lewat suara atau teks bebas biaya.",
    },
    {
      step: "02",
      icon: LineChart,
      color: "bg-orange-500 text-brown-900",
      badge: "Langkah 2",
      title: "Petakan Akar & Refleksi Batin",
      desc: "Sistem memetakan ritme emosi, tingkat stres, dan kualitas tidur ke dalam kurva Zyba Score harian secara dinamis dan transparan.",
    },
    {
      step: "03",
      icon: Wind,
      color: "bg-[#3E7B54] text-white",
      badge: "Langkah 3",
      title: "Latihan Aksi Mikro yang Lembut",
      desc: "Ikuti breathing garden 4-7-8, jurnal reflektif suaka, dan rekomendasi kebiasaan harian tanpa streak api yang membebani mental.",
    },
  ];

  return (
    <section id="alur" className="py-14 sm:py-18 bg-white border-y border-brown-900/10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14">
        {/* Section Header (Sesuai Foto 3) */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#3E7B54] uppercase tracking-widest bg-emerald-100 px-3.5 py-1 rounded-full">
            Alur Terpadu ZYBA
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-brown-900 tracking-tight tabular-nums">
            3 Langkah Menuju Ruang Batin yang Tenang
          </h2>
          <p className="text-xs sm:text-sm text-brown-700/70 leading-relaxed">
            Metodologi pendampingan mindful yang mengalir ramah: Curhat &rarr; Solusi & Refleksi &rarr; Program Aksi Nyata.
          </p>
        </div>

        {/* 3 Step Columns (Sesuai Foto 3: Bersih dengan alur terhubung) */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-start">
          {/* Subtle Connection Line between steps on desktop */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 border-t border-dashed border-[#3E7B54]/25 -z-0 pointer-events-none" />

          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center text-center space-y-4 group p-6 rounded-3xl hover:bg-[#F5F8F5] transition-colors duration-200"
              >
                {/* Circle Icon (Persis Foto 3) */}
                <div
                  className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200`}
                >
                  <Icon className="w-7 h-7 stroke-[2]" />
                </div>

                {/* Badge Step */}
                <span className="font-mono text-xs font-bold text-brown-700/60 uppercase tracking-wider">
                  {item.badge}
                </span>

                {/* Title */}
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900 leading-snug">
                  {item.title}
                </h3>

                {/* Desc */}
                <p className="text-xs sm:text-sm text-brown-700/80 leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
