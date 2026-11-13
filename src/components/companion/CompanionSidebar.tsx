"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Plus,
  Search,
  ArrowLeft,
  Folder,
  FolderOpen,
  Trash2,
  X,
  Sparkles,
  ChevronDown,
  Clock,
  BookOpen,
} from "lucide-react";
import { Mascot } from "@/components/ui/Mascot";
import { useCompanion } from "./CompanionContext";

export interface ConversationItem {
  id: string;
  title: string;
  emotionTag?: string | null;
  updatedAt: string | Date;
}

interface CompanionSidebarProps {
  conversations: ConversationItem[];
  remainingQuota?: number;
  onDeleteConversation?: (id: string) => Promise<void> | void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function CompanionSidebar({
  conversations,
  onDeleteConversation,
  isOpenMobile,
  onCloseMobile,
}: CompanionSidebarProps) {
  const router = useRouter();
  const params = useParams();
  const activeId = params?.id as string | undefined;

  const {
    userName,
    remainingTokens,
    tokenLimit,
    isCooldown,
    cooldownRemainingSec,
    setIsQuotaModalOpen,
  } = useCompanion();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

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

  const folders = [
    { id: "anxiety", name: "Kecemasan & Stres" },
    { id: "habits", name: "Rutinitas & Tidur" },
    { id: "mindful", name: "Refleksi Batin" },
  ];

  return (
    <>
      {/* Mobile / Tablet Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-charcoal-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container: matching Aetheris reference (w-72, clean white/frosted, soft borders) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white/95 border-r border-botanical-500/15 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header: Brand & Back Link */}
        <div className="p-4 border-b border-botanical-500/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center">
              <Mascot pose="default" size={32} animate={false} decorative={true} />
            </div>
            <div>
              <span className="font-serif text-sm font-bold text-charcoal-900 block leading-tight">
                ZYBA Companion
              </span>
              <span className="text-[10px] text-charcoal-900/50 block">
                Sahabat Mindful &bull; Zibi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-lg text-charcoal-900/40 hover:text-botanical-600 hover:bg-cream transition-colors text-[11px] font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
              title="Kembali ke Dashboard ZYBA"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <button
              onClick={onCloseMobile}
              aria-label="Tutup menu percakapan"
              className="lg:hidden p-1.5 rounded-lg text-charcoal-900/40 hover:text-charcoal-900 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action: + New Chat Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white border border-botanical-500/20 hover:border-botanical-500 hover:bg-botanical-100/40 text-charcoal-900 font-bold text-xs transition-all shadow-xs group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
          >
            <div className="w-5 h-5 rounded-lg bg-botanical-100 flex items-center justify-center text-botanical-700 group-hover:scale-105 transition-transform motion-reduce:group-hover:scale-100">
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span>Percakapan Baru</span>
          </button>
        </div>

        {/* Search Chat Input */}
        <div className="px-3 pb-2">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-charcoal-900/40 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari curhat terdahulu..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-cream/70 border border-botanical-500/15 text-xs text-charcoal-900 placeholder:text-charcoal-900/40 focus:outline-hidden focus:bg-white focus:border-botanical-500 focus-visible:ring-2 focus-visible:ring-botanical-500 transition-all"
            />
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="px-3 py-1 space-y-0.5 border-b border-botanical-500/10 pb-2">
          <Link
            href="/wellness-journey"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs text-charcoal-900/70 hover:text-charcoal-900 hover:bg-cream transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
          >
            <BookOpen className="w-3.5 h-3.5 text-botanical-500" />
            <span>Ruang Jurnal & Refleksi</span>
          </Link>
        </div>

        {/* Folders / Categories Section */}
        <div className="px-3 pt-3">
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-900/40">
              Kategori Cerita
            </span>
            <span className="text-[10px] text-charcoal-900/40 font-mono">
              {folders.length}
            </span>
          </div>

          <div className="space-y-0.5">
            {folders.map((folder) => {
              const isSelected = selectedFolder === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() =>
                    setSelectedFolder(isSelected ? null : folder.id)
                  }
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                    isSelected
                      ? "bg-botanical-100/70 text-botanical-800 font-semibold"
                      : "text-charcoal-900/70 hover:bg-cream hover:text-charcoal-900"
                  }`}
                >
                  {isSelected ? (
                    <FolderOpen className="w-3.5 h-3.5 text-botanical-600" />
                  ) : (
                    <Folder className="w-3.5 h-3.5 text-charcoal-900/40" />
                  )}
                  <span className="truncate">{folder.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation History List */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <div className="px-2 py-1 mb-1">
            <p className="text-[10px] font-bold text-charcoal-900/40 uppercase tracking-wider font-mono">
              RIWAYAT PERCAKAPAN
            </p>
          </div>

          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center flex flex-col items-center">
              {searchQuery ? (
                <>
                  <Mascot
                    pose="sad"
                    size={50}
                    animate={false}
                    decorative={true}
                    className="mb-2"
                  />
                  <p className="text-xs text-charcoal-900/60 leading-relaxed">
                    Tidak ada curhat dengan kata kunci &quot;{searchQuery}&quot;
                  </p>
                </>
              ) : (
                <>
                  <Mascot
                    pose="listening"
                    size={50}
                    animate={false}
                    decorative={true}
                    className="mb-2"
                  />
                  <p className="text-xs text-charcoal-900/60 leading-relaxed">
                    Belum ada riwayat curhat. Mulai cerita pertama kamu saat kamu siap.
                  </p>
                </>
              )}
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
                        <span className="w-1.5 h-1.5 rounded-full bg-botanical-500 shrink-0" />
                        <p className="text-xs truncate">
                          {c.title || "Percakapan Suaka"}
                        </p>
                      </div>
                      <span className="text-[10px] text-charcoal-900/40 ml-3.5 block truncate">
                        {formatRelativeTime(c.updatedAt)}
                      </span>
                    </Link>

                    {/* Delete button on hover & keyboard focus */}
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
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:opacity-100 p-1.5 rounded-md text-charcoal-900/40 hover:text-red-600 hover:bg-red-50 transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-red-400"
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

        {/* Bottom User Profile & Token Quota */}
        <div className="p-3 border-t border-botanical-500/15 bg-white">
          <button
            type="button"
            onClick={() => setIsQuotaModalOpen(true)}
            aria-label="Buka ringkasan kuota token dan jeda batin"
            className="w-full text-left flex items-center justify-between p-2 rounded-2xl bg-cream/70 hover:bg-cream border border-botanical-500/10 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-botanical-500"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* User Avatar Circle */}
              <div className="w-8 h-8 rounded-full bg-peach-500 text-charcoal-900 font-serif font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-charcoal-900 truncate">
                  {userName}
                </span>
                <span className="block text-[10px] font-mono text-charcoal-900/60 truncate">
                  {isCooldown ? (
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> Jeda 5 Jam
                    </span>
                  ) : (
                    <span>
                      {remainingTokens.toLocaleString("id-ID")} /{" "}
                      {tokenLimit.toLocaleString("id-ID")} Token
                    </span>
                  )}
                </span>
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-charcoal-900/40 shrink-0" />
          </button>

          {/* Micro Progress Bar */}
          <div className="w-full h-1 bg-botanical-500/15 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCooldown ? "bg-amber-500" : "bg-botanical-500"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  (remainingTokens / tokenLimit) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
