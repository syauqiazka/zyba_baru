"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  Heart,
  Bookmark,
  Users,
  Search,
  MessageCircle,
  Bell,
  Plus,
  ShieldCheck,
  X,
  ArrowLeft,
  Settings,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

interface CommunitySidebarProps {
  currentTab: string;
  currentTopic?: string;
  onSelectTab: (tab: string, topic?: string) => void;
  onOpenCompose: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const CIRCLE_TOPICS = [
  { name: "Pikiran Tenang", count: 42, color: "bg-emerald-100 text-emerald-800" },
  { name: "Overthinking", count: 38, color: "bg-amber-100 text-amber-800" },
  { name: "Lingkar Syukur", count: 29, color: "bg-orange-100 text-orange-900" },
  { name: "Kisah Pulih", count: 19, color: "bg-blue-100 text-blue-800" },
];

export function CommunitySidebar({
  currentTab,
  currentTopic,
  onSelectTab,
  onOpenCompose,
  isOpenMobile = false,
  onCloseMobile,
}: CommunitySidebarProps) {
  const content = (
    <div className="flex flex-col h-full justify-between p-4 bg-white border-r border-brown-900/10 text-brown-900 overflow-y-auto">
      <div className="space-y-5">
        {/* Tombol Kembali ke Menu Utama ZYBA */}
        <Link
          href="/dashboard"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-brown-900 bg-cream/70 hover:bg-cream border border-brown-900/10 transition-all shadow-2xs group"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 text-[#3E7B54] group-hover:-translate-x-0.5 transition-transform shrink-0" />
            <span className="whitespace-nowrap">Menu Utama</span>
          </div>
          <span className="text-[10px] text-brown-700/50 font-normal">Dashboard &rarr;</span>
        </Link>

        {/* Brand Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3E7B54] text-white shadow-2xs">
              <Users className="h-4 w-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-serif text-sm font-bold tracking-tight text-brown-900 block leading-tight">
                ZYBA Community
              </span>
              <p className="text-[10px] text-brown-700/60 font-medium">
                Ruang Suaka Berbagi
              </p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-brown-700 hover:text-brown-900 hover:bg-cream"
              aria-label="Tutup Menu Komunitas"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Quick Post CTA Button */}
        <button
          type="button"
          onClick={() => {
            onOpenCompose();
            onCloseMobile?.();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-brown-900 font-bold text-xs shadow-xs transition-all active:scale-[0.99]"
        >
          <Plus className="h-4 w-4 stroke-[2.4]" />
          <span>Buat Postingan Baru</span>
        </button>

        {/* Section 1: General (Navigasi Feed Utama Convo) */}
        <div className="space-y-1">
          <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-brown-700/60 block mb-1">
            General
          </span>

          <button
            type="button"
            onClick={() => {
              onSelectTab("for-you");
              onCloseMobile?.();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentTab === "for-you" && !currentTopic
                ? "bg-[#3E7B54] text-white font-bold shadow-xs"
                : "text-brown-700 hover:bg-cream/80 hover:text-brown-900"
            }`}
          >
            <Compass className="h-4 w-4 shrink-0 stroke-[2]" />
            <span>Untuk Kamu (FYP)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectTab("following");
              onCloseMobile?.();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentTab === "following"
                ? "bg-[#3E7B54] text-white font-bold shadow-xs"
                : "text-brown-700 hover:bg-cream/80 hover:text-brown-900"
            }`}
          >
            <Users className="h-4 w-4 shrink-0 stroke-[2]" />
            <span>Mengikuti</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectTab("saved");
              onCloseMobile?.();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentTab === "saved"
                ? "bg-[#3E7B54] text-white font-bold shadow-xs"
                : "text-brown-700 hover:bg-cream/80 hover:text-brown-900"
            }`}
          >
            <Bookmark className="h-4 w-4 shrink-0 stroke-[2]" />
            <span>Disimpan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectTab("liked");
              onCloseMobile?.();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentTab === "liked"
                ? "bg-[#3E7B54] text-white font-bold shadow-xs"
                : "text-brown-700 hover:bg-cream/80 hover:text-brown-900"
            }`}
          >
            <Heart className="h-4 w-4 shrink-0 stroke-[2]" />
            <span>Disukai</span>
          </button>
        </div>

        {/* Section 2: Lingkar Komunitas (Your Community) */}
        <div className="space-y-1 pt-2 border-t border-brown-900/8">
          <div className="flex items-center justify-between px-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brown-700/60">
              Lingkar Komunitas
            </span>
          </div>

          {CIRCLE_TOPICS.map((topic) => {
            const isSelected = currentTopic === topic.name;
            return (
              <button
                key={topic.name}
                type="button"
                onClick={() => {
                  onSelectTab("topic", topic.name);
                  onCloseMobile?.();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-[#3E7B54] text-white font-bold shadow-xs"
                    : "text-brown-700 hover:bg-cream/80 hover:text-brown-900"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="truncate">{topic.name}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? "bg-white/20 text-white" : "bg-brown-900/5 text-brown-700"
                }`}>
                  {topic.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer: Help Center & Settings (Matching Convo Image 2) */}
      <div className="pt-4 border-t border-brown-900/8 space-y-1">
        <Link
          href="/guidebook"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-brown-700 hover:text-brown-900 hover:bg-cream/60 transition-colors"
        >
          <ShieldCheck className="h-4 w-4 text-[#3E7B54]" />
          <span>Pusat Bantuan (24/7)</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-brown-700 hover:text-brown-900 hover:bg-cream/60 transition-colors"
        >
          <Settings className="h-4 w-4 text-brown-700/60" />
          <span>Pengaturan Akun</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-60 xl:w-64 shrink-0 rounded-3xl border border-brown-900/10 shadow-[0_2px_12px_-2px_rgba(59,42,32,0.04)] overflow-hidden h-[calc(100vh-6rem)] sticky top-20">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}

