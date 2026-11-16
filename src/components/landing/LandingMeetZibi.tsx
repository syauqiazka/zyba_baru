"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Heart, ArrowRight, ShieldCheck, Clock } from "lucide-react";

export function LandingMeetZibi() {
  return (
    <section id="zibi" className="py-24 sm:py-32 bg-[#F5F8F5] relative overflow-hidden border-t border-brown-900/6">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-gradient-to-bl from-[#DCECE0]/50 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 w-full space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#3E7B54] uppercase tracking-widest bg-emerald-100/80 px-3.5 py-1 rounded-full shadow-2xs">
            <span>Meet Your Mindful Companion</span>
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brown-900 tracking-tight leading-[1.15]">
            Zibi, Sahabat Batin Berinsang Daun.
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-brown-700 leading-relaxed">
            Zibi bukan asisten virtual pencari fakta cepat atau chatbot dingin. Diilhami oleh daya regenerasi alami axolotl dan keteduhan dedaunan pinus, Zibi hadir sebagai sahabat yang siap menyimak tanpa menghakimi.
          </p>
        </div>

        {/* 2-Column Split: Visual Mascot Perch on Left, Realistic Conversation Snippet on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (5 Cols): Natural Environment Around Zibi */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6">
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              {/* Natural organic halo background */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#C8E4CD]/40 via-[#EAF4EC]/60 to-white/80 blur-2xl -z-10" />

              <Image
                src="/mascot/hero.png"
                alt="Zibi Maskot ZYBA Resmi"
                width={360}
                height={360}
                className="w-[280px] sm:w-[320px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(27,36,30,0.14)] select-none hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Mascot Identity Markers */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-[400px] text-left">
              <div className="p-3.5 rounded-2xl bg-white border border-brown-900/8 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-[#3E7B54] uppercase tracking-wider block">
                  Insang Daun
                </span>
                <p className="text-[11px] text-brown-700/80 leading-snug">
                  Melambangkan pemulihan batin yang bertumbuh perlahan.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-brown-900/8 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                  Senyum Teduh
                </span>
                <p className="text-[11px] text-brown-700/80 leading-snug">
                  Mendengarkan curhat tanpa interupsi atau vonis.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (7 Cols): Realistic Companion Interaction Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-brown-900/10 bg-white p-6 sm:p-8 shadow-sm space-y-5">
              
              {/* Chat Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-brown-900/8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-[#3E7B54] shadow-2xs">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-brown-900">
                      Zyba Companion • Zibi AI
                    </h4>
                    <span className="text-[10px] text-[#3E7B54] font-semibold">
                      Siap Mendengarkan 24/7
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#F5F8F5] text-brown-700/80 border border-brown-900/6">
                  100% Privat
                </span>
              </div>

              {/* Realistic Dialogue Exchange */}
              <div className="space-y-4 text-xs sm:text-sm">
                
                {/* User Message Bubble */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-[#1B241E] text-white p-4 shadow-2xs space-y-1">
                    <span className="text-[10px] text-white/50 block font-medium">Kamu</span>
                    <p className="leading-relaxed">
                      &ldquo;Hari ini rasanya overthinking banget soal kerjaan dan masa depan... Rasanya takut tertinggal jauh dari orang lain.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Zibi Response Bubble */}
                <div className="flex justify-start items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                    <span className="font-serif text-xs font-bold text-[#3E7B54]">Z</span>
                  </div>

                  <div className="max-w-[88%] rounded-2xl rounded-tl-xs bg-[#EAF4EC]/80 border border-[#C8E4CD] text-brown-900 p-4 shadow-2xs space-y-2">
                    <span className="text-[10px] text-[#28583B] font-bold block">Zibi</span>
                    <p className="leading-relaxed">
                      &ldquo;Tarik napas perlahan... Aku mendengarkanmu. Wajar sekali merasa cemas saat memikirkan hal-hal yang belum terjadi di masa depan. Tapi ingat, langkahmu hari ini berharga dan kamu tidak harus menyelesaikan seluruh hidupmu malam ini.&rdquo;
                    </p>
                    <p className="leading-relaxed text-brown-700/90 font-medium pt-1 border-t border-[#C8E4CD]/60">
                      Mau kita urai satu per satu apa hal paling kecil yang terasa membebani pikiranmu saat ini?
                    </p>
                  </div>
                </div>

              </div>

              {/* Jeda Batin Cooldown Explanation (Sesuai Aturan AGENTS.md D8) */}
              <div className="rounded-2xl border border-brown-900/8 bg-[#F5F8F5] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs">
                  <Clock className="w-4 h-4 text-[#3E7B54] shrink-0" />
                  <span className="text-brown-700/80 leading-snug">
                    Batas <strong>15.000 Token per Sesi</strong> dengan <strong>Jeda Batin 5 Jam</strong> agar kamu tidak bergantung pada AI.
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#3E7B54] bg-emerald-100/90 px-2.5 py-0.5 rounded-full shrink-0">
                  Etika Mindful
                </span>
              </div>

            </div>

            {/* Quick Action Link */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/companion"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#3E7B54] hover:bg-[#346B48] active:scale-98 text-white font-bold text-xs sm:text-sm shadow-xs transition-all"
              >
                <span>Mulai Curhat Bersama Zibi</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <span className="text-xs text-brown-700/70 font-medium">
                Bebas biaya 100% tanpa batas langganan.
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
