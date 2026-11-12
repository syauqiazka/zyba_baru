"use client";

import React, { useState, useRef, useEffect } from "react";
import { PersonaId, PERSONAS } from "@/backend/ai/personas";
import { Mic, MicOff, Send, Sparkles, ChevronDown } from "lucide-react";
import { PersonaAvatar } from "./PersonaAvatars";

interface ChatInputProps {
  onSendMessage: (content: string, persona: PersonaId) => Promise<void> | void;
  isLoading: boolean;
  selectedPersona: PersonaId;
  onSelectPersona: (persona: PersonaId) => void;
  remainingQuota: number;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  isLoading,
  selectedPersona,
  onSelectPersona,
  remainingQuota,
  placeholder = "Ketik ceritamu di sini... (Shift + Enter untuk baris baru)",
}: ChatInputProps) {
  const [content, setContent] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
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

  // Web Speech API STT setup
  const toggleListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Browser ini belum mendukung Web Speech Recognition. Gunakan Google Chrome atau Edge.");
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!content.trim() || isLoading) return;
    const textToSend = content.trim();
    setContent("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    onSendMessage(textToSend, selectedPersona);
  };

  const currentPersonaObj = PERSONAS[selectedPersona];

  return (
    <div className="relative p-3 sm:p-4 bg-white border-t border-botanical-500/15">
      {/* Listening wave indicator */}
      {isListening && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-botanical-500 text-white text-xs font-medium flex items-center gap-2 shadow-md animate-bounce">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
          Mendengarkan suaramu... Bicara sekarang
        </div>
      )}

      {/* Main input container */}
      <div className="max-w-4xl mx-auto flex flex-col gap-2 rounded-2xl border border-botanical-500/20 bg-cream/50 p-2 sm:p-3 focus-within:border-botanical-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-botanical-500/15 transition-all shadow-xs">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isLoading}
          className="w-full bg-transparent resize-none text-sm text-charcoal-900 placeholder:text-charcoal-900/40 focus:outline-hidden leading-relaxed px-1 max-h-[180px]"
        />

        {/* Toolbar below textarea */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-botanical-500/10">
          {/* Persona selector pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-botanical-500/20 text-xs font-medium text-charcoal-900 hover:bg-cream transition-colors shadow-2xs"
            >
              <PersonaAvatar id={selectedPersona} size={20} />
              <span>{currentPersonaObj.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-charcoal-900/40" />
            </button>

            {/* Persona Menu Popup */}
            {showPersonaMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowPersonaMenu(false)}
                />
                <div className="absolute bottom-full left-0 mb-2 w-64 p-2 rounded-2xl bg-white border border-botanical-500/15 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <p className="text-[11px] font-semibold text-charcoal-900/50 uppercase tracking-wider px-2 py-1">
                    Pilih Karakter Pendamping
                  </p>
                  {(Object.keys(PERSONAS) as PersonaId[]).map((pid) => {
                    const p = PERSONAS[pid];
                    const isSelected = p.id === selectedPersona;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          onSelectPersona(p.id);
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
                          isSelected
                            ? "bg-botanical-100/70 text-botanical-700 font-semibold"
                            : "hover:bg-cream text-charcoal-900"
                        }`}
                      >
                        <PersonaAvatar id={p.id} size={32} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate">{p.name}</p>
                          <p className="text-[10px] text-charcoal-900/50 truncate">
                            {p.roleTitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Right Actions: STT mic + quota hint + send button */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] text-charcoal-900/40">
              Sisa kuota: <span className="font-semibold text-botanical-600">{remainingQuota}</span>/20
            </span>

            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? "Hentikan suara" : "Bicara dengan suara (STT)"}
              className={`p-2 rounded-xl transition-colors ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "text-charcoal-900/60 hover:text-botanical-600 hover:bg-cream"
              }`}
              aria-label={isListening ? "Hentikan merekam" : "Mulai merekam suara"}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Send CTA */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!content.trim() || isLoading}
              className="inline-flex items-center justify-center p-2 rounded-xl bg-botanical-500 text-white hover:bg-botanical-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
              aria-label="Kirim pesan curhat"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
