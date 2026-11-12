"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCompanion } from "@/components/companion/CompanionContext";
import { PERSONAS, PersonaId } from "@/backend/ai/personas";
import { PersonaAvatar } from "@/components/companion/PersonaAvatars";
import { ChatInput } from "@/components/companion/ChatInput";
import { Mascot } from "@/components/ui/Mascot";
import { Menu, Sparkles, MessageSquareHeart } from "lucide-react";

const STARTER_PROMPTS = [
  "Aku merasa lelah dan overthinking belakangan ini...",
  "Bantu aku memilah hal yang bisa kukendalikan hari ini.",
  "Aku sedang cemas tentang masa depan dan karier.",
  "Aku butuh afirmasi positif dan ruang tenang.",
];

export default function CompanionLandingPage() {
  const router = useRouter();
  const {
    selectedPersona,
    setSelectedPersona,
    remainingQuota,
    refreshConversations,
    setIsMobileSidebarOpen,
    setIsQuotaModalOpen,
  } = useCompanion();

  const [isLoading, setIsLoading] = useState(false);
  const currentPersona = PERSONAS[selectedPersona];

  const handleStartChat = async (messageText: string, persona: PersonaId) => {
    if (remainingQuota <= 0) {
      setIsQuotaModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create a new conversation with first message
      const res = await fetch("/api/companion/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initialMessage: messageText,
          persona,
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

      // 2. Navigate to active chat
      if (data.conversationId) {
        router.push(`/companion/${data.conversationId}`);
      }
    } catch (err) {
      console.error("Error creating conversation:", err);
      alert("Terjadi kesalahan jaringan.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-cream">
      {/* Mobile & Tablet Top Header */}
      <div className="lg:hidden flex items-center justify-between p-3 bg-white border-b border-botanical-500/15">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-1.5 rounded-lg text-charcoal-900/70 hover:text-charcoal-900 hover:bg-cream"
          aria-label="Buka riwayat percakapan"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Mascot pose="default" size={40} animate={false} decorative={true} />
          <span className="text-xs font-serif font-bold text-charcoal-900">
            Zyba Companion
          </span>
        </div>
        <div className="w-8" />
      </div>

      {/* Main Scrollable Empty State Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 max-w-3xl mx-auto w-full flex flex-col items-center justify-center text-center">
        {/* Mascot Listening Pose in Empty State */}
        <div className="mb-4 flex flex-col items-center">
          <Mascot pose="listening" size={170} animate={true} decorative={true} />
        </div>

        {/* Title & Welcoming Tagline */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-100 text-botanical-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Suaka Curhat Empatis
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 tracking-tight mb-2">
          Cerita apa hari ini bersama {currentPersona.name}?
        </h1>
        <p className="text-sm text-charcoal-900/70 max-w-md mx-auto mb-6 leading-relaxed">
          {currentPersona.greetingStarter}
        </p>

        {/* Persona Switcher Chips */}
        <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
          {(Object.keys(PERSONAS) as PersonaId[]).map((pid) => {
            const p = PERSONAS[pid];
            const isSelected = p.id === selectedPersona;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPersona(p.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col items-center text-center ${
                  isSelected
                    ? "bg-white border-botanical-500 ring-2 ring-botanical-500/20 shadow-xs"
                    : "bg-white/60 border-botanical-500/15 hover:bg-white"
                }`}
              >
                <div className="mb-1.5">
                  <PersonaAvatar id={p.id} size={40} />
                </div>
                <p className="text-xs font-bold text-charcoal-900">{p.name}</p>
                <p className="text-[10px] text-charcoal-900/60 leading-tight mt-0.5 line-clamp-1">
                  {p.roleTitle.split("&")[0]}
                </p>
              </button>
            );
          })}
        </div>

        {/* Starter Prompt Chips */}
        <div className="w-full max-w-lg mb-6">
          <p className="text-xs font-semibold text-charcoal-900/50 mb-2 flex items-center justify-center gap-1">
            <MessageSquareHeart className="w-3.5 h-3.5 text-botanical-500" />
            Pemantik Refleksi Cepat
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {STARTER_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleStartChat(prompt, selectedPersona)}
                disabled={isLoading}
                className="px-3.5 py-2 rounded-xl bg-white border border-botanical-500/15 text-xs text-charcoal-900/80 hover:border-botanical-500 hover:text-botanical-700 hover:bg-botanical-100/40 transition-all text-left shadow-2xs"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Input Bar */}
      <ChatInput
        onSendMessage={handleStartChat}
        isLoading={isLoading}
        selectedPersona={selectedPersona}
        onSelectPersona={setSelectedPersona}
        remainingQuota={remainingQuota}
      />
    </div>
  );
}
