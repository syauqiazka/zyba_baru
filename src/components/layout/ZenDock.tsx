"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Smile,
  Bot,
  Compass,
  HeartPulse,
  Users,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  User as UserIcon,
  type LucideIcon,
} from "lucide-react";
import { PortalTooltip } from "./PortalTooltip";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Check-In Harian", href: "/mood-check-in", icon: Smile },
  { label: "Zyba Companion", href: "/companion", icon: Bot },
  { label: "Activity Planner", href: "/activity", icon: Compass },
  { label: "Wellness Journey", href: "/wellness-journey", icon: HeartPulse },
  { label: "Komunitas", href: "/community", icon: Users },
  { label: "Resources", href: "/resources", icon: BookOpen },
];

const secondaryNavItems: NavItem[] = [
  { label: "Guidebook & Krisis", href: "/guidebook", icon: HelpCircle },
  { label: "Pengaturan", href: "/settings", icon: Settings },
];

export function ZenDock() {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  // Close profile popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <>
      <aside
        aria-label="Navigasi Utama Zen Dock"
        className="hidden md:flex fixed left-4 top-4 bottom-4 w-[76px] z-40 rounded-[28px] bg-white/90 backdrop-blur-md border border-brown-900/10 shadow-[0_4px_24px_-4px_rgba(59,42,32,0.06)] flex-col items-center justify-between py-5 select-none"
      >
        {/* Top: Logo Brand (Z) */}
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/dashboard"
            aria-label="Kembali ke Dashboard ZYBA"
            className="w-12 h-12 rounded-2xl bg-brown-900 text-cream flex items-center justify-center font-display font-extrabold text-xl tracking-tight transition-transform duration-200 hover:scale-105 active:scale-95 motion-reduce:transform-none shadow-sm"
          >
            Z
          </Link>
          <div className="w-8 h-[1px] bg-brown-900/10 my-1" />
        </div>

        {/* Center: Main Nav Items */}
        <nav className="flex flex-col items-center gap-2 overflow-y-auto no-scrollbar py-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <PortalTooltip key={item.href} label={item.label}>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 ${
                    isActive
                      ? "bg-green-100 text-brown-900 font-bold shadow-xs"
                      : "text-brown-700 hover:bg-cream/80 hover:text-brown-900"
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.8} />
                </Link>
              </PortalTooltip>
            );
          })}
        </nav>

        {/* Bottom: Secondary Nav & Profile */}
        <div className="flex flex-col items-center gap-2 pt-2 border-t border-brown-900/10">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href);

            return (
              <PortalTooltip key={item.href} label={item.label}>
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 ${
                    isActive
                      ? "bg-green-100 text-brown-900 font-bold"
                      : "text-brown-700 hover:bg-cream/80 hover:text-brown-900"
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.8} />
                </Link>
              </PortalTooltip>
            );
          })}

          {/* Profile Trigger Button */}
          <div className="relative mt-1">
            <PortalTooltip label="Profil Pengguna">
              <button
                ref={profileButtonRef}
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-label="Menu Profil"
                aria-expanded={profileOpen}
                className="w-11 h-11 rounded-full bg-cream border border-brown-900/15 flex items-center justify-center text-brown-900 hover:bg-orange-100/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 cursor-pointer"
              >
                <UserIcon className="w-5 h-5 text-brown-900" strokeWidth={1.8} />
              </button>
            </PortalTooltip>
          </div>
        </div>
      </aside>

      {/* Profile Popover — Sesuai DESIGN.md §4.1: menempel left: 104px dengan scroll internal */}
      {profileOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Menu Pengguna"
          style={{ left: "104px" }}
          className="hidden md:block fixed bottom-6 z-50 w-72 max-h-[calc(100dvh-3rem)] overflow-y-auto rounded-2xl bg-white border border-brown-900/15 shadow-[0_12px_40px_-8px_rgba(59,42,32,0.12)] p-4 animate-in fade-in slide-in-from-left-2 duration-150 motion-reduce:animate-none"
        >
          <div className="flex items-center gap-3 pb-3 border-b border-brown-900/10">
            <div className="w-10 h-10 rounded-full bg-orange-100 border border-brown-900/10 flex items-center justify-center text-brown-900 font-display font-bold">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-brown-900 truncate">Teman ZYBA</p>
              <p className="text-xs text-brown-700/80 truncate">Ruang Tenangmu</p>
            </div>
          </div>

          <div className="py-2 space-y-1">
            <Link
              href="/settings"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-brown-900 rounded-xl hover:bg-cream/80 transition-colors"
            >
              <Settings className="w-4 h-4 text-brown-700" strokeWidth={1.8} />
              Pengaturan Akun & Privasi
            </Link>
            <Link
              href="/guidebook"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-brown-900 rounded-xl hover:bg-cream/80 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-brown-700" strokeWidth={1.8} />
              Bantuan & Hotline Krisis
            </Link>
          </div>

          <div className="pt-2 border-t border-brown-900/10">
            <button
              onClick={() => {
                setProfileOpen(false);
                // Trigger logout API or redirect
                window.location.href = "/login";
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-danger rounded-xl hover:bg-danger/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-danger" strokeWidth={1.8} />
              Keluar Akun
            </button>
          </div>
        </div>
      )}
    </>
  );
}
