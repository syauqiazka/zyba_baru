"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Smile,
  Bot,
  Compass,
  Menu,
  X,
  HeartPulse,
  Users,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

export function BottomPill() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const mainPillItems = [
    { label: "Home", href: "/dashboard", icon: LayoutDashboard },
    { label: "Check-In", href: "/mood-check-in", icon: Smile },
    { label: "Companion", href: "/companion", icon: Bot },
    { label: "Activity", href: "/activity", icon: Compass },
  ];

  const drawerItems = [
    { label: "Wellness Journey", href: "/wellness-journey", icon: HeartPulse },
    { label: "Komunitas Zyba", href: "/community", icon: Users },
    { label: "Resources Wawasan", href: "/resources", icon: BookOpen },
    { label: "Bantuan Krisis & Guidebook", href: "/guidebook", icon: HelpCircle },
    { label: "Pengaturan Akun", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Drawer Menu untuk Mobile (saat tombol Menu ditekan) */}
      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu Navigasi Tambahan"
          className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-brown-900/30 backdrop-blur-xs p-3 animate-in fade-in duration-200"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="w-full max-w-[420px] rounded-3xl bg-white border border-brown-900/15 p-5 shadow-[0_12px_40px_-8px_rgba(59,42,32,0.12)] mb-16 animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-brown-900/10">
              <h2 className="text-sm font-display font-bold text-brown-900">
                Menu Lainnya
              </h2>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Tutup Menu"
                className="w-8 h-8 rounded-full flex items-center justify-center text-brown-700 hover:bg-cream/80"
              >
                <X className="w-4 h-4" strokeWidth={1.8} />
              </button>
            </div>

            <nav className="py-3 space-y-1">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-green-100 text-brown-900"
                        : "text-brown-700 hover:bg-cream/80 hover:text-brown-900"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-brown-900" strokeWidth={1.8} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-brown-900/10">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  window.location.href = "/login";
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-danger rounded-xl hover:bg-danger/10 transition-colors"
              >
                <LogOut className="w-4 h-4 text-danger" strokeWidth={1.8} />
                Keluar Akun
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Pill Nav — Sesuai DESIGN.md §4.2: h-14 (56px), melayang 12px dari bawah, rounded-full */}
      <nav
        aria-label="Navigasi Seluler"
        className="md:hidden fixed bottom-3 inset-x-3 max-w-[420px] mx-auto h-14 rounded-full bg-white/95 backdrop-blur-md border border-brown-900/10 shadow-[0_4px_24px_-4px_rgba(59,42,32,0.06)] z-40 flex items-center justify-around px-2 select-none"
      >
        {mainPillItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={`min-w-[44px] min-h-[44px] px-3 rounded-full flex flex-col items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 ${
                isActive
                  ? "bg-green-100 text-brown-900 font-bold"
                  : "text-brown-700 hover:text-brown-900"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={1.8} />
              <span className="text-[10px] font-medium leading-none mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Tombol Menu untuk opsi lainnya */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Buka Menu Lainnya"
          aria-expanded={menuOpen}
          className={`min-w-[44px] min-h-[44px] px-3 rounded-full flex flex-col items-center justify-center transition-colors duration-200 cursor-pointer ${
            menuOpen ? "bg-cream text-brown-900 font-bold" : "text-brown-700 hover:text-brown-900"
          }`}
        >
          <Menu className="w-5 h-5" strokeWidth={1.8} />
          <span className="text-[10px] font-medium leading-none mt-0.5">Lainnya</span>
        </button>
      </nav>
    </>
  );
}

