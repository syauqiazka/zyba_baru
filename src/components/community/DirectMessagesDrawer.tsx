"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  MessageCircle,
  ArrowLeft,
  Sparkles,
  Check,
  CheckCheck,
  User,
  Radio,
} from "lucide-react";
import { useDirectMessages } from "./useDirectMessages";

interface DirectMessagesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialConversationId?: string;
}

export function DirectMessagesDrawer({
  isOpen,
  onClose,
  initialConversationId,
}: DirectMessagesDrawerProps) {
  const [activeConvId, setActiveConvId] = useState<string | undefined>(
    initialConversationId
  );
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    messages,
    loadingConv,
    loadingMessages,
    sendMessage,
    totalUnread,
  } = useDirectMessages(activeConvId);

  // Set active conv jika diberikan dari luar
  useEffect(() => {
    if (initialConversationId) {
      setActiveConvId(initialConversationId);
    }
  }, [initialConversationId]);

  // Scroll otomatis ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;
    const text = inputText;
    setInputText("");
    await sendMessage(activeConvId, text);
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white border-l border-brown-900/10 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-brown-900/10 bg-[#F5F8F5]/80 flex items-center justify-between shrink-0">
          {activeConvId ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setActiveConvId(undefined)}
                className="p-1.5 rounded-lg text-brown-700 hover:text-brown-900 hover:bg-cream"
                aria-label="Kembali ke daftar percakapan"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#3E7B54] flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200">
                {activeConv?.partnerName?.charAt(0) || "S"}
              </div>
              <div className="truncate">
                <h3 className="font-serif text-sm font-bold text-brown-900 truncate">
                  {activeConv?.partnerName || "Sahabat Suaka"}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Realtime via Ably</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#3E7B54] text-white flex items-center justify-center shadow-2xs">
                <MessageCircle className="h-4 w-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-brown-900">
                  Pesan Komunitas
                </h3>
                <p className="text-[10px] text-brown-700/60">
                  {totalUnread > 0 ? `${totalUnread} pesan baru` : "Ruang berbagi privat"}
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-brown-700 hover:text-brown-900 hover:bg-cream"
            aria-label="Tutup Pesan"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        {activeConvId ? (
          /* Active Chat View */
          <div className="flex-1 flex flex-col min-h-0 bg-[#F5F8F5]/40">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {loadingMessages ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-[#3E7B54] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-cream text-brown-700 mx-auto flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 opacity-60" />
                  </div>
                  <p className="text-xs font-bold text-brown-900">
                    Belum ada pesan di sini.
                  </p>
                  <p className="text-[11px] text-brown-700/60 max-w-xs mx-auto leading-relaxed">
                    Kirim sapaan hangat pertama untuk saling mendengarkan dan mendukung.
                  </p>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.isMine ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                        m.isMine
                          ? "bg-[#3E7B54] text-white rounded-br-xs"
                          : "bg-white text-brown-900 border border-brown-900/10 rounded-bl-xs"
                      }`}
                    >
                      <p>{m.content}</p>
                    </div>
                    <span className="text-[9px] text-brown-700/50 mt-1 px-1">
                      {formatTime(m.createdAt)}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-brown-900/10 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tulis pesan saling mendukung..."
                className="flex-1 h-10 px-4 rounded-full bg-cream/40 border border-brown-900/10 text-xs text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:border-[#3E7B54] focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-brown-900 flex items-center justify-center shadow-xs transition-all shrink-0 active:scale-95"
                aria-label="Kirim Pesan"
              >
                <Send className="h-4 w-4 stroke-[2.2]" />
              </button>
            </form>
          </div>
        ) : (
          /* Conversation List View */
          <div className="flex-1 overflow-y-auto divide-y divide-brown-900/6">
            {loadingConv ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-[#3E7B54] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-16 px-6 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-cream text-[#3E7B54] mx-auto flex items-center justify-center shadow-2xs">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h4 className="font-serif text-sm font-bold text-brown-900">
                  Ruang Pesan Bersih
                </h4>
                <p className="text-xs text-brown-700/60 leading-relaxed">
                  Kamu belum memiliki percakapan pesan langsung. Sapa sahabat di postingan komunitas untuk mulai terhubung.
                </p>
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveConvId(c.id)}
                  className="w-full p-4 flex items-start gap-3 text-left hover:bg-cream/40 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#3E7B54] flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200">
                    {c.partnerName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-brown-900 truncate group-hover:text-[#3E7B54] transition-colors">
                        {c.partnerName}
                      </h4>
                      <span className="text-[10px] text-brown-700/50 shrink-0">
                        {formatTime(c.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-brown-700/70 truncate leading-relaxed">
                      {c.lastMessageSnippet}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-brown-900 text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
