"use client";

import React, { useState } from "react";
import { Plus, X, Send, EyeOff, Tag, HeartHandshake } from "lucide-react";
import { detectRisk } from "@/lib/crisisDetection";

const TOPIC_OPTIONS = [
  "Pikiran Tenang",
  "Overthinking",
  "Lingkar Syukur",
  "Kisah Pulih",
  "Tanya Jawab",
];

interface FloatingComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  userName: string;
}

export function FloatingComposeModal({
  isOpen,
  onClose,
  onPostCreated,
  userName,
}: FloatingComposeModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topicTag, setTopicTag] = useState("Pikiran Tenang");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [crisisAlert, setCrisisAlert] = useState(false);

  if (!isOpen) return null;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    const risk = detectRisk(`${title} ${text}`);
    setCrisisAlert(risk.flagged);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!content.trim()) {
      setErrorMsg("Isi cerita tidak boleh kosong.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || undefined,
          content: content.trim(),
          topicTag,
          isAnonymous,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal membagikan cerita.");
      }

      setTitle("");
      setContent("");
      setIsAnonymous(false);
      onPostCreated();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal membagikan cerita.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Floating Compose Card di kanan bawah, TANPA backdrop gelap penuh sesuai AGENTS.md 7.6 */
    <div
      id="floating-compose-card"
      className="fixed bottom-6 right-6 z-50 w-[92vw] max-w-md rounded-3xl border border-brown-900/15 bg-white p-5 shadow-[0_12px_40px_-8px_rgba(59,42,32,0.18)] transition-all animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-brown-900/8">
        <div>
          <h4 className="font-serif text-sm font-bold text-brown-900">
            Tulis Cerita Cepat
          </h4>
          <p className="text-[10px] text-brown-700/60">
            Kanal berbagi tanpa penghakiman
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-brown-700/60 hover:text-brown-900 hover:bg-cream transition-colors"
          aria-label="Tutup panel tulis"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Crisis Warning if detected */}
      {crisisAlert && (
        <div className="mt-3 rounded-2xl border border-orange-500/25 bg-orange-100/60 p-3 text-xs text-brown-900 flex items-start gap-2.5">
          <HeartHandshake className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Kamu tidak sendiri. Jika butuh teman bicara saat ini juga, hubungi <strong>119</strong> atau tenaga profesional terpercaya.
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="mt-3 rounded-xl border border-orange-500/20 bg-orange-50 p-2 text-xs text-brown-900">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul refleksi (opsional)..."
          className="w-full px-3.5 py-2 rounded-xl bg-cream/40 border border-brown-900/10 text-xs font-bold text-brown-900 placeholder:text-brown-700/50 focus:outline-none focus:border-[#3E7B54] focus:bg-white transition-all"
        />

        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Ceritakan apa yang ada di hatimu..."
          rows={4}
          autoFocus
          className="w-full px-3.5 py-2.5 rounded-2xl bg-cream/40 border border-brown-900/10 text-xs text-brown-900 placeholder:text-brown-700/50 focus:outline-none focus:border-[#3E7B54] focus:bg-white transition-all resize-none leading-relaxed"
        />

        {/* Topic chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {TOPIC_OPTIONS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setTopicTag(topic)}
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                topicTag === topic
                  ? "bg-[#3E7B54] text-white font-bold"
                  : "bg-cream text-brown-700 hover:bg-brown-900/5"
              }`}
            >
              #{topic}
            </button>
          ))}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-2 border-t border-brown-900/8">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-brown-700 hover:text-brown-900">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded text-[#3E7B54] focus:ring-0"
            />
            <span className="flex items-center gap-1 text-[11px]">
              <EyeOff className="h-3 w-3 text-brown-700/70" />
              Anonim
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-brown-900 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
          >
            <Send className="h-3.5 w-3.5 stroke-[2.4]" />
            <span>{loading ? "Mengirim..." : "Kirim Cerita"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

