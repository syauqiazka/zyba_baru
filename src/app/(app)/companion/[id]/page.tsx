"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCompanion } from "@/components/companion/CompanionContext";
import { PERSONAS, PersonaId } from "@/backend/ai/personas";
import { PersonaAvatar } from "@/components/companion/PersonaAvatars";
import {
  ChatMessageBubble,
  ChatMessageItem,
} from "@/components/companion/ChatMessageBubble";
import { ChatInput } from "@/components/companion/ChatInput";
import { CrisisBanner } from "@/components/companion/CrisisBanner";
import { Mascot } from "@/components/ui/Mascot";
import { Menu, ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ActiveCompanionChatPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params?.id as string;

  const {
    selectedPersona,
    setSelectedPersona,
    remainingQuota,
    refreshConversations,
    setIsMobileSidebarOpen,
    setIsQuotaModalOpen,
    decrementQuota,
  } = useCompanion();

  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationTitle, setConversationTitle] = useState("Percakapan Suaka");
  const [hasCrisisRisk, setHasCrisisRisk] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch initial messages for this conversation
  useEffect(() => {
    if (!conversationId) return;

    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/companion/conversations/${conversationId}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) {
            router.push("/companion");
            return null;
          }
          throw new Error("Gagal mengambil pesan");
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted || !data) return;
        setMessages(data.messages || []);
        if (data.title) setConversationTitle(data.title);
        if (data.persona && PERSONAS[data.persona as PersonaId]) {
          setSelectedPersona(data.persona as PersonaId);
        }

        // Check if any message is flagged for risk
        const riskFound = data.messages?.some((m: any) => m.flaggedForRisk);
        if (riskFound) setHasCrisisRisk(true);
      })
      .catch((err) => {
        console.error("Error fetching conversation messages:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [conversationId, router, setSelectedPersona]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string, persona: PersonaId) => {
    if (remainingQuota <= 0) {
      setIsQuotaModalOpen(true);
      return;
    }

    const optimisticId = `temp_${Date.now()}`;
    const userMsg: ChatMessageItem = {
      id: optimisticId,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/companion/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content: text,
          persona,
        }),
      });

      if (!res.ok) {
        if (res.status === 403) {
          setIsQuotaModalOpen(true);
          setIsTyping(false);
          return;
        }
        throw new Error("Gagal mengirim pesan");
      }

      const data = await res.json();
      decrementQuota();

      // Check if crisis flagged
      if (data.message?.flaggedForRisk) {
        setHasCrisisRisk(true);
      }

      // Add assistant message
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }

      // Refresh sidebar conversation titles/timestamps
      refreshConversations();
    } catch (err) {
      console.error("Chat error:", err);
      // Append gentle fallback message
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content:
            "Maaf, koneksi suaka sedang mengalami kendala sesaat. Tarik napas perlahan dan silakan coba kirim ulang ceritamu ya.",
          persona,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const personaConfig = PERSONAS[selectedPersona] || PERSONAS.KINA;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-cream">
      {/* Chat Top Header */}
      <header className="px-4 py-3 bg-white border-b border-botanical-500/15 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Mobile & Tablet drawer button */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-charcoal-900/70 hover:text-charcoal-900 hover:bg-cream"
            aria-label="Buka daftar percakapan"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            href="/companion"
            className="hidden sm:inline-flex items-center justify-center p-1.5 rounded-lg text-charcoal-900/40 hover:text-charcoal-900 hover:bg-cream"
            title="Kembali ke Ringkasan"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Persona Avatar & Info */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <PersonaAvatar id={selectedPersona} size={36} />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-serif font-bold text-charcoal-900">
                  {personaConfig.name}
                </h2>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-botanical-100 text-botanical-700 font-medium">
                  {personaConfig.avatarAnimal}
                </span>
              </div>
              <p className="text-[11px] text-charcoal-900/50 line-clamp-1">
                {conversationTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Quota Badge & Companion Header Mascot Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream border border-botanical-500/15 text-xs text-charcoal-900/70">
            <Sparkles className="w-3 h-3 text-botanical-500" />
            <span>Sisa kuota:</span>
            <span className="font-bold text-botanical-600">{remainingQuota}</span>
            <span>/ 20</span>
          </div>
          <div className="flex items-center" title="Maskot ZYBA">
            <Mascot pose="default" size={42} animate={false} decorative={true} />
          </div>
        </div>
      </header>

      {/* Optional Crisis Help Banner */}
      {hasCrisisRisk && (
        <CrisisBanner onDismiss={() => setHasCrisisRisk(false)} />
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {isLoading && messages.length === 0 ? (
            <div className="p-12 text-center text-charcoal-900/40 flex flex-col items-center">
              <RefreshCw className="w-6 h-6 animate-spin mb-2 text-botanical-500" />
              <p className="text-xs">Membuka suaka curhat...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-charcoal-900/50">
              <p className="text-sm">
                Belum ada pesan dalam percakapan ini. Mulailah mengetik ceritamu.
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <ChatMessageBubble
                key={m.id}
                message={m}
                currentPersona={selectedPersona}
              />
            ))
          )}

          {/* Typing Wave Pulse Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3 mb-4 animate-in fade-in duration-200">
              <div className="shrink-0 mt-0.5">
                <PersonaAvatar id={selectedPersona} size={32} />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-xs bg-white border border-botanical-500/15 shadow-xs flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-botanical-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-botanical-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-botanical-500 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-xs text-charcoal-900/60 font-medium">
                  {personaConfig.name} sedang merangkai kata...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input Bar */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isTyping}
        selectedPersona={selectedPersona}
        onSelectPersona={setSelectedPersona}
        remainingQuota={remainingQuota}
      />
    </div>
  );
}
