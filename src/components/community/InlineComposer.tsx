"use client";

import React, { useState } from "react";
import {
  Send,
  Sparkles,
  ShieldAlert,
  HeartHandshake,
  Tag,
  UserCheck,
  EyeOff,
} from "lucide-react";
import { detectRisk } from "@/lib/crisisDetection";

const TOPIC_OPTIONS = [
  "Pikiran Tenang",
  "Overthinking",
  "Lingkar Syukur",
  "Kisah Pulih",
  "Tanya Jawab",
];

interface InlineComposerProps {
  userName: string;
  onPostCreated: () => void;
}

export function InlineComposer({ userName, onPostCreated }: InlineComposerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Pikiran Tenang");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [crisisAlert, setCrisisAlert] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);

    // Dynamic risk check
    const risk = detectRisk(`${title} ${text}`);
    setCrisisAlert(risk.flagged);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!content.trim()) {
      setErrorMsg("Cerita tidak boleh kosong.");
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
          topicTag: selectedTopic,
          isAnonymous,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal membagikan cerita.");
      }

      // Reset form
      setTitle("");
      setContent("");
      setIsAnonymous(false);
      setIsOpen(false);
      setCrisisAlert(false);
      onPostCreated();
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat membagikan cerita.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-brown-900/10 bg-white p-4 sm:p-5 shadow-[0_2px_12px_-2px_rgba(59,42,32,0.04)] transition-all">
      {/* Gentle Crisis Care Alert if detected */}
      {crisisAlert && (
        <div className="mb-4 rounded-2xl border border-orange-500/25 bg-orange-100/60 p-3.5 text-xs text-brown-900 flex items-start gap-3">
          <HeartHandshake className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              Kami menyimak ceritamu dan peduli dengan keadaanmu.
            </p>
            <p className="text-brown-700 leading-relaxed text-[11px]">
              Jika bebanmu terasa terlalu berat untuk ditanggung sendiri, kamu berhak mendapatkan pertolongan. Hubungi hotline darurat <strong>119</strong> atau kunjungi halaman panduan krisis kami.
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-3 rounded-xl border border-orange-500/20 bg-orange-50 p-2.5 text-xs text-brown-900">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Top Trigger: Avatar + Input placeholder */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#3E7B54] flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-200">
            {isAnonymous ? <EyeOff className="h-4 w-4" /> : userName.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1 space-y-2">
            {isOpen && (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul refleksi (opsional)..."
                className="w-full px-3.5 py-2 rounded-xl bg-cream/50 border border-brown-900/10 text-xs font-bold text-brown-900 placeholder:text-brown-700/50 focus:outline-none focus:border-[#3E7B54] focus:bg-white transition-all"
              />
            )}

            <textarea
              value={content}
              onFocus={() => setIsOpen(true)}
              onChange={handleTextChange}
              placeholder="Bagikan apa yang sedang kamu rasakan hari ini..."
              rows={isOpen ? 3 : 2}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-cream/40 border border-brown-900/10 text-xs sm:text-sm text-brown-900 placeholder:text-brown-700/50 focus:outline-none focus:border-[#3E7B54] focus:bg-white transition-all resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Expanded options: Topic tags & Anonymous toggle */}
        {isOpen && (
          <div className="pt-2 border-t border-brown-900/8 space-y-3">
            {/* Topic selector */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/60 mr-1 flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Topik:
              </span>
              {TOPIC_OPTIONS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                    selectedTopic === topic
                      ? "bg-[#3E7B54] text-white shadow-2xs font-bold"
                      : "bg-cream text-brown-700 hover:bg-brown-900/5"
                  }`}
                >
                  #{topic}
                </button>
              ))}
            </div>

            {/* Bottom Actions: Anonymous toggle & Submit button */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-brown-700 hover:text-brown-900">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-[#3E7B54] focus:ring-0"
                />
                <span className="flex items-center gap-1 text-[11px]">
                  <EyeOff className="h-3.5 w-3.5 text-brown-700/70" />
                  Bagikan sebagai Anonim
                </span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-brown-700 hover:bg-cream"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-brown-900 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
                >
                  <Send className="h-3.5 w-3.5 stroke-[2.4]" />
                  <span>{loading ? "Menerbitkan..." : "Bagikan Cerita"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

