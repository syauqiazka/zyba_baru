"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCompanion } from "@/components/companion/CompanionContext";
import { ChatInput } from "@/components/companion/ChatInput";
import { Mascot } from "@/components/ui/Mascot";
import {
  Menu,
  ChevronDown,
  Sparkles,
  Wind,
  Brain,
  Heart,
  Clock,
  MessageSquare,
  Compass,
  ArrowRight,
  Info,
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
  const [showZibiInfo, setShowZibiInfo] = useState(false);

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

  // 3 Recent chats (or fallback starter reflection cards)
  const recentChats = conversations.slice(0, 3);

  const fallbackCards = [
    {
      id: "f-1",
      title: "Melepas Lelah Mental",
      snippet: "Bagikan beban yang membuat energimu terasa terkuras hari ini...",
      date: "Saran Zibi",
      prompt: "Aku merasa energiku terkuras habis hari ini dan ingin curhat santai.",
    },
    {
      id: "f-2",
      title: "Kecemasan Masa Depan",
      snippet: "Mengurai ketakutan dan kekhawatiran tentang langkah berikutnya...",
      date: "Saran Zibi",
      prompt: "Aku cemas memikirkan masa depan dan ekspektasi di sekitarku.",
    },
    {
      id: "f-3",
      title: "Momen Syukur Sederhana",
      snippet: "Menemukan secercah hal hangat yang layak dirayakan hari ini...",
      date: "Saran Zibi",
      prompt: "Ajak aku mengingat hal-hal kecil yang layak kusyukuri hari ini.",
    },
  ];

  const formatCardDate = (dateInput: string | Date) => {
    try {
      const d = new Date(dateInput);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return "Hari ini";
    }
  };

  const cooldownHours = Math.floor(cooldownRemainingSec / 3600);
  const cooldownMinutes = Math.floor((cooldownRemainingSec % 3600) / 60);
  const cooldownSeconds = cooldownRemainingSec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#F5F8F5] via-[#FAFBF9] to-white">
      {/* Top Navigation Bar (Matching reference: Centered "Aetheris AI Chat ∨") */}
      <header className="px-4 py-3 bg-white/70 backdrop-blur-md border-b border-botanical-500/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {/* Mobile drawer button */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl text-charcoal-900/60 hover:text-charcoal-900 hover:bg-cream focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
            aria-label="Buka riwayat percakapan"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Centered Breadcrumb / Title Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowZibiInfo(!showZibiInfo)}
            aria-expanded={showZibiInfo}
            aria-haspopup="true"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream/90 hover:bg-cream border border-botanical-500/15 text-xs font-serif font-bold text-charcoal-900 transition-colors shadow-2xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
          >
            <span>Zyba Companion &bull; Zibi</span>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-900/40" />
          </button>

          {/* Zibi Info Popup */}
          {showZibiInfo && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowZibiInfo(false)}
              />
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 rounded-3xl bg-white border border-botanical-500/15 shadow-xl z-50 text-center animate-in fade-in zoom-in-95 duration-150 motion-reduce:transition-none">
                <div className="mb-2 flex justify-center">
                  <Mascot pose="happy" size={70} animate={false} decorative={true} />
                </div>
                <h4 className="text-sm font-serif font-bold text-charcoal-900">
                  Zibi &bull; Axolotl Suaka
                </h4>
                <p className="text-[11px] text-charcoal-900/70 mt-1 leading-relaxed">
                  Sahabat AI mindful yang mendengarkan curhatmu tanpa penghakiman 24/7.
                </p>
                <div className="mt-3 pt-2.5 border-t border-botanical-500/10 text-[10px] text-charcoal-900/50 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-botanical-500" />
                  Batas sesi: 15.000 Token &bull; Jeda 5 Jam
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Token Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQuotaModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream hover:bg-botanical-100/50 border border-botanical-500/15 text-xs text-charcoal-900 transition-colors shadow-2xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
            title="Klik untuk melihat detail token & jeda"
          >
            <Sparkles className="w-3 h-3 text-botanical-500" />
            {isCooldown ? (
              <span className="font-bold text-amber-700 font-mono text-[11px]">
                Jeda ({pad(cooldownHours)}:{pad(cooldownMinutes)}:{pad(cooldownSeconds)})
              </span>
            ) : (
              <span className="text-[11px] font-mono">
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
          <div className="relative mb-5 flex items-center justify-center">
            <Mascot
              pose={isCooldown ? "sleep" : "listening"}
              size={155}
              animate={true}
              decorative={true}
              className="drop-shadow-[0_8px_20px_rgba(62,123,84,0.12)]"
            />
          </div>

          {/* Greeting */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-charcoal-900 tracking-tight mb-1.5">
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
          <div className="w-full flex items-center justify-center flex-wrap gap-2 mb-10">
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

          {/* "Percakapan Terakhirmu" Section */}
          <div className="w-full text-left">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900/50 flex items-center gap-1.5 font-mono">
                <MessageSquare className="w-3.5 h-3.5 text-botanical-500" />
                Percakapan Terakhirmu
              </h3>
              {conversations.length > 3 && (
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="text-[11px] text-botanical-700 hover:text-botanical-800 font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500 rounded-md"
                >
                  Lihat Semua ({conversations.length})
                </button>
              )}
            </div>

            {/* 3 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recentChats.length > 0
                ? recentChats.map((chat) => (
                    <Link
                      key={chat.id}
                      href={`/companion/${chat.id}`}
                      className="group p-4 rounded-2xl bg-white border border-botanical-500/15 hover:border-botanical-500/40 hover:bg-cream/50 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-charcoal-900 group-hover:text-botanical-700 transition-colors line-clamp-1 mb-1">
                          {chat.title}
                        </h4>
                        <p className="text-[11px] text-charcoal-900/60 line-clamp-2 leading-relaxed">
                          Sesi curhat bersama Zibi mengenai perasaan dan refleksi batin.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-botanical-500/10 flex items-center justify-between text-[10px] text-charcoal-900/40 font-mono">
                        <span>{formatCardDate(chat.updatedAt)}</span>
                        <ArrowRight className="w-3 h-3 text-botanical-500 group-hover:translate-x-0.5 transition-transform motion-reduce:group-hover:translate-x-0" />
                      </div>
                    </Link>
                  ))
                : fallbackCards.map((card) => (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handleStartChat(card.prompt)}
                      disabled={isLoading || isCooldown}
                      className="group p-4 rounded-2xl bg-white border border-botanical-500/15 hover:border-botanical-500/40 hover:bg-cream/50 transition-all shadow-2xs hover:shadow-xs text-left flex flex-col justify-between disabled:opacity-50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-charcoal-900 group-hover:text-botanical-700 transition-colors line-clamp-1 mb-1">
                          {card.title}
                        </h4>
                        <p className="text-[11px] text-charcoal-900/60 line-clamp-2 leading-relaxed">
                          {card.snippet}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-botanical-500/10 flex items-center justify-between text-[10px] text-charcoal-900/40 font-mono">
                        <span>{card.date}</span>
                        <ArrowRight className="w-3 h-3 text-botanical-500 group-hover:translate-x-0.5 transition-transform motion-reduce:group-hover:translate-x-0" />
                      </div>
                    </button>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
