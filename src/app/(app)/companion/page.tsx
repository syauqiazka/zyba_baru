"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCompanion } from "@/components/companion/CompanionContext";
import { ChatInput } from "@/components/companion/ChatInput";
import { Mascot } from "@/components/ui/Mascot";
import {
  Menu,
  Wind,
  Brain,
  Heart,
  Clock,
  MessageSquare,
  Compass,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

export default function CompanionLandingPage() {
  const router = useRouter();
  const {
    conversations,
    userName,
    remainingTokens,
    tokenLimit,
    isCooldown,
    cooldownRemainingSec,
    refreshConversations,
    setIsMobileSidebarOpen,
    setIsQuotaModalOpen,
  } = useCompanion();

  const [isLoading, setIsLoading] = useState(false);

  // Dynamic greeting based on time of day (WIB)
  const hour = new Date().getHours();
  const greeting =
    hour >= 4 && hour < 11
      ? "Selamat Pagi"
      : hour >= 11 && hour < 15
      ? "Selamat Siang"
      : hour >= 15 && hour < 18
      ? "Selamat Sore"
      : "Selamat Malam";

  const handleStartChat = async (messageText: string) => {
    if (isCooldown) {
      setIsQuotaModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/companion/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initialMessage: messageText,
        }),
      });

      if (!res.ok) {
        if (res.status === 403) {
          setIsQuotaModalOpen(true);
        } else {
          alert("Gagal memulai percakapan. Silakan coba lagi.");
        }
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      await refreshConversations();

      if (data.conversationId) {
        router.push(`/companion/${data.conversationId}`);
      }
    } catch (err) {
      console.error("Error creating conversation:", err);
      alert("Terjadi kesalahan jaringan.");
      setIsLoading(false);
    }
  };

  // Quick Action Pills (Matching the reference's row of buttons beneath input)
  const quickActions = [
    {
      label: "Urai Overthinking",
      icon: Brain,
      prompt: "Aku sedang terjebak overthinking belakangan ini, bantu aku memilahnya dengan tenang.",
    },
    {
      label: "Jeda Bernafas 4-7-8",
      icon: Wind,
      prompt: "Bimbing aku untuk mengambil jeda nafas mindful 4-7-8 sejenak.",
    },
    {
      label: "Afirmasi Tenang",
      icon: Heart,
      prompt: "Aku butuh afirmasi positif dan pengingat lembut untuk hariku hari ini.",
    },
    {
      label: "Rencana Hari Ini",
      icon: Compass,
      prompt: "Bantu aku menyusun 2-3 langkah mikro yang ringan tanpa tekanan hari ini.",
    },
  ];

  const cooldownHours = Math.floor(cooldownRemainingSec / 3600);
  const cooldownMinutes = Math.floor((cooldownRemainingSec % 3600) / 60);
  const cooldownSeconds = cooldownRemainingSec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#F5F8F5] via-[#FAFBF9] to-white">
      {/* Top Navigation Bar */}
      <header className="px-3 sm:px-4 py-2.5 bg-white/80 backdrop-blur-md border-b border-botanical-500/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile drawer button */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-charcoal-900/70 hover:text-charcoal-900 hover:bg-cream focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
            aria-label="Buka riwayat percakapan"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Back to Dashboard Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-botanical-500/15 bg-white text-xs font-semibold text-charcoal-900 hover:bg-cream transition-colors shadow-2xs whitespace-nowrap"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-botanical-600 shrink-0" />
            <span className="hidden sm:inline">Beranda</span>
          </Link>
        </div>

        {/* Clean Center Title (No Popovers / No Dropdown Overlap) */}
        <div className="flex items-center gap-2">
          <span className="font-display text-xs sm:text-sm font-bold text-charcoal-900">
            Zyba Companion
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100/90 text-[#3E7B54]">
            Zibi
          </span>
        </div>

        {/* Right Token Badge (Clean, No Star/Sparkles Decoration) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQuotaModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-cream hover:bg-botanical-100/50 border border-botanical-500/15 text-xs text-charcoal-900 transition-colors shadow-2xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
            title="Detail token & jeda"
          >
            {isCooldown ? (
              <span className="font-bold text-amber-700 font-mono text-[10px] sm:text-[11px]">
                Jeda ({pad(cooldownHours)}:{pad(cooldownMinutes)}:{pad(cooldownSeconds)})
              </span>
            ) : (
              <span className="text-[10px] sm:text-[11px] font-mono">
                <strong className="text-botanical-700">
                  {remainingTokens.toLocaleString("id-ID")}
                </strong>{" "}
                / {tokenLimit.toLocaleString("id-ID")} Token
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Scrollable Canvas */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:py-10">
        <div className="max-w-2xl mx-auto w-full flex flex-col items-center text-center">
          {/* Center Hero Mascot (100% Box-Free, Breathing Freely on Canvas) */}
          <div className="relative mb-3 sm:mb-5 flex items-center justify-center">
            <Mascot
              pose={isCooldown ? "sleep" : "listening"}
              size={115}
              animate={true}
              decorative={true}
              className="drop-shadow-[0_8px_20px_rgba(62,123,84,0.12)]"
            />
          </div>

          {/* Greeting */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-charcoal-900 tracking-tight mb-1.5">
            {greeting}, {userName}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-charcoal-900/60 mb-6 leading-relaxed max-w-md">
            {isCooldown
              ? "Sesi jeda batin sedang aktif. Beristirahatlah sejenak dari AI dan layar."
              : "Ada yang ingin kamu ceritakan atau refleksikan bersama Zibi hari ini?"}
          </p>

          {/* Cooldown Active Alert Banner */}
          {isCooldown && (
            <button
              type="button"
              onClick={() => setIsQuotaModalOpen(true)}
              className="w-full mb-6 p-4 rounded-3xl bg-amber-50/90 border border-amber-300 text-left flex items-start gap-3.5 shadow-xs hover:bg-amber-50 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <div className="w-9 h-9 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-950">
                    Jeda Batin 5 Jam Aktif (15.000 Token Tercapai)
                  </h4>
                  <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg">
                    {pad(cooldownHours)}:{pad(cooldownMinutes)}:{pad(cooldownSeconds)}
                  </span>
                </div>
                <p className="text-[11px] text-amber-900/80 mt-1 leading-relaxed">
                  Demi mencegah ketergantungan pada AI, sesi curhat dibuka kembali setelah jeda 5 jam selesai. Klik untuk saran aktivitas mindful offline.
                </p>
              </div>
            </button>
          )}

          {/* Prominent Floating Center Input Card (Matching Reference's "Ask anything..." Box) */}
          <div className="w-full mb-5">
            <ChatInput
              onSendMessage={handleStartChat}
              isLoading={isLoading}
              placeholder="Ceritakan apa pun yang sedang kamu rasakan..."
            />
          </div>

          {/* Quick Action Starter Pills */}
          <div className="w-full flex items-center justify-center flex-wrap gap-2 mb-6">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleStartChat(action.prompt)}
                  disabled={isLoading || isCooldown}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[38px] rounded-2xl bg-white hover:bg-cream border border-botanical-500/15 text-xs text-charcoal-900/80 hover:text-charcoal-900 transition-all shadow-2xs hover:shadow-xs disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
                >
                  <Icon className="w-3.5 h-3.5 text-botanical-600 shrink-0" />
                  <span className="font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
