"use client";

import React, { useState } from "react";
import { PersonaId } from "@/backend/ai/personas";
import { PersonaAvatar } from "./PersonaAvatars";
import { Volume2, VolumeX, Copy, Check, Sparkles } from "lucide-react";

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  persona?: PersonaId;
  createdAt: string | Date;
  modelUsed?: string;
  flaggedForRisk?: boolean;
}

interface ChatMessageBubbleProps {
  message: ChatMessageItem;
  currentPersona?: PersonaId;
}

export function ChatMessageBubble({
  message,
  currentPersona = "KINA",
}: ChatMessageBubbleProps) {
  const isUser = message.role === "user";
  const persona = message.persona || currentPersona;
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatTime = (dateInput: string | Date) => {
    try {
      const d = new Date(dateInput);
      return d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin pesan:", err);
    }
  };

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Fitur suara tidak didukung di browser ini.");
      return;
    }

    if (isPlayingTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.lang = "id-ID";
    utterance.rate = 0.95; // Slightly calmer pace
    utterance.pitch = 1.05;

    // Pick an Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(
      (v) => v.lang.startsWith("id") || v.lang.includes("ID")
    );
    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }

    utterance.onstart = () => setIsPlayingTTS(true);
    utterance.onend = () => setIsPlayingTTS(false);
    utterance.onerror = () => setIsPlayingTTS(false);

    window.speechSynthesis.speak(utterance);
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 group">
        <div className="max-w-[85%] sm:max-w-[70%] flex flex-col items-end">
          <div className="px-4 py-3 rounded-2xl rounded-tr-xs bg-peach-100/90 text-charcoal-900 border border-peach-500/25 shadow-xs">
            <p className="text-sm leading-relaxed whitespace-pre-wrap selection:bg-peach-200">
              {message.content}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1 px-1">
            <span className="text-[10px] text-charcoal-900/40">
              {formatTime(message.createdAt)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-5 group">
      {/* Persona Mini Avatar */}
      <div className="shrink-0 mt-0.5">
        <PersonaAvatar id={persona} size={36} />
      </div>

      <div className="max-w-[88%] sm:max-w-[75%] flex flex-col items-start">
        <div className="px-5 py-4 rounded-2xl rounded-tl-xs bg-white text-charcoal-900 border border-botanical-500/15 shadow-xs">
          <div className="text-sm leading-relaxed whitespace-pre-wrap selection:bg-botanical-100 text-charcoal-900/90 font-normal">
            {message.content}
          </div>

          {/* Model info badge if available */}
          {message.modelUsed && (
            <div className="mt-3 pt-2.5 border-t border-botanical-500/10 flex items-center justify-between gap-2">
              <span className="text-[10px] text-charcoal-900/40 flex items-center gap-1 font-mono">
                <Sparkles className="w-2.5 h-2.5 text-botanical-500" />
                {message.modelUsed}
              </span>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                {/* TTS Audio Button */}
                <button
                  onClick={handleSpeak}
                  title={isPlayingTTS ? "Hentikan pembacaan" : "Dengarkan respons suara"}
                  className={`p-1.5 rounded-lg text-charcoal-900/50 hover:text-botanical-600 hover:bg-cream transition-colors ${
                    isPlayingTTS ? "text-botanical-600 bg-botanical-100 animate-pulse" : ""
                  }`}
                  aria-label={isPlayingTTS ? "Hentikan suara" : "Dengarkan respons suara"}
                >
                  {isPlayingTTS ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Copy Text Button */}
                <button
                  onClick={handleCopy}
                  title="Salin teks"
                  className="p-1.5 rounded-lg text-charcoal-900/50 hover:text-botanical-600 hover:bg-cream transition-colors"
                  aria-label="Salin teks respons"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-botanical-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1 px-1">
          <span className="text-[10px] text-charcoal-900/40">
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

