"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useParams } from "next/navigation";
import {
  Plus,
  Search,
  ArrowLeft,
  MessageSquare,
  Trash2,
  X,
  Sparkles,
} from "lucide-react";
import { PersonaAvatar } from "./PersonaAvatars";
import { PersonaId } from "@/backend/ai/personas";

export interface ConversationItem {
  id: string;
  title: string;
  persona?: PersonaId;
  emotionTag?: string | null;
  updatedAt: string | Date;
}

interface CompanionSidebarProps {
  conversations: ConversationItem[];
  remainingQuota: number;
  onDeleteConversation?: (id: string) => Promise<void> | void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function CompanionSidebar({
  conversations,
  remainingQuota,
  onDeleteConversation,
  isOpenMobile,
  onCloseMobile,
}: CompanionSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const activeId = params?.id as string | undefined;

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredConversations = conversations.filter((c) => {
    if (!debouncedSearch) return true;
    return c.title.toLowerCase().includes(debouncedSearch);
  });

  const formatRelativeTime = (dateInput: string | Date) => {
    try {
      const d = new Date(dateInput);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Baru saja";
      if (diffMins < 60) return `${diffMins}m lalu`;
      if (diffHours < 24) return `${diffHours}j lalu`;
      if (diffDays === 1) return "Kemarin";
      if (diffDays < 7) return `${diffDays}h lalu`;
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    } catch {
      return "";
    }
  };

  const handleNewChat = () => {
    router.push("/companion");
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile / Tablet Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-charcoal-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container: permanent on lg (>=1024px), drawer on mobile/tablet */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-botanical-500/15 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Navigation */}
        <div className="p-4 border-b border-botanical-500/10 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-900/70 hover:text-botanical-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke ZYBA</span>
          </Link>

          <button
            onClick={onCloseMobile}
            aria-label="Tutup menu percakapan"
            className="lg:hidden p-1.5 rounded-lg text-charcoal-900/40 hover:text-charcoal-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action: New Chat Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-botanical-500 hover:bg-botanical-600 text-white font-medium text-xs transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Percakapan Baru</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-3 pb-2">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-charcoal-900/40 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari curhat terdahulu..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-cream/70 border border-botanical-500/15 text-xs text-charcoal-900 placeholder:text-charcoal-900/40 focus:outline-hidden focus:bg-white focus:border-botanical-500 transition-all"
            />
          </div>
        </div>

        {/* Conversation History List */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          <div className="px-2 py-1 mb-1">
            <p className="text-[10px] font-bold text-charcoal-900/40 uppercase tracking-wider font-mono">
              RIWAYAT PERCAKAPAN
            </p>
          </div>

          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center">
              <MessageSquare className="w-6 h-6 text-charcoal-900/20 mx-auto mb-2" />
              <p className="text-xs text-charcoal-900/50">
                {searchQuery ? "Tidak ditemukan" : "Belum ada riwayat curhat"}
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredConversations.map((c) => {
                const isActive = activeId === c.id;
                return (
                  <div
                    key={c.id}
                    className={`group relative flex items-center justify-between p-2 rounded-xl transition-colors ${
                      isActive
                        ? "bg-botanical-500/10 text-charcoal-900 font-semibold"
                        : "hover:bg-cream/80 text-charcoal-900/80"
                    }`}
                  >
                    <Link
                      href={`/companion/${c.id}`}
                      onClick={onCloseMobile}
                      className="flex-1 min-w-0 pr-2"
                    >
                      <div className="flex items-center gap-2">
                        {c.persona ? (
                          <div className="shrink-0">
                            <PersonaAvatar id={c.persona} size={16} />
                          </div>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-botanical-500 shrink-0" />
                        )}
                        <p className="text-xs truncate">{c.title || "Percakapan Suaka"}</p>
                      </div>
                      <span className="text-[10px] text-charcoal-900/40 ml-4 block truncate">
                        {formatRelativeTime(c.updatedAt)}
                      </span>
                    </Link>

                    {/* Delete button on hover */}
                    {onDeleteConversation && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (confirm("Hapus percakapan ini dari suakamu?")) {
                            onDeleteConversation(c.id);
                          }
                        }}
                        aria-label={`Hapus percakapan ${c.title}`}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-charcoal-900/30 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quota & Mindful Status at Bottom */}
        <div className="p-3 border-t border-botanical-500/10 bg-cream/40">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-charcoal-900/60 font-medium">Kuota Curhat Harian</span>
            <span className="font-semibold text-botanical-600">
              {remainingQuota} / 20
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-botanical-500/15 overflow-hidden">
            <div
              className="h-full bg-botanical-500 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (remainingQuota / 20) * 100)}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-charcoal-900/40 mt-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-botanical-500" />
            Suaka gratis & bebas 100%
          </p>
        </div>
      </aside>
    </>
  );
}
