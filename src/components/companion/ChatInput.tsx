"use client";

import React, { useState, useRef, useEffect } from "react";
import { PersonaId } from "@/backend/ai/personas";
import {
  Mic,
  MicOff,
  ArrowUp,
  Plus,
  ChevronDown,
  Sparkles,
  Wind,
  Brain,
  Heart,
  Smile,
} from "lucide-react";
import { useCompanion } from "./CompanionContext";

interface ChatInputProps {
  onSendMessage: (content: string, persona: PersonaId) => Promise<void> | void;
  isLoading: boolean;
  selectedPersona?: PersonaId;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  onSendMessage,
  isLoading,
  placeholder = "Tuliskan apa pun yang sedang kamu rasakan...",
  className = "",
}: ChatInputProps) {
  const { isCooldown, setIsQuotaModalOpen } = useCompanion();

  const [content, setContent] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showFocusMenu, setShowFocusMenu] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState("Curhat Bebas");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-grow textarea up to 180px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [content]);

  // Web Speech API STT setup (id-ID)
  const toggleListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Browser ini belum mendukung Web Speech Recognition. Gunakan Google Chrome atau Edge."
      );
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "id-ID";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setContent((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Gagal memulai perekam suara:", err);
      setIsListening(false);
    }
  };

  // Close dropdown on Escape (antislop-human R-26)
  useEffect(() => {
    if (!showFocusMenu) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowFocusMenu(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFocusMenu]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (isCooldown) {
      setIsQuotaModalOpen(true);
      return;
    }
    if (!content.trim() || isLoading) return;
    const textToSend = content.trim();
    setContent("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    onSendMessage(textToSend, "ZIBI");
  };

  const focusOptions = [
    { label: "Curhat Bebas", icon: Sparkles, desc: "Bercerita tanpa topik tertentu" },
    { label: "Urai Overthinking", icon: Brain, desc: "Membagi pikiran rumit jadi langkah kecil" },
    { label: "Jeda Bernafas", icon: Wind, desc: "Menenangkan detak jantung dan tubuh" },
    { label: "Afirmasi Positif", icon: Heart, desc: "Menemukan secercah hal baik hari ini" },
  ];

  return (
    <div className={`relative w-full ${className}`}>
      {/* Listening wave badge */}
      {isListening && (
        <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-botanical-500 text-white text-xs font-medium flex items-center gap-2 shadow-md animate-bounce motion-reduce:animate-none z-20">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping motion-reduce:animate-none" />
          Mendengarkan suaramu... Bicara sekarang
        </div>
      )}

      {/* Floating Card Input Container */}
      <div className="w-full rounded-3xl border border-botanical-500/20 bg-white p-3.5 sm:p-4 shadow-[0_8px_30px_rgba(27,36,30,0.06)] focus-within:border-botanical-500 focus-within:ring-2 focus-within:ring-botanical-500/15 transition-all">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isCooldown
              ? "Batas 15.000 token tercapai. Istirahatkan pikiranmu sejenak (Cooldown 5 jam)..."
              : placeholder
          }
          rows={1}
          disabled={isLoading || isCooldown}
          className="w-full bg-transparent resize-none text-sm text-charcoal-900 placeholder:text-charcoal-900/40 focus:outline-hidden leading-relaxed px-2 py-1 max-h-[160px] disabled:opacity-60"
        />

        {/* Toolbar Bar */}
        <div className="flex items-center justify-between gap-2 pt-2 mt-1 border-t border-botanical-500/10">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Plus Trigger Button */}
            <button
              type="button"
              onClick={() => {
                setContent((prev) =>
                  prev ? `${prev} Aku butuh bantuan Zibi untuk: ` : "Aku butuh bantuan Zibi untuk: "
                );
                textareaRef.current?.focus();
              }}
              title="Tambah pemicu refleksi"
              aria-label="Tambah pemicu refleksi"
              className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl text-charcoal-900/50 hover:text-charcoal-900 hover:bg-cream/80 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
            >
              <Plus className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Mic STT Button */}
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? "Hentikan perekaman suara" : "Bicara dengan suara"}
              aria-label={isListening ? "Hentikan suara" : "Bicara dengan suara"}
              className={`p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500 ${
                isListening
                  ? "bg-red-500 text-white animate-pulse motion-reduce:animate-none"
                  : "text-charcoal-900/50 hover:text-botanical-600 hover:bg-cream/80"
              }`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Focus Dropdown Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFocusMenu(!showFocusMenu)}
                aria-expanded={showFocusMenu}
                aria-haspopup="true"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-xl bg-cream/70 hover:bg-cream border border-botanical-500/15 text-xs text-charcoal-900 transition-colors shadow-2xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
              >
                <Sparkles className="w-3 h-3 text-botanical-600" />
                <span className="font-medium truncate max-w-[120px] sm:max-w-none">
                  {selectedFocus}
                </span>
                <ChevronDown className="w-3 h-3 text-charcoal-900/40" />
              </button>

              {/* Focus Menu Dropdown */}
              {showFocusMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowFocusMenu(false)}
                  />
                  <div className="absolute bottom-full left-0 mb-2 w-64 p-2 rounded-2xl bg-white border border-botanical-500/20 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 motion-reduce:transition-none">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-900/40 px-2.5 py-1">
                      Fokus Curhat Hari Ini
                    </p>
                    {focusOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSel = selectedFocus === opt.label;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => {
                            setSelectedFocus(opt.label);
                            setShowFocusMenu(false);
                          }}
                          className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500 ${
                            isSel
                              ? "bg-botanical-100/70 text-botanical-800 font-semibold"
                              : "hover:bg-cream text-charcoal-900"
                          }`}
                        >
                          <Icon className="w-4 h-4 mt-0.5 text-botanical-600 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs">{opt.label}</p>
                            <p className="text-[10px] text-charcoal-900/50 leading-tight">
                              {opt.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!content.trim() || isLoading || isCooldown}
            className="w-9 h-9 rounded-full bg-botanical-500 hover:bg-botanical-600 disabled:opacity-35 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-xs shrink-0 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500 focus-visible:ring-offset-2 motion-reduce:active:scale-100"
            aria-label="Kirim pesan curhat"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
