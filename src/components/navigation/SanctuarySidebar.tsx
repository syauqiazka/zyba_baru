"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Smile,
  MessageCircle,
  Activity,
  Heart,
  BookOpen,
  Users,
  Settings,
  ShieldAlert,
  LogOut,
  Flame,
} from "lucide-react";

interface SanctuarySidebarProps {
  userName?: string;
  userAvatar?: string | null;
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Beranda", icon: Compass },
  { href: "/mood-check-in", label: "Check-In Mood", icon: Smile },
  { href: "/companion", label: "Zyba Companion", icon: MessageCircle },
  { href: "/activity", label: "Smart Activity", icon: Activity },
  { href: "/wellness-journey", label: "Ruang Sehat", icon: Heart },
  { href: "/resources", label: "Wawasan", icon: BookOpen },
  { href: "/community", label: "Komunitas", icon: Users },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

export function SanctuarySidebar({ userName = "Teman ZYBA" }: SanctuarySidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-64 flex-col justify-between border-r border-brown-900/10 bg-[#FAF7F0] p-4 text-brown-900 transition-all"
      aria-label="Navigasi Utama"
    >
      {/* Top: Logo & Main Navigation */}
      <div className="space-y-6">
        {/* Brand Logo (Inspired by Habitdo & Zyba) */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-brown-900 shadow-xs">
            <span className="font-serif text-xl font-black">Z</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-lg font-extrabold tracking-tight text-brown-900">
                ZYBA
              </span>
              <span className="rounded-md bg-emerald-100 px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider text-emerald-800">
                Sanctuary
              </span>
            </div>
            <p className="text-[10px] font-medium text-brown-700/70">
              Gen Z Wellness Support
            </p>
          </div>
        </div>

        {/* Navigation Items (Active pill state like Habitdo) */}
        <nav className="space-y-1">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-brown-700/60 block mb-2">
            Menu Utama
          </span>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-xs font-bold"
                    : "text-brown-700 hover:bg-brown-900/5 hover:text-brown-900"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    isActive ? "text-white stroke-[2.2]" : "text-brown-700 group-hover:text-brown-900 stroke-[1.8]"
                  }`}
                />
                <span>{item.label}</span>
                {item.href === "/companion" && (
                  <span
                    className={`ml-auto text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-orange-100 text-orange-900"
                    }`}
                  >
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Crisis Hotline, Hearth Flame & Profile */}
      <div className="space-y-3 border-t border-brown-900/10 pt-4">
        {/* Quick Crisis Hotline */}
        <Link
          href="/guidebook"
          className="flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-200/60 px-3 py-2 text-xs font-bold text-orange-950 hover:bg-orange-100 transition-colors"
        >
          <ShieldAlert className="h-4 w-4 text-orange-600 shrink-0 stroke-[2]" />
          <div className="leading-tight">
            <span className="block text-[11px] font-bold">Bantuan Krisis 24/7</span>
            <span className="block text-[9px] font-medium text-orange-800/80">Hotline Darurat 119</span>
          </div>
        </Link>

        {/* User Card & Logout */}
        <div className="flex items-center justify-between rounded-2xl bg-white/80 p-2.5 border border-brown-900/10 shadow-2xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sand-200 text-brown-900 font-bold text-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden text-left">
              <span className="block truncate text-xs font-bold text-brown-900">
                {userName}
              </span>
              <span className="block text-[10px] text-brown-700/70 font-medium">
                Ruang Pribadi
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Keluar Akun"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-brown-700 hover:bg-brown-900/10 hover:text-brown-900 transition-colors focus:outline-none"
          >
            <LogOut className="h-4 w-4 stroke-[1.8]" />
          </button>
        </div>
      </div>
    </aside>
  );
}

