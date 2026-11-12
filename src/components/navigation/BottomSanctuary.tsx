"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Smile, MessageCircle, Heart, BookOpen } from "lucide-react";

const MOBILE_ITEMS = [
  { href: "/dashboard", label: "Beranda", icon: Compass },
  { href: "/mood-check-in", label: "Check-In", icon: Smile },
  { href: "/companion", label: "Companion", icon: MessageCircle },
  { href: "/wellness-journey", label: "Ruang Sehat", icon: Heart },
  { href: "/resources", label: "Wawasan", icon: BookOpen },
];

export function BottomSanctuary() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-3 left-4 right-4 z-50 flex h-16 items-center justify-around rounded-2xl border border-brown-900/8 bg-white/95 px-2 shadow-[0_8px_32px_rgba(27,36,30,0.08)] backdrop-blur-xl md:hidden"
      aria-label="Navigasi Bawah"
    >
      {MOBILE_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group relative flex min-w-[56px] flex-col items-center justify-center py-1 transition-all duration-200 focus:outline-none`}
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-[#3E7B54] text-white shadow-xs scale-105"
                  : "text-brown-700/80 group-hover:text-brown-900 group-hover:bg-[#F5F8F5]"
              }`}
            >
              <Icon className="h-4 w-4 stroke-[1.8]" />
            </div>
            <span
              className={`mt-1 text-[10px] leading-tight transition-colors ${
                isActive
                  ? "font-bold text-[#1B241E]"
                  : "font-medium text-brown-700/70"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

