"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function LandingFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apakah ZYBA benar-benar 100% gratis selamanya?",
      a: "Ya, betul. Seluruh layanan ZYBA — mulai dari curhat AI Zibi, breathing garden 4-7-8, pelacak kebugaran batin, artikel wawasan, hingga komunitas — terbuka bebas untuk semua pengguna tanpa skema langganan berbayar, tanpa tier premium, dan tanpa iklan komersial.",
    },
    {
      q: "Apakah Zibi AI memberikan diagnosis medis atau resep pengobatan?",
      a: "Sama sekali tidak. ZYBA adalah suaka pendampingan reflektif dan mindfulness, bukan pengganti psikolog klinis, psikiater, atau dokter. Zibi tidak memberikan diagnosis klinis. Apabila sistem mendeteksi sinyal krisis, kamu akan diarahkan ke Hotline Darurat 119 dan Panduan Bantuan Krisis profesional.",
    },
    {
      q: "Bagaimana ZYBA melindungi privasi dan keamanan data curhat saya?",
      a: "Kerahasiaan batinmu adalah amanah tertinggi kami. Seluruh obrolan dan jurnal reflektif disimpan dengan enkripsi aman. ZYBA tidak pernah menjual datamu kepada pihak ketiga, dan kamu memegang kendali penuh melalui menu Pengaturan untuk mengekspor seluruh arsip JSON atau menghapus akun secara permanen dari 3 database kami kapan saja.",
    },
    {
      q: "Mengapa ada batas kuota token dan jeda batin 5 jam di Companion?",
      a: "Kami percaya AI pendamping harus menyehatkan, bukan menimbulkan ketergantungan digital (AI addiction). Batas 15.000 token dengan jeda batin 5 jam dirancang secara etis agar kamu memiliki ruang jeda untuk bernapas, beristirahat dari layar, dan kembali terhubung dengan dunia nyata.",
    },
    {
      q: "Bagaimana cara berbagi cerita di Komunitas Suaka ZYBA secara aman?",
      a: "Kamu dapat menggunakan fitur Unggahan Anonim ketika menulis postingan reflektif. Komunitas ZYBA diawasi oleh filter moderasi otomatis dan tim admin untuk memastikan ruang obrolan tetap hangat, suportif, dan bebas dari perundungan maupun spam pinjaman ilegal.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-[#F5F8F5]">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#3E7B54] uppercase tracking-widest bg-emerald-100 px-3.5 py-1 rounded-full">
            Pertanyaan Umum
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-brown-900 tracking-tight">
            Tanya Jawab Seputar Suaka ZYBA
          </h2>
          <p className="text-xs sm:text-sm text-brown-700/70 leading-relaxed max-w-xl mx-auto">
            Semua hal penting mengenai privasi, model AI etis, dan cara kerja ruang tenang kami.
          </p>
        </div>

        {/* Accordion List (Sesuai Foto 3) */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-brown-900/10 bg-white overflow-hidden shadow-2xs transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 sm:py-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-sm sm:text-base font-bold text-brown-900 leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-cream flex items-center justify-center text-brown-900 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-emerald-100 text-[#3E7B54]" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-brown-700 leading-relaxed border-t border-brown-900/5 animate-in fade-in duration-200">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
