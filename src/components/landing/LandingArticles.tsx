"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight, User } from "lucide-react";

interface ArticlePreview {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  snippet: string;
  author: string;
  authorRole: string;
  readTimeMin: number;
  date: string;
  tagColor: string;
}

const FEATURED_ARTICLES: ArticlePreview[] = [
  {
    id: "res-1",
    category: "Manajemen Stres",
    title: "Mengurai Beban 'Harus Sukses Sebelum 25': Menata Ulang Ekspektasi Sosial",
    subtitle: "Menemukan kembali ritme hidup sendiri di tengah banjir pencapaian linimasa.",
    snippet: "Tekanan membandingkan garis waktu diri dengan sorotan media sosial sering kali menjadi pemicu utama kelelahan mental generasi muda.",
    author: "Tim Psikologi ZYBA",
    authorRole: "Kurator Psikologi Klinis",
    readTimeMin: 4,
    date: "14 November 2026",
    tagColor: "bg-emerald-100 text-[#28583B] border-emerald-200",
  },
  {
    id: "res-2",
    category: "Baterai Sosial",
    title: "Baterai Sosial Menipis? Cara Memulihkan Diri Tanpa Rasa Bersalah (FOMO)",
    subtitle: "Seni menetapkan batasan batin yang sehat tanpa takut kehilangan lingkaran pertemanan.",
    snippet: "Memberi diri sendiri izin untuk menolak ajakan kumpul bukanlah bentuk egois, melainkan jeda mutlak agar jiwamu tidak terbakar habis.",
    author: "Tim Psikologi ZYBA",
    authorRole: "Kurator Wellness",
    readTimeMin: 5,
    date: "14 November 2026",
    tagColor: "bg-teal-100 text-teal-800 border-teal-200",
  },
  {
    id: "res-3",
    category: "Ritme Sirkadian & Tidur",
    title: "Siklus Tidur Berantakan di Akhir Pekan (Social Jetlag): Mengembalikan Ritme Tubuh",
    subtitle: "Panduan praktis menyelaraskan jam biologis tanpa bergantung pada kafein atau obat tidur.",
    snippet: "Perbedaan jam bangun lebih dari 2 jam di akhir pekan dapat mengacaukan ritme melatonin selama 4 hari ke depan.",
    author: "Tim Medis & Wellness ZYBA",
    authorRole: "Konsultan Tidur Sehat",
    readTimeMin: 6,
    date: "14 November 2026",
    tagColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
  },
];

export function LandingArticles() {
  return (
    <section id="articles" className="py-24 sm:py-32 bg-[#F5F8F5] relative overflow-hidden border-t border-brown-900/6">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#3E7B54] uppercase tracking-widest bg-emerald-100/80 px-3.5 py-1 rounded-full shadow-2xs">
              <span>Curated Wellness Literature</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-900 tracking-tight leading-[1.15]">
              Bacaan Mindful Berbasis Bukti untuk Gen Z.
            </h2>

            <p className="text-sm sm:text-base text-brown-700 leading-relaxed">
              Ditulis dalam bahasa Indonesia yang konkret, hangat, dan bebas dari gaya generik AI. Berakar pada riset psikologi klinis dan kebiasaan hidup sehat nyata.
            </p>
          </div>

          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brown-900/15 bg-white text-brown-900 hover:bg-[#F5F8F5] font-bold text-xs shadow-2xs transition-all shrink-0 self-start sm:self-auto"
          >
            <span>Buka Seluruh Artikel di Resources</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

        {/* 3 Editorial Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {FEATURED_ARTICLES.map((art) => (
            <article
              key={art.id}
              className="rounded-3xl border border-brown-900/10 bg-white p-7 shadow-xs hover:border-[#3E7B54]/40 hover:shadow-md transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${art.tagColor}`}>
                    {art.category}
                  </span>
                  <span className="text-[10px] text-brown-700/60 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {art.readTimeMin} menit baca
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-2">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-brown-900 leading-snug group-hover:text-[#3E7B54] transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-brown-700/70 font-medium leading-relaxed">
                    {art.subtitle}
                  </p>
                </div>

                {/* Excerpt */}
                <p className="text-xs text-brown-800/80 leading-relaxed pt-2 border-t border-brown-900/6">
                  {art.snippet}
                </p>
              </div>

              {/* Footer Author & Link */}
              <div className="pt-4 border-t border-brown-900/6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#3E7B54] flex items-center justify-center">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-brown-900 block leading-tight">
                      {art.author}
                    </span>
                    <span className="text-[9px] text-brown-700/60 block leading-tight">
                      {art.authorRole}
                    </span>
                  </div>
                </div>

                <Link
                  href="/resources"
                  className="text-xs font-bold text-[#3E7B54] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
                  aria-label={`Baca artikel ${art.title}`}
                >
                  <span>Baca</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
