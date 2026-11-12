"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  MessageCircle,
  Activity,
  Heart,
  BookOpen,
  Users,
  Settings,
  Sparkles,
  LogOut,
  Smile,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Beranda", icon: Compass },
  { href: "/mood-check-in", label: "Check-In", icon: Smile },
  { href: "/companion", label: "Companion", icon: MessageCircle },
  { href: "/activity", label: "Aktivitas", icon: Activity },
  { href: "/wellness-journey", label: "Ruang Sehat", icon: Heart },
  { href: "/resources", label: "Wawasan", icon: BookOpen },
  { href: "/community", label: "Komunitas", icon: Users },
];

export function SanctuaryNav() {
  const pathname = usePathname();
  const [flameLit, setFlameLit] = useState(false);
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    // Ambil status ringan Hearth Flame
    async function fetchStatus() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const data = await res.json();
          setFlameLit(Boolean(data.hearthFlame?.litToday));
          setStreakDays(Number(data.hearthFlame?.streakDays) || 0);
        }
      } catch {
        // Fallback anggun
      }
    }
    fetchStatus();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 hidden md:block px-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-brown-900/10 bg-cream/85 px-5 py-2.5 shadow-[0_4px_24px_rgba(44,34,30,0.06)] backdrop-blur-lg">
        {/* Logo Sanctuary */}
        <Link
          href="/dashboard"
          className="group flex items-center gap-2.5 focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-brown-900 shadow-sm transition-transform duration-200 group-hover:scale-105">
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-3.5H7.5l7-8.5v4.5h3.5l-7 7.5z" />
            </svg>
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-brown-900">
              ZYBA
            </span>
            <span className="hidden lg:inline ml-2 text-[10px] font-semibold uppercase tracking-widest text-brown-700/60 border-l border-brown-900/15 pl-2">
              Sanctuary
            </span>
          </div>
        </Link>

        {/* Central Tactile Navigation Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-brown-900/[0.04] p-1 border border-brown-900/5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-brown-900 shadow-sm font-bold"
                    : "text-brown-700 hover:text-brown-900 hover:bg-white/50"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 stroke-[1.8] ${
                    isActive ? "text-orange-600" : "text-brown-700/70"
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-orange-500" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Utility Cluster: Hearth Flame Indicator & Settings */}
        <div className="flex items-center gap-3">
          {/* Micro Hearth Flame Indicator */}
          <Link
            href="/mood-check-in"
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all ${
              flameLit
                ? "border-orange-500/30 bg-orange-100/70 text-orange-950 font-semibold shadow-xs"
                : "border-brown-900/10 bg-white/70 text-brown-700/80 hover:border-orange-500/30"
            }`}
            title={
              flameLit
                ? `Lilin menyala (${streakDays} hari)`
                : "Nyalakan lilin kehangatan hari ini"
            }
          >
            <Sparkles
              className={`h-3 w-3 ${
                flameLit ? "text-orange-600" : "text-brown-700/50"
              }`}
            />
            <span className="text-[11px]">
              {flameLit ? `${streakDays} Hari` : "Nyalakan Lilin"}
            </span>
          </Link>

          {/* Settings & Logout */}
          <div className="flex items-center gap-1 border-l border-brown-900/10 pl-3">
            <Link
              href="/settings"
              className="rounded-lg p-1.5 text-brown-700 hover:bg-brown-900/5 hover:text-brown-900 transition-colors"
              title="Pengaturan Akun"
            >
              <Settings className="h-4 w-4 stroke-[1.8]" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-brown-700 hover:bg-brown-900/5 hover:text-brown-900 transition-colors"
              title="Keluar"
            >
              <LogOut className="h-4 w-4 stroke-[1.8]" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

