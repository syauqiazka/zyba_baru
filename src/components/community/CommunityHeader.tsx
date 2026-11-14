"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  Sparkles,
  MessageCircle,
  Bell,
  ChevronDown,
  Users,
} from "lucide-react";
import { useCommunity } from "@/components/community/CommunityContext";

export function CommunityHeader() {
  const {
    searchQuery,
    setSearchQuery,
    setIsMobileSidebarOpen,
    userName,
    setIsMessagesOpen,
  } = useCommunity();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F5F8F5]/95 backdrop-blur-md border-b border-brown-900/10 px-4 sm:px-8 lg:px-12 xl:px-16 py-3 transition-colors shadow-2xs">
      <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Mobile Menu & Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-white border border-brown-900/10 text-brown-900 hover:bg-cream transition-colors shadow-2xs"
            aria-label="Buka navigasi komunitas"
          >
            <Menu className="h-4 w-4" />
          </button>

          <Link
            href="/community"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#3E7B54] text-white flex items-center justify-center shadow-2xs group-hover:bg-[#346B48] transition-colors">
              <Users className="h-4 w-4 stroke-[2.4]" />
            </div>
            <div className="hidden xs:block">
              <span className="font-serif text-base font-bold tracking-tight text-brown-900 block leading-tight">
                ZYBA
              </span>
              <span className="text-[10px] font-semibold text-[#3E7B54] tracking-wider uppercase">
                Komunitas
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar with Ctrl+K shortcut (matching Convo reference) */}
        <div className="flex-1 max-w-lg relative">
          <Search className="h-4 w-4 text-brown-700/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari cerita, topik, atau kata kunci..."
            className="w-full h-10 pl-10 pr-20 rounded-full bg-white border border-brown-900/10 text-xs sm:text-sm text-brown-900 placeholder:text-brown-700/40 focus:outline-none focus:border-[#3E7B54] focus:ring-1 focus:ring-[#3E7B54]/20 shadow-[0_2px_10px_-2px_rgba(59,42,32,0.03)] transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 rounded-full text-brown-700/50 hover:text-brown-900 hover:bg-cream"
                aria-label="Hapus pencarian"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-brown-700/50 bg-cream/70 border border-brown-900/10">
                Ctrl K
              </kbd>
            )}
          </div>
        </div>

        {/* Right: Zibi AI Pill, Message, Notification, Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Zibi AI Pill Button (Inspired by Convo AI yellow pill) */}
          <Link
            href="/companion"
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-100/90 hover:bg-emerald-200 text-[#275338] font-bold text-xs border border-emerald-300/60 shadow-2xs transition-all active:scale-[0.98]"
            title="Ngobrol dengan Pendamping AI Zibi"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#3E7B54] shrink-0" />
            <span className="hidden sm:inline">Zibi AI</span>
          </Link>

          {/* Direct Messages Icon Button */}
          <button
            type="button"
            onClick={() => setIsMessagesOpen(true)}
            className="p-2 rounded-full text-brown-700 hover:text-brown-900 hover:bg-white border border-transparent hover:border-brown-900/10 transition-all relative"
            aria-label="Pesan Komunitas"
            title="Pesan Langsung"
          >
            <MessageCircle className="h-4 w-4" />
          </button>

          {/* Notification Bell */}
          <button
            type="button"
            className="p-2 rounded-full text-brown-700 hover:text-brown-900 hover:bg-white border border-transparent hover:border-brown-900/10 transition-all relative"
            aria-label="Notifikasi"
            title="Notifikasi"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-[#F5F8F5]" />
          </button>

          {/* User Profile Pill */}
          <Link
            href="/settings"
            className="flex items-center gap-2 p-1 sm:pr-2.5 rounded-full bg-white hover:bg-cream/70 border border-brown-900/10 transition-all shadow-2xs"
            title="Pengaturan Profil"
          >
            <div className="w-7 h-7 rounded-full bg-[#3E7B54] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-bold text-brown-900 max-w-[110px] truncate hidden md:inline">
              {userName}
            </span>
            <ChevronDown className="h-3 w-3 text-brown-700/50 hidden sm:inline" />
          </Link>
        </div>
      </div>
    </header>
  );
}

